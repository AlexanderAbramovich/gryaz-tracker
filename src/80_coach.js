/* ═══════════ КАБИНЕТ ТРЕНЕРА ═══════════ */
/* Все функции с префиксом c, чтобы не пересекаться с клиентской частью:
   у тренера свои dayFood/dayScore (читают документы клиента, а не хранилище). */
const ICONS = ["press","pullup","lateral","flye","biceps","triceps","dips","core","legs","calf","hamstring","rdl","shoulderpress","facepull","warmup","fire","timer","sparkle"];
let cClients = [], cInvites = [], cur = null, cTab = "sum", ed = null, edOpen = {};

function cShow(id){
  ["cvList", "cvClient", "cvProfile"].forEach(v => document.getElementById(v).classList.toggle("hidden", v !== id));
  document.getElementById("cBack").classList.toggle("hidden", id !== "cvClient");
  document.getElementById("cnavList").classList.toggle("active", id !== "cvProfile");
  document.getElementById("cnavProfile").classList.toggle("active", id === "cvProfile");
  window.scrollTo(0, 0);
}
async function cBoot(){
  showScreen("sCoach");
  document.getElementById("cWho").textContent = me().name;
  await cShowList();
}
function cFmt(iso){ if(!iso) return "—"; const d = isoDate(iso); return pad(d.getDate()) + "." + pad(d.getMonth() + 1); }
function cFmtTs(t){ if(!t) return "—"; const d = new Date(t * 1000); return pad(d.getDate()) + "." + pad(d.getMonth() + 1) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()); }
function cAgo(ts){ return ts ? ago(ts * 1000) : "никогда"; }
function cToday(){ return isoOf(new Date()); }
function cDaysAgo(iso){ if(!iso) return null; return Math.round((isoDate(cToday()) - isoDate(iso)) / 864e5); }
function copy(txt, msg){ copyText(txt, msg || "Скопировано"); }

/* ── СПИСОК ── */
async function cShowList(){
  ed = null; edOpen = {};
  try {
    const r = await api("coach/me");
    cClients = r.clients; cInvites = r.invites || [];
  } catch(e){ if(e.status !== 401) toast(e.message); return; }
  const box = document.getElementById("cvList");
  box.innerHTML = '<h2>Клиенты</h2><div class="c-sub">' + (cClients.length ? cClients.length + " " + plural(cClients.length, "клиент", "клиента", "клиентов") : "Пока никого. Пригласи первого кодом ниже.") + '</div>' +
    cClients.map(c => {
      const d = cDaysAgo(c.lastWorkout), flag = d != null && d >= 5;
      return '<div class="cl' + (flag ? " flag" : "") + '" onclick="cOpenClient(' + c.id + ')"><div class="grow"><div class="nm">' + esc(c.name) + '</div><div class="mt">' +
        (c.lastWorkout ? 'тренировка ' + (flag ? '<i>' + d + ' дн назад</i>' : '<b>' + (d === 0 ? "сегодня" : d === 1 ? "вчера" : d + " дн назад") + '</b>') : '<i>ещё не тренировался</i>') +
        ' · всего ' + c.workouts + (c.goal ? ' · ' + (GOAL_NAMES[c.goal] || "").toLowerCase() : '') + ' · был ' + cAgo(c.lastSync) + '</div></div>' +
        '<div class="w">' + (c.weight != null ? '<b>' + c.weight.toFixed(1).replace(".", ",") + '</b><small>кг</small>' : '<small>нет веса</small>') + '</div></div>';
    }).join("") +
    '<div class="sec-h">Пригласить</div><div class="card"><div class="kv">Код действует 7 дней. Клиент вводит его при регистрации (шаг «Программа → Есть тренер») или потом в Профиле. Или отправь ссылку - код подставится сам.</div>' +
    '<div id="cInviteBox">' + cInvites.map(i => cInviteHtml(i.code, i.expires)).join("") + '</div>' +
    '<button class="cbtn ghost" style="margin-top:10px" onclick="cInvite()">Новый код</button></div>';
  cShow("cvList");
}
function cJoinLink(code){ return location.origin + location.pathname + "#join=" + code; }
function cInviteHtml(code, exp){
  return '<div class="code">' + code.slice(0, 3) + "-" + code.slice(3) + '</div><div class="code-sub">действует до ' + cFmtTs(exp) + '</div>' +
    '<div class="row"><button class="cbtn ghost sm grow" onclick="copy(\'' + code + '\',\'Код скопирован\')">Скопировать код</button>' +
    '<button class="cbtn sm grow" onclick="copy(\'' + cJoinLink(code) + '\',\'Ссылка скопирована\')">Скопировать ссылку</button></div>';
}
async function cInvite(){
  try { const r = await api("coach/invite", {}); cInvites.unshift({ code: r.code, expires: r.expires }); document.getElementById("cInviteBox").innerHTML = cInvites.map(i => cInviteHtml(i.code, i.expires)).join(""); toast("Код создан"); }
  catch(e){ toast(e.message); }
}

