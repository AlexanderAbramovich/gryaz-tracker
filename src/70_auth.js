/* ═══════════ ДОКУМЕНТЫ ═══════════ */
/* Краткие тексты, которые человек реально читает и принимает. Каждый - отдельный
   документ со своей версией и хэшем (156-ФЗ). Полные тексты - terms/consent/… .html */
const LEGAL = {
  terms: { ver: "2026-09-21", title: "Условия использования", file: "terms.html", lines: [
    "ГРЯЗЬ - дневник тренировок, питания, сна и веса. Это не медицинский сервис и не медицинское изделие: программы и цели - рекомендации, а не назначение врача. Есть заболевания или травмы - сперва к врачу.",
    "Пользоваться можно с 18 лет. Нагрузку и рацион ты выбираешь сам и отвечаешь за них сам.",
    "Простая электронная подпись: действия в аккаунте после входа по почте и паролю (нажатия «Принимаю», «Создать аккаунт», «Подключиться») - это твоя подпись под документами. Пароль никому не сообщай.",
    "Сервис бесплатный, без рекламы, аналитики и рассылок. Аккаунт удаляется в профиле одной кнопкой вместе со всеми данными.",
    "Оператор сервиса - разработчик, физическое лицо; реквизиты и контакт для обращений - в политике."
  ]},
  pdn: { ver: "2026-09-21", title: "Согласие на обработку персональных данных", file: "consent.html", lines: [
    "Я даю оператору сервиса ГРЯЗЬ согласие на обработку моих персональных данных: имя, адрес электронной почты, технические данные устройства (браузер, IP-адрес в журналах сервера).",
    "Цель: работа моего аккаунта, вход, восстановление пароля, ответы на мои запросы.",
    "Действия: сбор, запись, хранение, уточнение, использование, удаление. Автоматизированная обработка на сервере в России.",
    "Срок: до отзыва согласия или удаления аккаунта. Отзыв - кнопкой «Удалить аккаунт» в профиле или сообщением оператору; данные стираются сразу.",
    "Согласие дано свободно и отдельно от других документов."
  ]},
  health: { ver: "2026-09-21", title: "Согласие на обработку данных о теле и тренировках", file: "consent-health.html", lines: [
    "Я даю оператору сервиса ГРЯЗЬ согласие на обработку данных о моём теле и образе жизни: вес и его история; тренировки - упражнения, рабочие веса, повторы, даты; дневник питания - блюда, калории, белки, жиры, углеводы; время подъёма и отбоя; отметки чек-листа; цели и программа.",
    "Понимаю, что такие сведения могут расцениваться как данные о состоянии здоровья. Диагнозы, болезни, лекарства и самочувствие в приложение не вношу - для этого нет полей, и такие сведения не собираются.",
    "Цель: ведение моего тренировочного процесса и питания, в том числе под контролем тренера, если я его подключу отдельным согласием.",
    "Фотографии тела на сервер не передаются - они остаются только на моём устройстве.",
    "Срок: до отзыва согласия или удаления аккаунта. Отзыв - кнопкой «Удалить аккаунт»: данные стираются сразу.",
    "Согласие дано свободно, отдельно от других документов, и подписано простой электронной подписью в порядке условий использования."
  ]},
  share: { ver: "2026-09-21", title: "Согласие на показ данных тренеру", file: "consent-health.html", lines: [
    "Я подключаюсь к тренеру по его коду и даю согласие на то, чтобы этот тренер видел мои данные из приложения: вес и его историю, тренировки, дневник питания, сон, чек-лист, цели и программу. Фотографии тренеру не показываются.",
    "Тренер обрабатывает данные по поручению оператора, только в кабинете сервиса, без права копировать, пересылать или публиковать их.",
    "Отозвать согласие можно в любой момент кнопкой «Отключиться от тренера» в профиле: доступ тренера прекращается сразу, его программа и заметки удаляются.",
    "Согласие дано свободно и отдельно от других документов."
  ]},
  coach: { ver: "2026-09-21", title: "Условия для тренера", file: "terms.html", lines: [
    "Данные клиентов я смотрю только в кабинете и только чтобы вести их тренировочный процесс. Обработка ведётся по поручению оператора сервиса.",
    "Соблюдаю конфиденциальность: не пересылаю данные в мессенджеры, не делаю скриншоты, не показываю третьим лицам.",
    "Публикую «до/после», результаты и цифры клиента только с его отдельного письменного согласия на распространение.",
    "Не оказываю медицинских услуг: при жалобах клиента на здоровье направляю к врачу, не корректирую питание и нагрузку «под болезнь».",
    "За программы и рекомендации отвечаю я; оператор отвечает за работу приложения.",
    "Если клиент отключается - удаляю свои копии и записи, если они были. Об утечке или подозрении на неё сообщаю оператору в течение 12 часов.",
    "Даю согласие на обработку своих данных (имя, почта, технические данные) для работы кабинета."
  ]}
};
function legalText(k){ const d = LEGAL[k]; return d.title + " · версия " + d.ver + "\n" + d.lines.join("\n"); }
async function consentsFor(kinds){
  const out = [];
  for(const k of kinds) out.push({ kind: k, version: LEGAL[k].ver, hash: await sha256Hex(legalText(k)) });
  return out;
}
function legalHtml(k){
  const d = LEGAL[k];
  return '<div class="j-l">версия ' + d.ver + '</div><div class="j-h" style="font-size:22px">' + esc(d.title) + '</div>' +
    '<div class="j-box" style="color:var(--ink-2)">' + d.lines.map(l => '<p style="margin:0 0 9px">' + esc(l) + '</p>').join("") +
    '<a href="' + d.file + '" target="_blank" style="color:var(--org);font-weight:700">Полный текст</a></div>';
}

