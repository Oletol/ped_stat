
const METHODS = [{"slug": "sign-test", "name": "Sign Test (G)", "block": "One group, pre–post", "scale": "Ordinal / interval", "samples": "Paired", "min": "5 non-zero changes", "desc": "Tests whether positive or negative changes predominate, ignoring the size of each change.", "type": "paired", "calc": "sign"}, {"slug": "wilcoxon", "name": "Wilcoxon Signed-Rank Test", "block": "One group, pre–post", "scale": "Ordinal / interval", "samples": "Paired", "min": "6 non-zero pairs", "desc": "Tests a paired shift while taking both direction and magnitude of change into account.", "type": "paired", "calc": "wilcoxon"}, {"slug": "paired-t", "name": "Paired t-test", "block": "One group, pre–post", "scale": "Interval", "samples": "Paired", "min": "7 pairs; preferably ≥30", "desc": "Compares the mean pre–post difference. The differences should be approximately normally distributed.", "type": "paired", "calc": "pairedT"}, {"slug": "mcnemar", "name": "McNemar Exact Test", "block": "One group, pre–post", "scale": "Binary nominal", "samples": "Paired", "min": "6 discordant pairs", "desc": "Tests whether the proportion of a binary outcome changes between two paired measurements.", "type": "binarypaired", "calc": "mcnemar"}, {"slug": "hake-g", "name": "Normalized Gain (Hake g)", "block": "One group, pre–post", "scale": "Scores expressed as %", "samples": "Paired / aggregate", "min": "Any n", "desc": "Describes the proportion of the available improvement that was achieved. It is an effect indicator, not a significance test.", "type": "hake", "calc": "hake"}, {"slug": "bespalko", "name": "Bespalko Mastery Coefficient (Ka)", "block": "Criterion-referenced outcome", "scale": "Proportion", "samples": "Individual / group", "min": "Any n", "desc": "Describes mastery as the proportion of essential operations completed correctly; Ka ≥ 0.70 is treated as a mastery threshold in the supplied methodological framework.", "type": "bespalko", "calc": "bespalko"}, {"slug": "friedman", "name": "Friedman Test", "block": "One group, 3+ measurements", "scale": "Ordinal / interval", "samples": "Repeated measures", "min": "5 complete cases", "desc": "Tests whether three or more related measurements differ. A significant result requires follow-up paired comparisons.", "type": "matrix", "calc": "friedman"}, {"slug": "mann-whitney", "name": "Mann–Whitney U Test", "block": "Two independent groups", "scale": "Ordinal / interval", "samples": "Independent", "min": "About 4 per group", "desc": "Compares the distributions/ranks of two independent groups without assuming normality.", "type": "twoGroups", "calc": "mannWhitney"}, {"slug": "independent-t", "name": "Independent Samples t-test (Welch)", "block": "Two independent groups", "scale": "Interval", "samples": "Independent", "min": "Preferably ≥15 per group", "desc": "Compares group means. Welch’s version is used by default because it does not require equal variances.", "type": "twoGroups", "calc": "independentT"}, {"slug": "fisher-exact", "name": "Fisher’s Exact Test (2×2)", "block": "Two independent groups", "scale": "Binary nominal", "samples": "Independent", "min": "Works with very small counts", "desc": "Tests association/difference between two binary proportions using an exact 2×2 calculation.", "type": "fisher", "calc": "fisher"}, {"slug": "chi-square", "name": "Pearson Chi-Square Test", "block": "Independent categorical data", "scale": "Nominal / grouped ordinal", "samples": "Independent", "min": "Expected counts should generally be ≥5", "desc": "Tests whether two categorical variables are associated or whether categorical distributions differ.", "type": "matrixCounts", "calc": "chiSquare"}, {"slug": "spearman", "name": "Spearman Rank Correlation", "block": "Relationship between indicators", "scale": "Ordinal / interval", "samples": "Paired observations", "min": "5 pairs; preferably ≥30", "desc": "Measures a monotonic association without requiring normality or linearity.", "type": "pairedXY", "calc": "spearman"}, {"slug": "pearson", "name": "Pearson Correlation", "block": "Relationship between indicators", "scale": "Interval", "samples": "Paired observations", "min": "Preferably ≥30", "desc": "Measures linear association between two quantitative variables. It is sensitive to outliers.", "type": "pairedXY", "calc": "pearson"}, {"slug": "cronbach-alpha", "name": "Cronbach’s Alpha", "block": "Measurement quality", "scale": "Item scores", "samples": "Pilot sample", "min": "20 respondents, preferably ≥30", "desc": "Estimates internal consistency of a multi-item test or scale. It should be checked before the main study.", "type": "matrixItems", "calc": "cronbach"}, {"slug": "cohen-kappa", "name": "Cohen’s Kappa", "block": "Measurement quality", "scale": "Nominal ratings", "samples": "Two raters", "min": "About 20 rated objects", "desc": "Measures agreement between two raters beyond chance agreement.", "type": "labelsTwo", "calc": "kappa"}, {"slug": "kendall-w", "name": "Kendall’s W", "block": "Measurement quality", "scale": "Ranks", "samples": "Three or more raters", "min": "3 raters × about 7 objects", "desc": "Measures concordance among three or more experts who rank the same objects.", "type": "matrixRanks", "calc": "kendallW"}, {"slug": "one-way-anova", "name": "One-Way ANOVA", "block": "Three or more independent groups", "scale": "Interval", "samples": "Independent", "min": "Preferably ≥15 per group", "desc": "Tests whether at least one group mean differs across three or more independent groups.", "type": "multiGroups", "calc": "anova"}];

