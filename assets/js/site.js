(function(){
  const KEY="pedstat-language";
  const COMMON={
    "Pedagogical Statistics Lab":"Лаборатория педагогической статистики",
    "Method selector":"Выбор метода","All methods":"Все методы","Study design guide":"Планирование исследования",
    "Data entry":"Ввод данных","Calculate the result":"Расчёт","Calculate":"Рассчитать","Back to selector":"К выбору метода",
    "Result":"Результат","Enter your data and select Calculate.":"Введите данные и нажмите «Рассчитать».",
    "Method note":"О методе","When to use it":"Когда применять","Conditions and limits:":"Условия и ограничения:",
    "How to interpret “effective”":"Как интерпретировать эффективность","Minimum:":"Минимум:",
    "Copy report":"Копировать отчёт","Copied.":"Скопировано.","Result Report":"Отчёт о результатах",
    "What can you conclude?":"Какой вывод допустим?","Analysis result":"Результат анализа","Input problem":"Ошибка ввода",
    "Interval":"Количественная шкала","Ordinal / interval":"Порядковая или количественная шкала",
    "Binary nominal":"Две категории","Nominal / grouped ordinal":"Номинальная или сгруппированная порядковая шкала",
    "Paired":"Связанные измерения","Independent":"Независимые наблюдения","Paired observations":"Парные наблюдения",
    "Repeated measures":"Повторные измерения","Pilot sample":"Пилотная выборка","Item scores":"Баллы по заданиям",
    "Nominal ratings":"Номинальные оценки","Two raters":"Два эксперта","Ranks":"Ранги",
    "Three or more raters":"Три эксперта и более","Proportion":"Доля","Individual / group":"Учащийся или группа",
    "Scores expressed as %":"Результаты в процентах","Paired / aggregate":"Парные или агрегированные данные",
    "Any n":"Любое количество наблюдений","5 complete cases":"5 полных наблюдений","About 4 per group":"Около 4 в каждой группе",
    "Works with very small counts":"Подходит для малых частот","Preferably ≥15 per group":"Желательно не менее 15 в каждой группе",
    "Preferably ≥30":"Желательно не менее 30","5 pairs; preferably ≥30":"5 пар, желательно не менее 30",
    "20 respondents, preferably ≥30":"20 респондентов, желательно не менее 30","About 20 rated objects":"Около 20 оцениваемых объектов",
    "3 raters × about 7 objects":"3 эксперта и около 7 объектов","Expected counts should generally be ≥5":"Ожидаемые частоты обычно не менее 5",
    "6 discordant pairs":"6 несовпадающих пар","6 non-zero pairs":"6 ненулевых пар","5 non-zero changes":"5 ненулевых изменений",
    "7 pairs; preferably ≥30":"7 пар, желательно не менее 30"
  };
  const METHOD_RU={
    "sign-test":{desc:"Проверяет, преобладают ли положительные или отрицательные изменения, не учитывая величину каждого изменения.",block:"Одна группа, измерения до и после"},
    "wilcoxon":{desc:"Проверяет изменение в связанных измерениях с учётом направления и величины различий.",block:"Одна группа, измерения до и после"},
    "paired-t":{desc:"Сравнивает среднее значение до и после у одних и тех же участников.",block:"Одна группа, измерения до и после"},
    "mcnemar":{desc:"Проверяет изменение доли бинарного результата между двумя связанными измерениями.",block:"Одна группа, измерения до и после"},
    "hake-g":{desc:"Показывает, какая доля возможного улучшения достигнута. Это описательный показатель, а не тест значимости.",block:"Одна группа, измерения до и после"},
    "bespalko":{desc:"Показывает долю правильно выполненных существенных операций. Значение Ka не менее 0,70 используется как заранее заданный порог освоения.",block:"Оценка достижения критерия"},
    "friedman":{desc:"Проверяет различия между тремя или более связанными измерениями. После значимого результата нужны попарные сравнения.",block:"Одна группа, три измерения и более"},
    "mann-whitney":{desc:"Сравнивает распределения и ранги двух независимых групп без требования нормальности.",block:"Две независимые группы"},
    "independent-t":{desc:"Сравнивает средние двух независимых групп. Вариант Уэлча не требует равенства дисперсий.",block:"Две независимые группы"},
    "fisher-exact":{desc:"Проверяет различие или связь между двумя бинарными долями с помощью точного расчёта таблицы 2 × 2.",block:"Две независимые группы"},
    "chi-square":{desc:"Проверяет связь между двумя категориальными переменными или различие категориальных распределений.",block:"Независимые категориальные данные"},
    "spearman":{desc:"Оценивает монотонную связь по рангам без требования нормальности.",block:"Связь между показателями"},
    "pearson":{desc:"Оценивает линейную связь между двумя количественными показателями и чувствителен к выбросам.",block:"Связь между показателями"},
    "cronbach-alpha":{desc:"Оценивает внутреннюю согласованность заданий теста или пунктов шкалы.",block:"Качество измерения"},
    "cohen-kappa":{desc:"Оценивает согласие двух экспертов сверх уровня случайного совпадения.",block:"Качество измерения"},
    "kendall-w":{desc:"Оценивает согласованность рангов, выставленных тремя или более экспертами одним объектам.",block:"Качество измерения"},
    "one-way-anova":{desc:"Проверяет, различается ли хотя бы одно среднее среди трёх или более независимых групп.",block:"Три независимые группы и более"}
  };
  const DESC_EN={};
  const CONDITION_RU={
    sign:"Нулевые изменения исключаются. Тест не учитывает величину изменения, поэтому при информативных числовых различиях тест Уилкоксона обычно полезнее.",
    wilcoxon:"Нужны связанные наблюдения одних и тех же участников. Нулевые различия исключаются.",
    pairedT:"Распределение разностей между измерениями должно быть приблизительно нормальным. Сильные выбросы могут заметно изменить результат.",
    mcnemar:"В расчёте используются только пары, в которых бинарный результат изменился. Точный вариант подходит для малых выборок.",
    hake:"Оба результата должны быть выражены в процентах по одной шкале. Без индивидуальных данных показатель не даёт p-значение или доверительный интервал.",
    bespalko:"Порог и перечень существенных операций задаются до анализа результата и должны иметь методическое обоснование.",
    friedman:"У каждого участника должны быть данные по всем моментам измерения. После общего значимого результата нужны дополнительные попарные тесты.",
    mannWhitney:"Группы должны состоять из разных участников. При сильно различающейся форме распределений тест нельзя интерпретировать только как сравнение медиан.",
    independentT:"Группы должны быть независимыми. При малых выборках особенно важны отсутствие сильных выбросов и приблизительная нормальность.",
    fisher:"В таблицу 2 × 2 вводятся абсолютные частоты. Отношение шансов может быть бесконечным, если одна из ячеек равна нулю.",
    chiSquare:"Ожидаемые частоты обычно должны быть не менее 5. Для малой таблицы 2 × 2 используйте точный тест Фишера.",
    spearman:"Каждая пара значений должна относиться к одному участнику или объекту. Статистическая связь не доказывает причинность.",
    pearson:"Проверьте диаграмму рассеяния и выбросы. Коэффициент Пирсона описывает только линейную связь.",
    cronbach:"Альфа показывает надёжность, но не доказывает одномерность или валидность шкалы. Объединяйте только содержательно связанные пункты.",
    kappa:"Категории задаются до оценивания. Для упорядоченных категорий предпочтительна взвешенная каппа; здесь рассчитывается невзвешенная.",
    kendallW:"Все эксперты должны ранжировать одни и те же объекты по одинаковому критерию.",
    anova:"Значимый общий тест не показывает, какие именно группы различаются. Нужны корректированные попарные сравнения и проверка предпосылок."
  };
  const FIELDS={
    "Pre-test / condition A":"До обучения или условие A","Post-test / condition B":"После обучения или условие B",
    "Before (0/1)":"До, 0 или 1","After (0/1)":"После, 0 или 1","Mean pre-test score (%)":"Средний результат до обучения, %",
    "Mean post-test score (%)":"Средний результат после обучения, %","Correct essential operations":"Правильно выполненные существенные операции",
    "Total essential operations":"Общее количество существенных операций","Repeated-measures matrix":"Матрица повторных измерений",
    "Group 1":"Группа 1","Group 2":"Группа 2","Contingency table":"Таблица сопряжённости","Indicator X":"Показатель X",
    "Indicator Y":"Показатель Y","Respondent × item matrix":"Матрица «респондент × задание»","Rater 1 labels":"Категории эксперта 1",
    "Rater 2 labels":"Категории эксперта 2","Object × rater rank matrix":"Матрица «объект × ранг эксперта»","Independent groups":"Независимые группы"
  };
  const HELP={
    "Enter one value per participant; spaces, commas or new lines are accepted. The order must match across both fields.":"Введите по одному значению для каждого участника. Допустимы пробелы, запятые и новые строки. Порядок участников в двух полях должен совпадать.",
    "Use 1 for “success/pass” and 0 for “not successful/not passed”. Participant order must match.":"Используйте 1 для успешного результата и 0 для неуспешного. Порядок участников должен совпадать.",
    "Rows = participants. Columns = measurement occasions.":"Строки – участники. Столбцы – моменты измерения.",
    "Rows = groups/categories of variable A. Columns = categories of variable B. Enter absolute counts, not percentages.":"Строки – группы или категории переменной A. Столбцы – категории переменной B. Вводите количество наблюдений, а не проценты.",
    "Rows = respondents. Columns = scored items. All rows must contain the same number of items.":"Строки – респонденты. Столбцы – задания или пункты. Во всех строках должно быть одинаковое число значений.",
    "Enter one category per line. Spelling must be consistent.":"Введите одну категорию в каждой строке. Названия одинаковых категорий должны совпадать.",
    "Rows = objects being ranked. Columns = raters. Use rank values.":"Строки – оцениваемые объекты. Столбцы – эксперты. Вводите ранги.",
    "One group per line; observations separated by spaces or commas.":"Каждая группа вводится в отдельной строке. Значения разделяются пробелами или запятыми."
  };
  const FOOTER={en:"Educational tool for planning and preliminary statistical analysis. Verify final results in a validated statistical package before high-stakes reporting.",ru:"Учебный инструмент для планирования и предварительного статистического анализа. Перед публикацией проверьте итоговые результаты в валидированном статистическом пакете."};

  function get(){return localStorage.getItem(KEY)==="ru"?"ru":"en"}
  function text(en,ru){return get()==="ru"?ru:en}
  function translateExact(value){return get()==="ru"?(COMMON[value]||FIELDS[value]||HELP[value]||value):value}
  function applyData(){
    document.documentElement.lang=get();
    document.querySelectorAll("[data-en][data-ru]").forEach(el=>{
      const value=el.dataset[get()];
      if(el.hasAttribute("data-html"))el.innerHTML=value;else el.textContent=value;
    });
    document.querySelectorAll("[data-placeholder-en][data-placeholder-ru]").forEach(el=>el.placeholder=el.dataset[get()==="ru"?"placeholderRu":"placeholderEn"]);
    document.querySelectorAll("[data-lang-btn]").forEach(btn=>btn.classList.toggle("active",btn.dataset.langBtn===get()));
    if(document.body.dataset.titleEn)document.title=get()==="ru"?document.body.dataset.titleRu:document.body.dataset.titleEn;
  }
  function addSwitch(){
    const nav=document.querySelector(".nav"); if(!nav||nav.querySelector(".lang-switch"))return;
    const box=document.createElement("div");box.className="lang-switch";
    box.innerHTML='<button type="button" data-lang-btn="en" aria-label="English">EN</button><button type="button" data-lang-btn="ru" aria-label="Русский">RU</button>';
    nav.appendChild(box);
    box.addEventListener("click",e=>{const v=e.target.dataset.langBtn;if(!v)return;localStorage.setItem(KEY,v);apply();document.dispatchEvent(new CustomEvent("languagechange"));});
  }
  function localizeCommon(){
    const brand=document.querySelector(".brand span:last-child");if(brand)brand.textContent=text("Pedagogical Statistics Lab","Лаборатория педагогической статистики");
    const links=document.querySelectorAll(".nav-links a");["Method selector","All methods","Study design guide"].forEach((v,i)=>{if(links[i])links[i].textContent=translateExact(v)});
    const footer=document.querySelector(".footer");if(footer)footer.textContent=FOOTER[get()];
  }
  function localizeMethod(){
    const calc=document.body.dataset.calc;if(!calc)return;
    document.body.classList.add("method-page");
    document.querySelectorAll(".hero .eyebrow,.hero p").forEach(el=>el.remove());
    const kickers=document.querySelectorAll(".kicker");if(kickers[0])kickers[0].textContent=translateExact("Data entry");if(kickers[1])kickers[1].textContent=translateExact("Method note");
    const mainH2=document.querySelector(".method-layout section.card h2");if(mainH2)mainH2.textContent=translateExact("Calculate the result");
    const aside=document.querySelector(".method-layout aside.card");if(aside){
      const h2=aside.querySelector("h2");if(h2)h2.textContent=translateExact("When to use it");
      const slug=location.pathname.split("/").pop().replace(".html","");
      const desc=aside.querySelector(":scope > p.muted");if(desc&&!desc.dataset.originalEn)desc.dataset.originalEn=desc.textContent;
      if(desc&&get()==="ru"&&METHOD_RU[slug])desc.textContent=METHOD_RU[slug].desc;
      if(desc&&get()==="en")desc.textContent=desc.dataset.originalEn;
      const note=aside.querySelector(".note.blue");if(note&&!note.dataset.originalEn)note.dataset.originalEn=note.innerHTML;
      if(note&&get()==="ru")note.innerHTML=`<b>Условия и ограничения:</b><br>${CONDITION_RU[calc]||"Проверьте предпосылки метода до интерпретации результата."}`;
      if(note&&get()==="en")note.innerHTML=note.dataset.originalEn;
      const h3=aside.querySelector("h3");if(h3)h3.textContent=translateExact("How to interpret “effective”");
      const ps=aside.querySelectorAll("p.muted");const caution=ps[ps.length-1];if(caution&&caution!==desc)caution.textContent=text("A statistical pattern is not automatic proof of teaching effectiveness. A causal conclusion also requires an appropriate design, comparable groups or measurements, reliable outcomes and consideration of alternative explanations.","Статистическая закономерность сама по себе не доказывает эффективность обучения. Для причинного вывода также нужны подходящий дизайн, сопоставимые группы или измерения, надёжные показатели и анализ альтернативных объяснений.");
    }
    document.querySelectorAll("label,small,.field + p.muted,.input-grid + p.muted").forEach(el=>{if(!el.dataset.originalEn)el.dataset.originalEn=el.textContent.trim();el.textContent=get()==="ru"?translateExact(el.dataset.originalEn):el.dataset.originalEn;});
    document.querySelectorAll(".badge").forEach(el=>{if(!el.dataset.originalEn)el.dataset.originalEn=el.textContent.trim();let v=el.dataset.originalEn;if(get()==="ru"){v=v.replace(/^Minimum:\s*/,"Минимум: ");v=translateExact(v);Object.keys(COMMON).forEach(k=>{v=v.replace(k,COMMON[k])});}el.textContent=v;});
    const calcBtn=document.getElementById("calculateBtn");if(calcBtn)calcBtn.textContent=translateExact("Calculate");
    const back=document.querySelector("a.btn.ghost");if(back)back.textContent=translateExact("Back to selector");
    const result=document.getElementById("result");if(result&&!result.dataset.calculated){const h=result.querySelector("h3"),m=result.querySelector(".muted");if(h)h.textContent=translateExact("Result");if(m)m.textContent=translateExact("Enter your data and select Calculate.");}
    document.querySelectorAll("th").forEach(th=>{if(!th.dataset.originalEn)th.dataset.originalEn=th.textContent.trim();const map={"Outcome = 1":"Результат = 1","Outcome = 0":"Результат = 0","Group 1":"Группа 1","Group 2":"Группа 2"};th.textContent=get()==="ru"?(map[th.dataset.originalEn]||th.dataset.originalEn):th.dataset.originalEn;});
  }
  function localizeDirectory(){
    if(!document.body.classList.contains("directory-page"))return;
    document.querySelectorAll(".method-card").forEach(card=>{const slug=card.getAttribute("href").split("/").pop().replace(".html","");const info=METHOD_RU[slug];if(!info)return;const d=card.querySelector(".muted");if(d){if(!d.dataset.originalEn)d.dataset.originalEn=d.textContent.trim();d.textContent=get()==="ru"?info.desc:d.dataset.originalEn;}const badges=card.querySelectorAll(".badge");badges.forEach(b=>{if(!b.dataset.originalEn)b.dataset.originalEn=b.textContent.trim();b.textContent=get()==="ru"?(COMMON[b.dataset.originalEn]||info.block||b.dataset.originalEn):b.dataset.originalEn;});});
  }
  function apply(){applyData();localizeCommon();localizeMethod();localizeDirectory();}
  document.addEventListener("DOMContentLoaded",()=>{addSwitch();apply();});
  window.Lang={get,text,apply,method:slug=>METHOD_RU[slug],translateExact};
})();
