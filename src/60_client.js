/* ═══════════ ПРОГРАММА ЗАЛА ═══════════ */
/* Программа Димы, сентябрь 2026. Четырёхдневный сплит, везде 4 подхода.
   Это СИД: живая программа лежит в хранилище (ключ plan) и может прийти от тренера.
   Ключи d1e1…d4e5 заморожены навсегда - на них ссылаются записи за июль-сентябрь.
   Новые упражнения получают только свой префикс (x_…). */
const SEED_PROGRAM = {
  1: {
    title: "День 1 · Грудь · Дельты · Трицепс",
    warm: "<b>Разминка 8-10 мин.</b> Велотренажёр 4 мин до испарины. По 10: круги руками, вращения с палкой, кошка-корова. Подводящие к первому жиму: 50%×8, 75%×4.",
    cardio: "15 мин · пульс 120-130 · эллипс или лестница",
    ex: [
      { id:"d1e1", name:"Жим гантелей 45°", m:"Верх грудной · передняя дельта · трицепс", icon:"press", sets:4, lo:8, hi:12, w:0, step:2, dumb:true, calib:true,
        note:"Скамья под 45°. Гантели вниз до растяжения груди, вверх не до щелчка локтей. Вес одной гантели.",
        swap:"Жим в Смите на наклонной." },
      { id:"d1e2", name:"Жим в горизонтальном хаммере", m:"Середина грудной · трицепс", icon:"press", sets:4, lo:12, hi:15, w:0, step:2.5, calib:true,
        note:"Рычажный тренажёр, жмёшь от груди вперёд. Вес одной стороны.",
        swap:"Жим гантелей лёжа горизонтально." },
      { id:"d1e3", name:"Бабочка на грудь", m:"Грудная целиком, внутренний край", icon:"flye", sets:4, lo:12, hi:15, w:0, step:2.5, calib:true,
        note:"Пек-дек. Локти слегка согнуты и зафиксированы, сводишь до касания рукоятей.",
        swap:"Сведение в кроссовере стоя." },
      { id:"d1e4", name:"Отведение гантелей в стороны стоя", m:"Средняя дельта", icon:"lateral", sets:4, lo:15, hi:20, w:0, step:2, dumb:true, calib:true,
        note:"До параллели с полом, не выше. Никогда в отказ - это средняя дельта, она мелкая. Вес одной гантели.",
        swap:"Махи на нижнем блоке." },
      { id:"d1e5", name:"Жим на переднюю дельту в рычажном", m:"Передняя дельта · трицепс", icon:"shoulderpress", sets:4, lo:10, hi:12, w:0, step:2.5, calib:true,
        note:"Спина прижата к спинке, жмёшь вверх. Вес одной стороны.",
        swap:"Жим гантелей сидя со спинкой." },
      { id:"d1e6", name:"Разгибание с канатами на трицепс", m:"Трицепс, боковая и средняя головки", icon:"triceps", sets:4, lo:12, hi:15, w:0, step:2.5, calib:true, sg:1,
        note:"Локти прижаты к корпусу, внизу канат разводишь в стороны.",
        swap:"Разгибание с прямой рукоятью." },
      { id:"d1e7", name:"Французский жим", m:"Трицепс, длинная головка", icon:"triceps", sets:4, lo:12, hi:15, w:0, step:2.5, calib:true, sg:1,
        note:"Сразу после каната, без отдыха. Локти смотрят в потолок и не разъезжаются.",
        swap:"Разгибание из-за головы с гантелью." }
    ]
  },
  2: {
    title: "День 2 · Спина · Бицепс",
    warm: "<b>Разминка 8-10 мин.</b> Велотренажёр 4 мин. По 10: круги руками, вращения с палкой, кошка-корова. Подводящие к вертикальной тяге: 50%×8, 75%×4.",
    cardio: "15 мин · пульс 120-130 · эллипс или лестница",
    ex: [
      { id:"d2e1", name:"Вертикальная тяга средним параллельным хватом", m:"Широчайшие · низ трапеции · бицепс", icon:"pullup", sets:4, lo:10, hi:12, w:0, step:2.5, calib:true,
        note:"Дима: выше 59 кг не брать - начинают работать руки. Тянешь лопатками, не бицепсом.",
        swap:"Тяга в хаммере с упором в грудь." },
      { id:"d2e2", name:"Тяга гантели к поясу в наклоне", m:"Широчайшие · ромбовидные · задняя дельта", icon:"pullup", sets:4, lo:10, hi:12, w:0, step:2, dumb:true, calib:true,
        note:"Упор рукой и коленом в лавку, спина прямая. Тянешь к поясу, не к плечу. Вес одной гантели.",
        swap:"Тяга в нижнем блоке одной рукой." },
      { id:"d2e3", name:"Тяга в кроссовере сидя, по одной руке", m:"Широчайшие · середина спины", icon:"pullup", sets:4, lo:12, hi:15, w:0, step:2.5, calib:true,
        note:"Сидя, тянешь к поясу. Корпус не докручивать за рукой.",
        swap:"Тяга гантели в наклоне." },
      { id:"d2e4", name:"Горизонтальная тяга средним параллельным хватом", m:"Середина трапеции · ромбовидные · широчайшие", icon:"pullup", sets:4, lo:12, hi:15, w:0, step:2.5, calib:true,
        note:"Грудь в упор, лопатки сводишь в конце движения.",
        swap:"Хаммер-тяга." },
      { id:"d2e5", name:"Задняя дельта в бабочке", m:"Задняя дельта", icon:"flye", sets:4, lo:15, hi:15, w:0, step:2.5, calib:true, sg:1,
        note:"Пек-дек задом наперёд: грудью к спинке, разводишь руки назад.",
        swap:"Face pull на верхнем блоке." },
      { id:"d2e6", name:"Разгибание на поясницу", m:"Разгибатели спины · ягодицы · бицепс бедра", icon:"rdl", sets:4, lo:15, hi:15, w:0, step:2.5, calib:true,
        note:"Гиперэкстензия. Без веса, пока не станет легко. Не переразгибаться назад в верхней точке.",
        swap:"Обратная гиперэкстензия.", sg:1 },
      { id:"d2e7", name:"Бицепс в тренажёре Скотта", m:"Бицепс, короткая головка", icon:"biceps", sets:4, lo:12, hi:15, w:0, step:2.5, calib:true, sg:2,
        note:"Локти лежат на подушке и не отрываются. Внизу руку распускать полностью.",
        swap:"Сгибания на скамье Скотта с EZ-грифом." },
      { id:"d2e8", name:"Сгибание с нижнего блока, прямая рукоять", m:"Бицепс · брахиалис", icon:"curl", sets:4, lo:12, hi:15, w:0, step:2.5, calib:true, sg:2,
        note:"Сразу после Скотта. Стоя, локти прижаты к бокам.",
        swap:"Сгибания с гантелями стоя." }
    ]
  },
  3: {
    title: "День 3 · Ноги",
    warm: "<b>Разминка Димы:</b> 2 подхода приведение + 2 подхода отведение, по 20 повторений, НЕ в отказ. Плюс велотренажёр 4 мин и колени погреть отдельно.",
    cardio: "15 мин · пульс 120-130 · после ног бери эллипс: лестница добьёт то, что ты уже убил",
    ex: [
      { id:"d3e1", name:"Присед в Смите", m:"Квадрицепс · ягодицы", icon:"legs", sets:4, lo:10, hi:12, w:0, step:5, calib:true,
        note:"Стопы чуть вперёд от грифа, спина по рельсе. Вниз до параллели бедра с полом.",
        swap:"Гакк-машина." },
      { id:"d3e2", name:"Жим двумя ногами", m:"Квадрицепс · ягодицы", icon:"legs", sets:4, lo:10, hi:12, w:0, step:5, calib:true,
        note:"Поясница прижата к спинке. Колени не сводить внутрь.",
        swap:"Гакк-машина узкой постановкой." },
      { id:"d3e3", name:"Выпады на месте с гантелями", m:"Квадрицепс · ягодицы · приводящие", icon:"legs", sets:4, lo:10, hi:12, w:0, step:2, dumb:true, calib:true,
        note:"На месте, не в шаге. Колено задней ноги почти касается пола. Вес одной гантели.",
        swap:"Болгарские выпады в Смите." },
      { id:"d3e4", name:"Разгибание сидя", m:"Квадрицепс, изоляция", icon:"legs", sets:4, lo:12, hi:15, w:0, step:2.5, calib:true,
        note:"Пауза 1 сек в верхней точке. Это добивка, не рекорд.",
        swap:"Разгибание одной ногой." },
      { id:"d3e5", name:"Голень стоя", m:"Икроножная", icon:"calf", sets:4, lo:20, hi:20, w:0, step:5, calib:true, sg:1,
        note:"Пауза 1 сек внизу, на растяжении. Дима сказал делать в сете со сгибанием сидя.",
        swap:"Носками на платформе жима ногами." },
      { id:"d3e6", name:"Сгибание ног сидя", m:"Бицепс бедра", icon:"hamstring", sets:4, lo:12, hi:15, w:0, step:2.5, calib:true, sg:1,
        note:"Дима повторы не назвал - ставлю 12-15, при случае уточни. Именно сидя: растянутая позиция даёт больше роста.",
        swap:"Сгибание лёжа." }
    ]
  },
  4: {
    title: "День 4 · Спина · Грудь",
    warm: "<b>Разминка 8-10 мин.</b> Велотренажёр 4 мин. По 10: круги руками, вращения с палкой, кошка-корова. Подводящие к вертикальной тяге: 50%×8, 75%×4.",
    cardio: "15 мин · пульс 120-130 · эллипс или лестница",
    ex: [
      { id:"d4e1", name:"Вертикальная тяга хватом чуть шире плеч", m:"Широчайшие, работа на ширину", icon:"pullup", sets:4, lo:10, hi:12, w:0, step:2.5, calib:true,
        note:"Хват чуть шире плеч, к груди, никогда за голову.",
        swap:"Подтягивания в гравитроне." },
      { id:"d4e2", name:"Горизонтальная тяга узким параллельным хватом", m:"Середина спины · широчайшие", icon:"pullup", sets:4, lo:12, hi:15, w:0, step:2.5, calib:true,
        note:"Узкая рукоять, тянешь к животу. Корпус не раскачивать.",
        swap:"Хаммер-тяга." },
      { id:"d4e3", name:"Пуловер с изогнутой рукоятью", m:"Широчайшие · низ грудной", icon:"flye", sets:4, lo:12, hi:15, w:0, step:2.5, calib:true,
        note:"Стоя у верхнего блока, руки почти прямые. Тянешь широчайшими, а не трицепсом.",
        swap:"Пуловер с гантелью лёжа." },
      { id:"d4e4", name:"Жим гантелей на скамье 15°", m:"Грудная · передняя дельта", icon:"press", sets:4, lo:8, hi:12, w:0, step:2, dumb:true, calib:true,
        note:"Почти горизонталь, наклон всего 15°. Вес одной гантели.",
        swap:"Жим в хаммере." },
      { id:"d4e5", name:"Сведение в кроссовере на низ груди", m:"Низ грудной", icon:"flye", sets:4, lo:12, hi:15, w:0, step:2.5, calib:true,
        note:"Блоки сверху, сводишь вниз-внутрь к поясу. Лёгкий наклон корпуса вперёд.",
        swap:"Бабочка / отжимания на брусьях с наклоном." }
    ]
  }
};
const SEED_DAY_NAMES = { 1:"Грудь", 2:"Спина · бицепс", 3:"Ноги", 4:"Спина · грудь" };
const PLAN_FORMAT = 1;
const SEED_PLAN = {
  v: PLAN_FORMAT, id: "plan_dima_2026_09", name: "Сплит Димы · 4 дня", rev: 1, author: null,
  days: ["1","2","3","4"].map(k => Object.assign({ key: k, short: SEED_DAY_NAMES[k] }, SEED_PROGRAM[k]))
};

/* Живая программа. renderDay, progressTip, startWorkoutFlow, persistWorkout читают
   ровно эту форму - им всё равно, откуда она пришла: из сида, кода или от тренера. */
let PROGRAM = {}, DAY_NAMES = {}, DAY_ORDER = [], PLAN = null, EX_NAMES = {};
function planValid(p){
  return !!(p && typeof p === "object" && Array.isArray(p.days) && p.days.length &&
    p.days.every(d => d && d.key != null && Array.isArray(d.ex) && d.ex.every(e => e && e.id && e.name)));
}
function applyPlan(p){
  PLAN = p;
  PROGRAM = {}; DAY_NAMES = {}; DAY_ORDER = [];
  p.days.forEach(d => {
    const k = String(d.key);
    DAY_ORDER.push(k);
    DAY_NAMES[k] = d.short || d.title || k;
    PROGRAM[k] = Object.assign({}, d, {
      ex: d.ex.map(e => Object.assign({ sets: 4, lo: 10, hi: 12, step: 2.5, icon: "press", note: "", swap: "" }, e))
    });
  });
  EX_NAMES = Object.assign({}, LEGACY_EX_NAMES);
  Object.values(SEED_PROGRAM).forEach(d => d.ex.forEach(e => { EX_NAMES[e.id] = e.name; }));   /* история с d1e1… читается всегда */
  Object.values(PROGRAM).forEach(d => d.ex.forEach(e => { EX_NAMES[e.id] = e.name; }));
  if(typeof refreshPlanCode === "function") refreshPlanCode();
}
function loadPlan(){
  const p = store.get("plan", null);
  if(planValid(p)) return p;
  /* Программы нет - пустая: шаблон выбирают в анкете или в профиле */
  const empty = planFromTemplate("own");
  store.set("plan", empty);
  return empty;
}