const METHOD_RULES = {
  "sign-test":{recommended:5, preferred:12, note:"Exact and robust for direction of paired change, but ignores change magnitude."},
  "wilcoxon":{recommended:6, preferred:15, note:"Suitable for paired ordinal/non-normal quantitative data."},
  "paired-t":{recommended:8, preferred:30, note:"Small samples require a defensible normality assumption for the paired differences."},
  "mcnemar":{recommended:6, preferred:20, note:"Power is driven by the number of discordant pairs, not simply total N."},
  "hake-g":{recommended:1, preferred:20, note:"Descriptive learning-gain index; no significance test."},
  "bespalko":{recommended:1, preferred:20, note:"Criterion-referenced threshold; no significance test."},
  "friedman":{recommended:5, preferred:15, note:"Repeated-measures omnibus test; post-hoc comparisons are needed if significant."},
  "mann-whitney":{recommended:4, preferred:15, note:"Can be used with small independent groups, but very small N limits power."},
  "independent-t":{recommended:6, preferred:20, note:"Welch's test is robust to unequal variances; normality matters more at small N."},
  "fisher-exact":{recommended:4, preferred:15, note:"Exact 2×2 method and therefore appropriate when expected counts are small."},
  "chi-square":{recommended:20, preferred:30, note:"What matters is expected cell frequency; sparse tables should use exact methods."},
  "spearman":{recommended:5, preferred:20, note:"Works with ranks and monotonic associations; small N gives wide uncertainty."},
  "pearson":{recommended:8, preferred:30, note:"Check linearity and outliers; correlation estimates are unstable in small samples."},
  "cronbach-alpha":{recommended:20, preferred:30, note:"Pilot reliability estimates are unstable in very small samples."},
  "cohen-kappa":{recommended:20, preferred:30, note:"Agreement estimates and CIs are unstable with few rated objects."},
  "kendall-w":{recommended:7, preferred:15, note:"Requires at least three raters; more objects give a more stable concordance estimate."},
  "one-way-anova":{recommended:15, preferred:25, note:"Recommendation refers roughly to observations per group; check residual assumptions."}
};