/* ── КЛИЕНТ ── */
async function cOpenClient(id){
  try { cur = await api("coach/client&id=" + id); cur.id = id; cTab = "sum"; ed = null; edOpen = {}; cRenderClient(); cShow("cvClient"); }
  catch(e){ toast(e.message); }
}
function doc(k, d){ const x = cur && cur.docs && cur.docs[k]; return x ? x.d : d; }
function coachDoc(k, d){ const x = cur && cur.coach && cur.coach[k]; return x ? x.d : d; }
const CTABS = [["sum", "Сводка"], ["tr", "Тренировки"], ["w", "Вес"], ["food", "Еда"], ["plan", "Программа"], ["goals", "Цели"], ["more", "Ещё"]];
function cRenderClient(){
  const c = cur.client;
  document.getElementById("cvClient").innerHTML =
    '<h2>' + esc(c.name) + '</h2><div class="c-sub">с ' + cFmtTs(c.created).slice(0, 5) + ' · был ' + cAgo(c.last_seen) + (c.app_ver ? ' · v' + esc(c.app_ver) : '') + ' · согласий ' + ((cur.consents || []).length) + '</div>' +
    '<div class="ctabs">' + CTABS.map(t => '<div class="ctab' + (cTab === t[0] ? " active" : "") + '" onclick="cSetTab(\'' + t[0] + '\')">' + t[1] + '</div>').join("") + '</div>' +
    '<div id="cBody">' + ({ sum: cRenderSum, tr: cRenderTr, w: cRenderW, food: cRenderFood, plan: cRenderPlan, goals: cRenderGoals, more: cRenderMore }[cTab])() + '</div>';
}
function cSetTab(t){ cTab = t; cRenderClient(); window.scrollTo(0, 0); }

/* ── расчёты по документам клиента ── */
function cGoals(){ return Object.assign({}, GOALS_DEFAULT, doc("goals", {}), coachDoc("goals", {})); }
function cNorm(e){ return { n: e.n, k: (e.base ? e.base.k : e.k) || 0, p: (e.base ? e.base.p : e.p) || 0, frac: e.frac != null ? e.frac : 1 }; }
function cDayFood(iso){
  const list = (doc("food", {})[iso] || []).map(cNorm);
  return { k: Math.round(list.reduce((a, e) => a + e.k * e.frac, 0)), p: Math.round(list.reduce((a, e) => a + e.p * e.frac, 0)), n: list.length, list: list };
}
function cSleepMins(iso){
  const all = doc("sleep", {}), a = all[iso] || {}, b = all[isoShift(iso, -1)] || {};
  if(!a.up || !b.bed) return null;
  const [bh, bm] = b.bed.split(":").map(Number), [uh, um] = a.up.split(":").map(Number);
  let m = (uh * 60 + um) - (bh * 60 + bm); if(m < 0) m += 1440; return m;
}
function cSessionsOn(iso){ return doc("sessions", []).filter(s => s.date === iso); }
function cDayScore(iso){
  const g = cGoals(), st = doc("guide_" + iso, {}), f = cDayFood(iso), sl = doc("sleep", {})[iso] || {};
  const personal = !!((doc("cfg", {}) || {}).personal);
  const items = [["wake", !!(sl.up || st.wake)], ["crea", !!st.crea], ["food", f.k >= g.kcalLo], ["prot", f.p >= g.prot], ["tr", !!(cSessionsOn(iso).length || st.tr)], ["bed", !!(sl.bed || st.bed)]];
  if(personal) items.push(["am", !!st.am], ["pm", !!st.pm]);
  return { done: items.filter(x => x[1]).length, total: items.length };
}
function cWeekDelta(){
  const hist = doc("wHist", []);
  if(hist.length < 2) return null;
  const DAY = 864e5, t = d => isoDate(d).getTime();
  const end = t(hist[hist.length - 1].d);
  const win = (a, b) => hist.filter(p => t(p.d) > end - b * DAY && t(p.d) <= end - a * DAY);
  const avg = arr => arr.reduce((s, p) => s + p.w, 0) / arr.length;
  const w1 = win(0, 7), w2 = win(7, 14);
  if(w1.length && w2.length) return { kg: avg(w1) - avg(w2), mode: "avg" };
  const days = (end - t(hist[0].d)) / DAY;
  if(days < 3) return null;
  return { kg: (hist[hist.length - 1].w - hist[0].w) / days * 7, mode: "trend", days: Math.round(days) };
}
function cPlan(){ return doc("plan", null) || coachDoc("plan", null); }
function cExById(){
  const m = {}, p = cPlan();
  if(p && p.days) p.days.forEach(d => (d.ex || []).forEach(e => { m[e.id] = Object.assign({ sets: 4, lo: 10, hi: 12, step: 2.5 }, e); }));
  return m;
}
function cVerdicts(){
  const last = doc("lastEx", {}), ex = cExById(), out = [];
  Object.keys(last).forEach(id => {
    const e = ex[id], prev = last[id];
    if(!e || !prev || !prev.reps) return;
    const all = prev.reps.slice(0, e.sets).filter(r => r > 0);
    if(!all.length) return;
    const check = all.length > 1 ? all.slice(0, -1) : all;
    if(check.every(r => r >= e.hi)) out.push({ t: e.name + ": все подходы на потолке " + e.hi + " → пора " + ((prev.w || 0) + e.step) + " кг", ok: true });
    else if((prev.stuck || 0) >= 3) out.push({ t: e.name + ": " + prev.w + " кг стоит уже " + (prev.stuck + 1) + " тренировки → снять 10%", warn: true });
    else if(all.some(r => r < e.lo)) out.push({ t: e.name + ": повторы ниже нижней границы " + e.lo + " (" + all.join("·") + ") - вес великоват", warn: true });
  });
  return out;
}