/* Названия упражнений из старой программы - чтобы история до сентября 2026 читалась */
const LEGACY_EX_NAMES = {
  a1:"Подтягивания прямым хватом", a2:"Хаммер-жим сидя на грудь", a3:"Махи гантелями в стороны",
  a4:"Обратная бабочка", a5:"Сгибания на бицепс", a6:"Паллоф-пресс (на сторону)",
  b1:"Жим гантелей на наклонной 30°", b2:"Тяга верхнего блока к груди", b3:"Жим в тренажёре Shoulder Press",
  b4:"Жим ногами", b5:"Махи на нижнем блоке", b6:"Face pull", b7:"Разгибания на трицепс",
  c1:"Гакк-машина", c2:"Румынская тяга с гантелями", c3:"Отжимания на брусьях",
  c4:"Хаммер-тяга с упором в грудь", c5:"Сгибание ног СИДЯ", c6:"Подъёмы на носки СТОЯ"
};

/* Следующий день сплита после последней записанной тренировки */
function nextTrainDay(){
  const sessions = store.get("sessions", []);
  for(let i = sessions.length - 1; i >= 0; i--){
    const idx = DAY_ORDER.indexOf(String(sessions[i].day));
    if(idx < 0) continue;
    /* Если сегодня уже отзанимался - показываем ТОТ день, а не следующий,
       иначе экран убегает вперёд сразу после записи. */
    return sessions[i].date === todayISO() ? DAY_ORDER[idx] : DAY_ORDER[(idx + 1) % DAY_ORDER.length];
  }
  return DAY_ORDER[0];
}

/* ═══════════ ЕДА ═══════════ */
/* Цифры сверены со справочниками 29.08.2026. Правки против первых оценок:
   жареная овощная смесь 40 → 170 (масло впитывается), яйца С1 4 шт 280 → 325,
   пельмени с майонезом 1250 → 1415, сосиски 1050 → 1065, позы 660 → 640.
   Бедро считаю БЕЗ кожи. Готовишь с кожей - будет примерно +80 ккал и +10 г жира. */
const DISHES = [
  { id:"plate",  n:"Тарелка целиком",   d:"драник 2.0 + гарнир",            ic:"potato",   k:2040, p:100, f:107, c:168 },
  { id:"dranik", n:"Драник 2.0",        d:"3 треугольника, без гарнира",    ic:"potato",   k:1610, p:88,  f:93,  c:106 },
  { id:"garnir", n:"Гарнир",            d:"хлеб, жареные овощи, капуста",   ic:"bread",    k:430,  p:12,  f:14,  c:62  },
  { id:"gainer", n:"Гейнер-коктейль",   d:"бутылка ~1000 мл на весь день",  ic:"milk",     k:1340, p:75,  f:50,  c:149, ml:1000 },
  { id:"coffee", n:"Кофе с молоком",    d:"кружка, сироп 20 мл",            ic:"milk",     k:220,  p:9,   f:7,   c:29,  quick:true },
  { id:"sos",    n:"Сосиски с лапшой",  d:"сосиски 200, макароны 100, сыр", ic:"pasta",    k:1065, p:45,  f:64,  c:74  },
  { id:"pelm",   n:"Пельмени",          d:"400 г + майонез 50",             ic:"meat",     k:1415, p:55,  f:82,  c:125 },
  { id:"pozy",   n:"Позы «Дали»",       d:"4 штуки, 300 г",                 ic:"meatball", k:640,  p:31,  f:31,  c:61  }
];

/* ═══════════ ЦЕЛИ ═══════════ */
/* По умолчанию: 3200-3500 ккал, белок от 130 г, +0,3-0,5 кг в неделю, вес 70.
   Живут в хранилище (ключ goals) - их выставляет тренер или сам человек. */
const GOALS_DEFAULT = { kcalLo:3200, kcalHi:3500, prot:130, gainLo:0.3, gainHi:0.5, weightGoal:70, weightLo:60, weightLabel:"прайм" };
let KCAL_LO, KCAL_HI, KCAL_GOAL, PROT_GOAL, GAIN_LO, GAIN_HI, W_GOAL, W_LO, W_LABEL;
function goals(){ return Object.assign({}, GOALS_DEFAULT, store.get("goals", {})); }
function applyGoals(){
  const g = goals();
  KCAL_LO = g.kcalLo; KCAL_HI = g.kcalHi; KCAL_GOAL = g.kcalLo; PROT_GOAL = g.prot;
  GAIN_LO = g.gainLo; GAIN_HI = g.gainHi; W_GOAL = g.weightGoal; W_LO = g.weightLo; W_LABEL = g.weightLabel;
}

/* Доли порции. Ключ хранится в записи, чтобы долю можно было поправить задним числом */
const FRACS = [
  { k:"third", v:1/3, t:"1/3" },
  { k:"half",  v:0.5, t:"1/2" },
  { k:"two3",  v:2/3, t:"2/3" },
  { k:"all",   v:1,   t:"всё" }
];
function fracVal(k){ const f = FRACS.find(x=>x.k===k); return f ? f.v : 1; }
function fracTxt(k){ const f = FRACS.find(x=>x.k===k); return f ? f.t : "всё"; }

/* Глотки коктейля: доля считается от миллилитров */
const SIPS = [150, 250, 350, 500];

/* Старые записи (до сентября 2026) лежали как {n,k,p} без долей и без Ж/У.
   Нормализуем на лету, чтобы история за прошлые дни не рассыпалась. */
function normEntry(e){
  return {
    id:   e.id || null,
    n:    e.n,
    base: { k: e.base ? e.base.k : e.k, p: e.base ? e.base.p : e.p,
            f: e.base ? e.base.f : (e.f || 0), c: e.base ? e.base.c : (e.c || 0) },
    frac: e.frac != null ? e.frac : 1,
    fk:   e.fk || null,
    ml:   e.ml || null
  };
}
function entryK(e){ return Math.round(e.base.k * e.frac); }
function entryP(e){ return Math.round(e.base.p * e.frac); }
function entryF(e){ return Math.round(e.base.f * e.frac); }
function entryC(e){ return Math.round(e.base.c * e.frac); }

/* ═══════════ СПИСОК ПОКУПОК ═══════════ */
/* Посчитано под неделю набора: драник-тарелка 3 раза, пельмени 2, сосиски с позами 2,
   гейнер и 2 кофе каждый день. Выходит около 3400 ккал в день. Запас 15%. */
const SHOP = [
  { g:"Картошка и овощи", ic:"potato", wk:true, items:[
    { t:"Картофель", n:"3 кг", star:true },
    { t:"Бананы", n:"10 шт", star:true },
    { t:"Овощная смесь замороженная", n:"пачка 400 г" },
    { t:"Квашеная капуста", n:"банка 500 г" }
  ]},
  { g:"Мясо и полуфабрикаты", ic:"meat", wk:true, items:[
    { t:"Куриное бедро без кости", n:"700 г", star:true },
    { t:"Пельмени", n:"1 кг" },
    { t:"Позы «Дали»", n:"упаковка 12 шт" },
    { t:"Сосиски", n:"пачка 400-500 г" }
  ]},
  { g:"Молочка", ic:"milk", wk:true, items:[
    { t:"Молоко 2,5%", n:"9 л", star:true },
    { t:"Творог 5%", n:"8 пачек по 200 г", star:true },
    { t:"Яйца С1", n:"2 десятка", star:true },
    { t:"Сыр твёрдый куском", n:"400 г" }
  ]},
  { g:"Хлеб", ic:"bread", wk:true, items:[
    { t:"Хлеб", n:"1 буханка" }
  ]},
  { g:"Сухое · раз в месяц", ic:"pasta", items:[
    { t:"Овсяные хлопья", n:"5 кг", star:true },
    { t:"Арахисовая паста", n:"1,2 кг", star:true },
    { t:"Макароны", n:"1 кг" },
    { t:"Мука", n:"пачка, если драник течёт" }
  ]},
  { g:"Масло и соусы · раз в месяц", ic:"oil", items:[
    { t:"Масло растительное", n:"1 л" },
    { t:"Майонез", n:"500 г" },
    { t:"Соль, чёрный перец", n:"по пачке" }
  ]},
  { g:"Кофе · раз в месяц", ic:"powder", items:[
    { t:"Кофе молотый", n:"1 кг" },
    { t:"Сироп для кофе", n:"2 бутылки по 750 мл" }
  ]},
  { g:"Аптечка", ic:"powder", items:[
    { t:"Креатин моногидрат", n:"банка 300 г, хватит на 2 месяца", star:true },
    { t:"Витамин D3", n:"2000 МЕ" },
    { t:"Магний", n:"вечером" }
  ]}
];

/* ═══════════ РЕЦЕПТЫ (рулетка) ═══════════ */
/* Гид ведёт по шагам, в конце спрашивает долю и пишет полный БЖУ через поле dish.
   Итальянские рецепты лежат в истории гита, вернём, когда набор закончится. */
const RECIPES = [
  { n:"Драник 2.0", dish:"dranik", k:1610, p:88, time:"45 минут, руками 25", icon:"potato", steps:[
    { i:"potato", t:"Тёрка", d:"600 г картофеля на крупной тёрке, потом в полотенце и отжать досуха в миску.", s:"Отжимай горстями в три захода, уходит около 150 мл сока. Мелкая тёрка даёт пюре, которое течёт и сереет." },
    { i:"water", t:"Крахмал", d:"Дай соку постоять 3 минуты. Воду слей, а белый осадок со дна верни в картофель.", s:"Это крахмал, он держит форму вместо муки. Без него треугольник расползётся по сковороде." },
    { i:"chicken", t:"Курица", d:"175 г бедра кубиком 1 см. Сильный огонь, <b>2-3 минуты</b> до белого снаружи, снять и остудить.", s:"Дольше не жарь: она добирает внутри драника ещё 12 минут и станет резиной." },
    { i:"egg", t:"Масса", d:"В картофель вмешать курицу, 4 яйца, 50 г сыра мелкой тёркой и чайную ложку соли. Мешать 30 секунд и сразу жарить.", s:"Соль последней: она гонит воду. Масса откровенно течёт - вмешай 2 ст. ложки муки, это плюс 100 ккал к тарелке." },
    { i:"fire", t:"Первый бок", d:"Влей половину масла, средне-сильный огонь, <b>1,5 минуты</b>. Выложи два треугольника толщиной 1,5 см, жарь <b>6 минут</b> без крышки.", s:"Пустую антипригарную сковороду не грей - тефлон выше 250°C даёт вредные пары. Готово, когда край тёмно-золотой и лопатка поддевает драник целиком." },
    { i:"cheese", t:"Переворот", d:"Перевернуть, сверху 20 г сыра, накрыть крышкой, <b>6 минут</b> на слабом.", s:"Пар доводит середину и топит сыр, низ при этом остаётся хрустким. Крышка только после переворота, иначе нижняя корка размокнет." },
    { i:"timer", t:"Второй заход", d:"Третий треугольник так же: 6 минут открытым, 6 под крышкой. Первые два держи в духовке на решётке при 120°C.", s:"На тарелке низ отпотевает и корка уходит за пять минут." }
  ]},
  { n:"Гарнир к дранику", dish:"garnir", k:430, p:12, time:"10 минут", icon:"onion", steps:[
    { i:"fire", t:"Сковорода", d:"Ложка масла, сильный огонь, <b>1,5 минуты</b>.", s:"Масло пошло рябью и бежит по дну как вода - можно кидать овощи." },
    { i:"onion", t:"Овощи", d:"125 г смеси прямо из морозилки, разровнять в один слой. Не размораживать и не накрывать.", s:"Под крышкой иней вернётся в сковороду водой - это и есть каша вместо жарки." },
    { i:"timer", t:"Жарка", d:"Первые <b>2 минуты</b> не трогать, дальше <b>5 минут</b> мешать раз в минуту. Соль за 30 секунд до конца.", s:"Готово, когда на моркови коричневые пятна, а дно сковороды сухое. Соль в начале вытянет воду и превратит жарку в тушение." },
    { i:"bread", t:"Тарелка", d:"100 г хлеба и 50 г квашеной капусты холодными, как есть. Рассол отжать.", s:"Капусту не грей: от нагрева уходит кислота и хруст." }
  ]},
  { n:"Гейнер-коктейль", dish:"gainer", k:1340, p:75, time:"10 минут", icon:"milk", steps:[
    { i:"powder", t:"Мука", d:"Смолоть 150 г хлопьев в сухом пустом стакане, <b>15 секунд</b> импульсами.", s:"Целые хлопья в молоке не разбиваются и потом скрипят на зубах." },
    { i:"milk", t:"Заливка", d:"Молоко 470 мл первым. Сверху овсяная мука, 200 г творога, 100 г банана кусками, 36 г арахисовой пасты.", s:"Молоко строго первым: оно даёт воронку и тянет сухое к ножам. Мука на дне залипает комом и мотор встаёт." },
    { i:"sparkle", t:"Взбить", d:"Минуту на максимуме. На <b>30-й секунде</b> стоп, лопаткой соскрести пасту со стенок, добить ещё 30 секунд.", s:"Мотор воет, а масса стоит - долей 50 мл молока и запусти заново." },
    { i:"powder", t:"Креатин", d:"5 г в готовый холодный коктейль, размешать ложкой. Не варить и не сыпать в горячее.", s:"В кипятке креатин переходит в креатинин, а это уже отход, не топливо. В холодном молоке держится трое суток." },
    { i:"timer", t:"Бутылка", d:"В холодильник, выпить за сутки. Вне холода не дольше <b>2 часов</b>. Перед каждым глотком встряхнуть.", s:"Через 3-4 часа овсянка наберёт воду и встанет киселём - долей 50-100 мл молока и взболтай." }
  ]},
  { n:"Сосиски с лапшой", dish:"sos", k:1065, p:45, time:"20 минут", icon:"pasta", steps:[
    { i:"pot", t:"Макароны", d:"<b>600 мл</b> воды на 100 г макарон, закипело - чайная ложка соли. Варить на минуту меньше, чем на пачке.", s:"Воды мало специально: чем её меньше, тем больше крахмала, а крахмал и есть основа соуса." },
    { i:"bacon", t:"Сосиски", d:"200 г кружками по сантиметру. Средний огонь, в один слой, <b>3 минуты</b> не трогать, перевернуть, ещё 2.", s:"Готово, когда края загнулись вверх и подрумянились. Свалишь горкой - будут тушиться в своём соку без корки." },
    { i:"cheese", t:"Соус", d:"Перед сливом зачерпни <b>полстакана</b> воды в миску, дай ей остыть 2 минуты. Разотри в ней 50 г мелко тёртого сыра до гладкого.", s:"Сыр в кипяток нельзя: выше 65°C белок сворачивается и вместо соуса выходит комок с нитками." },
    { i:"pasta", t:"Сборка", d:"Снять кастрюлю с огня, влить сырную смесь в макароны, закинуть сосиски с их жиром, мешать 20 секунд.", s:"Густо - ложка воды, жидко - ещё 10 г сыра. Ешь сразу, соус держится пока горячий." }
  ]},
  { n:"Пельмени", dish:"pelm", k:1415, p:55, time:"20 минут, руками 5", icon:"meatball", steps:[
    { i:"water", t:"Вода", d:"<b>3 л</b> воды на сильный огонь до бурного кипения, столовая ложка соли. Меньше трёх литров на пачку не бери.", s:"В малом объёме кипение сбивается, пельмени томятся в мутной воде и слипаются." },
    { i:"pot", t:"Закладка", d:"Высыпать 400 г и <b>сразу</b> один раз мягко провести ложкой по дну. Второй раз - когда вода снова закипит.", s:"Первые минуты они лежат на дне и приклеиваются. Мешать надо сразу, но мягко, иначе рвёшь тесто." },
    { i:"timer", t:"Готовность", d:"Всплыли - это старт отсчёта, а не финиш. Магазинным дай <b>5-7 минут</b> после всплытия на среднем огне.", s:"Проверка: разрежь один, фарш серый насквозь, розового сока нет." },
    { i:"oil", t:"Корочка", d:"Хочешь жареные - дай отваренным стечь минуту, сковорода на средне-сильный, ложка масла, в один слой, <b>по 1-2 минуты</b> на сторону.", s:"Мокрые пельмени стреляют маслом и не румянятся, поэтому сначала даёшь воде стечь. Майонез в тарелку, не на сковороду." }
  ]},
  { n:"Позы «Дали»", dish:"pozy", k:640, p:31, time:"30 минут, руками 5", icon:"meatball", steps:[
    { i:"pot", t:"Пар", d:"1,5 л воды в нижний ярус, довести до кипения. Решётку смазать маслом без пропусков.", s:"Ставить только в кипящий пар: на холодном старте донце размокает и прилипает." },
    { i:"oil", t:"Донца", d:"Макнуть каждую позу донцем в масло и ставить прямо из морозилки, <b>не размораживая</b>. Зазор 2 см.", s:"Прилипшее донце рвётся при съёме, и весь бульон вытекает на решётку." },
    { i:"timer", t:"Варка", d:"Крышка, средний огонь, <b>30 минут</b>. Первые 20 минут не открывать. Позы крупнее 90 г - плюс 5-10 минут.", s:"Решает не таймер, а сок: в дырке сверху он должен быть прозрачным, а тесто из матового стать гладким." },
    { i:"meat", t:"Съём", d:"Поддеть лопаткой под донце. Дать <b>минуту</b> остыть, надкусить сбоку, выпить бульон.", s:"Без паузы обваришь нёбо: бульон внутри горячее теста." }
  ]}
];