const PEDAGOGICAL_DESC={
  "sign-test":["Use pre-test and post-test scores from the same learners to ask whether more students improved than declined. The size of each change is deliberately ignored.","Используйте результаты до и после обучения одних и тех же учащихся, чтобы проверить, улучшился ли результат у большинства. Величина каждого изменения не учитывается."],
  "wilcoxon":["Compare pre-test and post-test scores, rubric levels, or other paired outcomes for the same learners when differences are non-normal or ordinal.","Сравнивайте результаты до и после обучения или уровни рубрики у тех же учащихся, если разности ненормальны либо данные порядковые."],
  "paired-t":["Compare average pre-test and post-test scores for the same learners when the paired differences are reasonably normal and free of strong outliers.","Сравнивайте средние результаты до и после обучения у тех же учащихся, если разности близки к нормальным и не имеют сильных выбросов."],
  "mcnemar":["Check whether the proportion passing, completing, or answering correctly changed for the same learners between two occasions.","Проверяйте, изменилась ли доля сдавших, завершивших курс или ответивших правильно среди тех же учащихся между двумя измерениями."],
  "hake-g":["Describe how much of the possible improvement from pre-test to post-test was achieved; use it as a learning-gain indicator, not a significance test.","Опишите, какая доля возможного улучшения достигнута между входным и итоговым тестом; это показатель прироста, а не критерий значимости."],
  "bespalko":["Assess whether a learner or group reached a predefined mastery standard based on correctly completed essential learning operations.","Оцените, достиг ли учащийся или группа заранее заданного уровня освоения по правильно выполненным существенным операциям."],
  "friedman":["Compare the same learners at three or more occasions, such as pre-test, mid-test, and post-test, when a rank-based repeated-measures method is needed.","Сравнивайте тех же учащихся в трёх и более точках, например входной, промежуточный и итоговый тест, ранговым методом повторных измерений."],
  "mann-whitney":["Compare ordinal or non-normal outcomes from two separate learner groups, such as experimental and control groups.","Сравнивайте порядковые или ненормальные результаты двух отдельных групп учащихся, например экспериментальной и контрольной."],
  "independent-t":["Compare average numerical outcomes for two separate learner groups, allowing unequal group sizes and variances.","Сравнивайте средние числовые результаты двух отдельных групп учащихся с возможным различием размеров и дисперсий."],
  "fisher-exact":["Compare a binary result such as pass/fail across two small independent learner groups using a 2 × 2 count table.","Сравнивайте бинарный результат, например зачёт/незачёт, в двух малых независимых группах по таблице частот 2 × 2."],
  "chi-square":["Examine whether educational outcome categories are distributed differently across groups, for example low/medium/high achievement by course format.","Проверьте, различается ли распределение категорий результата между группами, например низкий/средний/высокий уровень по форматам курса."],
  "spearman":["Relate two ordered or numerical indicators for the same learners, such as engagement level and post-test score, without requiring a linear relationship.","Свяжите два порядковых или числовых показателя тех же учащихся, например вовлечённость и итоговый балл, без требования линейности."],
  "pearson":["Measure a linear relationship between two numerical indicators for the same learners or responses, such as automated and expert scores.","Оцените линейную связь двух числовых показателей тех же учащихся или ответов, например автоматической и экспертной оценки."],
  "cronbach-alpha":["Check whether questionnaire or test items intended to form one educational scale produce consistent scores in a pilot sample.","Проверьте, дают ли пункты анкеты или теста, образующие одну шкалу, согласованные результаты в пилотной выборке."],
  "cohen-kappa":["Evaluate agreement beyond chance between two categorical raters, such as a human expert and an automated assessment system.","Оцените согласие сверх случайного уровня между двумя категориальными оценщиками, например экспертом и автоматической системой."],
  "kendall-w":["Evaluate how consistently three or more experts rank the same educational materials, student products, or assessment criteria.","Оцените, насколько согласованно три и более эксперта ранжируют одни и те же учебные материалы, работы или критерии."],
  "one-way-anova":["Compare average numerical outcomes across three or more separate learner groups or teaching conditions.","Сравнивайте средние числовые результаты трёх и более отдельных групп учащихся или условий обучения."]
};

function byId(id){return document.getElementById(id)}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function selected(id){return byId(id)?.value || ""}
function tt(en,ru){return window.Lang?.text(en,ru)||en}

