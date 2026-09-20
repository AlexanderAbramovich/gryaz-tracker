<?php
declare(strict_types=1);
/* ═══════════════════════════════════════════════════════════════════════
   ГРЯЗЬ · сервер кабинета тренера
   Один файл, PHP 8 + SQLite, без зависимостей. Живёт на РФ-хостинге.

   Что хранит: аккаунты тренеров, клиентов, документы клиента (тренировки,
   вес, еда, сон, чек-лист), документы тренера для клиента (программа, цели,
   заметка), факты согласий. Фото тела на сервер НЕ попадают никогда.

   Маршрут: /api/index.php?r=client/sync  или  /api/index.php/client/sync
   Ответ всегда JSON. Ошибка: {"error":"текст"} и код 4xx/5xx.
   ═══════════════════════════════════════════════════════════════════════ */

$CFG = file_exists(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];
$DB_PATH   = $CFG['db']       ?? __DIR__ . '/data/gryaz.sqlite';
$ORIGINS   = $CFG['origins']  ?? [];          /* чужие origin'ы, которым можно ходить в API (GitHub Pages на время переезда) */
$TOKEN_DAYS  = 180;
$INVITE_DAYS = 7;
$MAX_BODY    = 3 * 1024 * 1024;
$MAX_DOC     = 1024 * 1024;
$COACH_KEYS  = ['plan', 'goals', 'note'];
$CLIENT_KEYS = ['sessions', 'lastEx', 'wHist', 'weight', 'sleep', 'food', 'cfg', 'startDate', 'curDay', 'schema', 'plan', 'goals'];

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');

/* ── CORS: свой origin всегда, чужие только из config ── */
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
function invite_code(): string {
  $abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  $s = '';
  for ($i = 0; $i < 6; $i++) $s .= $abc[random_int(0, strlen($abc) - 1)];
  return $s;
}
function norm_code(string $c): string { return strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $c)); }
function clean_name(string $n): string {
  $n = trim(preg_replace('/\s+/u', ' ', strip_tags($n)));
  return mb_substr($n, 0, 40);
}