/* ═══════════ УХОД ═══════════ */
function skincareAM(powderDay){
  const steps = [];
  if(powderDay){
    steps.push({ i:"sparkle", t:"Энзимная пудра", d:"Полчайной ложки в мокрые ладони, вспенить, 40-60 секунд мягко по лицу, смыть.", s:"Сегодня день эксфолиации (2 раза в неделю). Вечером БЕЗ кислотной сыворотки" });
  } else {
    steps.push({ i:"cleanser", t:"Умывание", d:"Гель с ниацинамидом, тёплая вода. 30-60 секунд массажа, смыть.", s:"Смывает ночной жир, не сдирая барьер" });
  }
  steps.push({ i:"water", t:"Крем увлажняющий", d:"Горошина на всё лицо и шею, вбить подушечками пальцев, не растирать.", s:"Гиалуронка притягивает воду, сквалан запирает" });
  steps.push({ i:"sun", t:"SPF-стик", d:"<b>4-5 проходов</b> по каждой зоне: лоб, щёки, нос, подбородок. До лёгкого блеска.", s:"Главный шаг всего ухода. Тонкий мазок = SPF 15 вместо 50. Каждый день, и зимой тоже" });
  return steps;
}
function skincarePM(powderDay){
  const steps = [
    { i:"cleanser", t:"Умывание", d:"Гель с ниацинамидом. Смыть день: пот, SPF, грязь. 30-60 секунд." }
  ];
  if(!powderDay){
    steps.push({ i:"serum", t:"Сыворотка BHA", d:"2-3 капли на зоны с чёрными точками и жирностью: нос, лоб, подбородок. Дать впитаться минуту.", s:"Салициловая кислота растворяет пробки внутри пор" });
  }
  steps.push({ i:"moon", t:"Ночной крем", d:"Чуть больше горошины. Ночью кожа восстанавливается активнее всего.", s: powderDay ? "Сыворотку сегодня пропускаем - утром была пудра, двойная кислота = раздражение" : "Всё. Три минуты, а через месяц увидишь разницу" });
  return steps;
}
const HAIR_FLOW = [
  { i:"shower", t:"Шампунь", d:"Наносить на кожу головы, не на длину. Помассировать пальцами минуту, смыть." },
  { i:"conditioner", t:"Кондиционер", d:"По длине, кожу головы не трогать. Подержать 2-3 минуты, смыть прохладной водой.", s:"Прохладная вода закрывает чешуйки = блеск" },
  { i:"water", t:"Крем для кудрей", d:"На влажные волосы снизу вверх <b>сжимающими движениями</b>, как будто мнёшь бумагу.", s:"Это формирует завиток. Не расчёсывать после!" },
  { i:"sparkle", t:"Масло", d:"2-3 капли растереть в ладонях, пройтись по кончикам. Не корни!" }
];

/* ═══════════ ИКОНКИ ═══════════ */
function ico(name, cls){
  if(!name || !document.getElementById("i-" + name)) name = "sparkle";
  return '<svg viewBox="0 0 48 48" class="' + (cls || "") + '"><use href="#i-' + name + '"/></svg>';
}


let curDay = "1", manualDay = false;
/* Данные пользователя читаются только после входа: вызывается роутером */
function clientBoot(){
  migrateLocal();
  applyPlan(loadPlan());
  applyGoals();
  curDay = String(store.get("curDay", "1"));
  if(!PROGRAM[curDay]) curDay = DAY_ORDER[0];
  manualDay = false;
  shopOpen = store.get("shopOpen", {});
  startDate();
}



function startDate(){
  let s = store.get("startDate", null);
  if(!s){ s = todayISO(); store.set("startDate", s); }
  return s;
}
function weekNum(){
  const s = new Date(startDate()+"T12:00:00").getTime();
  const now = new Date(todayISO()+"T12:00:00").getTime();
  return Math.floor((now - s) / (7*864e5)) + 1;
}
function rirFor(w){
  if(w <= 2) return "3-4";
  if(w === 3) return "2-3";
  if(w < 8)  return "2 / 1";
  return "2 / отказ";
}
function modeFor(w){
  if(w <= 3) return "ВВОД";
  if(w === 5) return "РАЗГРУЗКА";
  if(w > 5 && (w - 5) % 6 === 0) return "РАЗГРУЗКА";
  return "РАБОТА";
}
function isPowderDay(){ const d = isoDate(todayISO()).getDay(); return d === 1 || d === 4; }

/* ═══════════ ГИД: чек-лист дня ═══════════ */
/* Времени в списке нет намеренно: режим свободный, а расписание по часам
   превращалось в вечный упрёк. Еда и тренировка считаются сами из своих
   вкладок, остальное отмечается руками. */
function gkey(iso){ return "guide_" + (iso || todayISO()); }
function gState(iso){ return store.get(gkey(iso), {}); }
function gMark(k){
  const s = gState(); s[k] = 1; store.set(gkey(), s);
  renderGuide();
}
function gToggle(k){
  const s = gState();
  if(s[k]) delete s[k]; else s[k] = 1;
  store.set(gkey(), s);
  renderGuide();
}

/* Сон за день: подъём этого дня минус отбой ПРЕДЫДУЩЕГО дня трекера.
   Отбой после полуночи лежит во вчерашнем дне (граница дня), поэтому пара
   «лёг 01:20 → встал 12:30» живёт в двух ключах и раньше не считалась никогда. */
function sleepInfo(iso){
  const all = store.get("sleep", {});
  const cur = all[iso] || {}, prev = all[isoShift(iso, -1)] || {};
  let mins = null;
  if(cur.up && prev.bed){
    const [bh,bm] = prev.bed.split(":").map(Number), [uh,um] = cur.up.split(":").map(Number);
    mins = (uh*60+um) - (bh*60+bm); if(mins < 0) mins += 1440;
  }
  return { up: cur.up || null, bed: cur.bed || null, prevBed: prev.bed || null, mins: mins };
}
function sleepTxt(mins){ return Math.floor(mins/60) + "ч " + pad(mins%60) + "м"; }

function dayFood(iso){
  const list = (store.get("food", {})[iso] || []).map(normEntry);
  return {
    k: list.reduce((a,e) => a + entryK(e), 0),
    p: list.reduce((a,e) => a + entryP(e), 0)
  };
}

function dayItems(iso){
  const st = gState(iso);
  const f = dayFood(iso);
  const ses = store.get("sessions", []).filter(s => s.date === iso);
  const sl = store.get("sleep", {})[iso] || {};
  const si = sleepInfo(iso);
  const powder = isPowderDay();
  const personal = !!cfg().personal;
  return [
    { k:"wake", n:"Подъём", done: !!(sl.up || st.wake),
      sub: sl.up ? "Встал в " + sl.up + (si.mins != null ? " · спал " + sleepTxt(si.mins) : "") : "Отметь, как встал - посчитаю сон",
      btn:"Встал", act:"markWake()" },
    { k:"am", n: powder ? "Утренний уход · день пудры" : "Утренний уход", done: !!st.am, personal:true,
      sub:"Умывание, крем, SPF. Три минуты", btn:"Начать", act:"startAM()" },
    { k:"crea", n:"Креатин 5 г", done: !!st.crea,
      sub:"Каждый день и в любое время. Пропуски сбивают насыщение мышц",
      btn:"Принял", act:"gMark('crea')" },
    { k:"food", n:"Еда", done: f.k >= KCAL_LO, auto:true,
      sub: f.k >= KCAL_LO
        ? "Съедено " + f.k + " ккал, коридор закрыт"
        : "Съедено " + f.k + " из " + KCAL_LO + ". Добрать " + (KCAL_LO - f.k),
      btn:"В еду", act:"switchView('food')" },
    { k:"prot", n:"Белок", done: f.p >= PROT_GOAL, auto:true,
      sub: f.p + " из " + PROT_GOAL + " г" + (f.p >= PROT_GOAL ? ", норма закрыта" : ". Не хватает " + (PROT_GOAL - f.p)),
      btn:"В еду", act:"switchView('food')" },
    { k:"tr", n:"Тренировка · " + (ses.length ? (DAY_NAMES[ses[0].day] || "") : DAY_NAMES[curDay]),
      done: !!(ses.length || st.tr), auto: !!ses.length,
      sub: ses.length
        ? "Записана, упражнений " + Object.keys(ses[0].ex).length
        : "Гид проведёт по упражнениям и запишет веса",
      btn:"В зал", act:"goWorkout()" },
    { k:"pm", n:"Вечерний уход", done: !!st.pm, personal:true,
      sub: powder ? "Сегодня без кислоты - утром была пудра" : "Умывание, BHA, ночной крем",
      btn:"Начать", act:"startPM()" },
    { k:"bed", n:"Отбой", done: !!(sl.bed || st.bed),
      sub: sl.bed ? "Лёг в " + sl.bed : "Отметь, как ложишься", btn:"Лёг", act:"markBed()" },
    { k:"hair", n:"Волосы", done: !!st.hair, opt:true, personal:true,
      sub:"Только после мытья. Кондиционер, крем для кудрей, масло",
      btn:"Гид", act:"startHair()" }
  ].filter(x => personal || !x.personal);
}
function dayScore(items){
  const it = items.filter(x => !x.opt);
  return { done: it.filter(x => x.done).length, total: it.length };
}