const CHOICE_HELP={
  objective:{
    "": ["Choose the statement that best matches the main research question.","Выберите вариант, который точнее всего соответствует главному исследовательскому вопросу."],
    change:["Use this when you want to determine whether the same learners changed over time or whether separate groups have different scores, ranks or success rates.","Выберите этот вариант, если нужно определить, изменились ли результаты одних и тех же учащихся или различаются ли баллы, ранги либо доли успеха в разных группах."],
    association:["Use this when each participant or object has two indicators and you want to know whether their values tend to vary together. Association does not establish causation.","Выберите этот вариант, если для каждого участника или объекта есть два показателя и нужно определить, изменяются ли они согласованно. Связь не доказывает причинность."],
    quality:["Use this to evaluate whether items in a test work consistently or whether experts give sufficiently similar ratings. This assesses the measurement tool, not learning progress.","Выберите этот вариант, чтобы оценить согласованность заданий теста или оценок экспертов. Здесь оценивается качество измерения, а не учебный прогресс."],
    mastery:["Use this when the result is compared with a predefined mastery threshold or when improvement is expressed as the proportion of the maximum possible gain.","Выберите этот вариант, если результат сравнивается с заранее заданным порогом освоения или прирост выражается как доля максимально возможного улучшения."]
  },
  scale:{
    "":["Select the form in which the outcome is recorded.","Выберите форму, в которой записан результат."],
    binary:["Exactly two categories, such as pass and fail, yes and no, or correct and incorrect.","Ровно две категории, например зачёт и незачёт, да и нет, правильно и неправильно."],
    nominal:["Three categories or more with no natural order, such as programme type, error type or preferred activity.","Три категории или более без естественного порядка, например тип программы, вид ошибки или предпочитаемая активность."],
    ordinal:["Categories have an order, but distances between levels are not assumed equal, such as low, medium and high, rubric levels or ranks.","Категории упорядочены, но расстояния между уровнями нельзя считать равными, например низкий, средний и высокий уровень, уровни рубрики или ранги."],
    interval:["Numerical scores for which differences are meaningful, such as test points, time, accuracy or a scale total treated as quantitative.","Числовые показатели, для которых разности имеют смысл, например тестовые баллы, время, точность или суммарный балл шкалы."],
    percent:["Scores from 0 to 100 recorded before and after learning. This option supports normalized gain calculations.","Результаты от 0 до 100, полученные до и после обучения. Этот вариант позволяет рассчитать нормализованный прирост."]
  },
  design:{
    "":["Specify where the observations come from.","Укажите, откуда получены наблюдения."],
    paired2:["The same learners provide two values, usually before and after instruction. Only learners with both values count toward N.","Одни и те же учащиеся имеют два результата, обычно до и после обучения. В N учитываются только учащиеся с обоими результатами."],
    repeated3:["The same learners are measured on three occasions or more. Each row of data represents one learner.","Одни и те же учащиеся проходят три измерения или более. Каждая строка данных соответствует одному учащемуся."],
    independent2:["The groups contain different learners. No learner belongs to both groups.","Группы состоят из разных учащихся. Один учащийся не должен входить в обе группы."],
    independent3:["Three separate groups or more are compared. Enter the size of the smallest group in Step 5.","Сравниваются три отдельные группы или более. На шаге 5 укажите размер наименьшей группы."],
    items:["Each respondent answers several test items or questionnaire statements. Rows are respondents and columns are items.","Каждый респондент выполняет несколько заданий теста или отвечает на несколько пунктов анкеты. Строки – респонденты, столбцы – пункты."],
    twoRaters:["Two experts independently assign categories to the same learners, responses or products.","Два эксперта независимо присваивают категории одним и тем же учащимся, ответам или работам."],
    multiRaters:["Three experts or more rank the same set of objects using one shared criterion.","Три эксперта или более ранжируют один и тот же набор объектов по общему критерию."]
  },
  normality:{
    "":["Choose this when normality has not been assessed or is irrelevant for categorical data.","Выберите этот вариант, если нормальность не проверялась или неприменима к категориальным данным."],
    yes:["Use this only when the relevant values are reasonably symmetric and do not contain strong outliers. For paired tests, assess the differences.","Выберите этот вариант, если соответствующие значения достаточно симметричны и не содержат сильных выбросов. Для связанных тестов оценивайте разности."],
    no:["Use this for clearly skewed data, strong outliers, doubtful assumptions or small samples without evidence of normality.","Выберите этот вариант при выраженной асимметрии, сильных выбросах, сомнительных предпосылках или малой выборке без подтверждения нормальности."]
  }
};

