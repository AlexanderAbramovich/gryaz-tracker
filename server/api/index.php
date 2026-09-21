<?php
declare(strict_types=1);
/* ═══════════════════════════════════════════════════════════════════════
   ГРЯЗЬ · сервер (v12, аккаунты)
   Один файл, PHP 8 + SQLite, без зависимостей. Живёт на РФ-хостинге.

   Пользователь = аккаунт с ролью coach|client (почта + пароль). Клиент может
   быть привязан к одному тренеру по коду приглашения. Данные клиента лежат
   документами (docs) - он их единственный автор; тренер пишет клиенту только
   свои документы (coach_docs: plan, goals, note, schedule). Фото тела на
   сервер не попадают никогда.

   Маршрут: /api/index.php?r=auth/login   Ответ всегда JSON; ошибка {"error"} + 4xx/5xx.
   ═══════════════════════════════════════════════════════════════════════ */

$CFG = file_exists(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];
$DB_PATH   = $CFG['db']       ?? __DIR__ . '/data/gryaz.sqlite';
$ORIGINS   = $CFG['origins']  ?? [];
$MAIL_FROM = $CFG['mail_from'] ?? '';        /* адрес отправителя для кодов восстановления; пусто = письма не шлём */
$TOKEN_DAYS  = 180;
$INVITE_DAYS = 7;
$MAX_BODY    = 3 * 1024 * 1024;
$MAX_DOC     = 1024 * 1024;
$COACH_KEYS  = ['plan', 'goals', 'note', 'schedule'];
$CLIENT_KEYS = ['sessions', 'lastEx', 'wHist', 'weight', 'sleep', 'food', 'cfg', 'startDate', 'curDay', 'schema', 'plan', 'goals', 'profile', 'schedule', 'dishes', 'shop'];

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');

/* ── CORS ── */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$https  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
$self   = ($https ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? '');
if ($origin !== '' && ($origin === $self || in_array($origin, $ORIGINS, true))) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
  header('Access-Control-Allow-Headers: Authorization, Content-Type');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  header('Access-Control-Max-Age: 600');
}
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

/* ── утилиты ── */
function out(array $data, int $code = 200): void { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function fail(string $msg, int $code = 400): void { out(['error' => $msg], $code); }
function now(): int { return time(); }
function ms(): int { return (int) round(microtime(true) * 1000); }
function token(): string { return bin2hex(random_bytes(24)); }
function thash(string $t): string { return hash('sha256', $t); }
function ip(): string { return $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'; }
function ua(): string { return mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 200); }
function body(): array {
  global $MAX_BODY;
  $len = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
  if ($len > $MAX_BODY) fail('Слишком большой запрос', 413);
  $raw = file_get_contents('php://input', false, null, 0, $MAX_BODY + 1);
  if ($raw === '' || $raw === false) return [];
  if (strlen($raw) > $MAX_BODY) fail('Слишком большой запрос', 413);
  $j = json_decode($raw, true);
  if (!is_array($j)) fail('Тело запроса не JSON');
  return $j;
}
function bearer(): string {
  $h = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
  if ($h === '' && function_exists('apache_request_headers')) { $all = apache_request_headers(); $h = $all['Authorization'] ?? $all['authorization'] ?? ''; }
  return preg_match('/^Bearer\s+([A-Za-z0-9]+)$/', trim($h), $m) ? $m[1] : '';
}
function code6(): string {
  $abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  $s = '';
  for ($i = 0; $i < 6; $i++) $s .= $abc[random_int(0, strlen($abc) - 1)];
  return $s;
}
function norm_code(string $c): string { return strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $c)); }
function clean_name(string $n): string { return mb_substr(trim(preg_replace('/\s+/u', ' ', strip_tags($n))), 0, 40); }
function norm_email(string $e): string { return strtolower(trim($e)); }
function valid_email(string $e): bool { return (bool) filter_var($e, FILTER_VALIDATE_EMAIL) && strlen($e) <= 120; }

