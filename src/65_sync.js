/* ═══════════ СИНК С СЕРВЕРОМ ═══════════ */
/* Клиент - единственный автор своих документов. Изменился ключ - пометили
   грязным, через пару секунд отправили. Документы тренера (программа, цели,
   заметка, расписание) приходят в ответе и применяются по номеру ревизии.
   Фото тела на сервер не уходят никогда. */
const SYNC_KEYS = ["sessions", "lastEx", "wHist", "weight", "sleep", "food", "cfg", "startDate", "curDay", "schema", "plan", "goals", "profile", "schedule", "dishes", "shop"];
const SYNC_PREFIX = /^guide_\d{4}-\d{2}-\d{2}$/;
let syncTimer = null, syncBusy = false, syncState = { at: null, err: null };

function linkedCoach(){ const s = session(); return s && s.coach ? s.coach : null; }
function coachRev(){ return store.get("coachRev", {}); }

/* Грязные ключи переживают закрытие приложения: лежат в localStorage */
function markDirty(k){
  const s = session();
  if(!s || s.user.role !== "client") return;
  if(!(SYNC_KEYS.indexOf(k) >= 0 || SYNC_PREFIX.test(k))) return;
  const d = store.get("syncDirty", {});
  d[k] = Date.now();
  try { localStorage.setItem("syncDirty", JSON.stringify(d)); } catch(e){}
  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncNow, 2500);
}
function allSyncKeys(){
  const keys = [];
  for(let i = 0; i < localStorage.length; i++){
    const k = localStorage.key(i);
    if(SYNC_KEYS.indexOf(k) >= 0 || SYNC_PREFIX.test(k)) keys.push(k);
  }
  return keys;
}
async function syncNow(full){
  const s = session();
  if(!s || s.user.role !== "client" || syncBusy || !navigator.onLine) return false;
  const dirty = store.get("syncDirty", {});
  const keys = full ? allSyncKeys() : Object.keys(dirty);
  syncBusy = true;
  try {
    const docs = {};
    keys.forEach(k => {
      const raw = localStorage.getItem(k);
      if(raw === null) return;
      try { docs[k] = { d: JSON.parse(raw), u: dirty[k] || Date.now() }; } catch(e){}
    });
    const res = await api("client/sync", { docs: docs, coachRev: coachRev(), app: APP_VERSION });
    const left = store.get("syncDirty", {});
    keys.forEach(k => { if(left[k] && left[k] <= (dirty[k] || Infinity)) delete left[k]; });
    try { localStorage.setItem("syncDirty", JSON.stringify(left)); } catch(e){}
    syncState = { at: Date.now(), err: null };
    /* Тренер мог отвязать или поменяться - держим сессию в курсе */
    const cs = session();
    if(cs && JSON.stringify(cs.coach || null) !== JSON.stringify(res.coachInfo || null)){ cs.coach = res.coachInfo || null; setSession(cs); }
    applyCoachDocs(res.coach || {});
    if(typeof renderProfile === "function" && !document.getElementById("viewProfile").classList.contains("hidden")) renderProfile();
    return true;
  } catch(e){
    syncState = { at: syncState.at, err: e.message };
    return false;
  } finally { syncBusy = false; }
}
/* Документы тренера: применяем только те, чья ревизия новее уже применённой */
function applyCoachDocs(cd){
  const rev = coachRev();
  let changed = false;
  Object.keys(cd).forEach(k => {
    const doc = cd[k];
    if(!doc || (rev[k] || 0) >= doc.rev) return;
    if(k === "plan" && planValid(doc.d)){
      const p = doc.d; if(!p.author) p.author = { name: (linkedCoach() || {}).name || "тренер" };
      store.set("plan", p); applyPlan(p);
      if(!PROGRAM[curDay]){ curDay = DAY_ORDER[0]; store.set("curDay", curDay); }
      toast("Тренер обновил программу");
    } else if(k === "goals" && doc.d && typeof doc.d === "object"){
      store.set("goals", doc.d); applyGoals();
      toast("Тренер обновил цели");
    } else if(k === "schedule" && doc.d && typeof doc.d === "object"){
      store.set("schedule", doc.d);
      toast("Тренер обновил расписание");
    } else if(k === "note"){
      localStorage.setItem("coachNote", JSON.stringify({ text: String(doc.d && doc.d.text || ""), at: doc.u }));
    }
    rev[k] = doc.rev; changed = true;
  });
  if(changed){
    store.set("coachRev", rev);
    renderGuide(); renderWeight();
    if(!document.getElementById("viewGym").classList.contains("hidden")){ renderTabs(); renderDay(); }
  }
}
/* Всё с сервера на это устройство: вход с нового телефона */
async function pullFromServer(silent){
  try {
    const res = await api("client/pull");
    const docs = res.docs || {};
    Object.keys(docs).forEach(k => { try { localStorage.setItem(k, JSON.stringify(docs[k].d)); } catch(e){} });
    localStorage.removeItem("syncDirty");
    store.set("coachRev", {});
    const s = session(); if(s){ s.coach = res.coachInfo || null; setSession(s); }
    applyCoachDocs(res.coach || {});
    if(!silent) toast("Данные с сервера на месте");
    return Object.keys(docs).length;
  } catch(e){ if(!silent) toast(e.message || "Не вышло"); return -1; }
}
async function exportServerData(){
  try {
    const res = await api("client/export");
    const blob = new Blob([JSON.stringify(res, null, 2)], { type:"application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "gryaz-server-" + todayISO() + ".json"; a.click();
    toast("Файл с сервера скачан");
  } catch(e){ toast(e.message || "Не вышло"); }
}
function renderCoachNote(){
  const nb = document.getElementById("coachNoteBox");
  if(!nb) return;
  const c = linkedCoach(), n = store.get("coachNote", null);
  nb.innerHTML = c && n && n.text
    ? '<div class="coach-card"><div class="cc-k">От тренера · ' + esc(c.name || "") + '</div><div class="cc-note">' + esc(n.text) + '</div></div>'
    : "";
}