function updateChoiceHelp(){
  ["objective","scale","design","normality"].forEach(id=>{
    const pair=CHOICE_HELP[id][selected(id)]||CHOICE_HELP[id][""];
    const el=byId(id+"Help");if(el)el.textContent=tt(pair[0],pair[1]);
  });
}

function inferDesignQuestions(){
  const objective=selected("objective");
  const design=byId("design");
  if(!design) return;
  const all=[...design.options];
  all.forEach(o=>o.hidden=false);
  if(objective==="quality"){
    all.forEach(o=>o.hidden=!["","items","twoRaters","multiRaters"].includes(o.value));
  }else if(objective==="association"){
    all.forEach(o=>o.hidden=!["","independent2","items"].includes(o.value));
  }else if(objective==="mastery"){
    all.forEach(o=>o.hidden=!["","paired2"].includes(o.value));
  }else{
    all.forEach(o=>o.hidden=false);
  }
  if(design.selectedOptions[0]?.hidden) design.value="";
}

function sampleDiagnostic(slug,n,design){
  const r=METHOD_RULES[slug];
  if(!r || !n) return {cls:"",text:tt("Enter the sample size to check whether the estimate may be unstable.","Укажите размер выборки, чтобы проверить возможную нестабильность оценки.")};
  let effectiveN=n;
  if(slug==="one-way-anova" && design==="independent3") effectiveN=n;
  if(effectiveN<r.recommended) return {cls:"bad",text:tt(`N = ${n} is below the minimum used by this teaching tool. Collect more observations or consider an exact or nonparametric alternative when appropriate.`, `N = ${n} меньше минимума, принятого в этом учебном инструменте. Увеличьте выборку или при необходимости рассмотрите точный либо непараметрический метод.`)};
  if(effectiveN<r.preferred) return {cls:"warn",text:tt(`N = ${n} can be analysed with caution, but statistical power may be low and confidence intervals may be wide.`, `N = ${n} можно анализировать с осторожностью, однако статистическая мощность может быть низкой, а доверительные интервалы – широкими.`)};
  return {cls:"ok",text:tt(`N = ${n} is not automatically problematic. Assumptions, missing data and study quality still require review.`, `N = ${n} само по себе не вызывает явной проблемы. Необходимо также проверить предпосылки, пропущенные данные и качество исследования.`)};
}

