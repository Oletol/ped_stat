
function q(id){return document.getElementById(id)}
function isRu(){return window.Lang?.get()==="ru"}
function mt(en,ru){return isRu()?ru:en}
function cleanLabel(value){return String(value).replace(/[<>&]/g,"").trim()}
function studyName(id,fallback){return cleanLabel(window.MethodGuide?.name(id,fallback)||fallback)||fallback}
function studyNames(id,count,prefix){return (window.MethodGuide?.names(id,count,prefix)||Array.from({length:count},(_,i)=>`${prefix} ${i+1}`)).map(cleanLabel)}
function parsePair(){
  const a=Stats.parseNums(q("a").value),b=Stats.parseNums(q("b").value);
  if(!a.length||a.length!==b.length) throw new Error("Enter the same number of valid observations in both fields.");
  return [a,b];
}
function significanceText(p,alpha=.05){
  return p<alpha ? mt("The result is statistically significant at α = .05.","Результат статистически значим при α = 0,05.") : mt("The result does not reach statistical significance at α = .05.","Результат не достиг уровня статистической значимости при α = 0,05.");
}
function causalCaution(){
  return mt("This statistical result alone does not establish that the teaching method caused the observed outcome. Causal interpretation depends on the research design, baseline equivalence, measurement quality, attrition, implementation fidelity and alternative explanations.","Этот статистический результат сам по себе не доказывает, что наблюдаемый эффект вызван методикой обучения. Причинная интерпретация зависит от дизайна исследования, сопоставимости исходных данных, качества измерения, выбывания участников, реализации методики и альтернативных объяснений.");
}
function conclusionFor(p,direction){
  if(p<.05){
    return direction
      ? mt(`The data provide statistical evidence of ${direction}. If this direction was specified before analysis and the design adequately isolates the intervention, the result can contribute to an argument for effectiveness.`,`Данные подтверждают наличие направленного изменения. Если направление было задано до анализа, а дизайн позволяет отделить влияние методики от других факторов, результат может использоваться как часть обоснования эффективности.`)
      : mt("The data provide statistical evidence that the tested groups or conditions differ. The test does not identify the cause of that difference.","Данные подтверждают наличие различий между условиями или группами. Сам тест не определяет причину этих различий.");
  }
  return mt("The data do not provide sufficient statistical evidence for the tested effect at α = .05. This does not mean that the method is ineffective or that no effect exists. Consider effect magnitude, confidence intervals, sample size and statistical power.","Данные не дают достаточных статистических оснований для подтверждения проверяемого эффекта при α = 0,05. Это не означает, что методика неэффективна или эффект отсутствует. Учитывайте размер эффекта, доверительный интервал, размер выборки и статистическую мощность.");
}
function reportBlock(report){
  return `<div class="report-box"><h4>${mt("Result Report","Отчёт о результатах")}</h4><div id="reportText" class="report-text">${escHtml(report)}</div><div class="actions" style="margin-top:12px"><button class="btn secondary" id="copyReportBtn" type="button">${mt("Copy report","Копировать отчёт")}</button><span id="copyStatus" class="copy-status"></span></div></div>`;
}
function barChart(chart){
  if(!chart||!chart.values?.length)return "";
  const values=chart.values.map(Number),finite=values.filter(Number.isFinite);if(!finite.length)return "";
  const min=Math.min(0,...finite),max=Math.max(0,...finite),range=max-min||1;
  const bars=values.map((value,i)=>{
    const height=Math.max(3,Math.abs(value)/range*142),left=46+i*(250/values.length),width=Math.max(22,176/values.length);
    const y=value>=0?166-height:20;return `<g><rect x="${left}" y="${y}" width="${width}" height="${height}" rx="2" fill="${i%2?'#6f987f':'#315d88'}"></rect><text x="${left+width/2}" y="${Math.max(14,y-7)}" text-anchor="middle" font-weight="700">${escHtml(Stats.fmt(value,2))}</text><text x="${left+width/2}" y="193" text-anchor="middle">${escHtml(chart.labels[i])}</text></g>`;
  }).join("");
  const note=chart.note||mt(`Each bar shows the calculated summary for ${chart.labels.join(" and ")}.`,`Каждый столбец показывает рассчитанное итоговое значение для указанных данных.`);
  return `<div class="chart-box"><h4>${mt("What this chart shows","Что показывает график")}</h4><p class="chart-explainer">${escHtml(note)}</p><svg class="result-chart" viewBox="0 0 340 210" role="img" aria-label="${mt("Result chart","График результата")}"><line x1="28" y1="166" x2="326" y2="166" stroke="#9cabbc"></line><line x1="28" y1="22" x2="28" y2="166" stroke="#9cabbc"></line>${bars}</svg></div>`;
}
function slopeChart(chart){
  const a=chart.a,b=chart.b;if(!a?.length||a.length!==b?.length)return "";
  const all=[...a,...b],min=Math.min(...all),max=Math.max(...all),range=max-min||1,y=v=>172-(v-min)/range*132;
  const rows=a.map((v,i)=>{const improved=b[i]>v,declined=b[i]<v,color=improved?"#4f8467":declined?"#a45a52":"#9aa7b5";return `<g opacity=".68"><line x1="62" y1="${y(v)}" x2="278" y2="${y(b[i])}" stroke="${color}" stroke-width="1.4"></line><circle cx="62" cy="${y(v)}" r="2.7" fill="${color}"></circle><circle cx="278" cy="${y(b[i])}" r="2.7" fill="${color}"></circle></g>`}).join("");
  const ma=Stats.mean(a),mb=Stats.mean(b);
  const ticks=[0,.25,.5,.75,1].map(t=>{const val=min+t*range,yy=y(val);return `<g><line x1="42" y1="${yy}" x2="300" y2="${yy}" stroke="#e1e7ed"></line><text x="35" y="${yy+4}" text-anchor="end">${escHtml(Stats.fmt(val,1))}</text></g>`}).join("");
  const note=chart.note||mt("Each line connects one learner’s two measurements. Green indicates improvement, red indicates decline, and the dark line shows the group mean.","Каждая линия соединяет два измерения одного учащегося. Зелёный цвет показывает улучшение, красный — ухудшение, тёмная линия — среднее группы.");
  return `<div class="chart-box"><h4>${mt("What this chart shows","Что показывает график")}</h4><p class="chart-explainer">${escHtml(note)}</p><svg class="result-chart" viewBox="0 0 340 230" role="img" aria-label="${mt("Paired score chart","График связанных результатов")}">${ticks}${rows}<line x1="62" y1="${y(ma)}" x2="278" y2="${y(mb)}" stroke="#14294b" stroke-width="4"></line><circle cx="62" cy="${y(ma)}" r="4.5" fill="#14294b"></circle><circle cx="278" cy="${y(mb)}" r="4.5" fill="#14294b"></circle><text x="62" y="204" text-anchor="middle">${escHtml(chart.labels[0])}</text><text x="278" y="204" text-anchor="middle">${escHtml(chart.labels[1])}</text><g transform="translate(62 220)"><circle r="3" fill="#4f8467"></circle><text x="8" y="4">${mt("Improved","Улучшение")}</text><circle cx="92" r="3" fill="#a45a52"></circle><text x="100" y="4">${mt("Declined","Ухудшение")}</text><line x1="185" x2="201" stroke="#14294b" stroke-width="3"></line><text x="207" y="4">${mt("Group mean","Среднее")}</text></g></svg></div>`;
}
function scatterChart(chart){
  const xs=chart.x,ys=chart.y;if(!xs?.length||xs.length!==ys?.length)return "";
  const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys),xr=xmax-xmin||1,yr=ymax-ymin||1;
  const dots=xs.map((x,i)=>`<circle cx="${24+(x-xmin)/xr*245}" cy="${175-(ys[i]-ymin)/yr*145}" r="5" fill="#245ee8" opacity=".8"></circle>`).join("");
  const xLabel=chart.xLabel||mt("Indicator X","Показатель X"),yLabel=chart.yLabel||mt("Indicator Y","Показатель Y");
  return `<div class="chart-box"><h4>${mt("What this chart shows","Что показывает график")}</h4><p class="chart-explainer">${mt(`Each point is one learner or response: ${escHtml(xLabel)} is on the horizontal axis and ${escHtml(yLabel)} is on the vertical axis. Look for the overall pattern and unusual points.`,`Каждая точка — один учащийся или ответ. Оцените общую форму связи и необычные точки.`)}</p><svg class="result-chart" viewBox="0 0 290 225" role="img" aria-label="${mt("Scatter plot","Диаграмма рассеяния")}"><line x1="20" y1="180" x2="278" y2="180" stroke="#cbd7eb"></line><line x1="20" y1="18" x2="20" y2="180" stroke="#cbd7eb"></line>${dots}<text x="150" y="215" text-anchor="middle">${escHtml(xLabel)}</text><text x="9" y="100" text-anchor="middle" transform="rotate(-90 9 100)">${escHtml(yLabel)}</text></svg></div>`;
}
function showResult(kind,title,metrics,body,conclusion,report,chart){
  const box=q("result"); box.className="result "+kind;
  box.dataset.calculated="true";
  if(isRu())report=`Для анализа применён метод «${document.querySelector(".hero h1")?.textContent||"статистический тест"}». ${metrics.map(x=>`${x[0]} = ${x[1]}`).join("; ")}. ${body} ${conclusion}`;
  box.innerHTML=`<h3>${title}</h3><div class="result-grid">${metrics.map(x=>`<div class="metric">${x[0]}<b>${x[1]}</b></div>`).join("")}</div>
  <div class="muted">${body}</div>
  ${chart?(chart.type==="scatter"?scatterChart(chart):chart.type==="slope"?slopeChart(chart):barChart(chart)):""}
  <div class="conclusion-box"><h4>${mt("What can you conclude?","Какой вывод допустим?")}</h4><div class="muted">${conclusion}</div></div>
  ${reportBlock(report)}`;
  q("copyReportBtn")?.addEventListener("click",async()=>{
    try{await navigator.clipboard.writeText(q("reportText").innerText);q("copyStatus").textContent=mt("Copied.","Скопировано.")}
    catch(e){q("copyStatus").textContent=mt("Select the report text and copy it manually.","Выделите текст отчёта и скопируйте его вручную.")}
  });
}
function validateMin(n,min,msg){ if(n<min) throw new Error(msg||`At least ${min} observations are required for this calculator.`); }
function ciText(lo,hi,d=2){return `[${Stats.fmt(lo,d)}, ${Stats.fmt(hi,d)}]`}
function calculate(){
 try{
  const calc=document.body.dataset.calc;
  let r,p,metrics=[],body="",kind="warning",conclusion="",report="",chart=null;
  if(calc==="sign"){
    const [a,b]=parsePair(); let pos=0,neg=0,ties=0;
    b.forEach((v,i)=>{if(v>a[i])pos++; else if(v<a[i])neg++; else ties++});
    const n=pos+neg; validateMin(n,5,"The Sign Test needs at least five non-zero changes.");
    const k=Math.min(pos,neg); p=Stats.binomPValue(k,n,.5,true); const ci=Stats.wilson(pos,n);
    kind=p<.05?"success":"warning";
    metrics=[["Positive changes",pos],["Negative changes",neg],["Exact p",Stats.pFmt(p)]];
    body=mt(`Zero changes excluded: ${ties}. Positive-change proportion = ${(pos/n*100).toFixed(1)}%; 95% Wilson CI ${(ci[0]*100).toFixed(1)}–${(ci[1]*100).toFixed(1)}%. ${significanceText(p)}`,`Нулевые изменения исключены: ${ties}. Доля положительных изменений = ${(pos/n*100).toFixed(1)}%; 95% ДИ Уилсона ${(ci[0]*100).toFixed(1)}–${(ci[1]*100).toFixed(1)}%. ${significanceText(p)}`);
    conclusion=conclusionFor(p,pos>neg?"a predominance of positive change":"a predominance of negative change")+" "+causalCaution();
    report=`A paired Sign Test was used to evaluate the direction of change. Of ${n} non-zero paired changes, ${pos} were positive and ${neg} were negative (${ties} zero changes were excluded). The exact two-sided p-value was ${Stats.pFmt(p)}. The estimated proportion of positive non-zero changes was ${(pos/n).toFixed(3)}, 95% Wilson CI ${(ci[0]).toFixed(3)}–${(ci[1]).toFixed(3)}. ${p<.05?"The null hypothesis of equal probabilities of positive and negative change was rejected at α = .05.":"The null hypothesis was not rejected at α = .05."}`;
    chart={type:"slope",a,b,labels:[studyName("labelA",mt("Pre-test","До обучения")),studyName("labelB",mt("Post-test","После обучения"))]};
  }
  else if(calc==="wilcoxon"){
    const [a,b]=parsePair(); r=Stats.wilcoxon(a,b); validateMin(r.n,5,"At least five non-zero paired differences are required.");
    p=r.p;kind=p<.05?"success":"warning";
    metrics=[["T statistic",Stats.fmt(r.T,2)],["Non-zero pairs",r.n],["p",Stats.pFmt(p)]];
    const medChange=Stats.median(b.map((v,i)=>v-a[i]));
    body=mt(`Positive rank sum = ${Stats.fmt(r.Wp,2)}; negative rank sum = ${Stats.fmt(r.Wm,2)}; median change = ${Stats.fmt(medChange,2)}; effect r ≈ ${Stats.fmt(r.r,3)}. ${significanceText(p)}`,`Сумма положительных рангов = ${Stats.fmt(r.Wp,2)}; сумма отрицательных рангов = ${Stats.fmt(r.Wm,2)}; медиана изменения = ${Stats.fmt(medChange,2)}; размер эффекта r ≈ ${Stats.fmt(r.r,3)}. ${significanceText(p)}`);
    conclusion=conclusionFor(p,medChange>0?"an upward paired shift":medChange<0?"a downward paired shift":null)+" "+causalCaution();
    report=`A Wilcoxon signed-rank test was conducted to compare paired measurements (N = ${r.n} non-zero pairs). The test statistic was T = ${Stats.fmt(r.T,2)}, p ${Stats.pFmt(p)}, with an approximate effect size r = ${Stats.fmt(r.r,3)}. The median raw change was ${Stats.fmt(medChange,2)}. ${p<.05?"The paired distributions differed significantly at α = .05.":"The paired difference did not reach statistical significance at α = .05."}`;
    chart={type:"slope",a,b,labels:[studyName("labelA",mt("Pre-test","До обучения")),studyName("labelB",mt("Post-test","После обучения"))]};
  }
  else if(calc==="pairedT"){
    const [a,b]=parsePair(); validateMin(a.length,3); r=Stats.pairedT(a,b); p=r.p;kind=p<.05?"success":"warning"; const ci=Stats.pairedDiffCI(a,b);
    const nameA=studyName("labelA","Pre-test"),nameB=studyName("labelB","Post-test");
    metrics=[["t",Stats.fmt(r.t,3)],["df",Stats.fmt(r.df,0)],["p",Stats.pFmt(p)]];
    body=mt(`Mean change (post minus pre) = ${Stats.fmt(r.md,3)}, 95% CI ${ciText(ci[0],ci[1],3)}; paired Cohen's d = ${Stats.fmt(r.effect,3)}. ${significanceText(p)} The paired differences should be approximately normally distributed.`,`Среднее изменение после обучения относительно исходного измерения = ${Stats.fmt(r.md,3)}, 95% ДИ ${ciText(ci[0],ci[1],3)}; парный d Коэна = ${Stats.fmt(r.effect,3)}. ${significanceText(p)} Разности должны иметь приблизительно нормальное распределение.`);
    conclusion=conclusionFor(p,r.md>0?"a positive mean pre–post change":"a negative mean pre–post change")+" "+causalCaution();
    report=`A paired-samples t-test was used to compare ${nameA} and ${nameB} scores (N = ${r.n}). The mean change (${nameB} − ${nameA}) was ${Stats.fmt(r.md,3)}, 95% CI ${ciText(ci[0],ci[1],3)}. The difference was ${p<.05?"statistically significant":"not statistically significant"}, t(${Stats.fmt(r.df,0)}) = ${Stats.fmt(r.t,3)}, p ${Stats.pFmt(p)}. The paired effect size was Cohen's d = ${Stats.fmt(r.effect,3)}.`;
    chart={type:"slope",a,b,labels:[nameA,nameB]};
  }
  else if(calc==="mcnemar"){
    const a=Stats.parseNums(q("a").value),b=Stats.parseNums(q("b").value); if(a.length!==b.length||!a.length)throw new Error("Enter equal-length binary vectors using 0 and 1.");
    if(a.some(x=>![0,1].includes(x))||b.some(x=>![0,1].includes(x)))throw new Error("McNemar input must contain only 0 and 1.");
    let b01=0,b10=0,same=0;a.forEach((x,i)=>{if(x===0&&b[i]===1)b01++;else if(x===1&&b[i]===0)b10++;else same++});
    const n=b01+b10;validateMin(n,1,"There are no discordant pairs, so there is no change to test.");p=Stats.binomPValue(Math.min(b01,b10),n,.5,true);kind=p<.05?"success":"warning";
    metrics=[["0 to 1",b01],["1 to 0",b10],["Exact p",Stats.pFmt(p)]];
    body=mt(`Matching pairs: ${same}. The exact McNemar test uses ${n} changed pairs. ${significanceText(p)}`,`Совпадающие пары: ${same}. В точном тесте Мак-Немара используются ${n} пар с изменившимся результатом. ${significanceText(p)}`);
    conclusion=conclusionFor(p,b01>b10?"a net increase in the binary success outcome":b10>b01?"a net decrease in the binary success outcome":null)+" "+causalCaution();
    report=`An exact McNemar test was used for paired binary outcomes. There were ${b01} changes from 0 to 1 and ${b10} changes from 1 to 0; ${same} pairs were concordant. The exact two-sided p-value was ${Stats.pFmt(p)}. ${p<.05?"The paired proportions differed significantly at α = .05.":"The paired proportions did not differ significantly at α = .05."}`;
    chart={labels:[mt("Improved (0→1)","Улучшение (0→1)"),mt("Declined (1→0)","Ухудшение (1→0)")],values:[b01,b10],note:mt("Bars count learners whose binary outcome improved or declined between the two measurements; unchanged learners are not shown.","Столбцы показывают учащихся, чей бинарный результат улучшился или ухудшился; неизменившиеся результаты не показаны.")};
  }
  else if(calc==="hake"){
    const pre=Number(q("pre").value),post=Number(q("post").value); if(!Number.isFinite(pre)||!Number.isFinite(post)||pre<0||pre>=100||post<0||post>100)throw new Error("Enter valid percentages; pre-test must be below 100.");
    const nameA=studyName("labelA","Pre-test"),nameB=studyName("labelB","Post-test");
    const g=(post-pre)/(100-pre);let label=g<.3?"low":g<=.7?"medium":"high";kind=g>=.3?"success":"warning";
    metrics=[["Pre-test",pre.toFixed(1)+"%"],["Post-test",post.toFixed(1)+"%"],["Normalized gain g",Stats.fmt(g,3)]];
    body=mt(`The normalized gain is classified as ${label}. This descriptive index has no p-value or confidence interval without participant-level data.`,`Нормализованный прирост относится к категории «${label==="low"?"низкий":label==="medium"?"средний":"высокий"}». Без индивидуальных данных этот описательный показатель не имеет p-значения или доверительного интервала.`);
    conclusion=mt(`The observed aggregate learning gain is ${label}. It describes improvement but cannot establish statistical significance or causal effectiveness on its own.`,`Полученный учебный прирост описывает величину улучшения, но сам по себе не подтверждает статистическую значимость или причинную эффективность методики.`);
    report=`The normalized learning gain was calculated using Hake's g = (post − pre)/(100 − pre). The mean pre-test score was ${pre.toFixed(1)}% and the mean post-test score was ${post.toFixed(1)}%, giving g = ${Stats.fmt(g,3)}, interpreted as a ${label} normalized gain. This index was treated as descriptive and was not used as a significance test.`;
    chart={labels:[nameA,nameB],values:[pre,post],note:`Bars compare the group mean percentages at ${nameA} and ${nameB}.`};
  }
  else if(calc==="bespalko"){
    const correct=Number(q("correct").value),total=Number(q("total").value); if(!(total>0)||correct<0||correct>total)throw new Error("Correct operations must be between 0 and the total number of essential operations.");
    const ka=correct/total, mastered=ka>=.7;kind=mastered?"success":"warning";
    metrics=[["Correct operations",correct],["Total operations",total],["Ka",Stats.fmt(ka,3)]];
    body=mastered?mt(`Ka ≥ .70: the predefined mastery threshold was reached.`,`Ka ≥ 0,70: заранее заданный порог освоения достигнут.`):mt(`Ka < .70: the predefined mastery threshold was not reached.`,`Ka < 0,70: заранее заданный порог освоения не достигнут.`);
    conclusion=mastered?mt(`The mastery threshold was reached. This supports attainment of the standard, not a causal claim that teaching produced it.`,`Порог освоения достигнут. Это подтверждает достижение стандарта, но не доказывает, что результат вызван методикой обучения.`):mt(`The mastery threshold was not reached. This does not identify the cause and is not a significance test.`,`Порог освоения не достигнут. Результат не указывает причину и не является тестом статистической значимости.`);
    report=`A criterion-referenced mastery coefficient was calculated as Ka = correct essential operations / total essential operations. The result was Ka = ${Stats.fmt(ka,3)} (${correct}/${total}). Using the predefined threshold Ka ≥ .70, mastery was ${mastered?"classified as achieved":"not classified as achieved"}.`;
    chart={labels:["Ka",mt("Threshold","Порог")],values:[ka,.7]};
  }
  else if(calc==="friedman"){
    const m=Stats.parseMatrix(q("matrix").value); if(m.length<3||m.some(x=>x.length!==m[0].length)||m[0].length<3)throw new Error("Enter at least 3 participants (rows) and 3 repeated measurements (columns), with no missing cells.");
    r=Stats.friedman(m);p=r.p;kind=p<.05?"success":"warning";
    metrics=[["χ²r",Stats.fmt(r.q,3)],["df",r.df],["p",Stats.pFmt(p)]];
    body=mt(`Kendall's W = ${Stats.fmt(r.W,3)}. Mean ranks: ${r.meanRanks.map(x=>Stats.fmt(x,2)).join(", ")}. ${significanceText(p)}`,`W Кендалла = ${Stats.fmt(r.W,3)}. Средние ранги: ${r.meanRanks.map(x=>Stats.fmt(x,2)).join(", ")}. ${significanceText(p)}`);
    conclusion=(p<.05?mt("At least one repeated measurement differs. Pairwise comparisons with multiplicity control are required to locate the differences.","Как минимум одно повторное измерение отличается. Чтобы определить различающиеся измерения, нужны попарные сравнения с поправкой на множественность."):mt("The overall test does not provide sufficient evidence that the repeated measurements differ.","Общий тест не даёт достаточных оснований считать повторные измерения различающимися."))+" "+causalCaution();
    report=`A Friedman test was used to compare ${r.k} repeated measurements for ${r.n} participants. The omnibus result was χ²(${r.df}) = ${Stats.fmt(r.q,3)}, p ${Stats.pFmt(p)}, with Kendall's W = ${Stats.fmt(r.W,3)}. Mean ranks across measurement occasions were ${r.meanRanks.map(x=>Stats.fmt(x,2)).join(", ")}.`;
    const occasionNames=studyNames("seriesLabels",r.k,"Measurement");
    chart={labels:occasionNames,values:r.meanRanks,note:`Bars compare mean ranks across ${occasionNames.join(", ")}; they are ranks, not raw mean scores.`};
  }
  else if(calc==="mannWhitney"){
    const a=Stats.parseNums(q("group1").value),b=Stats.parseNums(q("group2").value);validateMin(a.length,2);validateMin(b.length,2);r=Stats.mannWhitney(a,b);p=r.p;kind=p<.05?"success":"warning";
    const nameA=studyName("labelA","Experimental group"),nameB=studyName("labelB","Control group");
    metrics=[["U",Stats.fmt(r.U,2)],["z (approx.)",Stats.fmt(r.z,3)],["p (approx.)",Stats.pFmt(p)]];
    body=mt(`Median ${nameA} = ${Stats.fmt(Stats.median(a),2)}; median ${nameB} = ${Stats.fmt(Stats.median(b),2)}; effect r ≈ ${Stats.fmt(r.r,3)}. The p-value uses a tie-corrected normal approximation.`,`Медиана первой группы = ${Stats.fmt(Stats.median(a),2)}; медиана второй группы = ${Stats.fmt(Stats.median(b),2)}; размер эффекта r ≈ ${Stats.fmt(r.r,3)}. p-значение рассчитано по нормальному приближению с поправкой на совпадающие ранги.`);
    conclusion=conclusionFor(p,Stats.median(a)>Stats.median(b)?`higher ranks/values in ${nameA}`:`higher ranks/values in ${nameB}`)+" "+causalCaution();
    report=`A Mann–Whitney U test compared ${nameA} (n = ${a.length}) and ${nameB} (n = ${b.length}). The test yielded U = ${Stats.fmt(r.U,2)}, z ≈ ${Stats.fmt(r.z,3)}, p ${Stats.pFmt(p)}, with effect size r ≈ ${Stats.fmt(r.r,3)}. The group medians were ${Stats.fmt(Stats.median(a),2)} and ${Stats.fmt(Stats.median(b),2)}, respectively.`;
    chart={labels:[`${nameA} median`,`${nameB} median`],values:[Stats.median(a),Stats.median(b)],note:`Bars compare the median entered score for ${nameA} and ${nameB}.`};
  }
  else if(calc==="independentT"){
    const a=Stats.parseNums(q("group1").value),b=Stats.parseNums(q("group2").value);validateMin(a.length,3);validateMin(b.length,3);r=Stats.independentT(a,b,true);p=r.p;kind=p<.05?"success":"warning";const ci=Stats.welchDiffCI(a,b);
    const nameA=studyName("labelA","Experimental group"),nameB=studyName("labelB","Control group");
    metrics=[["Welch t",Stats.fmt(r.t,3)],["df",Stats.fmt(r.df,2)],["p",Stats.pFmt(p)]];
    body=mt(`Mean difference (${nameA} minus ${nameB}) = ${Stats.fmt(ci.diff,3)}, 95% CI ${ciText(ci.low,ci.high,3)}; Cohen's d = ${Stats.fmt(r.d,3)}; Hedges' g = ${Stats.fmt(r.g,3)}.`,`Разность средних первой и второй группы = ${Stats.fmt(ci.diff,3)}, 95% ДИ ${ciText(ci.low,ci.high,3)}; d Коэна = ${Stats.fmt(r.d,3)}; g Хеджеса = ${Stats.fmt(r.g,3)}.`);
    conclusion=conclusionFor(p,ci.diff>0?`a higher mean in ${nameA}`:`a higher mean in ${nameB}`)+" "+causalCaution();
    report=`A Welch independent-samples t-test compared ${nameA} (n = ${r.n1}, M = ${Stats.fmt(r.m1,2)}) and ${nameB} (n = ${r.n2}, M = ${Stats.fmt(r.m2,2)}). The mean difference was ${Stats.fmt(ci.diff,3)}, 95% CI ${ciText(ci.low,ci.high,3)}. The result was ${p<.05?"statistically significant":"not statistically significant"}, t(${Stats.fmt(r.df,2)}) = ${Stats.fmt(r.t,3)}, p ${Stats.pFmt(p)}. Effect sizes were Cohen's d = ${Stats.fmt(r.d,3)} and Hedges' g = ${Stats.fmt(r.g,3)}.`;
    chart={labels:[`${nameA} mean`,`${nameB} mean`],values:[r.m1,r.m2],note:`Bars compare the mean outcome for ${nameA} and ${nameB}.`};
  }
  else if(calc==="fisher"){
    const a=Number(q("c11").value),b=Number(q("c12").value),c=Number(q("c21").value),d=Number(q("c22").value);if([a,b,c,d].some(x=>!Number.isInteger(x)||x<0))throw new Error("All four cells must be non-negative integers.");
    const nameA=studyName("labelA","Experimental group"),nameB=studyName("labelB","Control group"),outcome=studyName("outcomeYes","positive outcome");
    r=Stats.fisherExact2x2(a,b,c,d);p=r.p;kind=p<.05?"success":"warning";const ci=Stats.logOddsRatioCI(a,b,c,d);
    metrics=[["Exact p",Stats.pFmt(p)],["Odds ratio",Number.isFinite(r.or)?Stats.fmt(r.or,3):"∞"],["N",a+b+c+d]];
    body=mt(`Approximate 95% CI for the odds ratio, with a correction when needed: ${ciText(ci[0],ci[1],3)}. ${significanceText(p)}`,`Приблизительный 95% ДИ для отношения шансов с поправкой при необходимости: ${ciText(ci[0],ci[1],3)}. ${significanceText(p)}`);
    conclusion=conclusionFor(p,null)+" "+mt("Association in a 2 × 2 table is not evidence of causation on its own.","Связь в таблице 2 × 2 сама по себе не доказывает причинность.");
    report=`Fisher's exact test compared ${outcome} counts for ${nameA} and ${nameB} in a 2×2 table (N = ${a+b+c+d}). The exact two-sided p-value was ${Stats.pFmt(p)}. The odds ratio was ${Number.isFinite(r.or)?Stats.fmt(r.or,3):"infinite"}, with an approximate 95% CI ${ciText(ci[0],ci[1],3)}.`;
    chart={labels:[nameA,nameB],values:[a/(a+b||1)*100,c/(c+d||1)*100],note:`Bars show the percentage classified as “${outcome}” in ${nameA} and ${nameB}.`};
  }
  else if(calc==="chiSquare"){
    const m=Stats.parseMatrix(q("matrix").value);if(m.length<2||m.some(x=>x.length!==m[0].length)||m[0].length<2||m.flat().some(x=>x<0||!Number.isFinite(x)))throw new Error("Enter a rectangular contingency table with at least 2 rows and 2 columns.");
    r=Stats.chiSquare(m);p=r.p;kind=p<.05?"success":"warning";
    metrics=[["χ²",Stats.fmt(r.x2,3)],["df",r.df],["p",Stats.pFmt(p)]];
    body=mt(`Cramér's V = ${Stats.fmt(r.V,3)}; smallest expected count = ${Stats.fmt(r.minExpected,2)}. ${r.minExpected<5?"The approximation is questionable because an expected count is below 5. ":""}${significanceText(p)}`,`V Крамера = ${Stats.fmt(r.V,3)}; наименьшая ожидаемая частота = ${Stats.fmt(r.minExpected,2)}. ${r.minExpected<5?"Приближение может быть неточным, потому что ожидаемая частота меньше 5. ":""}${significanceText(p)}`);
    conclusion=(p<.05?mt("The categorical variables or distributions are statistically associated.","Между категориальными переменными или распределениями обнаружена статистическая связь."):mt("The test does not provide sufficient evidence of a categorical association.","Тест не даёт достаточных оснований для вывода о категориальной связи."))+" "+mt("Association does not establish causation.","Связь не доказывает причинность.");
    report=`A Pearson chi-square test examined the contingency table (N = ${r.n}). The result was χ²(${r.df}) = ${Stats.fmt(r.x2,3)}, p ${Stats.pFmt(p)}, with Cramér's V = ${Stats.fmt(r.V,3)}. The smallest expected cell count was ${Stats.fmt(r.minExpected,2)}.${r.minExpected<5?" Because an expected count was below 5, the chi-square approximation should be interpreted cautiously.":""}`;
    const rowNames=studyNames("rowLabels",m.length,"Educational group");
    chart={labels:rowNames,values:m.map(row=>row.reduce((s,x)=>s+x,0)),note:`Bars show the total number of learners/observations entered for ${rowNames.join(" and ")}. Category differences are evaluated in the test result, not by bar height alone.`};
  }
  else if(calc==="spearman"||calc==="pearson"){
    const [x,y]=parsePair();validateMin(x.length,4);const corr=calc==="spearman"?Stats.spearman(x,y):Stats.pearson(x,y);const t=corr*Math.sqrt((x.length-2)/(1-corr*corr));p=Stats.studentTP(t,x.length-2,true);kind=p<.05?"success":"warning";const ci=Stats.correlationCI(corr,x.length);
    const nameA=studyName("labelA","Indicator X"),nameB=studyName("labelB","Indicator Y");
    metrics=[[calc==="spearman"?"rs":"r",Stats.fmt(corr,3)],["N",x.length],["p",Stats.pFmt(p)]];
    body=mt(`Approximate 95% CI = ${ciText(ci[0],ci[1],3)}. ${significanceText(p)} ${calc==="pearson"?"Pearson correlation assumes an approximately linear relationship and is sensitive to outliers.":"Spearman correlation assesses monotonic association using ranks."}`,`Приблизительный 95% ДИ = ${ciText(ci[0],ci[1],3)}. ${significanceText(p)} ${calc==="pearson"?"Корреляция Пирсона предполагает приблизительно линейную связь и чувствительна к выбросам.":"Корреляция Спирмена оценивает монотонную связь с использованием рангов."}`);
    conclusion=(p<.05?mt(`There is statistical evidence of a ${corr>0?"positive":"negative"} association between the indicators.`,`Обнаружена статистически подтверждённая ${corr>0?"положительная":"отрицательная"} связь между показателями.`):mt("The data do not provide sufficient evidence of a non-zero association at α = .05.","Данные не дают достаточных оснований считать связь отличной от нуля при α = 0,05."))+" "+mt("Correlation does not prove that one indicator causes the other and is not primary proof of teaching effectiveness.","Корреляция не доказывает, что один показатель вызывает другой, и не является самостоятельным доказательством эффективности обучения.");
    report=`A ${calc==="spearman"?"Spearman rank-order":"Pearson product–moment"} correlation between ${nameA} and ${nameB} was calculated for ${x.length} paired observations. The coefficient was ${calc==="spearman"?"rs":"r"} = ${Stats.fmt(corr,3)}, approximate 95% CI ${ciText(ci[0],ci[1],3)}, p ${Stats.pFmt(p)}.`;
    chart={type:"scatter",x,y,xLabel:nameA,yLabel:nameB};
  }
  else if(calc==="cronbach"){
    const m=Stats.parseMatrix(q("matrix").value);if(m.length<3||m.some(x=>x.length!==m[0].length)||m[0].length<2)throw new Error("Enter respondents as rows and at least two items as columns.");
    r=Stats.cronbach(m);kind=r.alpha>=.7?"success":"warning";
    metrics=[["Cronbach's α",Stats.fmt(r.alpha,3)],["Respondents",r.n],["Items",r.k]];
    body=isRu()?(r.alpha>=.95?`Внутренняя согласованность очень высокая (α > 0,95), что может указывать на избыточно похожие пункты.`:r.alpha>=.8?`Внутренняя согласованность хорошая для исследовательского педагогического измерения.`:r.alpha>=.7?`Внутренняя согласованность соответствует распространённому ориентиру.`:`α < 0,70: внутренняя согласованность может быть недостаточной для уверенной интерпретации.`):(r.alpha>=.95?`Internal consistency is extremely high (α > .95), which can indicate redundant items.`:r.alpha>=.8?`Internal consistency is good for exploratory educational measurement.`:r.alpha>=.7?`Internal consistency is conventionally acceptable.`:`α < .70: internal consistency may be insufficient for strong interpretation.`);
    conclusion=mt(`Internal consistency is ${r.alpha>=.8?"good":r.alpha>=.7?"acceptable":"potentially insufficient"} by conventional criteria. Alpha indicates reliability, not unidimensionality, validity or teaching effectiveness.`,`По распространённым ориентирам внутренняя согласованность ${r.alpha>=.8?"хорошая":r.alpha>=.7?"приемлемая":"может быть недостаточной"}. Альфа характеризует надёжность, но не доказывает одномерность, валидность или эффективность обучения.`);
    report=`Internal consistency was evaluated using Cronbach's alpha for ${r.k} items and ${r.n} respondents. The coefficient was α = ${Stats.fmt(r.alpha,3)}. This value was interpreted as ${r.alpha>=.8?"good":r.alpha>=.7?"acceptable":"below the conventional .70 threshold"} internal consistency, while recognizing that alpha alone does not establish scale validity.`;
    chart={labels:["α",mt("Reference .70","Ориентир 0,70")],values:[r.alpha,.7]};
  }
  else if(calc==="kappa"){
    const a=Stats.parseLabels(q("labels1").value),b=Stats.parseLabels(q("labels2").value);if(!a.length||a.length!==b.length)throw new Error("Enter one category label per line for each rater, with the same number of rated objects.");
    const nameA=studyName("labelA","Human rater"),nameB=studyName("labelB","Automated system");
    r=Stats.cohenKappa(a,b);p=r.p;kind=r.kappa>=.6?"success":"warning";
    metrics=[["κ",Stats.fmt(r.kappa,3)],["Observed agreement",(r.po*100).toFixed(1)+"%"],["p",Stats.pFmt(p)]];
    const lbl=r.kappa<.4?"weak":r.kappa<.6?"moderate":r.kappa<.8?"good":"very strong";
    body=mt(`Chance-corrected agreement is ${lbl}. Observed agreement = ${(r.po*100).toFixed(1)}%; expected chance agreement = ${(r.pe*100).toFixed(1)}%.`,`Согласие с поправкой на случайные совпадения оценивается как ${lbl==="weak"?"слабое":lbl==="moderate"?"умеренное":lbl==="good"?"хорошее":"очень сильное"}. Наблюдаемое согласие = ${(r.po*100).toFixed(1)}%; ожидаемое случайное согласие = ${(r.pe*100).toFixed(1)}%.`);
    conclusion=mt(`${nameA} and ${nameB} show ${lbl} agreement beyond chance. If this is inadequate for the intended use, revise the rubric and calibrate the raters or scoring system before using the ratings as outcome data.`,`Два источника оценок демонстрируют согласие сверх случайного уровня. Если оно недостаточно для цели исследования, уточните рубрику и проведите калибровку до использования оценок как итоговых данных.`);
    report=`Agreement between ${nameA} and ${nameB} was assessed using Cohen's kappa across ${r.n} rated objects. Observed agreement was ${(r.po*100).toFixed(1)}%, and κ = ${Stats.fmt(r.kappa,3)}, p ${Stats.pFmt(p)}, indicating ${lbl} agreement beyond chance.`;
    chart={labels:[mt("Observed agreement","Наблюдаемое согласие"),mt("Expected by chance","Случайное")],values:[r.po*100,r.pe*100],note:`Bars compare the actual percentage agreement between ${nameA} and ${nameB} with the agreement expected by chance.`};
  }
  else if(calc==="kendallW"){
    const m=Stats.parseMatrix(q("matrix").value);if(m.length<3||m.some(x=>x.length!==m[0].length)||m[0].length<3)throw new Error("Enter objects as rows and at least three raters as columns; values should be ranks.");
    r=Stats.kendallW(m);p=r.p;kind=r.W>=.7&&p<.05?"success":"warning";
    metrics=[["Kendall's W",Stats.fmt(r.W,3)],["χ²",Stats.fmt(r.chi,3)],["p",Stats.pFmt(p)]];
    body=mt(`W ranges from 0, no concordance, to 1, complete concordance. This tool uses W ≥ .70 as a practical benchmark for strong agreement.`,`W изменяется от 0, отсутствия согласованности, до 1, полного согласия. В инструменте W ≥ 0,70 используется как практический ориентир сильного согласия.`);
    conclusion=mt(`Expert concordance ${r.W>=.7?"meets":"does not meet"} the predefined .70 benchmark. Statistical significance alone is insufficient when W is practically weak.`,`Согласованность экспертов ${r.W>=.7?"достигает":"не достигает"} заданного ориентира 0,70. Одной статистической значимости недостаточно, если W практически мало.`);
    report=`Agreement among ${r.m} raters ranking ${r.n} objects was assessed using Kendall's coefficient of concordance. The result was W = ${Stats.fmt(r.W,3)}, χ²(${r.df}) = ${Stats.fmt(r.chi,3)}, p ${Stats.pFmt(p)}.`;
    chart={labels:["W",mt("Reference .70","Ориентир 0,70")],values:[r.W,.7]};
  }
  else if(calc==="anova"){
    const lines=q("groups").value.trim().split(/\n+/).filter(Boolean),groups=lines.map(line=>Stats.parseNums(line));if(groups.length<3||groups.some(g=>g.length<2))throw new Error("Enter at least three groups, one group per line, with at least two observations in each.");
    r=Stats.oneWayANOVA(groups);p=r.p;kind=p<.05?"success":"warning";
    metrics=[["F",Stats.fmt(r.F,3)],["df",`${r.df1}, ${r.df2}`],["p",Stats.pFmt(p)]];
    body=mt(`η² = ${Stats.fmt(r.eta2,3)}. Group means: ${r.means.map(x=>Stats.fmt(x,2)).join(", ")}. ${significanceText(p)}`,`η² = ${Stats.fmt(r.eta2,3)}. Средние групп: ${r.means.map(x=>Stats.fmt(x,2)).join(", ")}. ${significanceText(p)}`);
    conclusion=(p<.05?mt("At least one group mean differs. Multiplicity-controlled comparisons are required before identifying specific groups.","Как минимум одно среднее отличается. Чтобы определить конкретные различающиеся группы, нужны попарные сравнения с поправкой на множественность."):mt("The overall ANOVA does not provide sufficient evidence that the group means differ.","Общий дисперсионный анализ не даёт достаточных оснований считать средние групп различающимися."))+" "+causalCaution();
    report=`A one-way ANOVA compared ${r.k} independent groups (total N = ${r.N}). The omnibus result was F(${r.df1}, ${r.df2}) = ${Stats.fmt(r.F,3)}, p ${Stats.pFmt(p)}, with η² = ${Stats.fmt(r.eta2,3)}. Group means were ${r.means.map(x=>Stats.fmt(x,2)).join(", ")}.${p<.05?" Because the omnibus test was significant, post-hoc comparisons are required to identify specific group differences.":""}`;
    const groupNames=studyNames("seriesLabels",r.k,"Educational group");
    chart={labels:groupNames,values:r.means,note:`Bars compare mean outcomes across ${groupNames.join(", ")}. The omnibus test determines whether at least one mean differs.`};
  }
  const metricRu={"Positive changes":"Положительные изменения","Negative changes":"Отрицательные изменения","Exact p":"Точное p","T statistic":"Статистика T","Non-zero pairs":"Ненулевые пары","p":"p","t":"t","df":"степени свободы","0 to 1":"0 в 1","1 to 0":"1 в 0","Pre-test":"До обучения","Post-test":"После обучения","Normalized gain g":"Нормализованный прирост g","Correct operations":"Правильные операции","Total operations":"Всего операций","Ka":"Ka","χ²r":"χ²r","U":"U","z (approx.)":"z, приближённо","p (approx.)":"p, приближённо","Welch t":"t Уэлча","Odds ratio":"Отношение шансов","N":"N","χ²":"χ²","rs":"rs","r":"r","Cronbach's α":"Альфа Кронбаха","Respondents":"Респонденты","Items":"Пункты","κ":"κ","Observed agreement":"Наблюдаемое согласие","Kendall's W":"W Кендалла","F":"F"};
  if(isRu())metrics=metrics.map(x=>[metricRu[x[0]]||x[0],x[1]]);
  showResult(kind,mt("Analysis result","Результат анализа"),metrics,body,conclusion,report,chart);
 }catch(e){
   const box=q("result");box.className="result danger";box.innerHTML=`<h3>${mt("Input problem","Ошибка ввода")}</h3><div class="muted">${escHtml(isRu()?"Проверьте формат и количество введённых данных. "+e.message:e.message)}</div>`;
 }
}
function escHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
document.addEventListener("DOMContentLoaded",()=>q("calculateBtn")?.addEventListener("click",calculate));
document.addEventListener("languagechange",()=>{if(q("result")?.dataset.calculated)calculate()});