/* ── СВОДКА ── */
function cRenderSum(){
  const g = cGoals(), t = cToday(), ses = doc("sessions", []);
  const last = ses.length ? ses.reduce((a, s) => s.date > a ? s.date : a, "") : null;
  const dl = cDaysAgo(last);
  const week = ses.filter(s => s.date >= isoShift(t, -6) && s.date <= t).length;
  const w = doc("weight", null), wd = cWeekDelta();
  let discDone = 0, discTot = 0, kcalDays = 0, kcalSum = 0, protSum = 0, slSum = 0, slN = 0, dots = "";
  for(let i = 13; i >= 0; i--){
    const iso = isoShift(t, -i), sc = cDayScore(iso);
    discDone += sc.done; discTot += sc.total;
    const f = cDayFood(iso); if(f.n){ kcalDays++; kcalSum += f.k; protSum += f.p; }
    const sm = cSleepMins(iso); if(sm != null){ slSum += sm; slN++; }
    const ratio = sc.done / sc.total;
    dots += '<i class="' + (cSessionsOn(iso).length ? "on" : (ratio >= .6 ? "half" : "")) + '" title="' + cFmt(iso) + '">' + isoDate(iso).getDate() + '</i>';
  }
  const disc = discTot ? Math.round(discDone / discTot * 100) : 0;
  const kcalAvg = kcalDays ? Math.round(kcalSum / kcalDays) : null, protAvg = kcalDays ? Math.round(protSum / kcalDays) : null;
  const v = cVerdicts(), note = coachDoc("note", null), sch = coachDoc("schedule", null) || doc("schedule", null) || { days: [] };
  return '<div class="stat-grid">' +
    '<div class="stat"><div class="stat-n' + (dl == null ? "" : dl >= 5 ? " bad" : dl >= 3 ? " warn" : "") + '">' + (dl == null ? "—" : dl) + '</div><div class="stat-l">дней с последней тренировки</div></div>' +
    '<div class="stat"><div class="stat-n">' + week + '</div><div class="stat-l">тренировок за 7 дней</div></div>' +
    '<div class="stat"><div class="stat-n' + (disc < 50 ? " bad" : disc < 75 ? " warn" : "") + '">' + disc + '%</div><div class="stat-l">дисциплина за 14 дней</div></div>' +
    '<div class="stat"><div class="stat-n">' + (w != null ? Number(w).toFixed(1).replace(".", ",") : "—") + '</div><div class="stat-l">вес, кг · цель ' + g.weightGoal + '</div></div>' +
    '<div class="stat"><div class="stat-n' + (wd ? (wd.kg < g.gainLo ? " warn" : wd.kg > g.gainHi ? " bad" : "") : "") + '">' + (wd ? (wd.kg >= 0 ? "+" : "") + wd.kg.toFixed(2).replace(".", ",") : "—") + '</div><div class="stat-l">кг в неделю · цель ' + g.gainLo + "…" + g.gainHi + '</div></div>' +
    '<div class="stat"><div class="stat-n' + (kcalAvg == null ? "" : kcalAvg < g.kcalLo * .93 ? " bad" : kcalAvg > g.kcalHi * 1.07 ? " warn" : "") + '">' + (kcalAvg == null ? "—" : kcalAvg) + '</div><div class="stat-l">ккал в среднем · ' + g.kcalLo + "–" + g.kcalHi + '</div></div></div>' +
    '<div class="card"><div class="sec-h" style="margin:0 0 8px">Последние 14 дней <span>оранжевый = тренировка</span></div><div class="dots">' + dots + '</div>' +
    '<div class="kv" style="margin-top:8px">Белок в среднем <b>' + (protAvg == null ? "—" : protAvg + " г") + '</b> · сон <b>' + (slN ? sleepTxt(Math.round(slSum / slN)) : "нет данных") + '</b> · дни тренировок: <b>' + ((sch.days || []).map(d => DOW[d - 1]).join(" ") || "не заданы") + '</b></div></div>' +
    '<div class="sec-h">Что делать с весами</div>' +
    (v.length ? v.map(x => '<div class="verd' + (x.warn ? " warn" : "") + '">' + esc(x.t) + '</div>').join("") : '<div class="verd dim">Пока нечего советовать: по всем упражнениям идёт набор повторов в рамках.</div>') +
    '<div class="sec-h">Заметка клиенту</div><div class="card"><textarea class="in" id="cNoteIn" placeholder="Появится у него на главном экране">' + esc(note && note.text || "") + '</textarea>' +
    '<div class="row" style="margin-top:8px"><button class="cbtn sm grow" onclick="cSaveNote()">Отправить</button><button class="cbtn ghost sm" onclick="document.getElementById(\'cNoteIn\').value=\'\';cSaveNote()">Убрать</button></div></div>';
}
async function cSaveNote(){
  const text = document.getElementById("cNoteIn").value.trim();
  try { await api("coach/client/set", { id: cur.id, key: "note", data: { text: text } }); cur.coach.note = { d: { text: text } }; toast(text ? "Заметка отправлена" : "Заметка убрана"); } catch(e){ toast(e.message); }
}