function recommend(){
  inferDesignQuestions();
  const objective=selected("objective"), scale=selected("scale"), design=selected("design");
  const normal=selected("normality"), n=Number(selected("sampleSize")||0);
  let slugs=[], rationale=[];
  if(objective==="change"){
    rationale.push(tt("The aim is to compare outcomes.","Цель – сравнить результаты."));
    if(design==="paired2"){
      rationale.push(tt("The same participants are measured twice, so the observations are paired.","Одни и те же участники измеряются дважды, поэтому наблюдения являются связанными."));
      if(scale==="binary") slugs=["mcnemar"];
      else if(scale==="percent") slugs=["wilcoxon","paired-t","hake-g"];
      else if(scale==="ordinal") slugs=["wilcoxon","sign-test"];
      else if(scale==="interval") slugs=normal==="yes"?["paired-t","wilcoxon"]:["wilcoxon","paired-t","sign-test"];
    } else if(design==="repeated3"){
      rationale.push(tt("The same participants provide three measurements or more.","Одни и те же участники имеют три измерения или более."));
      if(["ordinal","interval"].includes(scale)) slugs=["friedman"];
    } else if(design==="independent2"){
      rationale.push(tt("The groups contain different participants.","Группы состоят из разных участников."));
      if(scale==="binary") slugs=["fisher-exact","chi-square"];
      else if(scale==="ordinal") slugs=["mann-whitney"];
      else if(scale==="interval") slugs=normal==="yes"?["independent-t","mann-whitney"]:["mann-whitney","independent-t"];
    } else if(design==="independent3"){
      rationale.push(tt("Three independent groups or more are compared.","Сравниваются три независимые группы или более."));
      if(scale==="interval") slugs=["one-way-anova"];
      else if(["nominal","binary","ordinal"].includes(scale)) slugs=["chi-square"];
    }
  } else if(objective==="association"){
    rationale.push(tt("The aim is to assess an association between indicators.","Цель – оценить связь между показателями."));
    if(["nominal","binary"].includes(scale)) slugs=["chi-square","fisher-exact"];
    else if(scale==="ordinal") slugs=["spearman"];
    else if(scale==="interval") slugs=normal==="yes"?["pearson","spearman"]:["spearman","pearson"];
  } else if(objective==="quality"){
    rationale.push(tt("The aim is to assess the reliability of an instrument or expert ratings.","Цель – оценить надёжность инструмента или экспертных оценок."));
    if(design==="items") slugs=["cronbach-alpha"];
    else if(design==="twoRaters") slugs=["cohen-kappa"];
    else if(design==="multiRaters") slugs=["kendall-w"];
  } else if(objective==="mastery"){
    rationale.push(tt("The aim is to assess a predefined standard or learning gain.","Цель – оценить достижение заданного стандарта или учебный прирост."));
    slugs=["bespalko","hake-g"];
  }

  renderSummary(objective,scale,design,normal,n,rationale);
  renderRecs(slugs,n,design);
  updateProgress();
}
function renderSummary(objective,scale,design,normal,n,rationale){
  const box=byId("selectorSummary");
  if(!box) return;
  const label=id=>byId(id)?.selectedOptions[0]?.text || tt("Not selected","Не выбрано");
  box.innerHTML=`<div class="selector-summary">
    <div class="metric">${tt("Purpose","Цель")}<b>${esc(label("objective"))}</b></div>
    <div class="metric">${tt("Data","Данные")}<b>${esc(label("scale"))}</b></div>
    <div class="metric">${tt("Design","Дизайн")}<b>${esc(label("design"))}</b></div>
    <div class="metric">${tt("Sample size","Размер выборки")}<b>${n||tt("Not entered","Не указан")}</b></div>
  </div><div class="note blue"><b>${tt("Selection logic:","Логика выбора:")}</b> ${esc(rationale.join(" ")) || tt("Complete the form to generate the explanation.","Заполните форму, чтобы получить объяснение.")}</div>`;
}
function renderRecs(slugs,n,design){
  const box=byId("recommendations");
  if(!slugs.length){
    box.innerHTML=`<div class="note">${tt("No calculator matches all selected conditions. Check the purpose, data type and design.","Ни один калькулятор не соответствует всем выбранным условиям. Проверьте цель, тип данных и дизайн.")}</div>`;return;
  }
  box.innerHTML=slugs.map((slug,idx)=>{
    const m=METHODS.find(x=>x.slug===slug),d=sampleDiagnostic(slug,n,design);
    const ru=window.Lang?.method(slug);
    const desc=PEDAGOGICAL_DESC[slug]?.[window.Lang?.get()==="ru"?1:0]||(window.Lang?.get()==="ru"&&ru?ru.desc:m.desc);
    const name=window.Lang?.get()==="ru"&&ru?ru.name:m.name;
    return `<div class="rec"><div><h3>${idx===0?tt("Recommended: ","Рекомендуется: "):tt("Alternative: ","Альтернатива: ")}${esc(name)}</h3><div class="muted">${esc(desc)}</div><div class="diagnostic ${d.cls}"><b>${tt("Sample check:","Проверка выборки:")}</b> ${esc(d.text)}</div></div><a class="btn primary" href="methods/${m.slug}.html">${tt("Open calculator","Открыть калькулятор")}</a></div>`
  }).join("");
}
function updateProgress(){
  const ids=["objective","scale","design","normality","sampleSize"];
  const vals=ids.map(id=>byId(id)?.value),done=vals.filter(Boolean).length;
  const stepCount=byId("stepCount");if(stepCount)stepCount.textContent=`${done} / 5`;
  document.querySelectorAll(".tree-question").forEach((el,i)=>el.classList.toggle("complete",Boolean(vals[i])));
  const questions=[...document.querySelectorAll(".tree-question")],firstIncomplete=vals.findIndex(v=>!v),activeIndex=firstIncomplete<0?questions.length-1:firstIncomplete;
  questions.forEach((el,i)=>el.classList.toggle("active",i===activeIndex));
  ids.forEach((id,i)=>{
    const item=document.querySelector(`[data-snapshot="${id}"]`);if(!item)return;
    const value=byId(id)?.value;item.classList.toggle("done",Boolean(value));
    const small=item.querySelector("small");if(!small)return;
    if(id==="sampleSize") small.textContent=value?tt(`n = ${value} usable`,`n = ${value}, полные данные`):tt("Not entered","Не указана");
    else small.textContent=value?(byId(id)?.selectedOptions?.[0]?.text||value):tt(i===3?"Not assessed":"Not selected",i===3?"Не оценены":"Не выбрано");
  });
  updateEvidenceGuide();
}