/* ═══════════ ВХОД И РЕГИСТРАЦИЯ ═══════════ */
let A = {};   /* состояние экранов входа */
const ICON_CLIENT = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 24h32"/><rect x="4" y="16" width="6" height="16" rx="2"/><rect x="38" y="16" width="6" height="16" rx="2"/></svg>';
const ICON_COACH = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="14" r="6"/><path d="M6 40c0-8 5-13 12-13s12 5 12 13"/><path d="M32 12h10M32 20h10M32 28h6"/></svg>';

function showAuth(mode){
  A = Object.assign({ mode: mode || "welcome", role: "client", name: "", email: "", pass: "", code: "", adult: false, step: 0, acc: {}, err: "", busy: false, resetCode: "", resetPass: "" }, A.keep ? {} : {});
  showScreen("sAuth");
  renderAuth();
}
function aSet(k, v){ A[k] = v; }
function aGo(mode){ A.mode = mode; A.err = ""; A.step = 0; renderAuth(); window.scrollTo(0, 0); }
function renderAuth(){
  const el = document.getElementById("sAuth");
  let h = '<div class="screen">';
  const logo = '<div class="logo">ГРЯЗЬ<span>.</span></div><div class="logo-sub">Тренировки · питание · тренер</div>';
  if(A.mode === "welcome"){
    h += logo + '<button class="a-btn" onclick="aGo(\'login\')">Войти</button>' +
      '<button class="a-btn ghost" onclick="aGo(\'register\')">Создать аккаунт</button>' +
      '<div class="kv" style="margin-top:26px;text-align:center">Данные лежат на сервере в России, фото тела - только на твоём телефоне.<br><a href="policy.html" target="_blank" style="color:var(--org)">Политика</a> · <a href="terms.html" target="_blank" style="color:var(--org)">Условия</a></div>';
  } else if(A.mode === "login"){
    h += '<div class="j-h">Вход</div>' +
      '<div class="lbl-s">Почта</div><input class="inp" type="email" inputmode="email" autocomplete="username" autocapitalize="none" value="' + esc(A.email) + '" oninput="aSet(\'email\',this.value)">' +
      '<div class="lbl-s">Пароль</div><input class="inp" type="password" autocomplete="current-password" value="' + esc(A.pass) + '" oninput="aSet(\'pass\',this.value)" onkeydown="if(event.key===\'Enter\')doLogin()">' +
      '<div class="a-err">' + esc(A.err) + '</div>' +
      '<button class="a-btn" ' + (A.busy ? "disabled" : "") + ' onclick="doLogin()">Войти</button>' +
      '<button class="a-link" onclick="aGo(\'reset\')">Забыл пароль</button>' +
      '<button class="a-link" onclick="aGo(\'register\')">Нет аккаунта - создать</button>' +
      '<button class="a-link" style="color:var(--dim)" onclick="aGo(\'welcome\')">← Назад</button>';
  } else if(A.mode === "reset"){
    h += '<div class="j-h">Новый пароль</div>' +
      (A.step === 0
        ? '<p class="j-p">Пришлём код на почту, если она есть в системе.</p><div class="lbl-s">Почта</div><input class="inp" type="email" inputmode="email" autocapitalize="none" value="' + esc(A.email) + '" oninput="aSet(\'email\',this.value)">' +
          '<div class="a-err">' + esc(A.err) + '</div><button class="a-btn" ' + (A.busy ? "disabled" : "") + ' onclick="doResetRequest()">Прислать код</button>'
        : '<p class="j-p">Код из письма и новый пароль.</p><div class="lbl-s">Код</div><input class="inp num" maxlength="7" autocapitalize="characters" value="' + esc(A.resetCode) + '" oninput="aSet(\'resetCode\',this.value)">' +
          '<div class="lbl-s">Новый пароль</div><input class="inp" type="password" autocomplete="new-password" value="' + esc(A.resetPass) + '" oninput="aSet(\'resetPass\',this.value)">' +
          '<div class="a-err">' + esc(A.err) + '</div><button class="a-btn" ' + (A.busy ? "disabled" : "") + ' onclick="doResetConfirm()">Сменить пароль</button>') +
      '<button class="a-link" style="color:var(--dim)" onclick="aGo(\'login\')">← К входу</button>';
  } else if(A.mode === "register"){
    if(A.step === 0){
      const ok = A.name.trim().length >= 2 && /\S+@\S+\.\S+/.test(A.email) && A.pass.length >= 8 && A.adult && (A.role !== "coach" || A.code.replace(/\W/g, "").length === 6);
      h += '<div class="j-h">Новый аккаунт</div>' +
        '<div class="role-grid">' +
        '<button class="role' + (A.role === "client" ? " on" : "") + '" onclick="A.role=\'client\';renderAuth()">' + ICON_CLIENT + '<b>Тренируюсь</b><small>Дневник, программа, питание. Тренера можно подключить потом.</small></button>' +
        '<button class="role' + (A.role === "coach" ? " on" : "") + '" onclick="A.role=\'coach\';renderAuth()">' + ICON_COACH + '<b>Я тренер</b><small>Кабинет: клиенты, программы, цели, отчёты.</small></button></div>' +
        '<div class="lbl-s">Имя' + (A.role === "coach" ? " (как увидят клиенты)" : "") + '</div><input class="inp" maxlength="40" autocomplete="name" value="' + esc(A.name) + '" oninput="aSet(\'name\',this.value);aSoft()">' +
        '<div class="lbl-s">Почта</div><input class="inp" type="email" inputmode="email" autocomplete="username" autocapitalize="none" value="' + esc(A.email) + '" oninput="aSet(\'email\',this.value);aSoft()">' +
        '<div class="lbl-s">Пароль · от 8 символов</div><input class="inp" type="password" autocomplete="new-password" value="' + esc(A.pass) + '" oninput="aSet(\'pass\',this.value);aSoft()">' +
        (A.role === "coach" ? '<div class="lbl-s">Код тренера · выдаёт администратор сервиса</div><input class="inp num" maxlength="7" autocapitalize="characters" autocomplete="off" value="' + esc(A.code) + '" oninput="aSet(\'code\',this.value);aSoft()">' : '') +
        '<div class="j-chk' + (A.adult ? " on" : "") + '" onclick="A.adult=!A.adult;renderAuth()"><div class="bx"></div><div>Мне есть 18 лет</div></div>' +
        '<div class="a-err">' + esc(A.err) + '</div>' +
        '<button class="a-btn" id="aNext" ' + (ok ? "" : "disabled") + ' onclick="A.step=1;A.err=\'\';renderAuth();window.scrollTo(0,0)">Дальше · документы</button>' +
        '<button class="a-link" onclick="aGo(\'login\')">Уже есть аккаунт - войти</button>';
    } else {
      const kinds = A.role === "coach" ? ["terms", "pdn", "coach"] : ["terms", "pdn", "health"];
      const k = kinds[A.step - 1];
      const last = A.step === kinds.length;
      h += '<div class="j-l" style="margin-bottom:8px">Документ ' + A.step + ' из ' + kinds.length + '</div>' + legalHtml(k) +
        '<div class="j-chk' + (A.acc[k] ? " on" : "") + '" onclick="A.acc[\'' + k + '\']=!A.acc[\'' + k + '\'];renderAuth()"><div class="bx"></div><div>' +
        (k === "terms" ? "Принимаю условия и соглашение о простой электронной подписи" : k === "coach" ? "Принимаю условия для тренера" : "Даю это согласие. Оно отдельное и добровольное") + '</div></div>' +
        '<div class="a-err">' + esc(A.err) + '</div>' +
        '<div class="j-foot"><button class="fl-back" onclick="A.step--;A.err=\'\';renderAuth()">←</button>' +
        '<button class="fl-next" ' + (A.acc[k] && !A.busy ? "" : "disabled") + ' onclick="' + (last ? "doRegister()" : "A.step++;renderAuth();window.scrollTo(0,0)") + '">' + (last ? "Создать аккаунт" : "Дальше") + '</button></div>';
    }
  }
  el.innerHTML = h + '</div>';
}
function aSoft(){
  const b = document.getElementById("aNext"); if(!b) return;
  b.disabled = !(A.name.trim().length >= 2 && /\S+@\S+\.\S+/.test(A.email) && A.pass.length >= 8 && A.adult && (A.role !== "coach" || A.code.replace(/\W/g, "").length === 6));
}
function afterAuth(res){
  setSession({ token: res.token, user: res.user, coach: res.coach || null });
  A = {};
  route();
}
async function doLogin(){
  A.busy = true; A.err = ""; renderAuth();
  try {
    const res = await api("auth/login", { email: A.email.trim(), password: A.pass, app: APP_VERSION }, { token: null });
    afterAuth(res);
    if(res.user.role === "client"){
      /* Новое устройство: тянем всё с сервера, если локально пусто */
      claimLocalData(res.user.id);
      const n = await pullFromServer(true);
      if(n > 0){ clientBoot(); route(); toast("Данные с сервера на месте"); }
    }
  } catch(e){ A.busy = false; A.err = e.message; renderAuth(); }
}
async function doRegister(){
  A.busy = true; A.err = ""; renderAuth();
  try {
    const kinds = A.role === "coach" ? ["terms", "pdn", "coach"] : ["terms", "pdn", "health"];
    const res = await api("auth/register", { role: A.role, name: A.name.trim(), email: A.email.trim(), password: A.pass, adult: true, coachCode: A.code, consents: await consentsFor(kinds) }, { token: null });
    if(res.user.role === "client"){ claimLocalData(res.user.id); wipeLocalData(); localStorage.setItem("dataOwner", JSON.stringify(res.user.id)); }
    afterAuth(res);
  } catch(e){ A.busy = false; A.err = e.message; if(/почт|Пароль|называть|Код/.test(e.message)) A.step = 0; renderAuth(); }
}
async function doResetRequest(){
  A.busy = true; A.err = ""; renderAuth();
  try {
    const r = await api("auth/reset/request", { email: A.email.trim() }, { token: null });
    A.busy = false;
    if(!r.mail){ A.err = "Письма пока не настроены - напиши оператору, пароль сменят вручную"; renderAuth(); return; }
    A.step = 1; renderAuth();
  } catch(e){ A.busy = false; A.err = e.message; renderAuth(); }
}
async function doResetConfirm(){
  A.busy = true; A.err = ""; renderAuth();
  try {
    await api("auth/reset/confirm", { email: A.email.trim(), code: A.resetCode, password: A.resetPass }, { token: null });
    A.busy = false; A.pass = A.resetPass; A.resetPass = ""; A.resetCode = "";
    toast("Пароль сменён, входи"); aGo("login");
  } catch(e){ A.busy = false; A.err = e.message; renderAuth(); }
}
async function doLogout(){
  try { await api("auth/logout", {}); } catch(e){}
  setSession(null);
  showAuth("welcome");
}

