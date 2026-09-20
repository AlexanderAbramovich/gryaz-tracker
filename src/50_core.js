/* ═══════════ STORE ═══════════ */
const APP_VERSION = "12.0";
const store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v===null? d : JSON.parse(v); } catch(e){ return d; } },
  /* Переполнение раньше глоталось пустым catch: запись молча пропадала.
     Теперь возвращаем false и кричим тостом. */
  set(k, v){
    try { localStorage.setItem(k, JSON.stringify(v)); if(typeof markDirty === "function") markDirty(k); return true; }
    catch(e){ try { toast("Память переполнена - не сохранилось"); } catch(_){} return false; }
  }
};


/* ═══════════ ДЕНЬ И ДАТА ═══════════ */
/* День трекера начинается не в полночь, а в cfg.dayStart часов: всё, что записано
   ночью до этого часа, относится к вечеру предыдущего дня. Так ночная еда, отбой
   в 01:20 и чек-лист живут в том дне, который человек прожил. Раньше эту роль
   случайно играла UTC-дата (Иркутск +8), теперь граница явная и своя. */
const CFG_DEFAULT = { dayStart: 4, personal: false };
function cfg(){ return Object.assign({}, CFG_DEFAULT, store.get("cfg", {})); }
function pad(n){ return String(n).padStart(2,"0"); }
function isoOf(d){ return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
function dayOf(date){
  const d = new Date(date.getTime());
  d.setHours(d.getHours() - cfg().dayStart);
  return isoOf(d);
}
function todayISO(){ return dayOf(new Date()); }
function isoShift(iso, days){ const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + days); return isoOf(d); }
function isoDate(iso){ return new Date(iso + "T12:00:00"); }


/* ═══════════ МИГРАЦИЯ СХЕМЫ ═══════════ */
/* Чистая функция: на входе и выходе карта localStorage {ключ: json-строка}.
   Хранилища не касается, поэтому её можно прогнать на компьютере на файле бэкапа
   и сверить глазами до того, как она тронет живые данные. */
const SCHEMA = 2;
function migrateRaw(raw){
  const out = Object.assign({}, raw);
  const get = k => { try { return out[k] == null ? undefined : JSON.parse(out[k]); } catch(e){ return undefined; } };
  const set = (k, v) => { out[k] = JSON.stringify(v); };
  const log = [];
  let ver = get("schema") || 0;
  if(ver < 1){
    /* Данные до 9.1 писались по UTC-дате, то есть с границей дня в 08:00 по Иркутску.
       Ничего не переносим: закрепляем эту же границу настройкой, чтобы старые дни
       остались теми же днями. На чистой установке граница 04:00. */
    const hasData = ["sessions", "food", "sleep", "wHist"].some(k => out[k] != null);
    if(hasData){ set("cfg", Object.assign(get("cfg") || {}, { dayStart: 8 })); log.push("граница дня закреплена на 08:00, как было по UTC"); }
    ver = 1;
  }
  if(ver < 2){
    /* Рабочие веса last_<день> сливаются в один lastEx по id упражнения.
       Личные модули (уход, волосы, рецепты) остаются включёнными у тех, у кого они были. */
    const merged = get("lastEx") || {};
    Object.keys(out).filter(k => /^last_/.test(k)).forEach(k => {
      const v = get(k) || {};
      Object.keys(v).forEach(id => { if(!merged[id]) merged[id] = v[id]; });
      delete out[k];
      log.push(k + " → lastEx");
    });
    if(Object.keys(merged).length) set("lastEx", merged);
    const hasData = ["sessions", "food", "sleep", "wHist"].some(k => out[k] != null);
    if(hasData){ set("cfg", Object.assign(get("cfg") || {}, { personal: true })); log.push("личные модули включены"); }
    ver = 2;
  }
  set("schema", ver);
  return { raw: out, log: log };
}
function migrateLocal(){
  if((store.get("schema", 0) || 0) >= SCHEMA) return;
  const raw = {};
  for(let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); raw[k] = localStorage.getItem(k); }
  const res = migrateRaw(raw);
  Object.keys(res.raw).forEach(k => { if(res.raw[k] !== raw[k]) localStorage.setItem(k, res.raw[k]); });
  Object.keys(raw).forEach(k => { if(!(k in res.raw)) localStorage.removeItem(k); });
}

function esc(v){ return String(v == null ? "" : v).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c])); }
let toastT;
function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(()=>t.classList.remove("show"), 1900);
}

