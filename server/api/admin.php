<?php
declare(strict_types=1);
/* Служебка администратора: коды для регистрации тренеров, список пользователей,
   сброс пароля любому. Доступ только с ключом из config.php: admin.php?key=... */
header('Content-Type: text/html; charset=utf-8');
$CFG = file_exists(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];
$key = $CFG['admin_key'] ?? '';
if ($key === '' || !hash_equals($key, (string) ($_GET['key'] ?? $_POST['key'] ?? ''))) { http_response_code(403); exit('Нет доступа'); }
$db = new PDO('sqlite:' . ($CFG['db'] ?? __DIR__ . '/data/gryaz.sqlite'), null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
$db->exec('CREATE TABLE IF NOT EXISTS coach_codes (code TEXT PRIMARY KEY, created INTEGER NOT NULL, note TEXT, used_by INTEGER, used_at INTEGER)');
$db->exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, role TEXT NOT NULL, email TEXT UNIQUE NOT NULL, pass TEXT NOT NULL, name TEXT NOT NULL, created INTEGER NOT NULL, coach_id INTEGER, terms_ver TEXT, last_seen INTEGER, app_ver TEXT)');
$msg = '';
function code6(): string { $abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; $s = ''; for ($i = 0; $i < 6; $i++) $s .= $abc[random_int(0, 31)]; return $s; }
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $act = $_POST['act'] ?? '';
  if ($act === 'code') {
    $c = code6();
    $db->prepare('INSERT INTO coach_codes (code, created, note) VALUES (?,?,?)')->execute([$c, time(), mb_substr(trim((string) ($_POST['note'] ?? '')), 0, 60)]);
    $msg = "Код для тренера: $c (отдай лично, одноразовый)";
  } elseif ($act === 'pass') {
    $email = strtolower(trim((string) ($_POST['email'] ?? ''))); $p = (string) ($_POST['password'] ?? '');
    if (strlen($p) < 8) $msg = 'Пароль от 8 символов';
    else { $q = $db->prepare('UPDATE users SET pass = ? WHERE email = ?'); $q->execute([password_hash($p, PASSWORD_DEFAULT), $email]); $db->prepare('DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE email = ?)')->execute([$email]); $msg = $q->rowCount() ? "Пароль для $email обновлён" : 'Нет такой почты'; }
  }
}
$users = $db->query('SELECT u.id, u.role, u.email, u.name, u.created, u.last_seen, c.name coach FROM users u LEFT JOIN users c ON c.id = u.coach_id ORDER BY u.role, u.id')->fetchAll();
$codes = $db->query('SELECT code, created, note, used_by, used_at FROM coach_codes ORDER BY created DESC LIMIT 30')->fetchAll();
$db->exec('CREATE TABLE IF NOT EXISTS wipes (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, at INTEGER NOT NULL, by TEXT NOT NULL, note TEXT)');
$db->exec('CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, created INTEGER NOT NULL, expires INTEGER NOT NULL, ua TEXT)');
$wipes = $db->query('SELECT COUNT(*) c FROM wipes')->fetchColumn();
?><!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ГРЯЗЬ · служебка</title>
<style>body{font:15px system-ui;background:#0a0a0c;color:#ececf1;max-width:720px;margin:30px auto;padding:0 16px}input{display:block;width:100%;box-sizing:border-box;margin:6px 0 12px;padding:10px;background:#1a1a22;border:1px solid #26262f;color:#ececf1;border-radius:8px}button{background:#ff7a1a;border:0;padding:12px 18px;border-radius:10px;font-weight:800;cursor:pointer}table{width:100%;border-collapse:collapse;margin:14px 0 28px}td,th{padding:7px;border-bottom:1px solid #26262f;text-align:left;font-size:13px}.m{padding:10px 12px;background:#1a1a22;border-radius:8px;margin-bottom:16px;color:#ffb020;font-weight:700}h2{font-size:18px;margin:26px 0 8px}small{color:#7c7c8a}.row{display:flex;gap:10px;align-items:flex-end}.row label{flex:1}</style>
<h1 style="font-size:22px">ГРЯЗЬ · служебка</h1>
<?php if ($msg): ?><div class="m"><?= htmlspecialchars($msg) ?></div><?php endif; ?>

<h2>Код для регистрации тренера</h2>
<form method="post" class="row"><input type="hidden" name="key" value="<?= htmlspecialchars($key) ?>"><input type="hidden" name="act" value="code">
<label>Заметка (кому)<input name="note" placeholder="Дима, World Class"></label><button>Создать код</button></form>
<table><tr><th>код</th><th>кому</th><th>создан</th><th>использован</th></tr>
<?php foreach ($codes as $c): ?><tr><td><b><?= $c['code'] ?></b></td><td><?= htmlspecialchars((string) $c['note']) ?></td><td><?= date('d.m H:i', (int) $c['created']) ?></td><td><?= $c['used_at'] ? 'да, user #' . $c['used_by'] : '—' ?></td></tr><?php endforeach; ?>
</table>

<h2>Пользователи <small>(<?= count($users) ?>, удалений в журнале: <?= (int) $wipes ?>)</small></h2>
<table><tr><th>id</th><th>роль</th><th>имя</th><th>почта</th><th>тренер</th><th>создан</th><th>был</th></tr>
<?php foreach ($users as $u): ?><tr><td><?= $u['id'] ?></td><td><?= $u['role'] ?></td><td><?= htmlspecialchars($u['name']) ?></td><td><?= htmlspecialchars($u['email']) ?></td><td><?= htmlspecialchars((string) $u['coach']) ?></td><td><?= date('d.m', (int) $u['created']) ?></td><td><?= $u['last_seen'] ? date('d.m H:i', (int) $u['last_seen']) : '—' ?></td></tr><?php endforeach; ?>
</table>

<h2>Сменить пароль пользователю</h2>
<form method="post"><input type="hidden" name="key" value="<?= htmlspecialchars($key) ?>"><input type="hidden" name="act" value="pass">
<label>Почта<input name="email" required></label><label>Новый пароль<input name="password" type="password" minlength="8" required></label><button>Сменить</button></form>
<p><small>Удаление аккаунтов - только самим пользователем из приложения (журнал wipes) или SQL-запросом вручную.</small></p>
