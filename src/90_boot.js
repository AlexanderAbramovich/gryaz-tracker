/* ═══════════ ЗАПУСК ═══════════ */
/* Ссылка-приглашение #join=КОД: запоминаем и подставляем - в анкете или в профиле */
(function(){
  const m = location.hash.match(/#join=([A-Za-z0-9]{6})/);
  if(m){ localStorage.setItem("pendingJoin", m[1].toUpperCase()); history.replaceState(null, "", location.pathname); }
})();
function takePendingJoin(){ const c = localStorage.getItem("pendingJoin"); if(c) localStorage.removeItem("pendingJoin"); return c || ""; }

/* Старый адрес на GitHub Pages: только скачать бэкап и уйти на новый */
const NEW_HOME = "https://cb869498.tw1.ru/";
if(/github\.io$/.test(location.hostname)){
  document.getElementById("sAuth").innerHTML = '<div class="screen"><div class="logo">ГРЯЗЬ<span>.</span></div><div class="logo-sub">Переезд</div>' +
    '<p class="j-p">Приложение переехало на новый адрес. Здесь остались только твои старые записи. Скачай бэкап, затем открой новый адрес, создай аккаунт и в Профиле нажми «Восстановить».</p>' +
    '<button class="a-btn" onclick="exportData()">Скачать бэкап</button><a class="a-btn ghost" style="text-align:center;text-decoration:none" href="' + NEW_HOME + '">Открыть новый адрес</a></div>';
  showScreen("sAuth");
} else route();

/* Сессию проверяем в фоне: сервер мог её закрыть (смена пароля, удаление) */
(async () => {
  const s = session();
  if(!s || !navigator.onLine) return;
  try {
    const r = await api("auth/me", null, { noKick: true });
    const changed = JSON.stringify(r.user) !== JSON.stringify(s.user) || JSON.stringify(r.coach || null) !== JSON.stringify(s.coach || null);
    if(changed){ s.user = r.user; s.coach = r.coach || null; setSession(s); if(r.user.role === "client" && !document.getElementById("sClient").classList.contains("hidden")){ showClientHeader(); renderGuide(); } }
    if(r.user.role === "client") setTimeout(() => syncNow(), 800);
  } catch(e){ if(e.status === 401) kickOut("Сессия закрыта, войди заново"); }
})();
window.addEventListener("online", () => syncNow());

/* ═══════════ ОБНОВЛЕНИЕ ═══════════ */
/* SW ставит новую версию сразу (skipWaiting). Перезагружаемся сами, но не посреди
   тренировки или рецепта: если открыт гид - ждём, пока его закроют. */
let swReloading = false, swPending = false;
function swMaybeReload(){
  if(!swPending || swReloading) return;
  if(typeof flowEl !== "undefined" && flowEl){ toast("Есть обновление - применю после гида"); return; }
  swReloading = true;
  location.reload();
}
if("serviceWorker" in navigator){
  const hadSW = !!navigator.serviceWorker.controller;   /* false = первая установка, не обновление */
  navigator.serviceWorker.register("sw.js").then(reg => {
    document.addEventListener("visibilitychange", () => {
      if(document.visibilityState === "visible"){ reg.update().catch(()=>{}); swMaybeReload(); syncNow(); }
    });
  }).catch(()=>{});
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if(!hadSW) return;
    swPending = true;
    swMaybeReload();
  });
}
