<?php
declare(strict_types=1);
/* Служебка: создать тренера, сменить пароль, посмотреть список.
   Доступ только с ключом из config.php:  admin.php?key=...  */
header('Content-Type: text/html; charset=utf-8');
$CFG = file_exists(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];
$key = $CFG['admin_key'] ?? '';
if ($key === '' || !hash_equals($key, (string) ($_GET['key'] ?? $_POST['key'] ?? ''))) { http_response_code(403); exit('Нет доступа'); }
$db = new PDO('sqlite:' . ($CFG['db'] ?? __DIR__ . '/data/gryaz.sqlite'), null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
$db->exec('CREATE TABLE IF NOT EXISTS coaches (id INTEGER PRIMARY KEY, login TEXT UNIQUE NOT NULL, pass TEXT NOT NULL, name TEXT NOT NULL, created INTEGER NOT NULL, terms_ver TEXT, terms_at INTEGER)');
$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $login = strtolower(trim((string) ($_POST['login'] ?? '')));
  $name  = trim((string) ($_POST['name'] ?? ''));
  $pass  = (string) ($_POST['password'] ?? '');
  if (!preg_match('/^[a-z0-9_.-]{3,30}$/', $login)) $msg = 'Логин: латиница, цифры, 3–30 символов';
  elseif (strlen($pass) < 8) $msg = 'Пароль от 8 символов';
  else {
    $h = password_hash($pass, PASSWORD_DEFAULT);
    $q = $db->prepare('SELECT id FROM coaches WHERE login = ?'); $q->execute([$login]);
    if ($q->fetch()) { $db->prepare('UPDATE coaches SET pass = ?' . ($name !== '' ? ', name = ?' : '') . ' WHERE login = ?')->execute($name !== '' ? [$h, $name, $login] : [$h, $login]); $msg = "Пароль тренера $login обновлён"; }
    else { if ($name === '') $msg = 'Нужно имя'; else { $db->prepare('INSERT INTO coaches (login, pass, name, created) VALUES (?,?,?,?)')->execute([$login, $h, $name, time()]); $msg = "Тренер $login создан"; } }
  }
}
$rows = $db->query('SELECT id, login, name, created FROM coaches ORDER BY id')->fetchAll();
?><!doctype html><meta charset="utf-8"><title>ГРЯЗЬ · служебка</title>
<style>body{font:15px system-ui;background:#0a0a0c;color:#ececf1;max-width:520px;margin:40px auto;padding:0 16px}input{display:block;width:100%;box-sizing:border-box;margin:6px 0 12px;padding:10px;background:#1a1a22;border:1px solid #26262f;color:#ececf1;border-radius:8px}button{background:#ff7a1a;border:0;padding:12px 18px;border-radius:10px;font-weight:800}table{width:100%;border-collapse:collapse;margin-top:24px}td,th{padding:8px;border-bottom:1px solid #26262f;text-align:left;font-size:13px}.m{padding:10px 12px;background:#1a1a22;border-radius:8px;margin-bottom:16px;color:#ffb020}</style>
<h2>Тренеры</h2>
<?php if ($msg): ?><div class="m"><?= htmlspecialchars($msg) ?></div><?php endif; ?>
<form method="post"><input type="hidden" name="key" value="<?= htmlspecialchars($key) ?>">
<label>Логин<input name="login" required placeholder="dima"></label>
<label>Имя (как увидят клиенты)<input name="name" placeholder="Дмитрий"></label>
<label>Пароль (новый тренер или смена)<input name="password" type="password" required minlength="8"></label>
<button>Создать / сменить пароль</button></form>
<table><tr><th>id</th><th>логин</th><th>имя</th><th>создан</th></tr>
<?php foreach ($rows as $r): ?><tr><td><?= $r['id'] ?></td><td><?= htmlspecialchars($r['login']) ?></td><td><?= htmlspecialchars($r['name']) ?></td><td><?= date('d.m.Y', (int) $r['created']) ?></td></tr><?php endforeach; ?>
</table>