function renderGuide(){
  const iso = todayISO();
  const d = isoDate(iso);
  const names = ["ВОСКРЕСЕНЬЕ","ПОНЕДЕЛЬНИК","ВТОРНИК","СРЕДА","ЧЕТВЕРГ","ПЯТНИЦА","СУББОТА"];
  const ses = store.get("sessions", []).filter(s => s.date === iso);
  /* День сплита берём по кругу от последней тренировки, а не по дню недели */
  if(!manualDay && !ses.length){ curDay = nextTrainDay(); store.set("curDay", curDay); }

  const sch = store.get("schedule", { days: [] }), sdays = sch.days || [];
  const dow = d.getDay() === 0 ? 7 : d.getDay();
  const trainToday = !sdays.length || sdays.indexOf(dow) >= 0;
  let nextTxt = "";
  if(!trainToday && sdays.length){
    for(let i = 1; i <= 7; i++){ const nd = ((dow - 1 + i) % 7) + 1; if(sdays.indexOf(nd) >= 0){ nextTxt = " · следующая " + DOW[nd - 1]; break; } }
  }
  document.getElementById("todayCard").className = "today-card " + (ses.length || trainToday ? "iron" : "");
  document.getElementById("tcDay").textContent =
    names[d.getDay()] + " · " + pad(d.getDate()) + "." + pad(d.getMonth() + 1);
  document.getElementById("tcWhat").textContent = ses.length
    ? "Оттренирован · " + (DAY_NAMES[ses[0].day] || "")
    : (trainToday ? "Впереди · " + DAY_NAMES[curDay] : "Отдых" + nextTxt);

  const f = dayFood(iso);
  document.getElementById("tcNote").textContent = f.k >= KCAL_LO
    ? "Еда закрыта: " + f.k + " ккал, белок " + f.p + " г"
    : "Добрать ещё " + (KCAL_LO - f.k) + "-" + (KCAL_HI - f.k) + " ккал";

  const w = weekNum();
  document.getElementById("tcWeek").textContent = w;
  document.getElementById("tcRir").textContent = rirFor(w);
  document.getElementById("tcMode").textContent = modeFor(w);

  const si = sleepInfo(iso);
  document.getElementById("tcSleep").textContent = si.mins != null ? sleepTxt(si.mins) : (si.up ? "встал " + si.up : "—");

  const items = dayItems(iso);
  const sc = dayScore(items);
  let html = '<div class="ck-head"><span>Обязательное за день</span>' +
    '<b class="' + (sc.done === sc.total ? "full" : "") + '">' + sc.done + ' из ' + sc.total + '</b></div>';
  items.forEach(s => {
    const tap = s.done && !s.auto ? "gToggle('" + s.k + "')" : s.act;
    html += '<div class="tstep' + (s.done ? " done" : "") + (s.opt ? " opt" : "") + '" onclick="' + tap + '">';
    html += '<div class="dot"></div><div class="tt">';
    html += '<div class="tt-name">' + s.n + (s.opt ? ' <i>по желанию</i>' : '') + '</div>';
    html += '<div class="tt-sub">' + s.sub + '</div></div>';
    if(!s.done) html += '<div class="go">' + s.btn + '</div>';
    html += '</div>';
  });
  document.getElementById("timeline").innerHTML = html;
  renderStats();
  renderCoachNote();
}

/* История дней: те же пункты, посчитанные за прошлые даты */
function renderDays(){
  const box = document.getElementById("daysBox");
  if(!box) return;
  const names = ["вс","пн","вт","ср","чт","пт","сб"];
  const rows = [];
  for(let i = 0; i < 14; i++){
    const iso = isoShift(todayISO(), -i);
    const dt = isoDate(iso);
    const items = dayItems(iso).filter(x => !x.opt);
    const done = items.filter(x => x.done).length;
    const dots = items.map(x => '<i class="' + (x.done ? "on" : "") + '" title="' + x.n + '"></i>').join("");
    rows.push({ done: done, html: '<div class="dayrow' + (done === items.length ? " full" : "") + '">' +
      '<span class="dr-d">' + pad(dt.getDate()) + "." + pad(dt.getMonth()+1) + '</span>' +
      '<span class="dr-w">' + names[dt.getDay()] + '</span>' +
      '<span class="dr-dots">' + dots + '</span>' +
      '<span class="dr-n">' + done + '/' + items.length + '</span></div>' });
  }
  /* Обрезаем пустой хвост: на свежей установке незачем показывать две недели нулей */
  while(rows.length > 1 && rows[rows.length - 1].done === 0) rows.pop();
  const any = rows.some(x => x.done > 0);
  box.innerHTML = any ? rows.map(x => x.html).join("") : '<div class="wc-hist">Пока пусто. Отмечай пункты в Гиде - здесь появится картина по дням.</div>';
}

function markWake(){
  const sl = store.get("sleep", {});
  const now = new Date();
  const key = todayISO();
  if(!sl[key]) sl[key] = {};
  sl[key].up = pad(now.getHours()) + ":" + pad(now.getMinutes());
  store.set("sleep", sl);
  gMark("wake");
  toast("Подъём " + sl[key].up);
}
function markBed(){
  const sl = store.get("sleep", {});
  const now = new Date();
  const key = todayISO();
  if(!sl[key]) sl[key] = {};
  sl[key].bed = pad(now.getHours()) + ":" + pad(now.getMinutes());
  store.set("sleep", sl);
  gMark("bed");
  toast("Спокойной ночи");
}
function startAM(){ openFlow("Утренний уход", skincareAM(isPowderDay()), ()=>gMark("am")); }
function startPM(){ openFlow("Вечерний уход", skincarePM(isPowderDay()), ()=>gMark("pm")); }
function startHair(){ openFlow("Волосы после мытья", HAIR_FLOW, ()=>gMark("hair")); }
function goWorkout(){ switchView("gym"); }

/* ═══════════ FLOW ENGINE ═══════════ */
let flowSteps = [], flowIdx = 0, flowFinish = null, flowTitle = "", flowEl = null, restTimer = null;

function openFlow(title, steps, onFinish){
  flowTitle = title; flowSteps = steps; flowIdx = 0; flowFinish = onFinish;
  if(!steps.some(st => st.exId)) flowVals = {};
  if(flowEl) flowEl.remove();
  flowEl = document.createElement("div");
  flowEl.id = "flow";
  document.body.appendChild(flowEl);
  renderFlowStep();
}
function closeFlow(){
  if(restTimer){ clearInterval(restTimer); restTimer = null; }
  if(flowEl){ flowEl.remove(); flowEl = null; }
  setTimeout(swMaybeReload, 400);
}
function flowCollect(){
  const s = flowSteps[flowIdx];
  if(s && s.collect) s.collect();
}
function flowNext(){
  flowCollect();
  if(restTimer){ clearInterval(restTimer); restTimer = null; }
  if(flowIdx >= flowSteps.length - 1){
    // финальный экран
    flowEl.innerHTML = '<div class="fl-head"><div class="fl-title">' + flowTitle + '</div></div>' +
      '<div class="fl-body"><div class="done-burst"><svg viewBox="0 0 48 48"><use href="#i-fire"/></svg><div class="t">Сделано</div></div></div>' +
      '<div class="fl-foot"><button class="fl-next" onclick="finishFlow()">Готово</button></div>';
    return;
  }
  flowIdx++;
  renderFlowStep();
}
function finishFlow(){
  closeFlow();
  if(flowFinish) flowFinish();
}
function flowBack(){
  /* Назад тоже сохраняет введённое: раньше собирал только «Дальше», и шаг,
     с которого вернулся, терял веса и повторы */
  flowCollect();
  if(flowIdx === 0){ closeFlowAsk(); return; }
  if(restTimer){ clearInterval(restTimer); restTimer = null; }
  flowIdx--;
  renderFlowStep();
}
/* Крестик посреди тренировки с введёнными подходами - спрашиваем, иначе всё пропадает молча */
function closeFlowAsk(){
  flowCollect();
  const typed = Object.values(flowVals || {}).some(v => v && v.reps && v.reps.some(r => r > 0));
  if(typed && !confirm("Закрыть тренировку? Введённые подходы пропадут.")) return;
  closeFlow();
}
function renderFlowStep(){
  const s = flowSteps[flowIdx];
  let prog = '<div class="fl-prog">';
  flowSteps.forEach((_,i)=>{ prog += '<i class="' + (i <= flowIdx ? "on" : "") + '"></i>'; });
  prog += '</div>';
  flowEl.innerHTML =
    '<div class="fl-head"><div class="fl-title">' + flowTitle + ' · ' + (flowIdx+1) + '/' + flowSteps.length + '</div>' +
    '<button class="fl-x" onclick="closeFlowAsk()">✕</button></div>' + prog +
    '<div class="fl-body"><div class="fstep">' +
    '<div class="fs-icon">' + ico(s.i) + '</div>' +
    '<div class="fs-kicker">Шаг ' + (flowIdx+1) + '</div>' +
    '<div class="fs-title">' + s.t + '</div>' +
    '<div class="fs-text">' + s.d + '</div>' +
    (s.s ? '<div class="fs-sub">' + s.s + '</div>' : '') +
    (s.html ? '<div class="fs-html">' + s.html + '</div>' : '') +
    '</div></div>' +
    '<div class="fl-foot">' +
    '<button class="fl-back" onclick="flowBack()">' + (flowIdx === 0 ? "✕" : "←") + '</button>' +
    '<button class="fl-next" onclick="flowNext()">' + (flowIdx >= flowSteps.length-1 ? "Завершить" : "Дальше →") + '</button>' +
    '</div>';

  /* Шаблон шага строится один раз и без value, поэтому шаг назад стирал уже введённое.
     Возвращаем на место то, что успели собрать. */
  if(s.exId && flowVals[s.exId]){
    const v = flowVals[s.exId];
    const wEl = document.getElementById("fw_" + s.exId);
    if(wEl && v.w != null) wEl.value = v.w;
    (v.reps || []).forEach((r, i) => {
      const el = document.getElementById("fr_" + s.exId + "_" + i);
      if(el && r > 0) el.value = r;
    });
  }
}
function startRest(btn, sec){
  if(restTimer) clearInterval(restTimer);
  let left = sec;
  btn.disabled = true;
  restTimer = setInterval(()=>{
    left--;
    btn.textContent = "Отдых · " + Math.floor(left/60) + ":" + pad(left%60);
    if(left <= 0){
      clearInterval(restTimer); restTimer = null;
      btn.textContent = "Отдых закончен - следующий подход!";
      btn.disabled = false;
      if(navigator.vibrate) navigator.vibrate([200,100,200]);
    }
  }, 1000);
}

/* ═══════════ РЕЦЕПТЫ ═══════════ */
function cookRecipe(idx, fromSpin){
  const r = RECIPES[idx];
  const dish = r.dish ? DISHES.find(x => x.id === r.dish) : null;
  const kcal = dish ? dish.k : r.k, prot = dish ? dish.p : r.p;
  const hero = {
    i: r.icon, t: r.n,
    d: "<b>" + kcal + " ккал · " + prot + " г белка</b> · " + r.time + ".<br>Веду по шагам, как шеф. Погнали?",
    s: fromSpin ? "Не нравится - закрой и крути ещё раз" : "В конце спрошу, сколько съел"
  };
  openFlow("Готовим · " + r.n, [hero].concat(r.steps), ()=>{
    /* Блюдо есть в списке - спрашиваем долю и пишем полный БЖУ */
    if(dish){ switchView("food"); pickDish(dish.id); return; }
    const list = foodToday();
    list.push({ id:null, n:r.n, base:{ k:r.k, p:r.p, f:0, c:0 }, frac:1, fk:"all" });
    foodSet(list);
    renderFood(); renderStats();
    toast("+" + r.k + " ккал · долю поправишь в списке");
  });
}
function spinRecipe(){
  cookRecipe(Math.floor(Math.random()*RECIPES.length), true);
}


/* ═══════════ ОБМЕН ПРОГРАММОЙ ═══════════ */
/* Одна строка, три носителя: буфер, ссылка, файл. Ссылка ничего не пишет в чужое
   хранилище сама - показывает программу и ждёт «Принять». Код сжимается, если
   телефон умеет (Safari 16.4+), иначе идёт как есть. */