/* ── ТРЕНИРОВКИ ── */
function cRenderTr(){
  const ses = doc("sessions", []).slice().reverse(), ex = cExById();
  if(!ses.length) return '<div class="verd dim">Тренировок ещё нет.</div>';
  const names = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  return '<div class="c-sub">Всего ' + ses.length + '. Красным - ниже нижней границы, оранжевым - все на потолке.</div>' + ses.slice(0, 60).map(s => {
    const d = isoDate(s.date);
    const rows = Object.keys(s.ex).map(id => {
      const e = s.ex[id], p = ex[id], reps = (e.reps || []).filter(r => r > 0);
      let cls = "";
      if(p && reps.length){ if(reps.every(r => r >= p.hi)) cls = " ok"; else if(reps.some(r => r < p.lo)) cls = " bad"; }
      return '<div class="hrow"><span class="n">' + esc(e.n || (p && p.name) || id) + '</span><span class="v' + cls + '">' + (e.w != null && e.w !== "" ? e.w + " кг · " : "") + reps.join(" · ") + '</span></div>';
    }).join("");
    return '<div class="card"><div class="hdate">' + cFmt(s.date) + ' · ' + names[d.getDay()] + '</div><div class="hday">' + esc(s.title || ("день " + s.day)) + (s.week ? " · неделя " + s.week : "") + '</div>' + rows + '</div>';
  }).join("") + (ses.length > 60 ? '<div class="verd dim">Показаны последние 60.</div>' : '');
}

/* ── ВЕС ── */
function cRenderW(){
  const hist = doc("wHist", []), g = cGoals();
  if(!hist.length) return '<div class="verd dim">Взвешиваний ещё нет.</div>';
  const wd = cWeekDelta();
  return '<div class="card"><div class="wchart">' + weightChartSvg(hist, g.weightGoal, g.weightLabel) + '</div>' +
    '<div class="kv" style="margin-top:8px">Записей <b>' + hist.length + '</b> · со старта <b>' + ((hist[hist.length - 1].w - hist[0].w) >= 0 ? "+" : "") + (hist[hist.length - 1].w - hist[0].w).toFixed(1).replace(".", ",") + ' кг</b>' +
    (wd ? ' · темп <b>' + (wd.kg >= 0 ? "+" : "") + wd.kg.toFixed(2).replace(".", ",") + ' кг/нед</b>' : "") + '</div></div>' +
    '<div class="card">' + hist.slice().reverse().slice(0, 40).map(p => '<div class="hrow"><span class="n">' + cFmt(p.d) + (p.am === false ? ' · <span style="color:var(--warn-ink)">не утром</span>' : "") + '</span><span class="v">' + p.w.toFixed(1).replace(".", ",") + '</span></div>').join("") + '</div>';
}