/* ═══════════ АНКЕТА КЛИЕНТА ═══════════ */
/* Четыре шага: тело и цель → дни тренировок → программа → готово.
   Цели по еде считаются на лету и видны сразу, чтобы экран не был формой. */
let OB = {};
function showOnboard(){
  const p = store.get("profile", {}) || {};
  OB = { step: 0, weight: p.weight || "", goal: p.goal || "gain", pace: p.pace || 2, target: p.target || "", days: p.days || [1, 3, 5], tpl: "", code: "", err: "", busy: false };
  showScreen("sOnboard");
  renderOB();
}
const DOW = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
/* Значение в onclick только в одинарных кавычках: двойные рвут атрибут, и тап молчит */
function obChip(k, v, label, cls){ return '<button class="chip-b ' + (cls || "") + (OB[k] === v ? " on" : "") + '" onclick="obSet(&quot;' + k + '&quot;,' + (typeof v === "string" ? "&quot;" + v + "&quot;" : v) + ')">' + label + '</button>'; }
/* Задача и целевой вес не должны спорить: выбрал «сушку» при цели выше текущего -
   цель сбрасывается на умолчание; ввёл цель ниже текущего - задача сама станет «сушка» */
function obSet(k, v){
  OB[k] = v;
  if(k === "goal"){
    const w = Number(OB.weight) || 0, t = Number(OB.target) || 0;
    if(t && w && ((v === "gain" && t <= w) || (v === "cut" && t >= w) || v === "keep")) OB.target = "";
  }
  renderOB();
}
function obTarget(v){
  OB.target = v;
  const w = Number(OB.weight) || 0, t = Number(v) || 0;
  if(w && t){
    const g = t > w + 0.4 ? "gain" : t < w - 0.4 ? "cut" : "keep";
    if(g !== OB.goal){
      OB.goal = g; renderOB();
      const el = document.getElementById("obTarget"); if(el) el.focus();   /* type=number не умеет setSelectionRange */
      return;
    }
  }
  obRecalc();
}
function renderOB(){
  const el = document.getElementById("sOnboard");
  const prog = '<div class="ob-prog">' + [0, 1, 2].map(i => '<i class="' + (i <= OB.step ? "on" : "") + '"></i>').join("") + '</div>';
  let h = '<div class="screen">' + prog;
  if(OB.step === 0){
    const g = computeGoals(OB);
    h += '<div class="j-h">Тело и цель</div><p class="j-p">Отсюда считаются калории, белок и темп. Цифры потом можно поправить в профиле, тренер тоже может.</p>' +
      '<div class="lbl-s">Вес сейчас, кг</div><input class="inp num" type="number" inputmode="decimal" step="0.1" placeholder="70" value="' + esc(OB.weight) + '" oninput="OB.weight=this.value;obRecalc()">' +
      '<div class="lbl-s">Задача</div><div class="chips">' + obChip("goal", "gain", "Набор") + obChip("goal", "keep", "Держать") + obChip("goal", "cut", "Сушка") + '</div>' +
      '<div class="lbl-s">Темп</div><div class="chips">' + obChip("pace", 1, "Спокойно") + obChip("pace", 2, "Средне") + obChip("pace", 3, "Быстро") + '</div>' +
      '<div class="lbl-s">Целевой вес, кг · можно пропустить</div><input class="inp num" id="obTarget" type="number" inputmode="decimal" step="0.5" placeholder="' + g.weightGoal + '" value="' + esc(OB.target) + '" oninput="obTarget(this.value)">' +
      '<div class="calc" id="obCalc">' + obCalcHtml(g) + '</div>' +
      '<button class="a-btn" ' + (Number(OB.weight) >= 35 ? "" : "disabled") + ' id="obNext" onclick="OB.step=1;renderOB();window.scrollTo(0,0)">Дальше</button>';
  } else if(OB.step === 1){
    h += '<div class="j-h">Дни тренировок</div><p class="j-p">В эти дни Гид будет звать в зал, в остальные - отдых. Программу можно крутить по кругу независимо от дней.</p>' +
      '<div class="chips">' + DOW.map((d, i) => '<button class="chip-b day' + (OB.days.indexOf(i + 1) >= 0 ? " on" : "") + '" onclick="obDay(' + (i + 1) + ')">' + d + '</button>').join("") + '</div>' +
      '<div class="kv">' + (OB.days.length ? OB.days.length + " " + plural(OB.days.length, "тренировка", "тренировки", "тренировок") + " в неделю" : "Выбери хотя бы один день") + '</div>' +
      '<div class="j-foot"><button class="fl-back" onclick="OB.step=0;renderOB()">←</button><button class="fl-next" ' + (OB.days.length ? "" : "disabled") + ' onclick="OB.step=2;renderOB();window.scrollTo(0,0)">Дальше</button></div>';
  } else if(OB.step === 2){
    const fit = TEMPLATES.filter(t => t.id !== "own");
    h += '<div class="j-h">Программа</div><p class="j-p">Выбери шаблон под свои дни - или подключись к тренеру, он пришлёт свою.</p>' +
      fit.map(t => '<div class="tpl' + (OB.tpl === t.id ? " on" : "") + '" onclick="OB.tpl=\'' + t.id + '\';OB.code=\'\';renderOB()"><b>' + esc(t.name) + (t.days === OB.days.length ? ' <span style="color:var(--org);font-size:11px">· под твои дни</span>' : '') + '</b><small>' + esc(t.who) + '</small></div>').join("") +
      '<div class="tpl' + (OB.tpl === "own" ? " on" : "") + '" onclick="OB.tpl=\'own\';OB.code=\'\';renderOB()"><b>Соберу сам</b><small>Пустая программа, упражнения добавишь в Зале.</small></div>' +
      '<div class="tpl' + (OB.tpl === "coach" ? " on" : "") + '" onclick="OB.tpl=\'coach\';renderOB()"><b>Есть тренер</b><small>Введи код от тренера - он увидит твой прогресс и пришлёт программу.</small>' +
      (OB.tpl === "coach" ? '<input class="inp num" style="margin-top:10px" maxlength="7" placeholder="ABC234" autocapitalize="characters" autocomplete="off" value="' + esc(OB.code) + '" oninput="OB.code=this.value" onclick="event.stopPropagation()">' : '') + '</div>' +
      '<div class="a-err">' + esc(OB.err) + '</div>' +
      '<div class="j-foot"><button class="fl-back" onclick="OB.step=1;renderOB()">←</button><button class="fl-next" ' + (OB.tpl && !OB.busy && (OB.tpl !== "coach" || OB.code.replace(/\W/g, "").length === 6) ? "" : "disabled") + ' onclick="obFinish()">Готово</button></div>';
  }
  el.innerHTML = h + '</div>';
}
function obCalcHtml(g){
  return '<div class="calc-row"><span>Калории в день</span><b>' + g.kcalLo + '–' + g.kcalHi + '</b></div>' +
    '<div class="calc-row"><span>Белок</span><b>' + g.prot + ' г</b></div>' +
    '<div class="calc-row"><span>Темп веса в неделю</span><b>' + (g.gainLo >= 0 ? "+" : "") + g.gainLo + '…' + (g.gainHi >= 0 ? "+" : "") + g.gainHi + ' кг</b></div>' +
    '<div class="calc-row"><span>Цель</span><b>' + g.weightGoal + ' кг</b></div>';
}
function obRecalc(){
  const c = document.getElementById("obCalc"); if(c) c.innerHTML = obCalcHtml(computeGoals(OB));
  const b = document.getElementById("obNext"); if(b) b.disabled = !(Number(OB.weight) >= 35);
}
function obDay(d){ const i = OB.days.indexOf(d); if(i >= 0) OB.days.splice(i, 1); else OB.days.push(d); OB.days.sort(); renderOB(); }
function plural(n, a, b, c){ const x = Math.abs(n) % 100, y = x % 10; if(x > 10 && x < 20) return c; if(y > 1 && y < 5) return b; if(y === 1) return a; return c; }
async function obFinish(){
  OB.busy = true; OB.err = ""; renderOB();
  const w = Math.round(Number(OB.weight) * 10) / 10;
  const profile = { done: true, weight: w, goal: OB.goal, pace: OB.pace, target: Number(OB.target) || null, days: OB.days.slice(), at: new Date().toISOString() };
  const goals = computeGoals(profile);
  store.set("profile", profile);
  store.set("goals", goals);
  store.set("schedule", { days: OB.days.slice() });
  store.set("weight", w);
  if(!store.get("wHist", []).length) store.set("wHist", [{ d: todayISO(), w: w, am: true }]);
  if(OB.tpl === "coach"){
    try { await linkCoach(OB.code); } catch(e){ OB.busy = false; OB.err = e.message; renderOB(); return; }
    if(!store.get("plan", null)) store.set("plan", planFromTemplate("own"));
  } else {
    store.set("plan", planFromTemplate(OB.tpl || "own"));
  }
  clientBoot();
  showClient();
  syncNow(true);
  toast("Поехали");
}
async function linkCoach(code){
  const consents = await consentsFor(["share"]);
  const r = await api("client/link", { code: code, consents: consents });
  const s = session(); s.coach = r.coach; setSession(s);
  store.set("coachRev", {});
  return r.coach;
}

