
const Stats = (() => {
  const EPS = 1e-12;

  function mean(a){ return a.reduce((s,x)=>s+x,0)/a.length; }
  function sum(a){ return a.reduce((s,x)=>s+x,0); }
  function variance(a, sample=true){
    if(a.length < (sample?2:1)) return NaN;
    const m=mean(a); return a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-(sample?1:0));
  }
  function sd(a,sample=true){ return Math.sqrt(variance(a,sample)); }
  function median(a){
    const b=[...a].sort((x,y)=>x-y), n=b.length, h=Math.floor(n/2);
    return n%2?b[h]:(b[h-1]+b[h])/2;
  }
  function quantile(a,q){
    const b=[...a].sort((x,y)=>x-y);
    if(!b.length) return NaN;
    const pos=(b.length-1)*q, base=Math.floor(pos), rest=pos-base;
    return b[base+1]!==undefined?b[base]+rest*(b[base+1]-b[base]):b[base];
  }
  function erf(x){
    const sign=x<0?-1:1; x=Math.abs(x);
    const a1=.254829592,a2=-.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=.3275911;
    const t=1/(1+p*x);
    const y=1-(((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t)*Math.exp(-x*x);
    return sign*y;
  }
  function normalCDF(x){ return .5*(1+erf(x/Math.SQRT2)); }

  function logGamma(z){
    const c=[676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.984369578019571e-6,1.5056327351493116e-7];
    if(z<.5) return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z);
    z-=1; let x=.9999999999998099;
    for(let i=0;i<c.length;i++) x+=c[i]/(z+i+1);
    const t=z+c.length-.5;
    return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x);
  }
  function betacf(a,b,x){
    const MAXIT=200, FPMIN=1e-30;
    let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;
    if(Math.abs(d)<FPMIN)d=FPMIN; d=1/d; let h=d;
    for(let m=1;m<=MAXIT;m++){
      let m2=2*m, aa=m*(b-m)*x/((qam+m2)*(a+m2));
      d=1+aa*d;if(Math.abs(d)<FPMIN)d=FPMIN;c=1+aa/c;if(Math.abs(c)<FPMIN)c=FPMIN;d=1/d;h*=d*c;
      aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));
      d=1+aa*d;if(Math.abs(d)<FPMIN)d=FPMIN;c=1+aa/c;if(Math.abs(c)<FPMIN)c=FPMIN;d=1/d;
      const del=d*c;h*=del;if(Math.abs(del-1)<3e-9)break;
    }
    return h;
  }
  function regIncompleteBeta(x,a,b){
    if(x<=0)return 0;if(x>=1)return 1;
    const bt=Math.exp(logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log(1-x));
    return x<(a+1)/(a+b+2)?bt*betacf(a,b,x)/a:1-bt*betacf(b,a,1-x)/b;
  }
  function studentTCDF(t,df){
    const x=df/(df+t*t);
    const ib=regIncompleteBeta(x,df/2,.5);
    return t>=0?1-.5*ib:.5*ib;
  }
  function studentTP(t,df,two=true){
    const c=studentTCDF(Math.abs(t),df);
    return two?Math.min(1,2*(1-c)):1-c;
  }

  function gammaincSeries(a,x){
    let sum=1/a,del=sum,ap=a;
    for(let n=1;n<=200;n++){ap++;del*=x/ap;sum+=del;if(Math.abs(del)<Math.abs(sum)*3e-10)break;}
    return sum*Math.exp(-x+a*Math.log(x)-logGamma(a));
  }
  function gammaincCF(a,x){
    const FPMIN=1e-30;let b=x+1-a,c=1/FPMIN,d=1/b,h=d;
    for(let i=1;i<=200;i++){
      const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<FPMIN)d=FPMIN;c=b+an/c;if(Math.abs(c)<FPMIN)c=FPMIN;d=1/d;
      const del=d*c;h*=del;if(Math.abs(del-1)<3e-10)break;
    }
    return Math.exp(-x+a*Math.log(x)-logGamma(a))*h;
  }
  function regGammaP(a,x){ if(x<0||a<=0)return NaN; if(x===0)return 0; return x<a+1?gammaincSeries(a,x):1-gammaincCF(a,x); }
  function chiSquareP(x,df){ return Math.max(0,Math.min(1,1-regGammaP(df/2,x/2))); }
  function fCDF(f,d1,d2){ if(f<=0)return 0; return regIncompleteBeta((d1*f)/(d1*f+d2),d1/2,d2/2); }
  function fP(f,d1,d2){ return Math.max(0,Math.min(1,1-fCDF(f,d1,d2))); }

  function rank(a){
    const indexed=a.map((v,i)=>({v,i})).sort((x,y)=>x.v-y.v);
    const r=new Array(a.length); const ties=[];
    let i=0;
    while(i<indexed.length){
      let j=i+1; while(j<indexed.length && Math.abs(indexed[j].v-indexed[i].v)<EPS)j++;
      const avg=(i+1+j)/2;
      for(let k=i;k<j;k++)r[indexed[k].i]=avg;
      if(j-i>1)ties.push(j-i);
      i=j;
    }
    return {ranks:r,ties};
  }
  function pearson(x,y){
    const mx=mean(x),my=mean(y);
    let num=0,dx=0,dy=0;
    for(let i=0;i<x.length;i++){const a=x[i]-mx,b=y[i]-my;num+=a*b;dx+=a*a;dy+=b*b}
    return num/Math.sqrt(dx*dy);
  }
  function spearman(x,y){ return pearson(rank(x).ranks,rank(y).ranks); }

  function logFact(n){ return logGamma(n+1); }
  function logChoose(n,k){ if(k<0||k>n)return -Infinity; return logFact(n)-logFact(k)-logFact(n-k); }
  function binomPMF(k,n,p=.5){ return Math.exp(logChoose(n,k)+k*Math.log(p)+(n-k)*Math.log(1-p)); }
  function binomPValue(k,n,p0=.5,two=true){
    if(!two){
      let s=0; for(let i=k;i<=n;i++)s+=binomPMF(i,n,p0); return Math.min(1,s);
    }
    const pk=binomPMF(k,n,p0); let s=0;
    for(let i=0;i<=n;i++){const pi=binomPMF(i,n,p0); if(pi<=pk+1e-14)s+=pi;}
    return Math.min(1,s);
  }
  function wilson(k,n,z=1.95996398454){
    if(!n)return [NaN,NaN];
    const p=k/n,den=1+z*z/n,ctr=(p+z*z/(2*n))/den,half=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/den;
    return [Math.max(0,ctr-half),Math.min(1,ctr+half)];
  }


  function normalInv(p){
    if(p<=0||p>=1) return NaN;
    const a=[-39.6968302866538,220.946098424521,-275.928510446969,138.357751867269,-30.6647980661472,2.50662827745924];
    const b=[-54.4760987982241,161.585836858041,-155.698979859887,66.8013118877197,-13.2806815528857];
    const c=[-0.00778489400243029,-0.322396458041136,-2.40075827716184,-2.54973253934373,4.37466414146497,2.93816398269878];
    const d=[0.00778469570904146,0.32246712907004,2.445134137143,3.75440866190742];
    const pl=.02425, ph=1-pl; let q,r;
    if(p<pl){q=Math.sqrt(-2*Math.log(p));return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}
    if(p>ph){q=Math.sqrt(-2*Math.log(1-p));return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}
    q=p-.5;r=q*q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  }
  function tCritical95(df){
    // Cornish-Fisher expansion around z=.975; sufficiently accurate for reporting CIs in this teaching tool.
    const z=1.959963984540054, z2=z*z, z3=z2*z, z5=z3*z2, z7=z5*z2;
    return z+(z3+z)/(4*df)+(5*z5+16*z3+3*z)/(96*df*df)+(3*z7+19*z5+17*z3-15*z)/(384*df**3);
  }
  function meanCI(a){
    const n=a.length,m=mean(a),se=sd(a)/Math.sqrt(n),tc=tCritical95(n-1);
    return [m-tc*se,m+tc*se];
  }
  function pairedDiffCI(a,b){
    const d=a.map((x,i)=>b[i]-x),n=d.length,m=mean(d),se=sd(d)/Math.sqrt(n),tc=tCritical95(n-1);
    return [m-tc*se,m+tc*se];
  }
  function welchDiffCI(a,b){
    const n1=a.length,n2=b.length,v1=variance(a),v2=variance(b),diff=mean(a)-mean(b),se=Math.sqrt(v1/n1+v2/n2);
    const df=(v1/n1+v2/n2)**2/((v1*v1)/(n1*n1*(n1-1))+(v2*v2)/(n2*n2*(n2-1)));
    const tc=tCritical95(df); return {low:diff-tc*se,high:diff+tc*se,diff,df};
  }
  function correlationCI(r,n){
    if(n<=3||Math.abs(r)>=1) return [NaN,NaN];
    const z=.5*Math.log((1+r)/(1-r)),se=1/Math.sqrt(n-3),crit=1.95996398454;
    const lo=z-crit*se,hi=z+crit*se;
    return [Math.tanh(lo),Math.tanh(hi)];
  }
  function logOddsRatioCI(a,b,c,d){
    const aa=a===0?.5:a,bb=b===0?.5:b,cc=c===0?.5:c,dd=d===0?.5:d;
    const lor=Math.log((aa*dd)/(bb*cc)),se=Math.sqrt(1/aa+1/bb+1/cc+1/dd),z=1.95996398454;
    return [Math.exp(lor-z*se),Math.exp(lor+z*se)];
  }

  function parseNums(text){
    return text.trim().split(/[\s,;]+/).filter(Boolean).map(Number).filter(Number.isFinite);
  }
  function parseMatrix(text){
    return text.trim().split(/\n+/).map(line=>line.trim()).filter(Boolean).map(line=>line.split(/[\s,;]+/).filter(Boolean).map(Number)).filter(r=>r.length);
  }
  function parseLabels(text){
    return text.trim().split(/\n+/).map(x=>x.trim()).filter(Boolean);
  }
  function fmt(x,d=4){ return Number.isFinite(x)?Number(x).toFixed(d):"–"; }
  function pFmt(p){ if(!Number.isFinite(p))return "–"; if(p<.0001)return "< 0.0001"; return p.toFixed(4); }

  function pairedT(a,b){
    const d=a.map((x,i)=>b[i]-x), n=d.length, md=mean(d), s=sd(d);
    const t=md/(s/Math.sqrt(n)), df=n-1, p=studentTP(t,df,true), effect=md/s;
    return {n,md,sd:s,t,df,p,effect};
  }
  function independentT(a,b,welch=true){
    const n1=a.length,n2=b.length,m1=mean(a),m2=mean(b),v1=variance(a),v2=variance(b);
    let t,df,sp;
    if(welch){
      const se=Math.sqrt(v1/n1+v2/n2); t=(m1-m2)/se;
      df=(v1/n1+v2/n2)**2/((v1*v1)/(n1*n1*(n1-1))+(v2*v2)/(n2*n2*(n2-1)));
      sp=Math.sqrt(((n1-1)*v1+(n2-1)*v2)/(n1+n2-2));
    }else{
      sp=Math.sqrt(((n1-1)*v1+(n2-1)*v2)/(n1+n2-2));
      t=(m1-m2)/(sp*Math.sqrt(1/n1+1/n2)); df=n1+n2-2;
    }
    const d=(m1-m2)/sp, J=1-3/(4*(n1+n2-2)-1), g=d*J;
    return {n1,n2,m1,m2,t,df,p:studentTP(t,df,true),d,g};
  }
  function mannWhitney(a,b){
    const all=a.concat(b), rr=rank(all), n1=a.length,n2=b.length;
    const R1=sum(rr.ranks.slice(0,n1)); const U1=R1-n1*(n1+1)/2; const U2=n1*n2-U1; const U=Math.min(U1,U2);
    const N=n1+n2;
    const tieSum=rr.ties.reduce((s,t)=>s+t**3-t,0);
    const varU=n1*n2/12*((N+1)-tieSum/(N*(N-1)));
    const z=(Math.abs(U-n1*n2/2)-.5)/Math.sqrt(varU);
    const p=Math.min(1,2*(1-normalCDF(z)));
    const r=z/Math.sqrt(N);
    return {U,U1,U2,z,p,r,R1};
  }
  function wilcoxon(a,b){
    const diffs=b.map((v,i)=>v-a[i]).filter(d=>Math.abs(d)>EPS);
    const abs=diffs.map(Math.abs), rr=rank(abs), n=diffs.length;
    let Wp=0,Wm=0;
    diffs.forEach((d,i)=>{if(d>0)Wp+=rr.ranks[i];else Wm+=rr.ranks[i]});
    const T=Math.min(Wp,Wm), total=n*(n+1)/2;
    let p;
    if(n<=26){
      const scaled=rr.ranks.map(x=>Math.round(x*2)); const target=Math.round(T*2), max=scaled.reduce((a,b)=>a+b,0);
      let dp=new Array(max+1).fill(0);dp[0]=1;
      for(const w of scaled){for(let s=max;s>=w;s--)dp[s]+=dp[s-w]}
      const ways=2**n; let tail=0;
      for(let s=0;s<=target;s++)tail+=dp[s]||0;
      p=Math.min(1,2*tail/ways);
    } else {
      const tieSum=rr.ties.reduce((s,t)=>s+t*(t+1)*(2*t+1),0);
      const mu=total/2, varianceW=n*(n+1)*(2*n+1)/24-tieSum/48;
      const z=(Math.abs(Wp-mu)-.5)/Math.sqrt(varianceW);
      p=Math.min(1,2*(1-normalCDF(z)));
    }
    const zEff=(T-total/2)/Math.sqrt(n*(n+1)*(2*n+1)/24);
    return {n,Wp,Wm,T,p,r:Math.abs(zEff)/Math.sqrt(n)};
  }
  function chiSquare(table){
    const r=table.length,c=table[0].length,row=table.map(x=>sum(x)),col=Array(c).fill(0);
    table.forEach(x=>x.forEach((v,j)=>col[j]+=v));
    const n=sum(row);let x2=0,minExpected=Infinity;
    const expected=table.map((x,i)=>x.map((v,j)=>{const e=row[i]*col[j]/n;minExpected=Math.min(minExpected,e);x2+=(v-e)**2/e;return e}));
    const df=(r-1)*(c-1),p=chiSquareP(x2,df),V=Math.sqrt(x2/(n*Math.min(r-1,c-1)));
    return {x2,df,p,V,n,expected,minExpected};
  }
  function fisherExact2x2(a,b,c,d){
    const r1=a+b,r2=c+d,c1=a+c,n=r1+r2;
    const min=Math.max(0,c1-r2),max=Math.min(r1,c1);
    const lp=(x)=>logChoose(c1,x)+logChoose(n-c1,r1-x)-logChoose(n,r1);
    const obs=Math.exp(lp(a));let p=0;
    for(let x=min;x<=max;x++){const pr=Math.exp(lp(x));if(pr<=obs+1e-14)p+=pr}
    const or=(b*c===0)?(a*d===0?NaN:Infinity):(a*d)/(b*c);
    return {p:Math.min(1,p),or};
  }
  function friedman(matrix){
    const n=matrix.length,k=matrix[0].length, rankRows=matrix.map(row=>rank(row).ranks), sums=Array(k).fill(0);
    rankRows.forEach(r=>r.forEach((v,j)=>sums[j]+=v));
    const q=12/(n*k*(k+1))*sums.reduce((s,x)=>s+x*x,0)-3*n*(k+1);
    const df=k-1,p=chiSquareP(q,df),W=q/(n*(k-1));
    return {n,k,q,df,p,W,rankSums:sums,meanRanks:sums.map(x=>x/n)};
  }
  function oneWayANOVA(groups){
    const k=groups.length, ns=groups.map(g=>g.length),N=sum(ns),means=groups.map(mean),grand=sum(groups.map((g,i)=>sum(g)))/N;
    let ssb=0,ssw=0;
    groups.forEach((g,i)=>{ssb+=g.length*(means[i]-grand)**2;g.forEach(x=>ssw+=(x-means[i])**2)});
    const df1=k-1,df2=N-k,msb=ssb/df1,msw=ssw/df2,F=msb/msw,p=fP(F,df1,df2),eta2=ssb/(ssb+ssw);
    return {k,N,means,grand,ssb,ssw,df1,df2,F,p,eta2};
  }
  function cronbach(matrix){
    const n=matrix.length,k=matrix[0].length;
    const itemVars=Array(k).fill(0).map((_,j)=>variance(matrix.map(r=>r[j])));
    const totals=matrix.map(r=>sum(r)), totalVar=variance(totals);
    const alpha=k/(k-1)*(1-sum(itemVars)/totalVar);
    return {n,k,alpha};
  }
  function cohenKappa(a,b){
    const cats=[...new Set(a.concat(b))], idx=Object.fromEntries(cats.map((c,i)=>[c,i])), k=cats.length;
    const table=Array.from({length:k},()=>Array(k).fill(0));
    for(let i=0;i<a.length;i++)table[idx[a[i]]][idx[b[i]]]++;
    const n=a.length,row=table.map(sum),col=Array(k).fill(0);table.forEach(r=>r.forEach((v,j)=>col[j]+=v));
    const agree=table.reduce((s,r,i)=>s+r[i],0),po=agree/n,pe=row.reduce((s,v,i)=>s+v*col[i],0)/(n*n),kappa=(po-pe)/(1-pe);
    const se=Math.sqrt(Math.max(EPS,po*(1-po)/(n*(1-pe)**2))); const z=kappa/se,p=Math.min(1,2*(1-normalCDF(Math.abs(z))));
    return {cats,table,n,po,pe,kappa,z,p};
  }
  function kendallW(matrix){
    const n=matrix.length,m=matrix[0].length;
    const sums=matrix.map(r=>sum(r)),meanSum=mean(sums),S=sums.reduce((s,x)=>s+(x-meanSum)**2,0);
    let tieTerm=0;
    for(let j=0;j<m;j++){
      const col=matrix.map(r=>r[j]); const counts={}; col.forEach(v=>counts[v]=(counts[v]||0)+1);
      tieTerm+=Object.values(counts).reduce((s,t)=>s+(t>1?t**3-t:0),0);
    }
    const denom=m*m*(n**3-n)-m*tieTerm;
    const W=12*S/denom, chi=m*(n-1)*W, df=n-1,p=chiSquareP(chi,df);
    return {n,m,W,chi,df,p};
  }
  return {mean,sum,variance,sd,median,quantile,normalCDF,normalInv,tCritical95,meanCI,pairedDiffCI,welchDiffCI,correlationCI,logOddsRatioCI,studentTP,chiSquareP,fP,rank,pearson,spearman,
    binomPValue,wilson,parseNums,parseMatrix,parseLabels,fmt,pFmt,pairedT,independentT,mannWhitney,wilcoxon,
    chiSquare,fisherExact2x2,friedman,oneWayANOVA,cronbach,cohenKappa,kendallW};
})();