/* ── ЕДА ── */
function cRenderFood(){
  const g = cGoals(), t = cToday();
  let rows = "", any = false;
  for(let i = 0; i < 21; i++){
    const iso = isoShift(t, -i), f = cDayFood(iso);
    if(!f.n) continue;
    any = true;
    const kc = f.k >= g.kcalLo * .93 ? (f.k > g.kcalHi * 1.07 ? " bad" : " ok") : " bad";
    rows += '<div class="card" onclick="this.querySelector(\'.fx\').classList.toggle(\'hidden\')" style="cursor:pointer"><div class="hrow" style="border:0"><span class="n"><b style="color:var(--ink)">' + cFmt(iso) + '</b> · ' + f.n + ' ' + plural(f.n, "запись", "записи", "записей") + '</span>' +
      '<span class="v' + kc + '">' + f.k + ' ккал</span><span class="v' + (f.p >= g.prot ? " ok" : " bad") + '">Б ' + f.p + '</span></div>' +
      '<div class="fx hidden">' + f.list.map(e => '<div class="hrow"><span class="n">' + esc(e.n) + (e.frac < 1 ? ' · ' + Math.round(e.frac * 100) + '%' : '') + '</span><span class="v">' + Math.round(e.k * e.frac) + '</span></div>').join("") + '</div></div>';
  }
  return '<div class="c-sub">Коридор ' + g.kcalLo + '–' + g.kcalHi + ' ккал, белок от ' + g.prot + ' г. Тап по дню раскрывает список.</div>' + (any ? rows : '<div class="verd dim">Записей еды за 3 недели нет.</div>');
}

/* ── ЦЕЛИ И РАСПИСАНИЕ ── */
function cRenderGoals(){
  const g = cGoals(), prof = doc("profile", {}) || {}, sch = coachDoc("schedule", null) || doc("schedule", null) || { days: [] };
  const f = (k, l, step) => '<label class="l">' + l + '</label><input class="in" type="number" step="' + (step || 1) + '" id="g_' + k + '" value="' + g[k] + '">';
  return '<div class="card"><div class="kv">Клиент указал: вес ' + (prof.weight || "—") + ' кг, задача ' + (GOAL_NAMES[prof.goal] || "—").toLowerCase() + ', темп ' + (PACE_NAMES[prof.pace] || "—").toLowerCase() + '. Ниже - то, что видит он. Кнопка «по формуле» пересчитает от его веса.</div>' +
    '<div class="row" style="margin-top:8px"><button class="cbtn ghost sm" onclick="cGoalsFormula(\'gain\')">Набор</button><button class="cbtn ghost sm" onclick="cGoalsFormula(\'keep\')">Держать</button><button class="cbtn ghost sm" onclick="cGoalsFormula(\'cut\')">Сушка</button></div></div>' +
    '<div class="card">' + f("kcalLo", "Калории, нижняя граница") + f("kcalHi", "Калории, верхняя граница") + f("prot", "Белок, г в день") +
    f("gainLo", "Темп веса в неделю, от (кг)", 0.05) + f("gainHi", "Темп веса в неделю, до (кг; минус = сушка)", 0.05) +
    f("weightGoal", "Целевой вес, кг", 0.5) + f("weightLo", "Нижняя точка шкалы, кг", 0.5) +
    '<label class="l">Подпись цели</label><input class="in" id="g_weightLabel" value="' + esc(g.weightLabel || "") + '">' +
    '<button class="cbtn" style="margin-top:14px" onclick="cSaveGoals()">Отправить цели клиенту</button></div>' +
    '<div class="card"><label class="l">Дни тренировок</label><div class="chips" style="margin:6px 0 0">' + DOW.map((d, i) => '<button class="chip-b day' + ((sch.days || []).indexOf(i + 1) >= 0 ? " on" : "") + '" onclick="cSchedDay(' + (i + 1) + ')">' + d + '</button>').join("") + '</div>' +
    '<button class="cbtn ghost" style="margin-top:12px" onclick="cSaveSched()">Отправить расписание</button></div>';
}
let cSched = null;
function cSchedDay(d){
  if(!cSched) cSched = ((coachDoc("schedule", null) || doc("schedule", null) || { days: [] }).days || []).slice();
  const i = cSched.indexOf(d); if(i >= 0) cSched.splice(i, 1); else cSched.push(d); cSched.sort();
  cur.coach.schedule = { d: { days: cSched }, rev: (cur.coach.schedule && cur.coach.schedule.rev) || 0 };
  cRenderClient();
}
async function cSaveSched(){
  const days = ((coachDoc("schedule", null) || doc("schedule", null) || { days: [] }).days || []);
  try { const r = await api("coach/client/set", { id: cur.id, key: "schedule", data: { days: days } }); cur.coach.schedule = { d: { days: days }, rev: r.rev }; cSched = null; toast("Расписание отправлено"); } catch(e){ toast(e.message); }
}
function cGoalsFormula(goal){
  const prof = doc("profile", {}) || {};
  const g = computeGoals({ weight: doc("weight", prof.weight || 70), goal: goal, pace: prof.pace || 2, target: null });
  Object.keys(g).forEach(k => { const el = document.getElementById("g_" + k); if(el) el.value = g[k]; });
  toast("Посчитано по формуле, проверь и отправь");
}
async function cSaveGoals(){
  const num = k => { const v = parseFloat(String(document.getElementById("g_" + k).value).replace(",", ".")); return isNaN(v) ? null : v; };
  const g = { kcalLo: num("kcalLo"), kcalHi: num("kcalHi"), prot: num("prot"), gainLo: num("gainLo"), gainHi: num("gainHi"), weightGoal: num("weightGoal"), weightLo: num("weightLo"), weightLabel: document.getElementById("g_weightLabel").value.trim() };
  if([g.kcalLo, g.kcalHi, g.prot, g.weightGoal, g.weightLo].some(v => v == null) || g.kcalLo > g.kcalHi){ toast("Проверь цифры"); return; }
  try { const r = await api("coach/client/set", { id: cur.id, key: "goals", data: g }); cur.coach.goals = { d: g, rev: r.rev }; toast("Цели отправлены"); } catch(e){ toast(e.message); }
}