function ago(ts){
  if(!ts) return "ещё не было";
  const m = Math.round((Date.now() - ts) / 60000);
  if(m < 1) return "только что";
  if(m < 60) return m + " мин назад";
  const h = Math.round(m / 60);
  if(h < 48) return h + " ч назад";
  return Math.round(h / 24) + " дн назад";
}
async function sha256Hex(txt){
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  } catch(e){ return "nohash"; }
}
function copyText(txt, okMsg){
  const done = () => toast(okMsg);
  const fail = () => { prompt("Скопируй вручную:", txt); };
  try {
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, fail);
    else fail();
  } catch(e){ fail(); }
}


/* ═══════════ API И СЕССИЯ ═══════════ */
/* Сессия = {token, user:{id, role, name, email, coachId}, coach:{id,name}|null}.
   Живёт в localStorage под ключом session, не синкается. */
function session(){ return store.get("session", null); }
function setSession(s){ if(s) localStorage.setItem("session", JSON.stringify(s)); else localStorage.removeItem("session"); }
function me(){ const s = session(); return s ? s.user : null; }
function apiBase(){ return location.origin + location.pathname.replace(/[^\/]*$/, "") + "api/index.php"; }
async function api(route, body, opts){
  const s = session();
  const headers = { "Content-Type": "application/json" };
  const token = (opts && "token" in opts) ? opts.token : (s && s.token);
  if(token) headers["Authorization"] = "Bearer " + token;
  const url = apiBase() + "?r=" + route + (body ? "" : (route.indexOf("&") < 0 ? "&app=" + APP_VERSION : ""));
  const res = await fetch(url, { method: body ? "POST" : "GET", headers: headers, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  let j = null;
  try { j = await res.json(); } catch(e){}
  if(!res.ok){
    const err = new Error((j && j.error) || ("Сервер ответил " + res.status));
    err.status = res.status;
    if(res.status === 401 && s && !(opts && opts.noKick)) kickOut("Сессия истекла, войди заново");
    throw err;
  }
  return j;
}

/* Данные на устройстве принадлежат одному аккаунту. Вошёл другой человек - чистим,
   иначе он увидит чужие тренировки и фото. Ключ dataOwner = id пользователя. */
const LOCAL_KEYS_RE = /^(sessions|lastEx|wHist|weight|sleep|food|cfg|startDate|curDay|schema|plan|goals|profile|schedule|dishes|shop|shopOpen|myName|coachRev|coachNote|syncDirty|guide_\d{4}-\d{2}-\d{2})$/;
function wipeLocalData(){
  const keys = [];
  for(let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if(LOCAL_KEYS_RE.test(k)) keys.push(k); }
  keys.forEach(k => localStorage.removeItem(k));
  try { indexedDB.deleteDatabase("gryaz-photos"); } catch(e){}
}
function claimLocalData(userId){
  const owner = store.get("dataOwner", null);
  if(owner !== null && owner !== userId) wipeLocalData();
  localStorage.setItem("dataOwner", JSON.stringify(userId));
}
function kickOut(msg){
  setSession(null);
  if(msg) toast(msg);
  route();
}

/* ═══════════ ТЕМА ═══════════ */
/* system | dark | light. Хранится на устройстве, не в аккаунте: тема - свойство экрана. */
function themePref(){ return localStorage.getItem("theme") || "system"; }
function applyTheme(){
  const pref = themePref();
  const light = pref === "light" || (pref === "system" && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches);
  document.documentElement.dataset.theme = light ? "light" : "dark";
  const m = document.querySelector('meta[name="theme-color"]');
  if(m) m.setAttribute("content", light ? "#f3f2ee" : "#0a0a0c");
}
function setTheme(pref){ localStorage.setItem("theme", pref); applyTheme(); }
applyTheme();
try { window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", applyTheme); } catch(e){}

/* ═══════════ ЭКРАНЫ ═══════════ */
const SCREENS = ["sAuth", "sOnboard", "sClient", "sCoach"];
function showScreen(id){
  SCREENS.forEach(s => document.getElementById(s).classList.toggle("hidden", s !== id));
  window.scrollTo(0, 0);
}
/* Роутер: одна точка входа. Решает по сессии и роли, что показать. */
function route(){
  const s = session();
  if(!s){ showAuth(); return; }
  if(s.user.role === "coach"){ cBoot(); return; }
  claimLocalData(s.user.id);
  migrateLocal();   /* до анкеты: на чистой установке ставит текущую схему, не трогая настроек */
  const prof = store.get("profile", null);
  if(!prof || !prof.done){ showOnboard(); return; }
  clientBoot();
  showClient();
}