function updateEvidenceGuide(activeOverride){
  const box=byId("activeExplanation");if(!box)return;
  const ids=["objective","scale","design","normality"],active=activeOverride||ids.find(id=>!selected(id))||"sampleSize";
  const copy={
    objective:["Start with the research purpose","Choose whether you are studying change, association, measurement quality, or mastery. This prevents a calculator from answering a different question.","Начните с цели исследования","Определите, изучаете ли вы изменение, связь, качество измерения или освоение. Так калькулятор не будет отвечать на другой вопрос."],
    scale:["Name the outcome type","A score, rank, category, and pass/fail result require different methods even when they come from the same course.","Определите тип результата","Баллы, ранги, категории и результат зачёт/незачёт требуют разных методов, даже если получены в одном курсе."],
    design:["Identify who is being compared","The same learners measured twice produce paired data. Experimental and control groups normally produce independent data. Mixing these structures invalidates the result.","Определите, кого сравнивают","Два измерения тех же учащихся дают связанные данные. Экспериментальная и контрольная группы обычно независимы. Смешение структур делает результат неверным."],
    normality:["Check the relevant distribution","For pre–post studies, inspect each learner’s change—not the pre-test and post-test columns separately. Strong outliers can change the recommended method.","Проверьте нужное распределение","В исследовании до/после оценивайте изменение каждого учащегося, а не столбцы по отдельности. Сильные выбросы могут изменить рекомендацию."],
    sampleSize:["Count usable observations","Count complete pairs for repeated measurements, the smallest group for independent comparisons, respondents for a scale, or rated objects for agreement.","Посчитайте полные наблюдения","Считайте полные пары для повторных измерений, наименьшую группу для независимого сравнения, респондентов для шкалы или оценённые объекты для согласия."]
  }[active];
  box.innerHTML=`<b>${esc(tt(copy[0],copy[2]))}</b><p>${esc(tt(copy[1],copy[3]))}</p>`;
}
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".tree-question").forEach((el,i)=>el.querySelector(".question-heading")?.addEventListener("click",()=>{document.querySelectorAll(".tree-question").forEach(x=>x.classList.remove("active"));el.classList.add("active");updateEvidenceGuide(["objective","scale","design","normality","sampleSize"][i]);}));
  document.querySelectorAll("[data-recommend]").forEach(el=>el.addEventListener("change",()=>{updateChoiceHelp();recommend()}));
  document.querySelectorAll("[data-recommend]").forEach(el=>el.addEventListener("input",()=>{updateChoiceHelp();recommend()}));
  byId("recommendBtn")?.addEventListener("click",recommend);
  updateChoiceHelp();
  updateProgress();recommend();
});
document.addEventListener("languagechange",()=>{updateChoiceHelp();recommend()});