/* ── ПРОГРАММА ── */
function newId(){ return "x_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function cRenderPlan(){
  if(!ed){
    const src = coachDoc("plan", null) || doc("plan", null);
    ed = src ? JSON.parse(JSON.stringify(src)) : planFromTemplate("own");
  }
  const srcRev = (cur.coach.plan && cur.coach.plan.rev) || 0, clientPlan = doc("plan", {}) || {};
  let h = '<div class="card"><label class="l">Название программы</label><input class="in" id="pName" value="' + esc(ed.name || "") + '" oninput="ed.name=this.value">' +
    '<div class="kv" style="margin-top:8px">На сервере ревизия <b>' + srcRev + '</b>' + (clientPlan.id === ed.id && clientPlan.rev ? ' · у клиента принята ревизия <b>' + clientPlan.rev + '</b>' : ' · у клиента: <b>' + esc(clientPlan.name || "нет программы") + '</b>') + '</div>' +
    '<div class="row" style="margin-top:8px;flex-wrap:wrap"><span class="kv">Шаблон:</span>' + TEMPLATES.map(t => '<button class="mini" onclick="cFromTemplate(\'' + t.id + '\')">' + esc(t.name) + '</button>').join("") + '</div></div>';
  h += ed.days.map((d, di) => {
    const open = !!edOpen[di];
    let b = '<label class="l">Заголовок дня</label><input class="in sm" value="' + esc(d.title || "") + '" oninput="ed.days[' + di + '].title=this.value">' +
      '<label class="l">Короткое имя (на вкладке)</label><input class="in sm" value="' + esc(d.short || "") + '" oninput="ed.days[' + di + '].short=this.value">' +
      '<label class="l">Разминка</label><textarea class="in sm" oninput="ed.days[' + di + '].warm=this.value">' + esc(d.warm || "") + '</textarea>' +
      '<label class="l">Кардио после</label><input class="in sm" value="' + esc(d.cardio || "") + '" oninput="ed.days[' + di + '].cardio=this.value">' +
      '<label class="l">Упражнения</label>' + d.ex.map((e, ei) => cExHtml(di, ei, e)).join("") +
      '<div class="row" style="margin-top:8px"><button class="mini org" onclick="cAddEx(' + di + ')">+ упражнение</button><button class="mini" onclick="cMoveDay(' + di + ',-1)">день ↑</button><button class="mini" onclick="cMoveDay(' + di + ',1)">день ↓</button><button class="mini red" onclick="cDelDay(' + di + ')">удалить день</button></div>';
    return '<div class="day' + (open ? " open" : "") + '"><div class="day-h" onclick="edOpen[' + di + ']=!edOpen[' + di + '];cRenderClient()"><div class="t">' + esc(d.title || ("День " + (di + 1))) + '</div><div class="c">' + d.ex.length + ' упр.</div><div class="c">' + (open ? "▾" : "▸") + '</div></div><div class="day-b">' + b + '</div></div>';
  }).join("");
  h += '<div class="row" style="margin:4px 0 14px;flex-wrap:wrap"><button class="mini org" onclick="cAddDay()">+ день</button><button class="mini" onclick="document.getElementById(\'cPlanFile\').click()">из файла</button><button class="mini" onclick="cPlanToFile()">скачать</button><button class="mini red" onclick="ed=null;edOpen={};cRenderClient()">отменить правки</button></div>' +
    '<div class="sticky"><button class="cbtn" onclick="cSendPlan()">Отправить программу клиенту</button></div>' +
    '<input type="file" id="cPlanFile" accept=".json" class="hidden" onchange="cPlanFileRead(this.files[0])">';
  return h;
}
function cExHtml(di, ei, e){
  const p = 'ed.days[' + di + '].ex[' + ei + ']';
  return '<div class="exc">' +
    '<div class="row"><span class="lbl" style="flex:0 0 22px;text-align:left">' + (ei + 1) + '</span><input class="in sm grow" placeholder="Название" value="' + esc(e.name || "") + '" oninput="' + p + '.name=this.value">' +
    '<select class="in sm" style="width:auto;flex:0 0 auto" onchange="' + p + '.icon=this.value">' + ICONS.map(i => '<option' + (e.icon === i ? " selected" : "") + '>' + i + '</option>').join("") + '</select></div>' +
    '<div class="row"><input class="in sm grow" placeholder="Мышцы (что чувствовать)" value="' + esc(e.m || "") + '" oninput="' + p + '.m=this.value"></div>' +
    '<div class="row"><span class="lbl">подх.</span><input class="in sm num" type="number" value="' + (e.sets || 4) + '" oninput="' + p + '.sets=+this.value">' +
    '<span class="lbl">повт. от</span><input class="in sm num" type="number" value="' + (e.lo || 10) + '" oninput="' + p + '.lo=+this.value">' +
    '<span class="lbl">до</span><input class="in sm num" type="number" value="' + (e.hi || 12) + '" oninput="' + p + '.hi=+this.value"></div>' +
    '<div class="row"><span class="lbl">шаг, кг</span><input class="in sm num" type="number" step="0.5" value="' + (e.step != null ? e.step : 2.5) + '" oninput="' + p + '.step=+this.value">' +
    '<span class="lbl">суперсет №</span><input class="in sm num" type="number" placeholder="—" value="' + (e.sg || "") + '" oninput="' + p + '.sg=this.value?+this.value:undefined">' +
    '<span class="chip' + (e.dumb ? " on" : "") + '" onclick="' + p + '.dumb=!' + p + '.dumb;cRenderClient()"><span class="bx"></span>одна гантель</span></div>' +
    '<div class="row"><textarea class="in sm grow" placeholder="Техника, заметка" style="min-height:52px" oninput="' + p + '.note=this.value">' + esc(e.note || "") + '</textarea></div>' +
    '<div class="row"><input class="in sm grow" placeholder="Если занято: замена" value="' + esc(e.swap || "") + '" oninput="' + p + '.swap=this.value"></div>' +
    '<div class="row" style="margin-top:8px"><button class="mini" onclick="cMoveEx(' + di + ',' + ei + ',-1)">↑</button><button class="mini" onclick="cMoveEx(' + di + ',' + ei + ',1)">↓</button><span class="grow"></span><button class="mini red" onclick="cDelEx(' + di + ',' + ei + ')">удалить</button></div></div>';
}
function cFromTemplate(id){ if(ed.days.some(d => d.ex.length) && !confirm("Заменить текущую правку шаблоном?")) return; ed = planFromTemplate(id, { name: me().name }); edOpen = {}; cRenderClient(); }
function cAddDay(){ const n = ed.days.length + 1; ed.days.push({ key: String(n), title: "День " + n, short: "День " + n, warm: WARM_STD, cardio: "", ex: [] }); edOpen[ed.days.length - 1] = true; cRenderClient(); }
function cDelDay(di){ if(!confirm("Удалить день целиком?")) return; ed.days.splice(di, 1); edOpen = {}; cRenderClient(); }
function cMoveDay(di, dir){ const j = di + dir; if(j < 0 || j >= ed.days.length) return; [ed.days[di], ed.days[j]] = [ed.days[j], ed.days[di]]; edOpen = {}; edOpen[j] = true; cRenderClient(); }
function cAddEx(di){ ed.days[di].ex.push({ id: newId(), name: "", m: "", icon: "press", sets: 4, lo: 10, hi: 12, step: 2.5, calib: true, note: "", swap: "" }); cRenderClient(); }
function cDelEx(di, ei){ ed.days[di].ex.splice(ei, 1); cRenderClient(); }
function cMoveEx(di, ei, dir){ const a = ed.days[di].ex, j = ei + dir; if(j < 0 || j >= a.length) return; [a[ei], a[j]] = [a[j], a[ei]]; cRenderClient(); }
function cPlanFileRead(f){ if(!f) return; const r = new FileReader(); r.onload = e => { try { const p = JSON.parse(e.target.result); if(!planValid(p)) throw 0; ed = p; edOpen = {}; cRenderClient(); toast("Загружено"); } catch(x){ toast("Файл не похож на программу"); } }; r.readAsText(f); }
function cPlanToFile(){ const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(ed, null, 1)], { type: "application/json" })); a.download = (ed.name || "программа") + ".gryaz.json"; a.click(); }
function cValidatePlan(p){
  if(!p.days.length) return "Нет ни одного дня";
  const ids = new Set();
  for(const d of p.days){
    if(!d.ex.length) return "В дне «" + (d.title || d.key) + "» нет упражнений";
    for(const e of d.ex){
      if(!e.name || !e.name.trim()) return "Упражнение без названия в дне «" + (d.title || d.key) + "»";
      if(ids.has(e.id)) return "Упражнение повторяется дважды: " + e.name;
      ids.add(e.id);
      if(!(e.sets >= 1 && e.sets <= 10)) return e.name + ": подходов от 1 до 10";
      if(!(e.lo >= 1 && e.hi >= e.lo && e.hi <= 100)) return e.name + ": повторы «от» ≤ «до»";
    }
  }
  return null;
}
async function cSendPlan(){
  ed.days.forEach((d, i) => { d.key = String(i + 1); if(!d.short) d.short = d.title || ("День " + (i + 1)); if(!d.title) d.title = "День " + (i + 1) + " · " + d.short; });
  const err = cValidatePlan(ed); if(err){ toast(err); return; }
  ed.v = 1; ed.author = { name: me().name }; ed.rev = ((cur.coach.plan && cur.coach.plan.rev) || 0) + 1;
  try { const r = await api("coach/client/set", { id: cur.id, key: "plan", data: ed }); ed.rev = r.rev; cur.coach.plan = { d: JSON.parse(JSON.stringify(ed)), rev: r.rev }; toast("Программа отправлена, ревизия " + r.rev); cRenderClient(); }
  catch(e){ toast(e.message); }
}

