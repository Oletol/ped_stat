
function q(id){return document.getElementById(id)}
function parsePair(){
  const a=Stats.parseNums(q("a").value),b=Stats.parseNums(q("b").value);
  if(!a.length||a.length!==b.length) throw new Error("Enter the same number of valid observations in both fields.");
  return [a,b];
}
function significanceText(p,alpha=.05){
  return p<alpha ? "The result is statistically significant at α = .05." : "The result does not reach statistical significance at α = .05.";
}
function causalCaution(){
  return "This statistical result alone does not establish that the teaching method caused the observed outcome. Causal interpretation depends on the research design, baseline equivalence, measurement quality, attrition, implementation fidelity, and alternative explanations.";
}
function conclusionFor(p,direction){
  if(p<.05){
    return direction
      ? `The data provide statistical evidence of ${direction}. If this direction was specified a priori and the research design adequately isolates the intervention, the result can contribute to an argument for method effectiveness.`
      : "The data provide statistical evidence that the tested groups/conditions differ. The statistical test does not by itself identify the cause of that difference.";
  }
  return "The data do not provide sufficient statistical evidence for the tested effect at α = .05. Do not rewrite this as “the method is ineffective” or “there is no effect”; consider effect magnitude, confidence intervals, sample size and statistical power.";
}
function reportBlock(report){
  return `<div class="report-box"><h4>Chapter 4 / Results report</h4><div id="reportText" class="report-text">${escHtml(report)}</div><div class="actions" style="margin-top:12px"><button class="btn secondary" id="copyReportBtn" type="button">Copy report</button><span id="copyStatus" class="copy-status"></span></div></div>`;
}
function showResult(kind,title,metrics,body,conclusion,report){
  const box=q("result"); box.className="result "+kind;
  box.innerHTML=`<h3>${title}</h3><div class="result-grid">${metrics.map(x=>`<div class="metric">${x[0]}<b>${x[1]}</b></div>`).join("")}</div>
  <div class="muted">${body}</div>
  <div class="conclusion-box"><h4>What can you conclude?</h4><div class="muted">${conclusion}</div></div>
  ${reportBlock(report)}`;
  q("copyReportBtn")?.addEventListener("click",async()=>{
    try{await navigator.clipboard.writeText(q("reportText").innerText);q("copyStatus").textContent="Copied."}
    catch(e){q("copyStatus").textContent="Select the report text and copy it manually."}
  });
}
function validateMin(n,min,msg){ if(n<min) throw new Error(msg||`At least ${min} observations are required for this calculator.`); }
function ciText(lo,hi,d=2){return `[${Stats.fmt(lo,d)}, ${Stats.fmt(hi,d)}]`}
function calculate(){
 try{
  const calc=document.body.dataset.calc;
  let r,p,metrics=[],body="",kind="warning",conclusion="",report="";
  if(calc==="sign"){
    const [a,b]=parsePair(); let pos=0,neg=0,ties=0;
    b.forEach((v,i)=>{if(v>a[i])pos++; else if(v<a[i])neg++; else ties++});
    const n=pos+neg; validateMin(n,5,"The Sign Test needs at least five non-zero changes.");
    const k=Math.min(pos,neg); p=Stats.binomPValue(k,n,.5,true); const ci=Stats.wilson(pos,n);
    kind=p<.05?"success":"warning";
    metrics=[["Positive changes",pos],["Negative changes",neg],["Exact p",Stats.pFmt(p)]];
    body=`Zero changes excluded: ${ties}. Positive-change proportion = ${(pos/n*100).toFixed(1)}%; 95% Wilson CI ${(ci[0]*100).toFixed(1)}–${(ci[1]*100).toFixed(1)}%. ${significanceText(p)}`;
    conclusion=conclusionFor(p,pos>neg?"a predominance of positive change":"a predominance of negative change")+" "+causalCaution();
    report=`A paired Sign Test was used to evaluate the direction of change. Of ${n} non-zero paired changes, ${pos} were positive and ${neg} were negative (${ties} zero changes were excluded). The exact two-sided p-value was ${Stats.pFmt(p)}. The estimated proportion of positive non-zero changes was ${(pos/n).toFixed(3)}, 95% Wilson CI ${(ci[0]).toFixed(3)}–${(ci[1]).toFixed(3)}. ${p<.05?"The null hypothesis of equal probabilities of positive and negative change was rejected at α = .05.":"The null hypothesis was not rejected at α = .05."}`;
  }
  else if(calc==="wilcoxon"){
    const [a,b]=parsePair(); r=Stats.wilcoxon(a,b); validateMin(r.n,5,"At least five non-zero paired differences are required.");
    p=r.p;kind=p<.05?"success":"warning";
    metrics=[["T statistic",Stats.fmt(r.T,2)],["Non-zero pairs",r.n],["p",Stats.pFmt(p)]];
    const medChange=Stats.median(b.map((v,i)=>v-a[i]));
    body=`Positive rank sum = ${Stats.fmt(r.Wp,2)}; negative rank sum = ${Stats.fmt(r.Wm,2)}; median raw change = ${Stats.fmt(medChange,2)}; effect r ≈ ${Stats.fmt(r.r,3)}. ${significanceText(p)}`;
    conclusion=conclusionFor(p,medChange>0?"an upward paired shift":medChange<0?"a downward paired shift":null)+" "+causalCaution();
    report=`A Wilcoxon signed-rank test was conducted to compare paired measurements (N = ${r.n} non-zero pairs). The test statistic was T = ${Stats.fmt(r.T,2)}, p ${Stats.pFmt(p)}, with an approximate effect size r = ${Stats.fmt(r.r,3)}. The median raw change was ${Stats.fmt(medChange,2)}. ${p<.05?"The paired distributions differed significantly at α = .05.":"The paired difference did not reach statistical significance at α = .05."}`;
  }
  else if(calc==="pairedT"){
    const [a,b]=parsePair(); validateMin(a.length,3); r=Stats.pairedT(a,b); p=r.p;kind=p<.05?"success":"warning"; const ci=Stats.pairedDiffCI(a,b);
    metrics=[["t",Stats.fmt(r.t,3)],["df",Stats.fmt(r.df,0)],["p",Stats.pFmt(p)]];
    body=`Mean change (post − pre) = ${Stats.fmt(r.md,3)}, 95% CI ${ciText(ci[0],ci[1],3)}; paired Cohen's d = ${Stats.fmt(r.effect,3)}. ${significanceText(p)} The paired differences should be approximately normally distributed.`;
    conclusion=conclusionFor(p,r.md>0?"a positive mean pre–post change":"a negative mean pre–post change")+" "+causalCaution();
    report=`A paired-samples t-test was used to compare pre-test and post-test scores (N = ${r.n}). The mean change (post − pre) was ${Stats.fmt(r.md,3)}, 95% CI ${ciText(ci[0],ci[1],3)}. The difference was ${p<.05?"statistically significant":"not statistically significant"}, t(${Stats.fmt(r.df,0)}) = ${Stats.fmt(r.t,3)}, p ${Stats.pFmt(p)}. The paired effect size was Cohen's d = ${Stats.fmt(r.effect,3)}.`;
  }
  else if(calc==="mcnemar"){
    const a=Stats.parseNums(q("a").value),b=Stats.parseNums(q("b").value); if(a.length!==b.length||!a.length)throw new Error("Enter equal-length binary vectors using 0 and 1.");
    if(a.some(x=>![0,1].includes(x))||b.some(x=>![0,1].includes(x)))throw new Error("McNemar input must contain only 0 and 1.");
    let b01=0,b10=0,same=0;a.forEach((x,i)=>{if(x===0&&b[i]===1)b01++;else if(x===1&&b[i]===0)b10++;else same++});
    const n=b01+b10;validateMin(n,1,"There are no discordant pairs, so there is no change to test.");p=Stats.binomPValue(Math.min(b01,b10),n,.5,true);kind=p<.05?"success":"warning";
    metrics=[["0 → 1",b01],["1 → 0",b10],["Exact p",Stats.pFmt(p)]];
    body=`Concordant pairs: ${same}. The exact McNemar test uses the ${n} discordant pairs. ${significanceText(p)}`;
    conclusion=conclusionFor(p,b01>b10?"a net increase in the binary success outcome":b10>b01?"a net decrease in the binary success outcome":null)+" "+causalCaution();
    report=`An exact McNemar test was used for paired binary outcomes. There were ${b01} changes from 0 to 1 and ${b10} changes from 1 to 0; ${same} pairs were concordant. The exact two-sided p-value was ${Stats.pFmt(p)}. ${p<.05?"The paired proportions differed significantly at α = .05.":"The paired proportions did not differ significantly at α = .05."}`;
  }
  else if(calc==="hake"){
    const pre=Number(q("pre").value),post=Number(q("post").value); if(!Number.isFinite(pre)||!Number.isFinite(post)||pre<0||pre>=100||post<0||post>100)throw new Error("Enter valid percentages; pre-test must be below 100.");
    const g=(post-pre)/(100-pre);let label=g<.3?"low":g<=.7?"medium":"high";kind=g>=.3?"success":"warning";
    metrics=[["Pre-test",pre.toFixed(1)+"%"],["Post-test",post.toFixed(1)+"%"],["Normalized gain g",Stats.fmt(g,3)]];
    body=`The normalized gain is classified here as ${label}. This is a descriptive index; it has no p-value and no confidence interval without participant-level data.`;
    conclusion=`The observed aggregate learning gain is ${label}. This result can describe the magnitude of improvement but cannot establish statistical significance or causal effectiveness on its own.`;
    report=`The normalized learning gain was calculated using Hake's g = (post − pre)/(100 − pre). The mean pre-test score was ${pre.toFixed(1)}% and the mean post-test score was ${post.toFixed(1)}%, giving g = ${Stats.fmt(g,3)}, interpreted as a ${label} normalized gain. This index was treated as descriptive and was not used as a significance test.`;
  }
  else if(calc==="bespalko"){
    const correct=Number(q("correct").value),total=Number(q("total").value); if(!(total>0)||correct<0||correct>total)throw new Error("Correct operations must be between 0 and the total number of essential operations.");
    const ka=correct/total, mastered=ka>=.7;kind=mastered?"success":"warning";
    metrics=[["Correct operations",correct],["Total operations",total],["Ka",Stats.fmt(ka,3)]];
    body=mastered?`Ka ≥ .70: the predefined mastery threshold is reached.`:`Ka < .70: the predefined mastery threshold is not reached.`;
    conclusion=mastered?`The criterion-referenced mastery threshold was reached. This supports a statement about attainment of the predefined standard, not a causal claim that the teaching method produced the attainment.`:`The predefined mastery threshold was not reached. This does not identify the cause and should not be treated as a significance test.`;
    report=`A criterion-referenced mastery coefficient was calculated as Ka = correct essential operations / total essential operations. The result was Ka = ${Stats.fmt(ka,3)} (${correct}/${total}). Using the predefined threshold Ka ≥ .70, mastery was ${mastered?"classified as achieved":"not classified as achieved"}.`;
  }
  else if(calc==="friedman"){
    const m=Stats.parseMatrix(q("matrix").value); if(m.length<3||m.some(x=>x.length!==m[0].length)||m[0].length<3)throw new Error("Enter at least 3 participants (rows) and 3 repeated measurements (columns), with no missing cells.");
    r=Stats.friedman(m);p=r.p;kind=p<.05?"success":"warning";
    metrics=[["χ²r",Stats.fmt(r.q,3)],["df",r.df],["p",Stats.pFmt(p)]];
    body=`Kendall's W = ${Stats.fmt(r.W,3)}. Mean ranks: ${r.meanRanks.map(x=>Stats.fmt(x,2)).join(", ")}. ${significanceText(p)}`;
    conclusion=(p<.05?"At least one repeated measurement differs from the others. Pairwise follow-up comparisons with multiplicity control are required before identifying where the differences lie.":"The omnibus test does not provide sufficient evidence that the repeated measurements differ.")+" "+causalCaution();
    report=`A Friedman test was used to compare ${r.k} repeated measurements for ${r.n} participants. The omnibus result was χ²(${r.df}) = ${Stats.fmt(r.q,3)}, p ${Stats.pFmt(p)}, with Kendall's W = ${Stats.fmt(r.W,3)}. Mean ranks across measurement occasions were ${r.meanRanks.map(x=>Stats.fmt(x,2)).join(", ")}.`;
  }
  else if(calc==="mannWhitney"){
    const a=Stats.parseNums(q("group1").value),b=Stats.parseNums(q("group2").value);validateMin(a.length,2);validateMin(b.length,2);r=Stats.mannWhitney(a,b);p=r.p;kind=p<.05?"success":"warning";
    metrics=[["U",Stats.fmt(r.U,2)],["z (approx.)",Stats.fmt(r.z,3)],["p (approx.)",Stats.pFmt(p)]];
    body=`Median group 1 = ${Stats.fmt(Stats.median(a),2)}; median group 2 = ${Stats.fmt(Stats.median(b),2)}; effect r ≈ ${Stats.fmt(r.r,3)}. The p-value uses a tie-corrected normal approximation.`;
    conclusion=conclusionFor(p,Stats.median(a)>Stats.median(b)?"higher ranks/values in group 1":"higher ranks/values in group 2")+" "+causalCaution();
    report=`A Mann–Whitney U test compared two independent groups (n1 = ${a.length}, n2 = ${b.length}). The test yielded U = ${Stats.fmt(r.U,2)}, z ≈ ${Stats.fmt(r.z,3)}, p ${Stats.pFmt(p)}, with effect size r ≈ ${Stats.fmt(r.r,3)}. The group medians were ${Stats.fmt(Stats.median(a),2)} and ${Stats.fmt(Stats.median(b),2)}, respectively.`;
  }
  else if(calc==="independentT"){
    const a=Stats.parseNums(q("group1").value),b=Stats.parseNums(q("group2").value);validateMin(a.length,3);validateMin(b.length,3);r=Stats.independentT(a,b,true);p=r.p;kind=p<.05?"success":"warning";const ci=Stats.welchDiffCI(a,b);
    metrics=[["Welch t",Stats.fmt(r.t,3)],["df",Stats.fmt(r.df,2)],["p",Stats.pFmt(p)]];
    body=`Mean difference (group 1 − group 2) = ${Stats.fmt(ci.diff,3)}, 95% CI ${ciText(ci.low,ci.high,3)}; Cohen's d = ${Stats.fmt(r.d,3)}; Hedges' g = ${Stats.fmt(r.g,3)}.`;
    conclusion=conclusionFor(p,ci.diff>0?"a higher mean in group 1":"a higher mean in group 2")+" "+causalCaution();
    report=`A Welch independent-samples t-test compared group 1 (n = ${r.n1}, M = ${Stats.fmt(r.m1,2)}) and group 2 (n = ${r.n2}, M = ${Stats.fmt(r.m2,2)}). The mean difference was ${Stats.fmt(ci.diff,3)}, 95% CI ${ciText(ci.low,ci.high,3)}. The result was ${p<.05?"statistically significant":"not statistically significant"}, t(${Stats.fmt(r.df,2)}) = ${Stats.fmt(r.t,3)}, p ${Stats.pFmt(p)}. Effect sizes were Cohen's d = ${Stats.fmt(r.d,3)} and Hedges' g = ${Stats.fmt(r.g,3)}.`;
  }
  else if(calc==="fisher"){
    const a=Number(q("c11").value),b=Number(q("c12").value),c=Number(q("c21").value),d=Number(q("c22").value);if([a,b,c,d].some(x=>!Number.isInteger(x)||x<0))throw new Error("All four cells must be non-negative integers.");
    r=Stats.fisherExact2x2(a,b,c,d);p=r.p;kind=p<.05?"success":"warning";const ci=Stats.logOddsRatioCI(a,b,c,d);
    metrics=[["Exact p",Stats.pFmt(p)],["Odds ratio",Number.isFinite(r.or)?Stats.fmt(r.or,3):"∞"],["N",a+b+c+d]];
    body=`Approximate 95% CI for the odds ratio (Haldane–Anscombe correction if needed): ${ciText(ci[0],ci[1],3)}. ${significanceText(p)}`;
    conclusion=conclusionFor(p,null)+" Association in a 2×2 table is not, on its own, evidence of causation.";
    report=`Fisher's exact test was used for a 2×2 contingency table (N = ${a+b+c+d}). The exact two-sided p-value was ${Stats.pFmt(p)}. The odds ratio was ${Number.isFinite(r.or)?Stats.fmt(r.or,3):"infinite"}, with an approximate 95% CI ${ciText(ci[0],ci[1],3)}.`;
  }
  else if(calc==="chiSquare"){
    const m=Stats.parseMatrix(q("matrix").value);if(m.length<2||m.some(x=>x.length!==m[0].length)||m[0].length<2||m.flat().some(x=>x<0||!Number.isFinite(x)))throw new Error("Enter a rectangular contingency table with at least 2 rows and 2 columns.");
    r=Stats.chiSquare(m);p=r.p;kind=p<.05?"success":"warning";
    metrics=[["χ²",Stats.fmt(r.x2,3)],["df",r.df],["p",Stats.pFmt(p)]];
    body=`Cramér's V = ${Stats.fmt(r.V,3)}; smallest expected count = ${Stats.fmt(r.minExpected,2)}. ${r.minExpected<5?"Warning: the chi-square approximation is questionable because at least one expected cell count is below 5. ":""}${significanceText(p)}`;
    conclusion=(p<.05?"The categorical variables/distributions are statistically associated.":"The test does not provide sufficient evidence of a categorical association.")+" Association does not establish causation.";
    report=`A Pearson chi-square test examined the contingency table (N = ${r.n}). The result was χ²(${r.df}) = ${Stats.fmt(r.x2,3)}, p ${Stats.pFmt(p)}, with Cramér's V = ${Stats.fmt(r.V,3)}. The smallest expected cell count was ${Stats.fmt(r.minExpected,2)}.${r.minExpected<5?" Because an expected count was below 5, the chi-square approximation should be interpreted cautiously.":""}`;
  }
  else if(calc==="spearman"||calc==="pearson"){
    const [x,y]=parsePair();validateMin(x.length,4);const corr=calc==="spearman"?Stats.spearman(x,y):Stats.pearson(x,y);const t=corr*Math.sqrt((x.length-2)/(1-corr*corr));p=Stats.studentTP(t,x.length-2,true);kind=p<.05?"success":"warning";const ci=Stats.correlationCI(corr,x.length);
    metrics=[[calc==="spearman"?"rs":"r",Stats.fmt(corr,3)],["N",x.length],["p",Stats.pFmt(p)]];
    body=`Approximate 95% CI = ${ciText(ci[0],ci[1],3)}. ${significanceText(p)} ${calc==="pearson"?"Pearson correlation assumes an approximately linear relationship and is sensitive to outliers.":"Spearman correlation assesses monotonic association using ranks."}`;
    conclusion=(p<.05?`There is statistical evidence of a ${corr>0?"positive":"negative"} association between the two indicators.`:"The data do not provide sufficient evidence of a non-zero association at α = .05.")+" Correlation must not be reported as proof that one indicator causes the other or as the primary proof of teaching-method effectiveness.";
    report=`A ${calc==="spearman"?"Spearman rank-order":"Pearson product–moment"} correlation was calculated for ${x.length} paired observations. The coefficient was ${calc==="spearman"?"rs":"r"} = ${Stats.fmt(corr,3)}, approximate 95% CI ${ciText(ci[0],ci[1],3)}, p ${Stats.pFmt(p)}.`;
  }
  else if(calc==="cronbach"){
    const m=Stats.parseMatrix(q("matrix").value);if(m.length<3||m.some(x=>x.length!==m[0].length)||m[0].length<2)throw new Error("Enter respondents as rows and at least two items as columns.");
    r=Stats.cronbach(m);kind=r.alpha>=.7?"success":"warning";
    metrics=[["Cronbach's α",Stats.fmt(r.alpha,3)],["Respondents",r.n],["Items",r.k]];
    body=r.alpha>=.95?`Internal consistency is extremely high (α > .95), which can indicate redundant items.`:r.alpha>=.8?`Internal consistency is good for exploratory educational measurement.`:r.alpha>=.7?`Internal consistency is conventionally acceptable.`:`α < .70: internal consistency may be insufficient for strong interpretation.`;
    conclusion=`The scale's internal consistency is ${r.alpha>=.8?"good":r.alpha>=.7?"acceptable":"potentially insufficient"} by conventional heuristic criteria. Alpha is evidence about reliability, not unidimensionality, construct validity or teaching effectiveness.`;
    report=`Internal consistency was evaluated using Cronbach's alpha for ${r.k} items and ${r.n} respondents. The coefficient was α = ${Stats.fmt(r.alpha,3)}. This value was interpreted as ${r.alpha>=.8?"good":r.alpha>=.7?"acceptable":"below the conventional .70 threshold"} internal consistency, while recognizing that alpha alone does not establish scale validity.`;
  }
  else if(calc==="kappa"){
    const a=Stats.parseLabels(q("labels1").value),b=Stats.parseLabels(q("labels2").value);if(!a.length||a.length!==b.length)throw new Error("Enter one category label per line for each rater, with the same number of rated objects.");
    r=Stats.cohenKappa(a,b);p=r.p;kind=r.kappa>=.6?"success":"warning";
    metrics=[["κ",Stats.fmt(r.kappa,3)],["Observed agreement",(r.po*100).toFixed(1)+"%"],["p",Stats.pFmt(p)]];
    const lbl=r.kappa<.4?"weak":r.kappa<.6?"moderate":r.kappa<.8?"good":"very strong";
    body=`Chance-corrected agreement is ${lbl}. Observed agreement = ${(r.po*100).toFixed(1)}%; expected chance agreement = ${(r.pe*100).toFixed(1)}%.`;
    conclusion=`The two raters show ${lbl} agreement beyond chance. If agreement is not adequate for the intended use, revise the rubric and conduct rater calibration before using expert ratings as outcome data.`;
    report=`Inter-rater agreement between two raters was assessed using Cohen's kappa across ${r.n} rated objects. Observed agreement was ${(r.po*100).toFixed(1)}%, and κ = ${Stats.fmt(r.kappa,3)}, p ${Stats.pFmt(p)}, indicating ${lbl} agreement beyond chance.`;
  }
  else if(calc==="kendallW"){
    const m=Stats.parseMatrix(q("matrix").value);if(m.length<3||m.some(x=>x.length!==m[0].length)||m[0].length<3)throw new Error("Enter objects as rows and at least three raters as columns; values should be ranks.");
    r=Stats.kendallW(m);p=r.p;kind=r.W>=.7&&p<.05?"success":"warning";
    metrics=[["Kendall's W",Stats.fmt(r.W,3)],["χ²",Stats.fmt(r.chi,3)],["p",Stats.pFmt(p)]];
    body=`W ranges from 0 (no concordance) to 1 (complete concordance). This site treats W ≥ .70 as a strong-practical-agreement benchmark.`;
    conclusion=`Expert concordance is ${r.W>=.7?"strong enough to meet the site's predefined .70 benchmark":"below the site's predefined .70 benchmark"}. Statistical significance alone is not sufficient if W is substantively weak.`;
    report=`Agreement among ${r.m} raters ranking ${r.n} objects was assessed using Kendall's coefficient of concordance. The result was W = ${Stats.fmt(r.W,3)}, χ²(${r.df}) = ${Stats.fmt(r.chi,3)}, p ${Stats.pFmt(p)}.`;
  }
  else if(calc==="anova"){
    const lines=q("groups").value.trim().split(/\n+/).filter(Boolean),groups=lines.map(line=>Stats.parseNums(line));if(groups.length<3||groups.some(g=>g.length<2))throw new Error("Enter at least three groups, one group per line, with at least two observations in each.");
    r=Stats.oneWayANOVA(groups);p=r.p;kind=p<.05?"success":"warning";
    metrics=[["F",Stats.fmt(r.F,3)],["df",`${r.df1}, ${r.df2}`],["p",Stats.pFmt(p)]];
    body=`η² = ${Stats.fmt(r.eta2,3)}. Group means: ${r.means.map(x=>Stats.fmt(x,2)).join(", ")}. ${significanceText(p)}`;
    conclusion=(p<.05?"At least one group mean differs. Post-hoc comparisons with multiplicity control are needed before stating which groups differ.":"The omnibus ANOVA does not provide sufficient evidence that the group means differ.")+" "+causalCaution();
    report=`A one-way ANOVA compared ${r.k} independent groups (total N = ${r.N}). The omnibus result was F(${r.df1}, ${r.df2}) = ${Stats.fmt(r.F,3)}, p ${Stats.pFmt(p)}, with η² = ${Stats.fmt(r.eta2,3)}. Group means were ${r.means.map(x=>Stats.fmt(x,2)).join(", ")}.${p<.05?" Because the omnibus test was significant, post-hoc comparisons are required to identify specific group differences.":""}`;
  }
  showResult(kind,"Analysis result",metrics,body,conclusion,report);
 }catch(e){
   const box=q("result");box.className="result danger";box.innerHTML=`<h3>Input problem</h3><div class="muted">${escHtml(e.message)}</div>`;
 }
}
function escHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
document.addEventListener("DOMContentLoaded",()=>q("calculateBtn")?.addEventListener("click",calculate));