/* ═══════════ ПРОФИЛЬ КЛИЕНТА ═══════════ */
function showClient(){
  showScreen("sClient");
  const u = me();
  document.getElementById("hdrSub").textContent = (u ? u.name + " · " : "") + "цель " + W_GOAL + " кг · v" + APP_VERSION;
  switchView("guide");
}
function renderProfile(){
  const box = document.getElementById("viewProfile");
  const u = me(), c = linkedCoach(), p = store.get("profile", {}) || {}, g = goals(), sch = store.get("schedule", { days: [] });
  const th = themePref();
  const dirty = Object.keys(store.get("syncDirty", {})).length;
  box.innerHTML =
    '<div class="h-title">Профиль</div>' +
    '<div class="p-card"><div class="p-name">' + esc(u ? u.name : "") + '</div><div class="p-mail">' + esc(u ? u.email : "") + '</div>' +
    '<div class="kv" style="margin-top:8px">Синк: ' + (syncState.at ? ago(syncState.at) : "ещё не было") + (dirty ? ' · не отправлено ' + dirty : '') + (syncState.err ? ' · <span style="color:var(--warn-ink)">' + esc(syncState.err) + '</span>' : '') + '</div>' +
    '<div class="cc-row"><button class="wbtn" onclick="syncNow(true).then(ok => { toast(ok ? \'Отправлено\' : \'Не вышло\'); renderProfile(); })">Отправить всё</button><button class="wbtn" onclick="pullFromServer().then(() => location.reload())">Забрать с сервера</button></div></div>' +

    '<div class="p-card"><div class="p-k">Тренер</div>' +
    (c ? '<div class="p-row"><div class="l"><b>' + esc(c.name) + '</b><small>Видит тренировки, вес, еду, сон и чек-лист. Фото - нет.</small></div><button class="wbtn danger" onclick="unlinkCoach()">Отключиться</button></div>'
       : '<div class="p-row"><div class="l">Не подключён<small>Тренер даёт код - вводишь здесь. Он увидит прогресс и сможет присылать программу и цели.</small></div></div>' +
         '<div class="row" style="margin-top:8px"><input class="inp num grow" id="pfCode" maxlength="7" placeholder="ABC234" autocapitalize="characters" autocomplete="off" style="margin:0"><button class="wbtn" style="flex:none;width:auto;padding:12px 16px" onclick="linkFromProfile()">Подключить</button></div>') + '</div>' +

    '<div class="p-card"><div class="p-k">Цели</div>' +
    '<div class="p-row"><div class="l">Задача<small>' + (GOAL_NAMES[p.goal] || "—") + ' · ' + (PACE_NAMES[p.pace] || "") + '</small></div><div class="v">' + (p.weight || "—") + ' → ' + g.weightGoal + ' кг</div></div>' +
    '<div class="p-row"><div class="l">Калории</div><div class="v">' + g.kcalLo + '–' + g.kcalHi + '</div></div>' +
    '<div class="p-row"><div class="l">Белок</div><div class="v">' + g.prot + ' г</div></div>' +
    '<div class="p-row"><div class="l">Темп</div><div class="v">' + (g.gainLo >= 0 ? "+" : "") + g.gainLo + '…' + (g.gainHi >= 0 ? "+" : "") + g.gainHi + ' кг/нед</div></div>' +
    '<div class="cc-row"><button class="wbtn" onclick="editGoals()">Пересчитать</button><button class="wbtn" onclick="editGoalsManual()">Ввести вручную</button></div></div>' +

    '<div class="p-card"><div class="p-k">Дни тренировок</div><div class="chips" style="margin:0">' + DOW.map((d, i) => '<button class="chip-b day' + ((sch.days || []).indexOf(i + 1) >= 0 ? " on" : "") + '" onclick="toggleSchedDay(' + (i + 1) + ')">' + d + '</button>').join("") + '</div></div>' +

    '<div class="p-card"><div class="p-k">Программа</div>' +
    '<div class="p-row"><div class="l"><b>' + esc(PLAN ? PLAN.name : "—") + '</b><small>' + DAY_ORDER.length + ' дн.' + (PLAN && PLAN.author && PLAN.author.name ? ' · от ' + esc(PLAN.author.name) : '') + '</small></div></div>' +
    '<div class="cc-row"><button class="wbtn" onclick="pickTemplate()">Выбрать шаблон</button><button class="wbtn" onclick="sharePlanFile()">Скачать файл</button><button class="wbtn" onclick="document.getElementById(\'planFile\').click()">Загрузить файл</button></div></div>' +

    '<div class="p-card"><div class="p-k">Тема</div><div class="seg">' + [["system", "Как в системе"], ["dark", "Тёмная"], ["light", "Светлая"]].map(x => '<button class="' + (th === x[0] ? "on" : "") + '" onclick="setTheme(\'' + x[0] + '\');renderProfile()">' + x[1] + '</button>').join("") + '</div></div>' +

    '<div class="p-card"><div class="p-k">Дополнительно</div>' +
    '<div class="p-row"><div class="l">Уход за кожей и волосами в чек-листе<small>Личный пресет: утренний и вечерний уход, волосы после мытья, рецепты и список покупок.</small></div><button class="toggle' + (cfg().personal ? " on" : "") + '" onclick="togglePersonal()"></button></div>' +
    '<div class="p-row"><div class="l">Граница дня<small>Всё, что записано ночью до этого часа, идёт во вчерашний день.</small></div><div class="v">' + pad(cfg().dayStart) + ':00</div><button class="wbtn" onclick="editDayStart()">Изменить</button></div></div>' +

    '<div class="p-card"><div class="p-k">Данные</div>' +
    '<div class="p-row"><div class="l">Бэкап на телефон<small>Всё, включая фото. Восстановление - тем же файлом.</small></div><button class="wbtn" onclick="exportData()">Скачать</button><button class="wbtn" onclick="document.getElementById(\'importFile\').click()">Восстановить</button></div>' +
    '<div class="p-row"><div class="l">Мои данные с сервера<small>Всё, что о тебе лежит на сервере, одним файлом.</small></div><button class="wbtn" onclick="exportServerData()">JSON</button></div>' +
    '<input type="file" id="importFile" accept=".json,application/json" style="display:none" onchange="importData(this.files[0])">' +
    '<input type="file" id="planFile" accept=".json,application/json" style="display:none" onchange="importPlanFile(this.files[0])"></div>' +

    '<div class="p-card"><div class="p-k">Аккаунт</div>' +
    '<div class="p-row"><div class="l">Имя</div><button class="wbtn" onclick="editName()">Изменить</button></div>' +
    '<div class="p-row"><div class="l">Пароль</div><button class="wbtn" onclick="changePassword()">Сменить</button></div>' +
    '<div class="p-row"><div class="l">Выйти<small>Данные на этом телефоне останутся до входа другого человека.</small></div><button class="wbtn" onclick="doLogout()">Выйти</button></div>' +
    '<div class="kv" style="margin-top:10px"><a href="terms.html" target="_blank" style="color:var(--org)">Условия</a> · <a href="consent.html" target="_blank" style="color:var(--org)">Согласие на ПДн</a> · <a href="consent-health.html" target="_blank" style="color:var(--org)">Согласие на данные о теле</a> · <a href="policy.html" target="_blank" style="color:var(--org)">Политика</a></div></div>' +

    '<div class="p-card warn"><div class="p-k">Удалить аккаунт</div><div class="kv">Стирает с сервера всё: аккаунт, тренировки, вес, еду, согласия. Отменить нельзя. На телефоне данные тоже сотрутся.</div>' +
    '<button class="wbtn danger" style="width:100%;margin-top:10px" onclick="deleteAccount()">Удалить аккаунт и все данные</button></div>';
}
async function linkFromProfile(){
  const code = document.getElementById("pfCode").value;
  if(code.replace(/\W/g, "").length !== 6){ toast("Код из 6 знаков"); return; }
  if(!confirm("Подключиться к тренеру? Он увидит твои тренировки, вес, еду, сон и чек-лист. Фото - нет. Это отдельное согласие, отозвать можно кнопкой «Отключиться».")) return;
  try { const c = await linkCoach(code); toast("Подключено к " + c.name); await syncNow(true); renderProfile(); renderGuide(); }
  catch(e){ toast(e.message || "Не вышло"); }
}
async function unlinkCoach(){
  if(!confirm("Отключиться от тренера? Его доступ прекратится сразу, его программа и заметки удалятся с сервера. Твои данные останутся.")) return;
  try { await api("client/unlink", {}); } catch(e){ toast(e.message); return; }
  const s = session(); s.coach = null; setSession(s);
  localStorage.removeItem("coachNote"); store.set("coachRev", {});
  toast("Отключено"); renderProfile(); renderGuide();
}
function editGoals(){
  const p = store.get("profile", {}) || {};
  const w = prompt("Вес сейчас, кг:", p.weight || store.get("weight", 70));
  if(w === null) return;
  const wn = parseFloat(String(w).replace(",", ".")); if(isNaN(wn) || wn < 35){ toast("Не похоже на вес"); return; }
  const goal = prompt("Задача: набор / держать / сушка", GOAL_NAMES[p.goal] || "набор");
  if(goal === null) return;
  const gk = /наб/i.test(goal) ? "gain" : /суш/i.test(goal) ? "cut" : "keep";
  const pace = prompt("Темп: 1 спокойно, 2 средне, 3 быстро", p.pace || 2);
  if(pace === null) return;
  const np = Object.assign({}, p, { weight: wn, goal: gk, pace: Math.max(1, Math.min(3, parseInt(pace, 10) || 2)) });
  store.set("profile", np); store.set("goals", computeGoals(np)); applyGoals();
  renderProfile(); renderWeight(); toast("Цели пересчитаны");
}
function editGoalsManual(){
  const g = goals();
  const lo = prompt("Калории, нижняя граница:", g.kcalLo); if(lo === null) return;
  const hi = prompt("Калории, верхняя граница:", g.kcalHi); if(hi === null) return;
  const pr = prompt("Белок, г:", g.prot); if(pr === null) return;
  const wg = prompt("Целевой вес, кг:", g.weightGoal); if(wg === null) return;
  const ng = Object.assign({}, g, { kcalLo: parseInt(lo, 10) || g.kcalLo, kcalHi: parseInt(hi, 10) || g.kcalHi, prot: parseInt(pr, 10) || g.prot, weightGoal: parseFloat(String(wg).replace(",", ".")) || g.weightGoal });
  if(ng.kcalHi < ng.kcalLo) ng.kcalHi = ng.kcalLo + 200;
  store.set("goals", ng); applyGoals(); renderProfile(); renderWeight(); toast("Цели сохранены");
}
function toggleSchedDay(d){
  const sch = store.get("schedule", { days: [] }); const days = sch.days || [];
  const i = days.indexOf(d); if(i >= 0) days.splice(i, 1); else days.push(d); days.sort();
  store.set("schedule", { days: days }); renderProfile();
}
function togglePersonal(){ const c = store.get("cfg", {}); c.personal = !cfg().personal; store.set("cfg", c); renderProfile(); }
function editDayStart(){
  const v = prompt("Час, с которого начинается новый день (0-12). Совы ставят 6-8:", cfg().dayStart);
  if(v === null) return;
  const n = parseInt(v, 10); if(isNaN(n) || n < 0 || n > 12){ toast("От 0 до 12"); return; }
  const c = store.get("cfg", {}); c.dayStart = n; store.set("cfg", c); renderProfile(); toast("Граница дня " + pad(n) + ":00");
}
function pickTemplate(){
  const html = TEMPLATES.map(t => '<button class="fracb wide" style="text-align:left" onclick="applyTemplate(\'' + t.id + '\')">' + esc(t.name) + '<small>' + esc(t.who) + '</small></button>').join("");
  openSheet(html, "Шаблон программы", "Текущая программа заменится. История тренировок останется.");
}
function applyTemplate(id){
  planPending = planFromTemplate(id);
  acceptPlan();
  renderProfile();
}
async function editName(){
  const n = prompt("Имя:", me().name); if(n === null) return;
  try { const r = await api("auth/name", { name: n }); const s = session(); s.user.name = r.name; setSession(s); renderProfile(); showClientHeader(); toast("Ок"); }
  catch(e){ toast(e.message); }
}
function showClientHeader(){ const u = me(); document.getElementById("hdrSub").textContent = (u ? u.name + " · " : "") + "цель " + W_GOAL + " кг · v" + APP_VERSION; }
async function changePassword(){
  const o = prompt("Старый пароль:"); if(o === null) return;
  const n = prompt("Новый пароль, от 8 символов:"); if(n === null) return;
  try { await api("auth/password", { old: o, new: n }); toast("Пароль сменён"); } catch(e){ toast(e.message); }
}
async function deleteAccount(){
  if(!confirm("Удалить аккаунт и ВСЕ данные с сервера? Отменить нельзя.")) return;
  const p = prompt("Для подтверждения введи пароль:"); if(p === null) return;
  try { await api("me/delete", { password: p }); } catch(e){ toast(e.message); return; }
  wipeLocalData(); localStorage.removeItem("dataOwner"); setSession(null);
  toast("Аккаунт удалён"); showAuth("welcome");
}