/* ── ЕЩЁ ── */
function cRenderMore(){
  const c = cur.client;
  return '<div class="card"><div class="sec-h" style="margin:0 0 8px">Согласия</div><div class="kv">' + ((cur.consents || []).map(x => ({ terms: "условия", pdn: "ПДн", health: "тело", share: "показ тренеру" }[x.kind] || x.kind) + " " + x.version).join("; ") || "нет") + '</div></div>' +
    '<div class="card"><div class="sec-h" style="margin:0 0 8px">Выгрузка</div><div class="kv">Всё, что о клиенте лежит на сервере, одним файлом - по его просьбе.</div><button class="cbtn ghost sm" style="margin-top:8px" onclick="cExportClient()">Скачать JSON</button></div>' +
    '<div class="card warn"><div class="sec-h" style="margin:0 0 8px">Отключить клиента</div><div class="kv">Ты перестанешь видеть его данные, твоя программа и заметки у него на сервере удалятся. Его аккаунт и записи остаются ему.</div><button class="cbtn danger" style="margin-top:10px" onclick="cUnlink()">Отключить ' + esc(c.name) + '</button></div>';
}
function cExportClient(){ const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(cur, null, 2)], { type: "application/json" })); a.download = "client-" + cur.id + ".json"; a.click(); }
async function cUnlink(){
  if(!confirm("Отключить " + cur.client.name + "?")) return;
  try { await api("coach/client/unlink", { id: cur.id }); toast("Отключён"); cur = null; await cShowList(); } catch(e){ toast(e.message); }
}