/* ── база ── */
$dir = dirname($DB_PATH);
if (!is_dir($dir)) @mkdir($dir, 0750, true);
try {
  $db = new PDO('sqlite:' . $DB_PATH, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
} catch (Throwable $e) { fail('База недоступна', 500); }
$db->exec('PRAGMA journal_mode=WAL');
$db->exec('PRAGMA busy_timeout=4000');
/* Необработанная ошибка - всё равно JSON, а подробности в журнал рядом с базой, не в ответ */
set_exception_handler(function (Throwable $e) use ($dir) {
  @error_log(date('c') . ' ' . get_class($e) . ': ' . $e->getMessage() . ' @' . $e->getFile() . ':' . $e->getLine() . "
", 3, $dir . '/error.log');
  out(['error' => 'Ошибка сервера, уже в журнале'], 500);
});
/* Таблицы v11 (кабинет без аккаунтов) несовместимы по колонкам: уводим их в архив, v12 создаст свои */
function col_exists(PDO $db, string $table, string $col): bool {
  foreach ($db->query("PRAGMA table_info($table)") as $r) if ($r['name'] === $col) return true;
  return false;
}
foreach ([['consents', 'user_id'], ['invites', 'used_by'], ['wipes', 'user_id'], ['docs', 'user_id']] as [$t, $c]) {
  $has = $db->query("SELECT name FROM sqlite_master WHERE type = 'table' AND name = '$t'")->fetch();
  if ($has && !col_exists($db, $t, $c)) { $db->exec("DROP TABLE IF EXISTS {$t}_v11"); $db->exec("ALTER TABLE $t RENAME TO {$t}_v11"); }
}
$db->exec(<<<SQL
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY, role TEXT NOT NULL, email TEXT UNIQUE NOT NULL, pass TEXT NOT NULL, name TEXT NOT NULL,
  created INTEGER NOT NULL, coach_id INTEGER, terms_ver TEXT, last_seen INTEGER, app_ver TEXT);
CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, created INTEGER NOT NULL, expires INTEGER NOT NULL, ua TEXT);
CREATE TABLE IF NOT EXISTS invites (code TEXT PRIMARY KEY, coach_id INTEGER NOT NULL, created INTEGER NOT NULL, expires INTEGER NOT NULL, used_by INTEGER, used_at INTEGER);
CREATE TABLE IF NOT EXISTS coach_codes (code TEXT PRIMARY KEY, created INTEGER NOT NULL, note TEXT, used_by INTEGER, used_at INTEGER);
CREATE TABLE IF NOT EXISTS docs (user_id INTEGER NOT NULL, key TEXT NOT NULL, json TEXT NOT NULL, updated INTEGER NOT NULL, received INTEGER NOT NULL, PRIMARY KEY (user_id, key));
CREATE TABLE IF NOT EXISTS coach_docs (client_id INTEGER NOT NULL, key TEXT NOT NULL, json TEXT NOT NULL, rev INTEGER NOT NULL, updated INTEGER NOT NULL, coach_id INTEGER NOT NULL, PRIMARY KEY (client_id, key));
CREATE TABLE IF NOT EXISTS consents (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, kind TEXT NOT NULL, version TEXT NOT NULL, text_hash TEXT NOT NULL, given_at INTEGER NOT NULL, withdrawn_at INTEGER, ip TEXT, ua TEXT);
CREATE TABLE IF NOT EXISTS wipes (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, at INTEGER NOT NULL, by TEXT NOT NULL, note TEXT);
CREATE TABLE IF NOT EXISTS resets (user_id INTEGER PRIMARY KEY, code_hash TEXT NOT NULL, expires INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS throttle (ip TEXT NOT NULL, action TEXT NOT NULL, ts INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS throttle_ix ON throttle (ip, action, ts);
CREATE INDEX IF NOT EXISTS users_coach_ix ON users (coach_id);
SQL);

function throttle(PDO $db, string $action, int $limit, int $window = 3600): void {
  $ip = ip(); $t = now();
  $db->prepare('DELETE FROM throttle WHERE ts < ?')->execute([$t - $window]);
  $q = $db->prepare('SELECT COUNT(*) c FROM throttle WHERE ip = ? AND action = ? AND ts > ?');
  $q->execute([$ip, $action, $t - $window]);
  if ((int) $q->fetch()['c'] >= $limit) fail('Слишком много попыток, подожди', 429);
  $db->prepare('INSERT INTO throttle (ip, action, ts) VALUES (?,?,?)')->execute([$ip, $action, $t]);
}

/* ── пользователи ── */
function user_by_id(PDO $db, int $id): ?array {
  $q = $db->prepare('SELECT id, role, email, name, created, coach_id, terms_ver, last_seen FROM users WHERE id = ?'); $q->execute([$id]);
  $u = $q->fetch(); return $u ?: null;
}
function public_user(array $u): array {
  return ['id' => (int) $u['id'], 'role' => $u['role'], 'email' => $u['email'], 'name' => $u['name'], 'created' => (int) $u['created'], 'coachId' => $u['coach_id'] ? (int) $u['coach_id'] : null, 'terms' => $u['terms_ver']];
}
function auth(PDO $db, ?string $role = null): array {
  $t = bearer();
  if ($t === '') fail('Нужен вход', 401);
  $q = $db->prepare('SELECT u.*, s.expires FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.hash = ?');
  $q->execute([thash($t)]);
  $u = $q->fetch();
  if (!$u || (int) $u['expires'] < now()) fail('Сессия истекла, войди заново', 401);
  if ($role && $u['role'] !== $role) fail('Не та роль', 403);
  return $u;
}
function new_session(PDO $db, int $userId): string {
  global $TOKEN_DAYS;
  $t = token();
  $db->prepare('INSERT INTO sessions (hash, user_id, created, expires, ua) VALUES (?,?,?,?,?)')->execute([thash($t), $userId, now(), now() + $TOKEN_DAYS * 86400, ua()]);
  $db->prepare('DELETE FROM sessions WHERE expires < ?')->execute([now()]);
  return $t;
}
function coach_brief(PDO $db, ?int $coachId): ?array {
  if (!$coachId) return null;
  $c = user_by_id($db, $coachId);
  return $c ? ['id' => (int) $c['id'], 'name' => $c['name']] : null;
}
function consents_of(PDO $db, int $userId): array {
  $q = $db->prepare('SELECT kind, version, given_at FROM consents WHERE user_id = ? AND withdrawn_at IS NULL ORDER BY given_at DESC'); $q->execute([$userId]);
  return $q->fetchAll();
}
function require_consents(array $b, array $need): array {
  $consents = is_array($b['consents'] ?? null) ? $b['consents'] : [];
  $kinds = [];
  foreach ($consents as $cs) if (is_array($cs) && !empty($cs['kind']) && !empty($cs['version']) && !empty($cs['hash'])) $kinds[(string) $cs['kind']] = $cs;
  foreach ($need as $k) if (empty($kinds[$k])) fail('Нужны все согласия: ' . implode(', ', $need), 422);
  return $kinds;
}
function save_consents(PDO $db, int $userId, array $kinds): void {
  $ci = $db->prepare('INSERT INTO consents (user_id, kind, version, text_hash, given_at, ip, ua) VALUES (?,?,?,?,?,?,?)');
  foreach ($kinds as $k => $c) $ci->execute([$userId, mb_substr((string) $k, 0, 20), mb_substr((string) $c['version'], 0, 40), mb_substr((string) $c['hash'], 0, 80), now(), ip(), ua()]);
}
function coach_docs(PDO $db, int $clientId, array $since = []): object {
  $q = $db->prepare('SELECT key, json, rev, updated FROM coach_docs WHERE client_id = ?'); $q->execute([$clientId]);
  $outv = [];
  foreach ($q as $r) {
    if (isset($since[$r['key']]) && (int) $since[$r['key']] >= (int) $r['rev']) continue;
    $outv[$r['key']] = ['d' => json_decode($r['json'], true), 'rev' => (int) $r['rev'], 'u' => (int) $r['updated']];
  }
  return (object) $outv;
}
function client_docs(PDO $db, int $userId): object {
  $q = $db->prepare('SELECT key, json, updated FROM docs WHERE user_id = ?'); $q->execute([$userId]);
  $outv = [];
  foreach ($q as $r) $outv[$r['key']] = ['d' => json_decode($r['json'], true), 'u' => (int) $r['updated']];
  return (object) $outv;
}
function client_summary(PDO $db, array $c): array {
  $q = $db->prepare('SELECT key, json FROM docs WHERE user_id = ? AND key IN (\'weight\',\'sessions\',\'profile\')'); $q->execute([(int) $c['id']]);
  $s = ['id' => (int) $c['id'], 'name' => $c['name'], 'created' => (int) $c['created'], 'lastSync' => $c['last_seen'] ? (int) $c['last_seen'] : null,
        'weight' => null, 'lastWorkout' => null, 'workouts' => 0, 'goal' => null];
  foreach ($q as $r) {
    $v = json_decode($r['json'], true);
    if ($r['key'] === 'weight' && is_numeric($v)) $s['weight'] = (float) $v;
    if ($r['key'] === 'profile' && is_array($v)) $s['goal'] = $v['goal'] ?? null;
    if ($r['key'] === 'sessions' && is_array($v)) {
      $s['workouts'] = count($v);
      foreach ($v as $ses) if (!empty($ses['date']) && (!$s['lastWorkout'] || $ses['date'] > $s['lastWorkout'])) $s['lastWorkout'] = $ses['date'];
    }
  }
  return $s;
}
function unlink_client(PDO $db, int $clientId, string $by): void {
  $db->prepare('DELETE FROM coach_docs WHERE client_id = ?')->execute([$clientId]);
  $db->prepare('UPDATE users SET coach_id = NULL WHERE id = ?')->execute([$clientId]);
  $db->prepare('INSERT INTO wipes (user_id, at, by, note) VALUES (?,?,?,?)')->execute([$clientId, now(), $by, 'unlink: coach_docs deleted, coach access revoked']);
}
function wipe_user(PDO $db, int $id, string $by): void {
  $db->beginTransaction();
  $u = user_by_id($db, $id);
  if ($u && $u['role'] === 'coach') {
    /* Тренер уходит - клиенты остаются со своими данными, но без тренера */
    $q = $db->prepare('SELECT id FROM users WHERE coach_id = ?'); $q->execute([$id]);
    foreach ($q->fetchAll() as $cl) unlink_client($db, (int) $cl['id'], $by);
    $db->prepare('DELETE FROM invites WHERE coach_id = ?')->execute([$id]);
  }
  foreach (['docs' => 'user_id', 'coach_docs' => 'client_id', 'sessions' => 'user_id', 'resets' => 'user_id'] as $t => $col) $db->prepare("DELETE FROM $t WHERE $col = ?")->execute([$id]);
  $db->prepare('UPDATE consents SET withdrawn_at = ?, ip = NULL, ua = NULL WHERE user_id = ? AND withdrawn_at IS NULL')->execute([now(), $id]);
  $db->prepare('DELETE FROM users WHERE id = ?')->execute([$id]);
  $db->prepare('INSERT INTO wipes (user_id, at, by, note) VALUES (?,?,?,?)')->execute([$id, now(), $by, 'account deleted: user, docs, coach_docs, sessions; consents anonymized']);
  $db->commit();
}
function seen(PDO $db, int $id, string $app = ''): void {
  $db->prepare('UPDATE users SET last_seen = ?, app_ver = COALESCE(NULLIF(?, \'\'), app_ver) WHERE id = ?')->execute([now(), mb_substr($app, 0, 20), $id]);
}

/* ── маршрут ── */
$route = $_GET['r'] ?? trim((string) ($_SERVER['PATH_INFO'] ?? ''), '/');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$post = fn() => $method === 'POST' ? body() : fail('Нужен POST', 405);

switch ($route) {

  case '': case 'ping':
    out(['ok' => true, 'service' => 'gryaz', 'v' => 12, 'time' => now()]);

  /* ═══════ АККАУНТ ═══════ */
  case 'auth/register': {
    $b = $post();
    throttle($db, 'register', 15);
    $role = ($b['role'] ?? '') === 'coach' ? 'coach' : 'client';
    $email = norm_email((string) ($b['email'] ?? ''));
    $pass = (string) ($b['password'] ?? '');
    $name = clean_name((string) ($b['name'] ?? ''));
    if (!valid_email($email)) fail('Похоже, почта с ошибкой', 422);
    if (strlen($pass) < 8) fail('Пароль от 8 символов', 422);
    if (mb_strlen($name) < 2) fail('Как тебя называть?', 422);
    if (empty($b['adult'])) fail('Сервис для тех, кому есть 18', 422);
    $kinds = require_consents($b, $role === 'coach' ? ['terms', 'pdn', 'coach'] : ['terms', 'pdn', 'health']);
    $q = $db->prepare('SELECT id FROM users WHERE email = ?'); $q->execute([$email]);
    if ($q->fetch()) fail('Эта почта уже зарегистрирована - войди', 409);
    $coachCode = null;
    if ($role === 'coach') {
      /* Тренеры регистрируются только по коду от администратора сервиса */
      $coachCode = norm_code((string) ($b['coachCode'] ?? ''));
      $q = $db->prepare('SELECT code FROM coach_codes WHERE code = ? AND used_by IS NULL'); $q->execute([$coachCode]);
      if (!$q->fetch()) fail('Код тренера не подходит или уже использован', 404);
    }
    $db->beginTransaction();
    $db->prepare('INSERT INTO users (role, email, pass, name, created, terms_ver) VALUES (?,?,?,?,?,?)')
       ->execute([$role, $email, password_hash($pass, PASSWORD_DEFAULT), $name, now(), (string) ($kinds['terms']['version'] ?? '')]);
    $id = (int) $db->lastInsertId();
    save_consents($db, $id, $kinds);
    if ($coachCode) $db->prepare('UPDATE coach_codes SET used_by = ?, used_at = ? WHERE code = ?')->execute([$id, now(), $coachCode]);
    $db->commit();
    $t = new_session($db, $id);
    out(['token' => $t, 'user' => public_user(user_by_id($db, $id)), 'coach' => null]);
  }

  case 'auth/login': {
    $b = $post();
    throttle($db, 'login', 25);
    $email = norm_email((string) ($b['email'] ?? ''));
    $q = $db->prepare('SELECT * FROM users WHERE email = ?'); $q->execute([$email]);
    $u = $q->fetch();
    if (!$u || !password_verify((string) ($b['password'] ?? ''), $u['pass'])) fail('Неверная почта или пароль', 401);
    $t = new_session($db, (int) $u['id']);
    seen($db, (int) $u['id'], (string) ($b['app'] ?? ''));
    out(['token' => $t, 'user' => public_user($u), 'coach' => coach_brief($db, $u['coach_id'] ? (int) $u['coach_id'] : null)]);
  }

  case 'auth/logout': {
    auth($db);
    $db->prepare('DELETE FROM sessions WHERE hash = ?')->execute([thash(bearer())]);
    out(['ok' => true]);
  }

  case 'auth/me': {
    $u = auth($db);
    seen($db, (int) $u['id'], (string) ($_GET['app'] ?? ''));
    out(['user' => public_user($u), 'coach' => coach_brief($db, $u['coach_id'] ? (int) $u['coach_id'] : null), 'consents' => consents_of($db, (int) $u['id']), 'time' => now()]);
  }

  case 'auth/name': {
    $u = auth($db); $b = $post();
    $name = clean_name((string) ($b['name'] ?? ''));
    if (mb_strlen($name) < 2) fail('Слишком коротко', 422);
    $db->prepare('UPDATE users SET name = ? WHERE id = ?')->execute([$name, $u['id']]);
    out(['ok' => true, 'name' => $name]);
  }

  case 'auth/password': {
    $u = auth($db); $b = $post();
    if (!password_verify((string) ($b['old'] ?? ''), $u['pass'])) fail('Старый пароль не подошёл', 401);
    $new = (string) ($b['new'] ?? '');
    if (strlen($new) < 8) fail('Новый пароль от 8 символов', 422);
    $db->prepare('UPDATE users SET pass = ? WHERE id = ?')->execute([password_hash($new, PASSWORD_DEFAULT), $u['id']]);
    /* Все остальные сессии - вон */
    $db->prepare('DELETE FROM sessions WHERE user_id = ? AND hash != ?')->execute([$u['id'], thash(bearer())]);
    out(['ok' => true]);
  }

  case 'auth/terms': {
    $u = auth($db); $b = $post();
    $kinds = require_consents($b, [$u['role'] === 'coach' ? 'coach' : 'terms']);
    save_consents($db, (int) $u['id'], $kinds);
    $db->prepare('UPDATE users SET terms_ver = ? WHERE id = ?')->execute([(string) reset($kinds)['version'], $u['id']]);
    out(['ok' => true]);
  }

  case 'auth/reset/request': {
    $b = $post();
    throttle($db, 'reset', 10);
    $email = norm_email((string) ($b['email'] ?? ''));
    $q = $db->prepare('SELECT id, name FROM users WHERE email = ?'); $q->execute([$email]);
    $u = $q->fetch();
    /* Отвечаем одинаково, есть такая почта или нет - чтобы по ответу нельзя было перебирать */
    if ($u && $MAIL_FROM !== '') {
      $code = code6();
      $db->prepare('INSERT INTO resets (user_id, code_hash, expires, attempts) VALUES (?,?,?,0) ON CONFLICT(user_id) DO UPDATE SET code_hash = excluded.code_hash, expires = excluded.expires, attempts = 0')
         ->execute([$u['id'], thash($code), now() + 900]);
      $subject = '=?UTF-8?B?' . base64_encode('ГРЯЗЬ: код для смены пароля') . '?=';
      $text = "Код для смены пароля: $code\nДействует 15 минут. Если это не ты - просто не обращай внимания.";
      @mail($email, $subject, $text, "From: $MAIL_FROM\r\nContent-Type: text/plain; charset=UTF-8");
    }
    out(['ok' => true, 'mail' => $MAIL_FROM !== '']);
  }

  case 'auth/reset/confirm': {
    $b = $post();
    throttle($db, 'reset', 10);
    $email = norm_email((string) ($b['email'] ?? ''));
    $q = $db->prepare('SELECT u.id, r.code_hash, r.expires, r.attempts FROM users u JOIN resets r ON r.user_id = u.id WHERE u.email = ?'); $q->execute([$email]);
    $r = $q->fetch();
    if (!$r || (int) $r['expires'] < now() || (int) $r['attempts'] >= 5) fail('Код не подходит или устарел', 404);
    if (!hash_equals($r['code_hash'], thash(norm_code((string) ($b['code'] ?? ''))))) {
      $db->prepare('UPDATE resets SET attempts = attempts + 1 WHERE user_id = ?')->execute([$r['id']]);
      fail('Код не подходит', 404);
    }
    $new = (string) ($b['password'] ?? '');
    if (strlen($new) < 8) fail('Пароль от 8 символов', 422);
    $db->prepare('UPDATE users SET pass = ? WHERE id = ?')->execute([password_hash($new, PASSWORD_DEFAULT), $r['id']]);
    $db->prepare('DELETE FROM resets WHERE user_id = ?')->execute([$r['id']]);
    $db->prepare('DELETE FROM sessions WHERE user_id = ?')->execute([$r['id']]);
    out(['ok' => true]);
  }

  case 'me/delete': {
    $u = auth($db); $b = $post();
    if (!password_verify((string) ($b['password'] ?? ''), $u['pass'])) fail('Пароль не подошёл', 401);
    wipe_user($db, (int) $u['id'], 'self');
    out(['ok' => true]);
  }

  /* ═══════ КЛИЕНТ ═══════ */
  case 'client/link': {
    $u = auth($db, 'client'); $b = $post();
    throttle($db, 'link', 20);
    $code = norm_code((string) ($b['code'] ?? ''));
    $q = $db->prepare('SELECT * FROM invites WHERE code = ? AND used_at IS NULL'); $q->execute([$code]);
    $inv = $q->fetch();
    if (!$inv) fail('Код не найден или уже использован', 404);
    if ((int) $inv['expires'] < now()) fail('Код просрочен, попроси у тренера новый', 410);
    $kinds = require_consents($b, ['share']);   /* отдельное согласие на показ данных этому тренеру */
    $db->beginTransaction();
    if ($u['coach_id'] && (int) $u['coach_id'] !== (int) $inv['coach_id']) unlink_client($db, (int) $u['id'], 'relink');
    $db->prepare('UPDATE users SET coach_id = ? WHERE id = ?')->execute([$inv['coach_id'], $u['id']]);
    $db->prepare('UPDATE invites SET used_by = ?, used_at = ? WHERE code = ?')->execute([$u['id'], now(), $code]);
    save_consents($db, (int) $u['id'], $kinds);
    $db->commit();
    out(['ok' => true, 'coach' => coach_brief($db, (int) $inv['coach_id'])]);
  }

  case 'client/unlink': {
    $u = auth($db, 'client'); $post();
    if ($u['coach_id']) unlink_client($db, (int) $u['id'], 'client');
    $db->prepare('UPDATE consents SET withdrawn_at = ? WHERE user_id = ? AND kind = \'share\' AND withdrawn_at IS NULL')->execute([now(), $u['id']]);
    out(['ok' => true]);
  }

  case 'client/sync': {
    $u = auth($db, 'client'); $b = $post();
    $docs = is_array($b['docs'] ?? null) ? $b['docs'] : [];
    $since = is_array($b['coachRev'] ?? null) ? $b['coachRev'] : [];
    $saved = [];
    $db->beginTransaction();
    $ins = $db->prepare('INSERT INTO docs (user_id, key, json, updated, received) VALUES (?,?,?,?,?)
                         ON CONFLICT(user_id, key) DO UPDATE SET json = excluded.json, updated = excluded.updated, received = excluded.received
                         WHERE excluded.updated >= docs.updated');
    foreach ($docs as $key => $doc) {
      $key = (string) $key;
      $okKey = in_array($key, $CLIENT_KEYS, true) || preg_match('/^guide_\d{4}-\d{2}-\d{2}$/', $key);
      if (!$okKey || !is_array($doc) || !array_key_exists('d', $doc)) continue;
      $json = json_encode($doc['d'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
      if ($json === false || strlen($json) > $MAX_DOC) continue;
      $ins->execute([(int) $u['id'], $key, $json, (int) ($doc['u'] ?? ms()), ms()]);
      $saved[] = $key;
    }
    $db->commit();
    seen($db, (int) $u['id'], (string) ($b['app'] ?? ''));
    out(['ok' => true, 'saved' => $saved, 'coach' => coach_docs($db, (int) $u['id'], $since), 'coachInfo' => coach_brief($db, $u['coach_id'] ? (int) $u['coach_id'] : null), 'time' => now()]);
  }

  case 'client/pull': {
    $u = auth($db, 'client');
    out(['docs' => client_docs($db, (int) $u['id']), 'coach' => coach_docs($db, (int) $u['id']), 'user' => public_user($u), 'coachInfo' => coach_brief($db, $u['coach_id'] ? (int) $u['coach_id'] : null), 'time' => now()]);
  }

  case 'client/export': {
    $u = auth($db);
    $q = $db->prepare('SELECT kind, version, text_hash, given_at, withdrawn_at FROM consents WHERE user_id = ?'); $q->execute([$u['id']]);
    out(['user' => public_user($u), 'coach' => coach_brief($db, $u['coach_id'] ? (int) $u['coach_id'] : null), 'consents' => $q->fetchAll(),
         'docs' => client_docs($db, (int) $u['id']), 'coachDocs' => coach_docs($db, (int) $u['id']), 'exported' => now()]);
  }

  /* ═══════ ТРЕНЕР ═══════ */
  case 'coach/me': {
    $u = auth($db, 'coach');
    seen($db, (int) $u['id'], (string) ($_GET['app'] ?? ''));
    $q = $db->prepare('SELECT id, name, created, last_seen FROM users WHERE coach_id = ? ORDER BY name'); $q->execute([$u['id']]);
    $list = array_map(fn($row) => client_summary($db, $row), $q->fetchAll());
    $q = $db->prepare('SELECT code, expires FROM invites WHERE coach_id = ? AND used_at IS NULL AND expires > ? ORDER BY created DESC'); $q->execute([$u['id'], now()]);
    out(['user' => public_user($u), 'clients' => $list, 'invites' => $q->fetchAll(), 'time' => now()]);
  }

  case 'coach/invite': {
    $u = auth($db, 'coach'); $post();
    $code = code6(); $exp = now() + $INVITE_DAYS * 86400;
    $db->prepare('INSERT INTO invites (code, coach_id, created, expires) VALUES (?,?,?,?)')->execute([$code, $u['id'], now(), $exp]);
    $db->prepare('DELETE FROM invites WHERE expires < ? AND used_at IS NULL')->execute([now()]);
    out(['code' => $code, 'expires' => $exp]);
  }

  case 'coach/client': {
    $u = auth($db, 'coach');
    $id = (int) ($_GET['id'] ?? 0);
    $q = $db->prepare('SELECT id, name, created, last_seen, app_ver FROM users WHERE id = ? AND coach_id = ?'); $q->execute([$id, $u['id']]);
    $cl = $q->fetch();
    if (!$cl) fail('Нет такого клиента', 404);
    out(['client' => $cl, 'docs' => client_docs($db, $id), 'coach' => coach_docs($db, $id), 'consents' => consents_of($db, $id), 'time' => now()]);
  }

  case 'coach/client/set': {
    $u = auth($db, 'coach'); $b = $post();
    $id = (int) ($b['id'] ?? 0); $key = (string) ($b['key'] ?? '');
    if (!in_array($key, $COACH_KEYS, true)) fail('Неизвестный документ');
    if (!array_key_exists('data', $b)) fail('Нет данных');
    $q = $db->prepare('SELECT id FROM users WHERE id = ? AND coach_id = ?'); $q->execute([$id, $u['id']]);
    if (!$q->fetch()) fail('Нет такого клиента', 404);
    $json = json_encode($b['data'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (strlen($json) > $MAX_DOC) fail('Документ слишком большой', 413);
    $q = $db->prepare('SELECT rev FROM coach_docs WHERE client_id = ? AND key = ?'); $q->execute([$id, $key]);
    $rev = ((int) ($q->fetchColumn() ?: 0)) + 1;
    $db->prepare('INSERT INTO coach_docs (client_id, key, json, rev, updated, coach_id) VALUES (?,?,?,?,?,?)
                  ON CONFLICT(client_id, key) DO UPDATE SET json = excluded.json, rev = excluded.rev, updated = excluded.updated, coach_id = excluded.coach_id')
       ->execute([$id, $key, $json, $rev, ms(), $u['id']]);
    out(['ok' => true, 'rev' => $rev]);
  }

  case 'coach/client/unlink': {
    $u = auth($db, 'coach'); $b = $post();
    $id = (int) ($b['id'] ?? 0);
    $q = $db->prepare('SELECT id FROM users WHERE id = ? AND coach_id = ?'); $q->execute([$id, $u['id']]);
    if (!$q->fetch()) fail('Нет такого клиента', 404);
    unlink_client($db, $id, 'coach:' . $u['id']);
    out(['ok' => true]);
  }

  default:
    fail('Нет такого маршрута: ' . $route, 404);
}