function b64u(bytes){ let t = ""; for(let i = 0; i < bytes.length; i++) t += String.fromCharCode(bytes[i]); return btoa(t).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
function b64d(str){
  str = str.replace(/-/g, "+").replace(/_/g, "/"); while(str.length % 4) str += "=";
  const bin = atob(str), out = new Uint8Array(bin.length);
  for(let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function planEncode(plan){
  const bytes = new TextEncoder().encode(JSON.stringify(plan));
  if(typeof CompressionStream === "function"){
    try {
      const cs = new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate"));
      return "GRZ1z." + b64u(new Uint8Array(await new Response(cs).arrayBuffer()));
    } catch(e){}
  }
  return "GRZ1." + b64u(bytes);
}
async function planDecode(code){
  code = String(code || "").trim();
  const hash = code.match(/#plan=([^&\s]+)/); if(hash) code = hash[1];
  code = code.replace(/\s+/g, "");
  const m = code.match(/^GRZ(\d+)(z?)\.([A-Za-z0-9_-]+)$/);
  if(!m) throw new Error("Это не код программы");
  if(+m[1] > PLAN_FORMAT) throw new Error("Код от новой версии - обнови приложение");
  let bytes = b64d(m[3]);
  if(m[2]){
    if(typeof DecompressionStream !== "function") throw new Error("Телефон не умеет распаковать код - попроси файл");
    const ds = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate"));
    bytes = new Uint8Array(await new Response(ds).arrayBuffer());
  }
  const plan = JSON.parse(new TextDecoder().decode(bytes));
  if(!planValid(plan)) throw new Error("Программа битая");
  return plan;
}
/* Код считаем заранее: iOS даёт писать в буфер только синхронно внутри тапа */
let planCode = "";

function sharePlanFile(){
  const name = (PLAN.name || "программа").replace(/[\\/:*?"<>|]+/g, " ").trim() + ".gryaz.json";
  const json = JSON.stringify(PLAN, null, 1);
  try {
    const f = new File([json], name, { type:"application/json" });
    if(navigator.canShare && navigator.canShare({ files:[f] })){ navigator.share({ files:[f], title: PLAN.name }).catch(()=>{}); return; }
  } catch(e){}
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([json], { type:"application/json" }));
  a.download = name; a.click();
  toast("Файл программы скачан");
}

function importPlanFile(file){
  if(!file) return;
  document.getElementById("planFile").value = "";
  const r = new FileReader();
  r.onload = e => {
    try {
      const plan = JSON.parse(e.target.result);
      if(!planValid(plan)) throw new Error();
      previewPlan(plan);
    } catch(err){ toast("Файл не похож на программу"); }
  };
  r.readAsText(file);
}
let planPending = null;
function previewPlan(plan){
  planPending = plan;
  const days = plan.days.map(d => '<div class="fitem"><span>' + esc(d.short || d.title || d.key) + '</span><span class="fi-m">' + d.ex.length + ' упр.</span></div>').join("");
  const who = plan.author && plan.author.name ? "от " + esc(plan.author.name) : "без автора";
  openSheet(
    '<div class="fracb wide" style="text-align:left;padding:12px 14px;font-size:14px">' + days + '</div>' +
    '<button class="fracb wide" onclick="acceptPlan()">Принять программу<small>текущая заменится, история тренировок останется</small></button>',
    plan.name || "Программа", plan.days.length + " дн. · " + who + (plan.rev ? " · ред. " + plan.rev : "")
  );
}
function acceptPlan(){
  const plan = planPending; planPending = null;
  if(!plan) return;
  store.set("plan", plan);
  applyPlan(plan);
  if(!PROGRAM[curDay]){ curDay = DAY_ORDER[0]; store.set("curDay", curDay); }
  manualDay = false;
  closeSheet(); renderTabs(); renderDay(); renderGuide();
  toast("Программа принята");
  if(location.hash.indexOf("plan=") >= 0) history.replaceState(null, "", location.pathname);
}
function resetPlan(){
  if(!confirm("Вернуть программу Димы из сида? Текущая программа заменится, история останется.")) return;
  planPending = JSON.parse(JSON.stringify(SEED_PLAN));
  acceptPlan();
}

/* ═══════════ ЗАЛ ═══════════ */
/* Рабочие веса лежат по id упражнения, а не по дню: упражнение может переехать
   в другой день программы, а его прогрессия должна остаться с ним. */
function lastAll(){ return store.get("lastEx", {}); }

function progressTip(ex, prev){
  if(!prev || !prev.reps || !prev.reps.length) return null;
  const reps = prev.reps.filter(r => r > 0);
  if(!reps.length) return null;
  const all = prev.reps.slice(0, ex.sets);
  const check = all.length > 1 ? all.slice(0, -1) : all;
  const hit = check.length && check.every(r => r >= ex.hi);
  if(hit){
    const nw = (prev.w || ex.w || 0) + ex.step;
    return { txt: "Все подходы на потолке → сегодня " + nw + " кг" + (ex.dumb ? " (одна гантель)" : ""), ok:true };
  }
  const stuck = prev.stuck || 0;
  if(stuck >= 3){
    const nw = Math.round(((prev.w || ex.w || 0) * 0.9) * 2) / 2;
    return { txt: "Застрял 3 тренировки → снять 10%, поставить " + nw + " кг и пройти заново", ok:false, warn:true };
  }
  return null;
}

/* Суперсет = одинаковый номер группы sg у соседних упражнений. Рамка открывается
   на первом и закрывается на последнем: удали любой элемент - div не повиснет. */
function ssOpens(list, i){ const e = list[i]; return !!(e.sg && (i === 0 || list[i-1].sg !== e.sg)); }
function ssCloses(list, i){ const e = list[i]; return !!(e.sg && (i === list.length - 1 || list[i+1].sg !== e.sg)); }
function ssPartner(list, i){
  const e = list[i]; if(!e.sg) return null;
  const n = list[i+1]; if(n && n.sg === e.sg) return n;
  return null;
}

function renderPlanBar(){
  const box = document.getElementById("planBar");
  if(!box || !PLAN) return;
  const who = PLAN.author && PLAN.author.name ? " · от " + esc(PLAN.author.name) : "";
  box.innerHTML = '<div class="pb-l" style="margin:0;display:flex;align-items:center;gap:10px"><div style="flex:1;min-width:0"><div class="pb-name">' + esc(PLAN.name || "Программа") + '</div>' +
    '<div class="pb-meta">' + DAY_ORDER.length + ' дн.' + who + '</div></div>' +
    (linkedCoach() ? '' : '<button class="pb-btn" onclick="pickTemplate()">Сменить</button>') + '</div>';
}
function renderTabs(){
  renderPlanBar();
  const box = document.getElementById("tabs");
  box.innerHTML = "";
  DAY_ORDER.forEach(k => {
    const t = document.createElement("div");
    t.className = "tab" + (k===curDay ? " active" : "");
    t.textContent = DAY_ORDER.length > 4 ? DAY_NAMES[k] : k + " · " + DAY_NAMES[k];
    t.onclick = () => { curDay = k; manualDay = true; store.set("curDay", k); renderTabs(); renderDay(); };
    box.appendChild(t);
  });
}

function renderDay(){
  const d = PROGRAM[curDay];
  const box = document.getElementById("dayBox");
  const prevAll = lastAll();
  const w = weekNum();
  const deload = modeFor(w) === "РАЗГРУЗКА";

  let html = '<div class="sec-h">' + d.title + '</div>';
  html += '<div class="warmbox">' + d.warm + '</div>';
  if(deload) html += '<div class="gate bad" style="margin-bottom:12px">РАЗГРУЗОЧНАЯ НЕДЕЛЯ. Тот же вес, подходов вдвое меньше, RIR 4-5.</div>';
  if(w <= 3) html += '<div class="gate ok" style="margin-bottom:12px">НЕДЕЛЯ ' + w + ' · ВВОД. RIR ' + rirFor(w) + '. Первая неделя - подходов на треть меньше.</div>';

  d.ex.forEach((ex, i) => {
    if(ssOpens(d.ex, i)) html += '<div class="ssblock"><div class="ss-tag">Суперсет · между ними не отдыхаешь</div>';
    const prev = prevAll[ex.id];
    const tip = progressTip(ex, prev);
    const target = ex.sets + " × " + (ex.lo === ex.hi ? ex.lo : ex.lo + "-" + ex.hi);

    html += '<div class="ex">';
    html += '<div class="ex-head"><div><div class="ex-name">' + ex.name + '</div>';
    html += '<div class="ex-target">' + target + '</div></div><div class="ex-idx">' + (i+1) + '</div></div>';
    if(ex.m) html += '<div class="ex-m">' + ex.m + '</div>';
    html += '<div class="ex-note">' + ex.note + '</div>';
    if(prev) html += '<div class="ex-last">Прошлый раз: ' + (prev.w ? prev.w + " кг · " : "") + prev.reps.filter(r=>r>0).join(" · ") + '</div>';
    if(tip) html += '<div class="ex-tip' + (tip.warn ? " warn" : "") + '">' + tip.txt + '</div>';

    const wVal = prev && prev.w != null ? prev.w : (ex.calib ? "" : (ex.w != null ? ex.w : ""));
    html += '<div class="ex-inputs">';
    html += '<div class="ex-w"><input class="cell wcell" type="number" inputmode="decimal" step="0.5" id="w_'+ex.id+'" value="'+wVal+'" placeholder="'+(ex.calib?"?":"кг")+'"></div>';
    html += '<div class="ex-reps">';
    for(let s=0; s<ex.sets; s++){
      html += '<input class="cell" type="number" inputmode="numeric" id="r_'+ex.id+'_'+s+'" placeholder="'+(s+1)+'">';
    }
    html += '</div></div>';
    html += '<div class="ex-labels"><div class="l1">' + (ex.dumb ? "КГ (ОДНА)" : "КГ") + '</div><div class="l2">ПОВТОРЫ ПО ПОДХОДАМ</div></div>';
    html += '<div class="swap"><b>Если занято:</b> ' + ex.swap + '</div>';
    html += '</div>';
    if(ssCloses(d.ex, i)) html += '</div>';
  });
  if(d.cardio) html += '<div class="cardio-row"><div class="cardio-t">Кардио</div><div class="cardio-x">' + d.cardio + '</div></div>';
  box.innerHTML = html;
}

function persistWorkout(dayKey, exVals){
  const prevAll = lastAll();
  const d = PROGRAM[dayKey] || {};
  /* Запись самодостаточна: имя упражнения и заголовок дня лежат внутри.
     История читается без программы - правка программы не переписывает прошлое. */
  const rec = { date: todayISO(), day: dayKey, week: weekNum(), title: d.title || "", plan: PLAN ? PLAN.id : null, ex: {} };
  let any = false;
  Object.keys(exVals).forEach(id => {
    const v = exVals[id];
    if(v.reps.some(r => r > 0)){
      any = true;
      rec.ex[id] = { n: EX_NAMES[id] || id, w: v.w, reps: v.reps };
      const prev = prevAll[id];
      let stuck = 0;
      if(prev && prev.w != null && v.w != null && prev.w === v.w) stuck = (prev.stuck || 0) + 1;
      prevAll[id] = { w: v.w, reps: v.reps, stuck: stuck };
    }
  });
  if(!any) return false;
  store.set("lastEx", prevAll);
  const sessions = store.get("sessions", []);
  sessions.push(rec);
  store.set("sessions", sessions);
  return true;
}

function saveDay(){
  const d = PROGRAM[curDay];
  const vals = {};
  d.ex.forEach(ex => {
    const wEl = document.getElementById("w_"+ex.id);
    const wv = wEl && wEl.value !== "" ? parseFloat(wEl.value) : null;
    const reps = [];
    for(let s=0; s<ex.sets; s++){
      const el = document.getElementById("r_"+ex.id+"_"+s);
      const v = el && el.value !== "" ? parseInt(el.value, 10) : 0;
      reps.push(isNaN(v) ? 0 : v);
    }
    vals[ex.id] = { w: wv, reps: reps };
  });
  if(persistWorkout(curDay, vals)){
    toast("Записано");
    gMark("tr");
    renderTabs(); renderDay(); renderStats();
  } else toast("Пусто - нечего писать");
}

/* Тренировка через гид */
let flowVals = {};
function startWorkoutFlow(){
  const d = PROGRAM[curDay];
  const prevAll = lastAll();
  flowVals = {};
  const steps = [];
  steps.push({ i:"fire", t:"Разминка", d: d.warm.replace(/<b>|<\/b>/g, m => m), s:"8-10 минут. Без неё связки холодные - а связки у тебя сейчас слабее мышц" });
  d.ex.forEach((ex, i) => {
    const prev = prevAll[ex.id];
    const tip = progressTip(ex, prev);
    const wVal = prev && prev.w != null ? prev.w : (ex.calib ? "" : (ex.w != null ? ex.w : ""));
    let html = '<div class="ex-inputs">';
    html += '<div class="ex-w"><input class="cell wcell" type="number" inputmode="decimal" step="0.5" id="fw_'+ex.id+'" value="'+wVal+'" placeholder="'+(ex.calib?"?":"кг")+'"></div>';
    html += '<div class="ex-reps">';
    for(let s=0; s<ex.sets; s++) html += '<input class="cell" type="number" inputmode="numeric" id="fr_'+ex.id+'_'+s+'" placeholder="'+(s+1)+'">';
    html += '</div></div>';
    html += '<div class="ex-labels"><div class="l1">' + (ex.dumb ? "КГ (ОДНА)" : "КГ") + '</div><div class="l2">ПОВТОРЫ</div></div>';
    const partner = ssPartner(d.ex, i);
    html += partner
      ? '<div class="ex-tip" style="margin-top:12px">Суперсет: без отдыха сразу «' + partner.name + '»</div>'
      : '<button class="rest-btn" onclick="startRest(this, 150)">▶ Таймер отдыха 2:30</button>';
    const target = ex.sets + " × " + (ex.lo === ex.hi ? ex.lo : ex.lo + "-" + ex.hi);
    steps.push({
      exId: ex.id,
      i: ex.icon || "press", t: ex.name,
      d: "<b>" + target + "</b>" + (ex.m ? " · чувствуй: " + ex.m : "") + ". " + ex.note,
      s: (prev ? "Прошлый раз: " + (prev.w ? prev.w + " кг · " : "") + prev.reps.filter(r=>r>0).join(" · ") + ". " : "") + (tip ? tip.txt : "") + " Если занято: " + ex.swap,
      html: html,
      collect: (function(exId, sets){
        return function(){
          const wEl = document.getElementById("fw_"+exId);
          const wv = wEl && wEl.value !== "" ? parseFloat(wEl.value) : null;
          const reps = [];
          for(let s=0; s<sets; s++){
            const el = document.getElementById("fr_"+exId+"_"+s);
            const v = el && el.value !== "" ? parseInt(el.value, 10) : 0;
            reps.push(isNaN(v) ? 0 : v);
          }
          flowVals[exId] = { w: wv, reps: reps };
        };
      })(ex.id, ex.sets)
    });
  });
  if(d.cardio) steps.push({ i:"timer", t:"Кардио", d:"<b>" + d.cardio + "</b>", s:"Последним, после железа. Пульс держи в зоне - это не гонка, это работоспособность и аппетит." });
  openFlow(d.title, steps, ()=>{
    if(persistWorkout(curDay, flowVals)){
      toast("Тренировка записана");
      gMark("tr");
      renderTabs(); renderDay(); renderStats();
    } else toast("Ничего не ввёл - не записал");
  });
}

/* ═══════════ ВЕС ═══════════ */
function renderWeight(){
  let w = store.get("weight", 63.0);
  const goal = W_GOAL, lo = W_LO;
  document.getElementById("wNow").innerHTML = kgTxt(w) + '<small> кг</small>';
  document.getElementById("wGoalTxt").textContent = goal + " кг" + (W_LABEL ? " · " + W_LABEL : "");
  document.getElementById("wScale").innerHTML = '<span>' + lo + '</span><span>' + Math.round((lo + goal) / 2) + '</span><span>' + goal + '</span>';
  let pct = Math.max(0, Math.min(100, ((w - lo)/(goal - lo))*100));
  document.getElementById("wFill").style.width = pct + "%";
  const hist = store.get("wHist", []);
  if(hist.length){
    const diff = w - hist[0].w;
    let txt = "Записей: " + hist.length;
    if(hist.length > 1) txt += " · со старта " + (diff>=0?"+":"") + diff.toFixed(1) + " кг";
    document.getElementById("wHist").textContent = txt;
  } else document.getElementById("wHist").textContent = "";

  /* недельная дельта, а не разница между соседними днями */
  const wk = weekDelta();
  const wkBox = document.getElementById("wWeek");
  if(wk){
    const kg = wk.kg;
    const cls = kg < GAIN_LO ? "slow" : (kg > GAIN_HI ? "fast" : "ok");
    const lbl = kg < GAIN_LO
      ? "в неделю. Цель " + GAIN_LO + "-" + GAIN_HI + " - добавь еды"
      : (kg > GAIN_HI ? "в неделю. Быстрее цели " + GAIN_LO + "-" + GAIN_HI + " - смотри талию" : "в неделю. Ровно в цели " + GAIN_LO + "-" + GAIN_HI);
    wkBox.innerHTML = '<span class="d ' + cls + '">' + (kg >= 0 ? "+" : "") + kg.toFixed(2).replace(".", ",") + ' кг</span>' +
      '<span class="lbl">' + lbl + (wk.mode === "trend" ? " · тренд за " + wk.days + " дн." : "") + '</span>';
  } else wkBox.innerHTML = '<span class="lbl">Взвесься ещё пару раз - посчитаю недельный темп</span>';

  /* протокол замера */
  const warn = document.getElementById("wWarn");
  const last = hist[hist.length-1];
  if(last && last.am === false){
    warn.textContent = "Последний замер сделан не утром - он несравним с остальными. Протокол: утром, натощак, без одежды, после туалета.";
    warn.classList.remove("hidden");
  } else warn.classList.add("hidden");

  renderWeightChart(hist);
}

/* Утро у тебя позднее, поэтому считаю от фактического подъёма, а не от 8:00 */
function isMorningNow(){
  const sl = store.get("sleep", {})[todayISO()] || {};
  const now = new Date();
  const mins = now.getHours()*60 + now.getMinutes();
  if(sl.up){
    const [h,m] = sl.up.split(":").map(Number);
    let diff = mins - (h*60 + m);
    if(diff < 0) diff += 1440;
    return diff <= 150;
  }
  return now.getHours() >= 6 && now.getHours() <= 14;
}

/* Недельный темп: среднее за 7 дней против среднего за предыдущие 7 */
function weekDelta(){
  const hist = store.get("wHist", []);
  if(hist.length < 2) return null;
  const DAY = 864e5;
  const t = d => new Date(d + "T12:00:00").getTime();
  const end = t(hist[hist.length-1].d);
  const win = (a, b) => hist.filter(p => t(p.d) > end - b*DAY && t(p.d) <= end - a*DAY);
  const avg = arr => arr.reduce((s,p) => s + p.w, 0) / arr.length;
  const w1 = win(0, 7), w2 = win(7, 14);
  if(w1.length && w2.length) return { kg: avg(w1) - avg(w2), mode:"avg" };
  const first = hist[0];
  const days = (end - t(first.d)) / DAY;
  if(days < 3) return null;
  return { kg: (hist[hist.length-1].w - first.w) / days * 7, mode:"trend", days: Math.round(days) };
}
function renderWeightChart(hist){
  const box = document.getElementById("wChart");
  if(!hist || hist.length < 2){ box.innerHTML = '<div class="wchart-hint">Вводи вес утром натощак - здесь появится кривая к ' + W_GOAL + '</div>'; return; }
  box.innerHTML = weightChartSvg(hist, W_GOAL, W_LABEL);
}
/* Общий график веса для приложения и кабинета. Цвета через токены темы. */
function weightChartSvg(hist, goal, label){
  const W = 340, H = 150, padL = 34, padR = 14, padT = 16, padB = 22;
  const ws = hist.map(p=>p.w), ts = hist.map(p=>new Date(p.d+"T12:00:00").getTime());
  const lo = Math.floor(Math.min(...ws, goal) - 1), hi = Math.max(Math.max(...ws) + 0.5, goal + 0.5);
  const t0 = Math.min(...ts), t1 = Math.max(...ts);
  const x = t => t1===t0 ? padL + (W-padL-padR)/2 : padL + (t-t0)/(t1-t0)*(W-padL-padR);
  const y = v => padT + (hi-v)/(hi-lo)*(H-padT-padB);
  const org = "var(--org)", dim = "var(--dim)", line = "var(--line)", gold = "var(--gold)";
  let s = '<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">';
  s += '<defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:'+org+'" stop-opacity="0.22"/><stop offset="1" style="stop-color:'+org+'" stop-opacity="0"/></linearGradient></defs>';
  const step = (hi-lo) > 6 ? 2 : 1;
  for(let v = Math.ceil(lo); v <= hi; v += step){
    const yy = y(v);
    s += '<line x1="'+padL+'" y1="'+yy+'" x2="'+(W-padR)+'" y2="'+yy+'" style="stroke:'+line+'" stroke-width="1"/>';
    s += '<text x="'+(padL-6)+'" y="'+(yy+3)+'" style="fill:'+dim+'" font-size="9" text-anchor="end" font-weight="600">'+v+'</text>';
  }
  const gy = y(goal);
  s += '<line x1="'+padL+'" y1="'+gy+'" x2="'+(W-padR)+'" y2="'+gy+'" style="stroke:'+gold+'" stroke-width="1.2" stroke-dasharray="5 4"/>';
  s += '<text x="'+(W-padR)+'" y="'+(gy-4)+'" style="fill:'+gold+'" font-size="9" text-anchor="end" font-weight="800">' + (label ? label.toUpperCase() + " " : "ЦЕЛЬ ") + goal + '</text>';
  const pts = ts.map((t,i)=> x(t).toFixed(1)+","+y(ws[i]).toFixed(1));
  const baseY = (H-padB).toFixed(1);
  s += '<polygon points="'+padL+','+baseY+' '+pts.join(" ")+' '+(W-padR)+','+baseY+'" fill="url(#ag)"/>';
  s += '<polyline points="'+pts.join(" ")+'" fill="none" style="stroke:'+org+'" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>';
  ts.forEach((t,i)=>{
    const isLast = i === ts.length-1;
    s += '<circle cx="'+x(t).toFixed(1)+'" cy="'+y(ws[i]).toFixed(1)+'" r="'+(isLast?4:2.6)+'" style="fill:'+org+'"/>';
    if(isLast){
      const lx = Math.min(x(t), W-padR-30);
      s += '<text x="'+lx+'" y="'+(y(ws[i])-9)+'" style="fill:'+org+'" font-size="11" font-weight="800" text-anchor="middle">'+ws[i].toFixed(1)+'</text>';
    }
  });
  return s + '</svg>';
}
function logWeight(d){
  let w = store.get("weight", 68.0);
  w = Math.round((w + d)*10)/10;
  store.set("weight", w); pushWeightHist(w, isMorningNow()); renderWeight();
}
function promptWeight(){
  const cur = store.get("weight", 68.0);
  const am = isMorningNow();
  if(!am && !confirm("Сейчас не утро. Замер не натощак несравним с остальными и собьёт недельный темп.\n\nВсё равно записать?")) return;
  const v = prompt("Вес: утром, натощак, без одежды, после туалета. Кг:", cur.toFixed(1));
  if(v === null) return;
  const n = parseFloat(String(v).replace(",", "."));
  if(isNaN(n) || n < 40 || n > 150){ toast("Не похоже на вес"); return; }
  const w = Math.round(n*10)/10;
  store.set("weight", w); pushWeightHist(w, am); renderWeight();
  toast(am ? "Вес записан" : "Записал, но замер не утренний");
}
function pushWeightHist(w, am){
  const hist = store.get("wHist", []);
  const today = todayISO();
  const last = hist[hist.length-1];
  if(last && last.d === today){ last.w = w; last.am = am !== false; }
  else hist.push({ d: today, w: w, am: am !== false });
  store.set("wHist", hist);
}

/* ═══════════ ЕДА ═══════════ */
function foodToday(){
  const f = store.get("food", {});
  return (f[todayISO()] || []).map(normEntry);
}
function foodSet(list){
  const f = store.get("food", {});
  f[todayISO()] = list;
  store.set("food", f);
}
function foodTotals(list){
  const t = { k:0, p:0, f:0, c:0 };
  list.forEach(e => { t.k += entryK(e); t.p += entryP(e); t.f += entryF(e); t.c += entryC(e); });
  return t;
}

/* ── запись ── */
function addDish(id, fk){
  const d = DISHES.find(x => x.id === id);
  if(!d) return;
  const list = foodToday();
  list.push({ id:d.id, n:d.n, base:{ k:d.k, p:d.p, f:d.f, c:d.c }, frac:fracVal(fk), fk:fk });
  foodSet(list); closeSheet(); renderFood(); renderStats();
  toast("+" + Math.round(d.k * fracVal(fk)) + " ккал · " + fracTxt(fk));
}
/* Коктейль копится одной строкой: бутылка стоит рядом, отпиваешь весь день */
function addSip(ml){
  const d = DISHES.find(x => x.id === "gainer");
  const list = foodToday();
  let e = list.find(x => x.id === "gainer");
  if(e){
    e.ml = Math.min(d.ml, (e.ml || 0) + ml);
    e.frac = e.ml / d.ml;
  } else {
    list.push({ id:"gainer", n:d.n, base:{ k:d.k, p:d.p, f:d.f, c:d.c }, frac:ml / d.ml, ml:ml });
    e = list[list.length - 1];
  }
  foodSet(list); closeSheet(); renderFood(); renderStats();
  toast("Коктейль: " + e.ml + " мл из " + d.ml);
}
function addQuick(id){
  const d = DISHES.find(x => x.id === id);
  if(!d) return;
  const list = foodToday();
  list.push({ id:d.id, n:d.n, base:{ k:d.k, p:d.p, f:d.f, c:d.c }, frac:1, fk:"all" });
  foodSet(list); renderFood(); renderStats();
  toast("+" + d.k + " ккал");
}
function addOther(){
  const raw = prompt("Прочее. Сколько калорий?");
  if(raw === null) return;
  const k = parseInt(raw, 10);
  if(isNaN(k) || k <= 0){ toast("Нужно число больше нуля"); return; }
  const list = foodToday();
  list.push({ id:null, n:"Прочее", base:{ k:k, p:0, f:0, c:0 }, frac:1, fk:"all" });
  foodSet(list); renderFood(); renderStats();
  toast("+" + k + " ккал");
}
function delFood(i){
  const list = foodToday();
  list.splice(i, 1);
  foodSet(list); renderFood(); renderStats();
}
function setFrac(i, fk){
  const list = foodToday();
  if(!list[i]) return;
  list[i].frac = fracVal(fk); list[i].fk = fk;
  foodSet(list); closeSheet(); renderFood(); renderStats();
  toast("Теперь " + fracTxt(fk) + " · " + entryK(list[i]) + " ккал");
}
function setSip(i, ml){
  const list = foodToday();
  const d = DISHES.find(x => x.id === "gainer");
  if(!list[i]) return;
  list[i].ml = ml; list[i].frac = ml / d.ml;
  foodSet(list); closeSheet(); renderFood(); renderStats();
  toast("Коктейль: " + ml + " мл");
}

/* ── шторка выбора доли ── */
function openSheet(html, title, sub){
  document.getElementById("sheetT").textContent = title;
  document.getElementById("sheetSub").textContent = sub;
  document.getElementById("sheetBtns").innerHTML = html;
  document.getElementById("fracSheet").classList.remove("hidden");
}
function closeSheet(e){
  if(e && e.target !== e.currentTarget) return;
  document.getElementById("fracSheet").classList.add("hidden");
}
/* Новая запись: тапнул блюдо → выбрал долю. Два тапа и всё */
function pickDish(id){
  const d = DISHES.find(x => x.id === id);
  if(!d) return;
  if(d.quick){ addQuick(id); return; }
  if(d.ml){
    const html = SIPS.map(ml => '<button class="fracb" onclick="addSip(' + ml + ')">' + ml + ' <small>мл</small></button>').join("")
      + '<button class="fracb wide" onclick="addSip(' + d.ml + ')">Выпил всю бутылку</button>';
    openSheet(html, d.n, "Сколько отпил? Строка одна на день, глотки складываются");
    return;
  }
  const html = FRACS.map(f =>
    '<button class="fracb" onclick="addDish(\'' + id + '\',\'' + f.k + '\')">' + f.t +
    '<small>' + Math.round(d.k * f.v) + ' ккал</small></button>').join("");
  openSheet(html, d.n, "Сколько съел? Целиком это " + d.k + " ккал");
}
/* Правка уже записанного: доедал в течение дня */
function editEntry(i){
  const list = foodToday();
  const e = list[i];
  if(!e) return;
  if(e.id === "gainer"){
    const d = DISHES.find(x => x.id === "gainer");
    const html = [250, 500, 750, 1000].map(ml =>
      '<button class="fracb' + (e.ml === ml ? " on" : "") + '" onclick="setSip(' + i + ',' + ml + ')">' + ml +
      '<small>' + Math.round(d.k * ml / d.ml) + ' ккал</small></button>').join("");
    openSheet(html, e.n, "Сколько выпито всего к этому моменту");
    return;
  }
  if(!e.base.k) return;
  const html = FRACS.map(f =>
    '<button class="fracb' + (e.fk === f.k ? " on" : "") + '" onclick="setFrac(' + i + ',\'' + f.k + '\')">' + f.t +
    '<small>' + Math.round(e.base.k * f.v) + ' ккал</small></button>').join("");
  openSheet(html, e.n, "Доел? Подвинь долю - пересчитаю");
}

function foodDaysInGoal(){
  const f = store.get("food", {});
  let cnt = 0;
  for(let i=0; i<7; i++){
    const key = isoShift(todayISO(), -i);
    const k = (f[key] || []).map(normEntry).reduce((a,e)=>a+entryK(e), 0);
    if(k >= KCAL_LO * 0.93) cnt++;
  }
  return cnt;
}

function renderFood(){
  const list = foodToday();
  const t = foodTotals(list);
  /* Берём ту же дату, по которой лежат записи, иначе ночью подпись убегает на день вперёд */
  const d = new Date(todayISO() + "T12:00:00");
  document.getElementById("foodDate").textContent =
    pad(d.getDate())+"."+pad(d.getMonth()+1)+" · цель " + KCAL_LO + "-" + KCAL_HI + " ккал, белок от " + PROT_GOAL + " г";

  /* главная цифра - съедено ПО ФАКТУ */
  document.getElementById("eatenK").textContent = t.k;
  document.getElementById("eatenGoal").textContent = "из " + KCAL_LO + "-" + KCAL_HI + " ккал";
  const leftLo = KCAL_LO - t.k, leftHi = KCAL_HI - t.k;
  document.getElementById("eatenLeft").textContent =
    leftLo > 0 ? "добрать ещё " + leftLo + "-" + leftHi
    : (leftHi >= 0 ? "в коридоре, можно ещё " + leftHi : "перебор " + (-leftHi) + " - не страшно");
  document.getElementById("kcalFill").style.width = Math.min(100, t.k / KCAL_HI * 100) + "%";

  document.getElementById("macros3").innerHTML =
    '<div class="m3"><div class="m3-v' + (t.p >= PROT_GOAL ? " ok" : "") + '">' + t.p + '<small> г</small></div><div class="m3-k">белок · ' + PROT_GOAL + '+</div></div>' +
    '<div class="m3"><div class="m3-v">' + t.f + '<small> г</small></div><div class="m3-k">жиры</div></div>' +
    '<div class="m3"><div class="m3-v">' + t.c + '<small> г</small></div><div class="m3-k">углеводы</div></div>';

  /* У рецептов из рулетки нет разбивки по жирам и углеводам - честно об этом говорим,
     иначе две плитки молча занижают итог */
  const noMac = list.filter(e => e.base.k > 0 && !e.base.f && !e.base.c);
  const macNote = document.getElementById("macNote");
  if(noMac.length){
    macNote.textContent = "Жиры и углеводы посчитаны без " + noMac.length +
      (noMac.length === 1 ? " записи" : " записей") + ": у рецептов есть только калории и белок. Калории учтены полностью.";
    macNote.classList.remove("hidden");
  } else macNote.classList.add("hidden");

  /* что съел */
  const fl = document.getElementById("foodList");
  fl.innerHTML = list.length
    ? list.map((e,i) => {
        const chip = e.id === "gainer" ? (e.ml || 0) + " мл" : fracTxt(e.fk);
        const full = e.id === "gainer" ? e.base.k + " ккал бутылка" : e.base.k + " ккал целиком";
        return '<div class="fitem">' +
          '<div class="fi-l"><div class="fi-n">' + e.n + '</div><div class="fi-m">' + full + '</div></div>' +
          '<div class="fi-chip" onclick="editEntry(' + i + ')">' + chip + '</div>' +
          '<div class="fi-k">' + entryK(e) + '</div>' +
          '<div class="fx" onclick="delFood(' + i + ')">×</div></div>';
      }).join("")
    : '<div class="wc-hist">Пока пусто. Жми блюдо ниже - спрошу только долю.</div>';

  /* блюда */
  document.getElementById("dishGrid").innerHTML = DISHES.map(x =>
    '<button class="fbtn" onclick="pickDish(\'' + x.id + '\')">' + ico(x.ic, "ic-lg") +
    '<b>' + x.n + '</b><small><i>' + x.k + ' ккал · Б' + x.p + ' Ж' + x.f + ' У' + x.c + '</i><br>' + x.d + '</small></button>'
  ).join("");

  const days = foodDaysInGoal();
  document.getElementById("gateBox").innerHTML = days >= 5
    ? '<div class="gate ok">ШЛЮЗ ОТКРЫТ · ' + days + ' из 7 дней в цели. Полный объём в зале.</div>'
    : '<div class="gate bad">ШЛЮЗ ЗАКРЫТ · ' + days + ' из 7 дней в цели. До 5 дней - работаешь на 2/3 объёма. Объём это награда за еду.</div>';

  document.getElementById("recGrid").innerHTML = RECIPES.map((r,i) =>
    '<button class="fbtn rec" onclick="cookRecipe('+i+')">' + ico(r.icon, "ic-lg") +
    '<b>'+r.n+'</b><small><i>'+r.k+' ккал · '+r.p+' г</i><br>'+r.time+' · '+r.steps.length+' шагов</small></button>'
  ).join("");

  document.getElementById("foodPersonal").classList.toggle("hidden", !cfg().personal);
  renderShop();
}

/* ═══════════ СПИСОК ПОКУПОК ═══════════ */
let shopOpen = {};
function shopState(){ return store.get("shop", {}); }
function shopKey(gi, ii){ return gi + "_" + ii; }
function shopToggle(gi, ii){
  const s = shopState();
  const k = shopKey(gi, ii);
  if(s[k]) delete s[k]; else s[k] = 1;
  store.set("shop", s);
  renderShop();
}
function shopFold(gi){
  shopOpen[gi] = !shopOpen[gi];
  store.set("shopOpen", shopOpen);
  renderShop();
}
function resetWeekly(){
  const s = shopState();
  SHOP.forEach((g, gi) => {
    if(g.wk) g.items.forEach((_, ii) => { delete s[shopKey(gi, ii)]; });
  });
  store.set("shop", s);
  renderShop();
  toast("Недельный список сброшен");
}
function renderShop(){
  const box = document.getElementById("shopBox");
  if(!box) return;
  const s = shopState();
  let totalDone = 0, totalAll = 0;
  let html = "";
  SHOP.forEach((g, gi) => {
    const done = g.items.filter((_, ii) => s[shopKey(gi, ii)]).length;
    totalDone += done; totalAll += g.items.length;
    const open = !!shopOpen[gi];
    html += '<div class="shop-g' + (open ? " open" : "") + '">';
    html += '<div class="shop-h" onclick="shopFold(' + gi + ')">' + ico(g.ic, "ic-lg");
    html += '<div class="nm">' + g.g + '</div>';
    if(g.wk) html += '<span class="shop-tag wk">нед</span>';
    html += '<div class="cnt' + (done === g.items.length ? " full" : "") + '">' + done + '/' + g.items.length + '</div>';
    html += '<div class="arw">›</div></div>';
    html += '<div class="shop-b">';
    g.items.forEach((it, ii) => {
      const on = !!s[shopKey(gi, ii)];
      html += '<div class="shop-i' + (on ? " on" : "") + '" onclick="shopToggle(' + gi + ',' + ii + ')">';
      html += '<div class="bx"></div><div class="tx">' + (it.star ? "<b>" + it.t + "</b>" : it.t) + '</div>';
      if(it.n) html += '<div class="nb">' + it.n + '</div>';
      html += '</div>';
    });
    html += '</div></div>';
  });
  box.innerHTML = html;
  const tot = document.getElementById("shopTotal");
  if(tot) tot.textContent = totalDone + " / " + totalAll;
}

/* ═══════════ СТАТИСТИКА / ИСТОРИЯ ═══════════ */
function renderStats(){
  const sessions = store.get("sessions", []);
  const today = todayISO();
  const weekAgo = isoShift(today, -6);
  let week = 0;
  sessions.forEach(s => { if(s.date >= weekAgo && s.date <= today) week++; });
  document.getElementById("weekN").textContent = week;
  document.getElementById("foodN").textContent = foodDaysInGoal();

  const dates = [...new Set(sessions.map(s=>s.date))].sort().reverse();
  let streak = 0;
  if(dates.length){
    let key = todayISO();
    for(let i=0; i<400; i++){
      if(dates.includes(key)) streak++;
      else if(streak > 0 || i > 2) break;
      key = isoShift(key, -1);
    }
  }
  document.getElementById("streakN").textContent = streak;
}
function sessionTitle(s){
  const t = s.title || (PROGRAM[s.day] ? PROGRAM[s.day].title : "");
  return t.split("·").slice(1).map(x => x.trim()).join(" · ") || t;
}
/* Чужой текст (имена из программы тренера) в разметку только через esc */

function renderHistory(){
  const sessions = store.get("sessions", []).slice().reverse();
  document.getElementById("hSub").textContent = "Всего тренировок: " + sessions.length + " · неделя программы " + weekNum();
  const box = document.getElementById("hList");
  if(!sessions.length){ box.innerHTML = '<div class="wchart-hint">Пока пусто. Запиши первую тренировку.</div>'; return; }
  box.innerHTML = sessions.map(s => {
    const d = new Date(s.date+"T12:00:00");
    const names = ["вс","пн","вт","ср","чт","пт","сб"];
    let rows = "";
    Object.keys(s.ex).forEach(id => {
      const e = s.ex[id];
      const wTxt = e.w != null && e.w !== "" ? e.w + " кг · " : "";
      rows += '<div class="hrow"><span class="n">'+esc(e.n || EX_NAMES[id] || id)+'</span><span class="v">'+wTxt+e.reps.filter(r=>r>0).join(" · ")+'</span></div>';
    });
    return '<div class="hcard"><div class="hcard-top"><div class="hbadge">'+s.day+'</div>'+
      '<div style="flex:1;margin-left:10px"><div class="hdate">'+pad(d.getDate())+"."+pad(d.getMonth()+1)+" · "+names[d.getDay()]+'</div>'+
      '<div class="hday">'+esc(sessionTitle(s))+(s.week?" · неделя "+s.week:"")+'</div></div></div>'+rows+'</div>';
  }).join("");
}

/* ═══════════ ФОТО ПРОГРЕССА ═══════════ */
/* Кадры лежат в IndexedDB, а не в localStorage: там лимит 5 МБ на всё,
   и пара снимков вынесла бы тренировки вместе с едой. */
const PH_MAX = 1280, PH_Q = 0.82, PH_THUMB = 260;
let phShots = [], phSel = [null, null], phActive = 1;

function phOpen(){
  return new Promise((res, rej) => {
    const r = indexedDB.open("gryaz-photos", 1);
    r.onupgradeneeded = () => {
      const db = r.result;
      if(!db.objectStoreNames.contains("shots")) db.createObjectStore("shots", { keyPath:"id" });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
function phTx(mode, fn){
  return phOpen().then(db => new Promise((res, rej) => {
    const tx = db.transaction("shots", mode);
    const req = fn(tx.objectStore("shots"));
    tx.oncomplete = () => res(req && req.result);
    tx.onerror = () => rej(tx.error);
    tx.onabort = () => rej(tx.error);
  }));
}
function phLoad(){ return phTx("readonly", st => st.getAll()); }
function phSave(rec){ return phTx("readwrite", st => st.put(rec)); }
function phDrop(id){ return phTx("readwrite", st => st.delete(id)); }

/* Сжимаем до 1280 px: iPhone отдаёт 12 Мп кадры, в них нет смысла для сравнения поз */
async function phShrink(file, max, q){
  let bmp = null;
  try { bmp = await createImageBitmap(file, { imageOrientation:"from-image" }); }
  catch(e){
    try { bmp = await createImageBitmap(file); }
    catch(e2){ bmp = null; }
  }
  if(!bmp){
    /* Старый браузер: грузим через img, он сам применяет поворот из EXIF */
    const url = URL.createObjectURL(file);
    try {
      bmp = await new Promise((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = url;
      });
    } finally { setTimeout(() => URL.revokeObjectURL(url), 5000); }
  }
  const bw = bmp.width || bmp.naturalWidth, bh = bmp.height || bmp.naturalHeight;
  const scale = Math.min(1, max / Math.max(bw, bh));
  const w = Math.round(bw * scale), h = Math.round(bh * scale);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  c.getContext("2d").drawImage(bmp, 0, 0, w, h);
  if(bmp.close) bmp.close();
  return c.toDataURL("image/jpeg", q);
}

/* Дата съёмки из EXIF. iOS при выборе из галереи отдаёт свежую копию файла
   (HEIC пережимается в JPEG), поэтому lastModified показывает момент выбора,
   а не когда снято. EXIF внутри копии сохраняется - читаем его. */
function phExifDate(file){
  return new Promise(res => {
    const r = new FileReader();
    r.onerror = () => res(null);
    r.onload = () => { try { res(phExifScan(new DataView(r.result))); } catch(e){ res(null); } };
    r.readAsArrayBuffer(file.slice(0, 256 * 1024));
  });
}
function phExifScan(v){
  if(v.byteLength < 8 || v.getUint16(0) !== 0xFFD8) return null;
  let off = 2;
  while(off + 4 <= v.byteLength){
    const marker = v.getUint16(off);
    if((marker & 0xFF00) !== 0xFF00) return null;
    if(marker === 0xFFDA) return null;
    const size = v.getUint16(off + 2);
    if(marker === 0xFFE1 && off + 10 <= v.byteLength && v.getUint32(off + 4) === 0x45786966){
      return phExifTiff(v, off + 10);
    }
    off += 2 + size;
  }
  return null;
}
function phExifTiff(v, base){
  if(base + 8 > v.byteLength) return null;
  const le = v.getUint16(base) === 0x4949;
  const u16 = o => v.getUint16(o, le);
  const u32 = o => v.getUint32(o, le);
  if(u16(base + 2) !== 0x002A) return null;
  const ascii = (o, len) => {
    let s = "";
    for(let i = 0; i < len - 1 && o + i < v.byteLength; i++) s += String.fromCharCode(v.getUint8(o + i));
    return s;
  };
  const scan = (ifd, want, isPtr) => {
    if(ifd + 2 > v.byteLength) return null;
    const n = u16(ifd);
    for(let i = 0; i < n; i++){
      const e = ifd + 2 + i * 12;
      if(e + 12 > v.byteLength) return null;
      if(u16(e) !== want) continue;
      const cnt = u32(e + 4), val = u32(e + 8);
      return isPtr ? base + val : ascii(base + val, cnt);
    }
    return null;
  };
  const ifd0 = base + u32(base + 4);
  const sub = scan(ifd0, 0x8769, true);
  let d = sub ? scan(sub, 0x9003, false) : null;
  if(!d) d = scan(ifd0, 0x0132, false);
  const m = d && String(d).match(/^(\d{4}):(\d{2}):(\d{2})/);
  if(!m) return null;
  const iso = m[1] + "-" + m[2] + "-" + m[3];
  return isNaN(new Date(iso + "T12:00:00").getTime()) ? null : iso;
}

/* Заливаешь старое фото из галереи - берём дату съёмки из файла, а не сегодняшнюю.
   Свежий кадр с камеры даст сегодняшнюю сам. */
function phFileDate(file){
  const t = file && file.lastModified;
  if(!t) return todayISO();
  const d = new Date(t);
  if(isNaN(d.getTime()) || t > Date.now() + 864e5 || t < Date.parse("2015-01-01")) return todayISO();
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}
let phPending = null;
async function phPick(file){
  if(!file) return;
  document.getElementById("phFile").value = "";
  if(!/^image\//.test(file.type)){ toast("Это не картинка"); return; }
  toast("Обрабатываю кадр");
  try {
    phPending = {
      id: Date.now(),
      date: (await phExifDate(file)) || phFileDate(file),
      img: await phShrink(file, PH_MAX, PH_Q),
      thumb: await phShrink(file, PH_THUMB, 0.7)
    };
  } catch(e){ toast("Не смог прочитать фото"); return; }
  openSheet(
    '<button class="fracb wide" onclick="phCommit(\'a\')">Контрольный кадр<small>та же комната, тот же свет, поза руки в стороны - это линейка</small></button>' +
    '<button class="fracb wide" onclick="phCommit(\'b\')">Просто фото<small>для красоты, в сравнение не пойдёт</small></button>',
    "Что за кадр?",
    "Дата кадра: " + phFmt(phPending.date) + ". Контрольные снимаются одинаково, поэтому по ним видно правду."
  );
}
function phCommit(track){
  if(!phPending) return;
  phPending.track = track;
  if(track === "a"){
    const cur = store.get("weight", 68.0);
    const v = prompt("Вес на этом кадре, кг:", cur.toFixed(1));
    if(v !== null){
      const num = parseFloat(String(v).replace(",", "."));
      if(!isNaN(num) && num >= 40 && num <= 150) phPending.w = Math.round(num * 10) / 10;
      else toast("Вес не разобрал, допишешь тапом по кадру");
    }
  }
  const rec = phPending;
  phPending = null;
  closeSheet();
  phSave(rec).then(() => {
    toast(track === "a" ? "Контрольный кадр записан" : "Кадр записан");
    return phRender();
  }).catch(() => toast("Память браузера переполнена - удали старые кадры"));
}
function phDelete(id){
  if(!confirm("Удалить этот кадр? В галерее телефона он останется.")) return;
  phDrop(id).then(() => {
    if(phSel[0] === id) phSel[0] = null;
    if(phSel[1] === id) phSel[1] = null;
    phRender();
  });
}
function phEditWeight(id){
  const s = phFind(id);
  if(!s) return;
  const v = prompt("Вес на этом кадре, кг:", s.w ? s.w.toFixed(1) : store.get("weight", 68.0).toFixed(1));
  if(v === null) return;
  const num = parseFloat(String(v).replace(",", "."));
  if(isNaN(num) || num < 40 || num > 150){ toast("Не похоже на вес"); return; }
  s.w = Math.round(num * 10) / 10;
  phSave(s).then(phRender);
}
function phEditDate(id){
  const s = phFind(id);
  if(!s) return;
  const v = prompt("Дата кадра в формате ГГГГ-ММ-ДД:", s.date);
  if(v === null) return;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(v.trim()) || isNaN(new Date(v.trim() + "T12:00:00").getTime())){
    toast("Формат: 2026-07-15"); return;
  }
  s.date = v.trim();
  phSave(s).then(phRender);
}
function phSlot(i){ phActive = i; phDraw(); }
function phTap(id){
  const other = phActive === 0 ? 1 : 0;
  /* Тапнул кадр, который уже стоит напротив - меняем слоты местами,
     иначе оба слота станут одинаковыми и сравнение исчезнет. */
  if(phSel[other] === id){
    phSel[other] = phSel[phActive];
    phSel[phActive] = id;
  } else {
    phSel[phActive] = id;
    phActive = other;
  }
  phDraw();
}

function kgTxt(n){ return n.toFixed(1).replace(".", ","); }
function phPlural(n, one, few, many){
  const a = Math.abs(n) % 100, b = a % 10;
  if(a > 10 && a < 20) return many;
  if(b > 1 && b < 5) return few;
  if(b === 1) return one;
  return many;
}
function phFmt(iso){
  const d = new Date(iso + "T12:00:00");
  const m = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];
  return d.getDate() + " " + m[d.getMonth()];
}
function phFind(id){ return phShots.find(s => s.id === id); }

function phDraw(){
  const box = document.getElementById("phCompare");
  const a = phFind(phSel[0]), b = phFind(phSel[1]);
  const slot = (s, i) => {
    const on = phActive === i ? " active" : "";
    if(!s) return '<div class="ph-slot empty' + on + '" onclick="phSlot(' + i + ')"><div class="ph-ph">' +
      (i === 0 ? "было" : "стало") + '</div></div>';
    return '<div class="ph-slot' + on + '" onclick="phSlot(' + i + ')">' +
      '<img src="' + s.img + '" alt="">' +
      '<div class="ph-cap">' +
      '<b onclick="event.stopPropagation();phEditDate(' + s.id + ')">' + phFmt(s.date) + '</b>' +
      '<span onclick="event.stopPropagation();phEditWeight(' + s.id + ')">' + (s.w ? kgTxt(s.w) + ' кг' : '+ вес') + '</span>' +
      '</div></div>';
  };
  box.innerHTML = slot(a, 0) + slot(b, 1);

  const d = document.getElementById("phDelta");
  if(a && b && a.id !== b.id){
    /* Всегда меряем от раннего кадра к позднему: иначе поставил новый слева -
       и набранные килограммы показываются как откат. */
    const early = a.date <= b.date ? a : b, late = a.date <= b.date ? b : a;
    const days = Math.round((new Date(late.date + "T12:00:00") - new Date(early.date + "T12:00:00")) / 864e5);
    const dayTxt = days + " " + phPlural(days, "день", "дня", "дней");
    let txt = dayTxt + " между кадрами";
    if(early.w && late.w){
      const dw = late.w - early.w;
      txt = '<b>' + (dw >= 0 ? "+" : "") + kgTxt(dw) + ' кг</b> за ' + dayTxt;
    }
    d.innerHTML = txt;
    d.classList.remove("hidden");
  } else d.classList.add("hidden");

  const g = document.getElementById("phGrid");
  g.innerHTML = phShots.length
    ? phShots.map(s =>
        '<div class="ph-th' + (phSel.indexOf(s.id) >= 0 ? " on" : "") + '" onclick="phTap(' + s.id + ')">' +
        '<img src="' + s.thumb + '" alt="">' +
        '<div class="ph-th-d">' + phFmt(s.date) + '</div>' +
        (s.track === "a" ? '<div class="ph-th-a">A</div>' : "") +
        '<div class="ph-th-x" onclick="event.stopPropagation();phDelete(' + s.id + ')">×</div></div>'
      ).join("")
    : '<div class="wc-hist">Пусто. Первый кадр станет точкой отсчёта.</div>';
}

function phRender(){
  return phLoad().then(list => {
    phShots = (list || []).sort((x, y) => x.date < y.date ? -1 : (x.date > y.date ? 1 : x.id - y.id));
    const ctrl = phShots.filter(s => s.track === "a");
    const pool = ctrl.length >= 2 ? ctrl : phShots;
    if(phSel[0] == null || !phFind(phSel[0])) phSel[0] = pool.length ? pool[0].id : null;
    if(phSel[1] == null || !phFind(phSel[1])) phSel[1] = pool.length ? pool[pool.length - 1].id : null;
    /* Первый снимок занимает оба слота. Появился второй - разводим их по краям. */
    if(pool.length > 1 && phSel[0] === phSel[1]){
      phSel[0] = pool[0].id;
      phSel[1] = pool[pool.length - 1].id;
    }
    document.getElementById("phCount").textContent =
      phShots.length ? phShots.length + " " + phPlural(phShots.length, "кадр", "кадра", "кадров") : "";
    phDraw();
  }).catch(() => {
    document.getElementById("phGrid").innerHTML =
      '<div class="wc-hist">Браузер не дал доступ к хранилищу фото. В приватной вкладке это нормально.</div>';
  });
}

/* Просим браузер не выбрасывать данные при нехватке места */
try { if(navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch(e){}

/* ═══════════ БЭКАП ═══════════ */
async function exportData(){
  const data = {};
  /* Сессию, владельца и служебные ключи в бэкап не кладём: токен - это ключ к аккаунту */
  const SKIP = /^(session|dataOwner|syncDirty|theme|pendingJoin|coach|coachRev)$/;
  for(let i=0; i<localStorage.length; i++){
    const k = localStorage.key(i);
    if(!SKIP.test(k)) data[k] = localStorage.getItem(k);
  }
  /* Кадры лежат в IndexedDB, поэтому кладём их в бэкап руками -
     иначе при смене телефона серия контрольных снимков остаётся на старом. */
  let photos = [];
  try { photos = (await phLoad()) || []; } catch(e){}
  const blob = new Blob([JSON.stringify({ v:4, exported: new Date().toISOString(), data:data, photos:photos }, null, 2)], { type:"application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gryaz-backup-" + todayISO() + ".json";
  a.click();
  toast(photos.length ? "Бэкап скачан, кадров внутри " + photos.length : "Бэкап скачан");
}
function importData(file){
  if(!file) return;
  const r = new FileReader();
  r.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      const data = parsed.data || parsed;
      const SKIP = /^(session|dataOwner|syncDirty|theme|pendingJoin|coach|coachRev|profile)$/;   /* анкета и вход - текущего аккаунта */
      Object.keys(data).forEach(k => { if(!SKIP.test(k)) localStorage.setItem(k, data[k]); });
      /* Всё восстановленное считается изменённым - уйдёт на сервер при следующем запуске */
      const dirty = {}; allSyncKeys().forEach(k => { dirty[k] = Date.now(); });
      localStorage.setItem("syncDirty", JSON.stringify(dirty));
      localStorage.removeItem("coachRev");
      const shots = Array.isArray(parsed.photos) ? parsed.photos : [];
      Promise.all(shots.map(s => phSave(s).catch(()=>null))).then(()=>{
        toast(shots.length ? "Восстановлено, кадров " + shots.length : "Восстановлено");
        setTimeout(()=>location.reload(), 700);
      });
    } catch(err){ toast("Файл не читается"); }
  };
  r.readAsText(file);
}


/* ═══════════ VIEWS ═══════════ */
function switchView(v){
  ["Guide","Gym","Food","History","Profile"].forEach(x=>{
    document.getElementById("view"+x).classList.toggle("hidden", v.toLowerCase() !== x.toLowerCase());
    document.getElementById("nav"+x).classList.toggle("active", v.toLowerCase() === x.toLowerCase());
  });
  if(v==="history"){ renderDays(); renderHistory(); phRender(); }
  if(v==="profile") renderProfile();
  if(v==="food") renderFood();
  if(v==="gym"){ renderTabs(); renderDay(); }
  if(v==="guide"){ renderGuide(); renderWeight(); }   /* карточка веса живёт на Гиде - без неё показывались значения из разметки */
  window.scrollTo(0,0);
}