/* ── ПРОФИЛЬ ТРЕНЕРА ── */
function cShowProfile(){
  const u = me(), th = themePref();
  document.getElementById("cvProfile").innerHTML = '<h2>Профиль</h2>' +
    '<div class="p-card"><div class="p-name">' + esc(u.name) + '</div><div class="p-mail">' + esc(u.email) + '</div></div>' +
    '<div class="p-card"><div class="p-k">Тема</div><div class="seg">' + [["system", "Как в системе"], ["dark", "Тёмная"], ["light", "Светлая"]].map(x => '<button class="' + (th === x[0] ? "on" : "") + '" onclick="setTheme(\'' + x[0] + '\');cShowProfile()">' + x[1] + '</button>').join("") + '</div></div>' +
    '<div class="p-card"><div class="p-k">Аккаунт</div>' +
    '<div class="p-row"><div class="l">Имя<small>Так тебя видят клиенты.</small></div><button class="wbtn" onclick="cEditName()">Изменить</button></div>' +
    '<div class="p-row"><div class="l">Пароль</div><button class="wbtn" onclick="changePassword()">Сменить</button></div>' +
    '<div class="p-row"><div class="l">Выйти</div><button class="wbtn" onclick="doLogout()">Выйти</button></div>' +
    '<div class="kv" style="margin-top:10px"><a href="terms.html" target="_blank" style="color:var(--org)">Условия для тренера</a> · <a href="policy.html" target="_blank" style="color:var(--org)">Политика</a></div></div>' +
    '<div class="p-card warn"><div class="p-k">Удалить аккаунт</div><div class="kv">Клиенты останутся со своими данными, но без тренера. Отменить нельзя.</div><button class="wbtn danger" style="width:100%;margin-top:10px" onclick="deleteAccount()">Удалить аккаунт</button></div>';
  cShow("cvProfile");
}
async function cEditName(){
  const n = prompt("Имя:", me().name); if(n === null) return;
  try { const r = await api("auth/name", { name: n }); const s = session(); s.user.name = r.name; setSession(s); document.getElementById("cWho").textContent = r.name; cShowProfile(); toast("Ок"); }
  catch(e){ toast(e.message); }
}