/* ── база ── */
$dir = dirname($DB_PATH);
if (!is_dir($dir)) @mkdir($dir, 0750, true);
try {
  $db = new PDO('sqlite:' . $DB_PATH, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
} catch (Throwable $e) { fail('База недоступна', 500); }
$db->exec('PRAGMA journal_mode=WAL');
$db->exec('PRAGMA foreign_keys=ON');
$db->exec('PRAGMA busy_timeout=4000');
$db->exec(<<<SQL
CREATE TABLE IF NOT EXISTS coaches (
  id INTEGER PRIMARY KEY, login TEXT UNIQUE NOT NULL, pass TEXT NOT NULL, name TEXT NOT NULL,
  created INTEGER NOT NULL, terms_ver TEXT, terms_at INTEGER);
CREATE TABLE IF NOT EXISTS coach_tokens (hash TEXT PRIMARY KEY, coach_id INTEGER NOT NULL, created INTEGER NOT NULL, expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY, coach_id INTEGER NOT NULL, name TEXT NOT NULL, token_hash TEXT UNIQUE,
  created INTEGER NOT NULL, last_sync INTEGER, app_ver TEXT);
CREATE TABLE IF NOT EXISTS invites (
  code TEXT PRIMARY KEY, coach_id INTEGER NOT NULL, client_id INTEGER, created INTEGER NOT NULL, expires INTEGER NOT NULL, used_at INTEGER);
CREATE TABLE IF NOT EXISTS docs (
  client_id INTEGER NOT NULL, key TEXT NOT NULL, json TEXT NOT NULL, updated INTEGER NOT NULL, received INTEGER NOT NULL,
  PRIMARY KEY (client_id, key));
CREATE TABLE IF NOT EXISTS coach_docs (
  client_id INTEGER NOT NULL, key TEXT NOT NULL, json TEXT NOT NULL, rev INTEGER NOT NULL, updated INTEGER NOT NULL, coach_id INTEGER NOT NULL,
  PRIMARY KEY (client_id, key));
CREATE TABLE IF NOT EXISTS consents (
  id INTEGER PRIMARY KEY, client_id INTEGER NOT NULL, coach_id INTEGER NOT NULL, kind TEXT NOT NULL DEFAULT 'pdn', version TEXT NOT NULL, text_hash TEXT NOT NULL,
  given_at INTEGER NOT NULL, withdrawn_at INTEGER, ip TEXT, ua TEXT);
CREATE TABLE IF NOT EXISTS wipes (id INTEGER PRIMARY KEY, client_id INTEGER NOT NULL, at INTEGER NOT NULL, by TEXT NOT NULL, note TEXT);
CREATE TABLE IF NOT EXISTS throttle (ip TEXT NOT NULL, action TEXT NOT NULL, ts INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS throttle_ix ON throttle (ip, action, ts);
SQL);

function throttle(PDO $db, string $action, int $limit, int $window = 3600): void {
  $ip = ip(); $t = now();
  $db->prepare('DELETE FROM throttle WHERE ts < ?')->execute([$t - $window]);
  $q = $db->prepare('SELECT COUNT(*) c FROM throttle WHERE ip = ? AND action = ? AND ts > ?');
  $q->execute([$ip, $action, $t - $window]);
  if ((int) $q->fetch()['c'] >= $limit) fail('Слишком много попыток, подожди', 429);
  $db->prepare('INSERT INTO throttle (ip, action, ts) VALUES (?,?,?)')->execute([$ip, $action, $t]);
}

/* ── авторизация ── */
function auth_coach(PDO $db): array {
  $t = bearer();
  if ($t === '') fail('Нужен вход', 401);
  $q = $db->prepare('SELECT c.id, c.login, c.name, t.expires FROM coach_tokens t JOIN coaches c ON c.id = t.coach_id WHERE t.hash = ?');
  $q->execute([thash($t)]);
  $row = $q->fetch();
  if (!$row || (int) $row['expires'] < now()) fail('Сессия истекла, войди заново', 401);
  return $row;
}
function auth_client(PDO $db): array {
  $t = bearer();
  if ($t === '') fail('Нет токена', 401);
  $q = $db->prepare('SELECT id, coach_id, name, created, last_sync FROM clients WHERE token_hash = ?');
  $q->execute([thash($t)]);
  $row = $q->fetch();
  if (!$row) fail('Устройство отключено от тренера', 401);
  return $row;
}
function coach_name(PDO $db, int $id): string {
  $q = $db->prepare('SELECT name FROM coaches WHERE id = ?'); $q->execute([$id]);
  return (string) ($q->fetchColumn() ?: '');
}
function coach_docs(PDO $db, int $clientId, array $since = []): object {
  $q = $db->prepare('SELECT key, json, rev, updated FROM coach_docs WHERE client_id = ?');
  $q->execute([$clientId]);
  $outv = [];
  foreach ($q as $r) {
    if (isset($since[$r['key']]) && (int) $since[$r['key']] >= (int) $r['rev']) continue;
    $outv[$r['key']] = ['d' => json_decode($r['json'], true), 'rev' => (int) $r['rev'], 'u' => (int) $r['updated']];
  }
  return (object) $outv;   /* пустой → {} в JSON, а не [] */
}
function client_docs(PDO $db, int $clientId): object {
  $q = $db->prepare('SELECT key, json, updated FROM docs WHERE client_id = ?');
  $q->execute([$clientId]);
  $outv = [];
  foreach ($q as $r) $outv[$r['key']] = ['d' => json_decode($r['json'], true), 'u' => (int) $r['updated']];
  return (object) $outv;
}
function client_summary(PDO $db, array $c): array {
  /* Дёшево: вес и последняя тренировка. Остальное считает кабинет из документов. */
  $q = $db->prepare('SELECT key, json FROM docs WHERE client_id = ? AND key IN (\'weight\',\'sessions\',\'wHist\')');
  $q->execute([(int) $c['id']]);
  $s = ['id' => (int) $c['id'], 'name' => $c['name'], 'created' => (int) $c['created'], 'lastSync' => $c['last_sync'] ? (int) $c['last_sync'] : null,
        'weight' => null, 'lastWorkout' => null, 'workouts' => 0, 'weighIns' => 0];
  foreach ($q as $r) {
    $v = json_decode($r['json'], true);
    if ($r['key'] === 'weight' && is_numeric($v)) $s['weight'] = (float) $v;
    if ($r['key'] === 'wHist' && is_array($v)) $s['weighIns'] = count($v);
    if ($r['key'] === 'sessions' && is_array($v)) {
      $s['workouts'] = count($v);
      foreach ($v as $ses) if (!empty($ses['date']) && (!$s['lastWorkout'] || $ses['date'] > $s['lastWorkout'])) $s['lastWorkout'] = $ses['date'];
    }
  }
  return $s;
}
function wipe_client(PDO $db, int $id, string $by): void {
  $db->beginTransaction();
  foreach (['docs', 'coach_docs', 'invites'] as $t) $db->prepare("DELETE FROM $t WHERE client_id = ?")->execute([$id]);
  /* Факт согласия и отзыва остаётся без имени: это не персональные данные, а доказательство, что согласие было */
  $db->prepare('UPDATE consents SET withdrawn_at = ?, ip = NULL, ua = NULL WHERE client_id = ? AND withdrawn_at IS NULL')->execute([now(), $id]);
  $db->prepare('DELETE FROM clients WHERE id = ?')->execute([$id]);
  /* Журнал уничтожения: дата, кто, что - без персональных данных. Это основа акта об уничтожении. */
  $db->prepare('INSERT INTO wipes (client_id, at, by, note) VALUES (?,?,?,?)')->execute([$id, now(), $by, 'docs, coach_docs, invites, client; consents anonymized']);
  $db->commit();
}

/* ── маршрут ── */
$route = $_GET['r'] ?? trim((string) ($_SERVER['PATH_INFO'] ?? ''), '/');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$post = fn() => $method === 'POST' ? body() : fail('Нужен POST', 405);

switch ($route) {

  case '': case 'ping':
    out(['ok' => true, 'service' => 'gryaz', 'time' => now()]);

  /* ═══════ ТРЕНЕР ═══════ */
  case 'coach/login': {
    $b = $post();
    throttle($db, 'login', 20);
    $login = strtolower(trim((string) ($b['login'] ?? '')));
    $pass  = (string) ($b['password'] ?? '');
    $q = $db->prepare('SELECT * FROM coaches WHERE login = ?'); $q->execute([$login]);
    $c = $q->fetch();
    if (!$c || !password_verify($pass, $c['pass'])) fail('Неверный логин или пароль', 401);
    $t = token();
    $db->prepare('INSERT INTO coach_tokens (hash, coach_id, created, expires) VALUES (?,?,?,?)')->execute([thash($t), $c['id'], now(), now() + $TOKEN_DAYS * 86400]);
    $db->prepare('DELETE FROM coach_tokens WHERE expires < ?')->execute([now()]);
    out(['token' => $t, 'coach' => ['id' => (int) $c['id'], 'name' => $c['name'], 'login' => $c['login'], 'terms' => $c['terms_ver']]]);
  }

  case 'coach/logout': {
    auth_coach($db);
    $db->prepare('DELETE FROM coach_tokens WHERE hash = ?')->execute([thash(bearer())]);
    out(['ok' => true]);
  }

  case 'coach/terms': {
    $c = auth_coach($db); $b = $post();
    $db->prepare('UPDATE coaches SET terms_ver = ?, terms_at = ? WHERE id = ?')->execute([(string) ($b['version'] ?? ''), now(), $c['id']]);
    out(['ok' => true]);
  }

  case 'coach/me': {
    $c = auth_coach($db);
    $q = $db->prepare('SELECT id, name, created, last_sync FROM clients WHERE coach_id = ? ORDER BY name');
    $q->execute([$c['id']]);
    $list = array_map(fn($row) => client_summary($db, $row), $q->fetchAll());
    $q = $db->prepare('SELECT code, client_id, expires FROM invites WHERE coach_id = ? AND used_at IS NULL AND expires > ? ORDER BY created DESC');
    $q->execute([$c['id'], now()]);
    out(['coach' => ['id' => (int) $c['id'], 'name' => $c['name'], 'login' => $c['login']], 'clients' => $list, 'invites' => $q->fetchAll(), 'time' => now()]);
  }

  case 'coach/invite': {
    $c = auth_coach($db); $b = $post();
    $clientId = isset($b['client_id']) ? (int) $b['client_id'] : null;
    if ($clientId) {
      $q = $db->prepare('SELECT id FROM clients WHERE id = ? AND coach_id = ?'); $q->execute([$clientId, $c['id']]);
      if (!$q->fetch()) fail('Нет такого клиента', 404);
    }
    $code = invite_code();
    $exp = now() + $INVITE_DAYS * 86400;
    $db->prepare('INSERT INTO invites (code, coach_id, client_id, created, expires) VALUES (?,?,?,?,?)')->execute([$code, $c['id'], $clientId, now(), $exp]);
    $db->prepare('DELETE FROM invites WHERE expires < ? AND used_at IS NULL')->execute([now()]);
    out(['code' => $code, 'expires' => $exp, 'client_id' => $clientId]);
  }

  case 'coach/client': {
    $c = auth_coach($db);
    $id = (int) ($_GET['id'] ?? 0);
    $q = $db->prepare('SELECT id, name, created, last_sync, app_ver FROM clients WHERE id = ? AND coach_id = ?');
    $q->execute([$id, $c['id']]);
    $cl = $q->fetch();
    if (!$cl) fail('Нет такого клиента', 404);
    $q = $db->prepare('SELECT kind, version, given_at, withdrawn_at FROM consents WHERE client_id = ? AND withdrawn_at IS NULL ORDER BY given_at DESC'); $q->execute([$id]);
    out(['client' => $cl, 'docs' => client_docs($db, $id), 'coach' => coach_docs($db, $id), 'consents' => $q->fetchAll(), 'time' => now()]);
  }

  case 'coach/client/set': {
    $c = auth_coach($db); $b = $post();
    $id = (int) ($b['id'] ?? 0); $key = (string) ($b['key'] ?? '');
    if (!in_array($key, $COACH_KEYS, true)) fail('Неизвестный документ');
    if (!array_key_exists('data', $b)) fail('Нет данных');
    $q = $db->prepare('SELECT id FROM clients WHERE id = ? AND coach_id = ?'); $q->execute([$id, $c['id']]);
    if (!$q->fetch()) fail('Нет такого клиента', 404);
    $json = json_encode($b['data'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (strlen($json) > $MAX_DOC) fail('Документ слишком большой', 413);
    $q = $db->prepare('SELECT rev FROM coach_docs WHERE client_id = ? AND key = ?'); $q->execute([$id, $key]);
    $rev = ((int) ($q->fetchColumn() ?: 0)) + 1;
    $db->prepare('INSERT INTO coach_docs (client_id, key, json, rev, updated, coach_id) VALUES (?,?,?,?,?,?)
                  ON CONFLICT(client_id, key) DO UPDATE SET json = excluded.json, rev = excluded.rev, updated = excluded.updated, coach_id = excluded.coach_id')
       ->execute([$id, $key, $json, $rev, ms(), $c['id']]);
    out(['ok' => true, 'rev' => $rev]);
  }

  case 'coach/client/rename': {
    $c = auth_coach($db); $b = $post();
    $name = clean_name((string) ($b['name'] ?? ''));
    if ($name === '') fail('Пустое имя');
    $q = $db->prepare('UPDATE clients SET name = ? WHERE id = ? AND coach_id = ?'); $q->execute([$name, (int) ($b['id'] ?? 0), $c['id']]);
    out(['ok' => $q->rowCount() > 0]);
  }

  case 'coach/client/delete': {
    $c = auth_coach($db); $b = $post();
    $id = (int) ($b['id'] ?? 0);
    $q = $db->prepare('SELECT id FROM clients WHERE id = ? AND coach_id = ?'); $q->execute([$id, $c['id']]);
    if (!$q->fetch()) fail('Нет такого клиента', 404);
    wipe_client($db, $id, 'coach:' . $c['id']);
    out(['ok' => true]);
  }

  /* ═══════ КЛИЕНТ ═══════ */
  case 'client/join': {
    $b = $post();
    throttle($db, 'join', 20);
    $code = norm_code((string) ($b['code'] ?? ''));
    $q = $db->prepare('SELECT * FROM invites WHERE code = ? AND used_at IS NULL'); $q->execute([$code]);
    $inv = $q->fetch();
    if (!$inv) fail('Код не найден или уже использован', 404);
    if ((int) $inv['expires'] < now()) fail('Код просрочен, попроси у тренера новый', 410);
    /* Три отдельных документа: условия+ПЭП, согласие на ПДн, согласие на данные о теле и передачу тренеру (156-ФЗ: каждое отдельно) */
    $consents = is_array($b['consents'] ?? null) ? $b['consents'] : [];
    $kinds = [];
    foreach ($consents as $cs) if (is_array($cs) && !empty($cs['kind']) && !empty($cs['version']) && !empty($cs['hash'])) $kinds[(string) $cs['kind']] = $cs;
    foreach (['terms', 'pdn', 'health'] as $need) if (empty($kinds[$need])) fail('Без всех трёх согласий подключиться нельзя', 422);
    $t = token();
    $db->beginTransaction();
    if ($inv['client_id']) {
      /* Код для нового телефона: перепривязываем существующего клиента */
      $id = (int) $inv['client_id'];
      $db->prepare('UPDATE clients SET token_hash = ? WHERE id = ? AND coach_id = ?')->execute([thash($t), $id, $inv['coach_id']]);
      $q = $db->prepare('SELECT name FROM clients WHERE id = ?'); $q->execute([$id]);
      $name = (string) $q->fetchColumn();
      if ($name === '') { $db->rollBack(); fail('Клиент уже удалён', 410); }
    } else {
      $name = clean_name((string) ($b['name'] ?? ''));
      if ($name === '') { $db->rollBack(); fail('Как тебя называть тренеру?', 422); }
      $db->prepare('INSERT INTO clients (coach_id, name, token_hash, created) VALUES (?,?,?,?)')->execute([$inv['coach_id'], $name, thash($t), now()]);
      $id = (int) $db->lastInsertId();
    }
    $ci = $db->prepare('INSERT INTO consents (client_id, coach_id, kind, version, text_hash, given_at, ip, ua) VALUES (?,?,?,?,?,?,?,?)');
    foreach (['terms', 'pdn', 'health'] as $k)
      $ci->execute([$id, $inv['coach_id'], $k, mb_substr((string) $kinds[$k]['version'], 0, 40), mb_substr((string) $kinds[$k]['hash'], 0, 80), now(), ip(), mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 200)]);
    $db->prepare('UPDATE invites SET used_at = ? WHERE code = ?')->execute([now(), $code]);
    $db->commit();
    out(['token' => $t, 'client' => ['id' => $id, 'name' => $name], 'coach' => ['name' => coach_name($db, (int) $inv['coach_id'])], 'relink' => (bool) $inv['client_id']]);
  }

  case 'client/me': {
    $cl = auth_client($db);
    $q = $db->prepare('SELECT kind, version, given_at FROM consents WHERE client_id = ? AND withdrawn_at IS NULL ORDER BY given_at DESC'); $q->execute([$cl['id']]);
    out(['client' => ['id' => (int) $cl['id'], 'name' => $cl['name'], 'created' => (int) $cl['created'], 'lastSync' => $cl['last_sync']],
         'coach' => ['name' => coach_name($db, (int) $cl['coach_id'])], 'consents' => $q->fetchAll(), 'time' => now()]);
  }

  case 'client/sync': {
    $cl = auth_client($db); $b = $post();
    $docs = is_array($b['docs'] ?? null) ? $b['docs'] : [];
    $since = is_array($b['coachRev'] ?? null) ? $b['coachRev'] : [];
    $saved = [];
    $db->beginTransaction();
    $ins = $db->prepare('INSERT INTO docs (client_id, key, json, updated, received) VALUES (?,?,?,?,?)
                         ON CONFLICT(client_id, key) DO UPDATE SET json = excluded.json, updated = excluded.updated, received = excluded.received
                         WHERE excluded.updated >= docs.updated');
    foreach ($docs as $key => $doc) {
      $key = (string) $key;
      $okKey = in_array($key, $CLIENT_KEYS, true) || preg_match('/^guide_\d{4}-\d{2}-\d{2}$/', $key);
      if (!$okKey || !is_array($doc) || !array_key_exists('d', $doc)) continue;
      $json = json_encode($doc['d'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
      if ($json === false || strlen($json) > $MAX_DOC) continue;
      $ins->execute([(int) $cl['id'], $key, $json, (int) ($doc['u'] ?? ms()), ms()]);
      $saved[] = $key;
    }
    $db->prepare('UPDATE clients SET last_sync = ?, app_ver = ? WHERE id = ?')->execute([now(), mb_substr((string) ($b['app'] ?? ''), 0, 20), $cl['id']]);
    $db->commit();
    out(['ok' => true, 'saved' => $saved, 'coach' => coach_docs($db, (int) $cl['id'], $since), 'time' => now()]);
  }

  case 'client/pull': {
    $cl = auth_client($db);
    out(['docs' => client_docs($db, (int) $cl['id']), 'coach' => coach_docs($db, (int) $cl['id']), 'client' => ['id' => (int) $cl['id'], 'name' => $cl['name']],
         'coachName' => coach_name($db, (int) $cl['coach_id']), 'time' => now()]);
  }

  case 'client/export': {
    /* Право субъекта на доступ к своим данным: отдаём всё, что о нём лежит */
    $cl = auth_client($db);
    $q = $db->prepare('SELECT kind, version, text_hash, given_at, withdrawn_at FROM consents WHERE client_id = ?'); $q->execute([$cl['id']]);
    out(['client' => ['id' => (int) $cl['id'], 'name' => $cl['name'], 'created' => (int) $cl['created']], 'coach' => coach_name($db, (int) $cl['coach_id']),
         'consents' => $q->fetchAll(), 'docs' => client_docs($db, (int) $cl['id']), 'coachDocs' => coach_docs($db, (int) $cl['id']), 'exported' => now()]);
  }

  case 'client/leave': {
    /* Отзыв согласия: стираем всё сразу, а не через 30 дней */
    $cl = auth_client($db); $post();
    wipe_client($db, (int) $cl['id'], 'client');
    out(['ok' => true]);
  }

  default:
    fail('Нет такого маршрута: ' . $route, 404);
}
