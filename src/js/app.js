// Interface: pages, rendering, and the privacy counter. All checking happens in analyzer.js.
(function(){
"use strict";
var A=window.Analyzer,D=window.AppData,NS="http://www.w3.org/2000/svg",first=true,net=0;
function $(i){return document.getElementById(i)}
function h(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n}
function btn(label,cls,fn){var b=h("button",cls||"btn",label);b.type="button";if(fn)b.onclick=fn;return b}
function reqCount(){try{return performance.getEntriesByType("resource").length}catch(e){return 0}}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var TITLES={home:"Second Look: check a message before you act",check:"Check a message | Second Look",practice:"Practice | Second Look",answers:"All questions and answers | Second Look",learn:"Common scams | Second Look",words:"Words to know | Second Look",help:"If it already happened | Second Look",family:"Family plan | Second Look",accuracy:"Accuracy | Second Look",privacy:"Privacy | Second Look",about:"About | Second Look"};
var MORE={answers:1,words:1,family:1,accuracy:1,privacy:1,about:1};
var VERDICT={
 scam:{head:"This looks like a scam",body:"Don’t click, reply, or send anything."},
 warn:{head:"Be careful with this one",body:"Some things don’t add up. Check before you act."},
 ok:{head:"No warning signs found",body:"That doesn’t make it safe. If it asks for money or personal details, check another way."}};
var NEXT=["Don’t use any link or phone number in the message.","Contact the company using the number on your card, or a website you already know.","Tell someone you trust before you send money or information.","Report scams at reportfraud.ftc.gov."];

/* ---------- display preferences ---------- */
var prefs={size:0,high:false},SIZES=[100,115,130,150];
function loadPrefs(){try{var p=JSON.parse(localStorage.getItem("sl-prefs")||"{}");prefs.size=Math.max(0,Math.min(3,+p.size||0));prefs.high=!!p.high}catch(e){}}
function applyPrefs(){
  document.documentElement.style.fontSize=SIZES[prefs.size]+"%";
  if(prefs.high)document.documentElement.setAttribute("data-contrast","high");else document.documentElement.removeAttribute("data-contrast");
  $("contrast").setAttribute("aria-pressed",String(prefs.high));
  try{localStorage.setItem("sl-prefs",JSON.stringify(prefs))}catch(e){}
}
function printEl(el){el.classList.add("print-target");window.print();setTimeout(function(){el.classList.remove("print-target")},600)}

/* ---------- routing ---------- */
function route(){
  var k=location.hash.replace(/^#\/?/,"").split("?")[0]||"home";
  if(!TITLES[k])k="home";
  Object.keys(TITLES).forEach(function(p){$("p-"+p).hidden=p!==k});
  document.querySelectorAll("header nav a").forEach(function(a){if(a.dataset.p===k)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  var more=$("more");more.open=false;more.classList.toggle("has-current",!!MORE[k]);
  document.title=TITLES[k];
  var hd=document.querySelector("#p-"+k+" h1");
  if(hd&&!first){hd.setAttribute("tabindex","-1");hd.focus({preventScroll:true})}
  first=false;window.scrollTo(0,0);
}

/* ---------- results ---------- */
function gauge(score,level){
  var s=document.createElementNS(NS,"svg");
  s.setAttribute("viewBox","0 0 200 120");s.setAttribute("class","gauge "+level);s.setAttribute("role","img");s.setAttribute("aria-label","Warning score "+score+" out of 100");
  function p(c){var e=document.createElementNS(NS,"path");e.setAttribute("d","M 20 100 A 80 80 0 0 1 180 100");e.setAttribute("class",c);return e}
  var val=p("g-val");val.style.strokeDasharray="251.3";val.style.strokeDashoffset="251.3";
  s.appendChild(p("g-track"));s.appendChild(val);
  var t=document.createElementNS(NS,"text");t.setAttribute("x","100");t.setAttribute("y","94");t.setAttribute("text-anchor","middle");t.setAttribute("class","g-num");t.textContent=score;s.appendChild(t);
  requestAnimationFrame(function(){requestAnimationFrame(function(){val.style.strokeDashoffset=String(251.3*(1-score/100))})});
  return s;
}
function verdictBlock(res){
  var V=VERDICT[res.level],box=h("div","verdict "+res.level),t=h("div");
  box.appendChild(gauge(res.score,res.level));
  t.appendChild(h("h2",null,V.head));t.appendChild(h("p",null,V.body));
  t.appendChild(h("p","meta","Warning score "+res.score+" of 100"));
  box.appendChild(t);return box;
}
function highlight(res){
  var text=res.text,title={};res.findings.forEach(function(f){title[f.id]=f.title});
  var m=res.marks.slice().sort(function(a,b){return a.s-b.s||b.e-a.e}),last=0,p=h("p","msg");
  m.forEach(function(k){
    if(k.s<last)return;
    if(k.s>last)p.appendChild(document.createTextNode(text.slice(last,k.s)));
    var el=h("mark","hl-"+(k.id==="links"?"link":"flag"),text.slice(k.s,k.e));el.title=title[k.id]||"";p.appendChild(el);last=k.e;
  });
  if(last<text.length)p.appendChild(document.createTextNode(text.slice(last)));
  return p;
}
function summaryText(res){
  var V=VERDICT[res.level];
  return "Second Look checked a message. Result: "+V.head+" (warning score "+res.score+" of 100)."+(res.findings.length?" Reasons: "+res.findings.slice(0,4).map(function(f){return f.title}).join("; ")+".":"")+" Advice: don’t use links or phone numbers in the message, and contact the company using a number you already trust.";
}
function copyText(t,done){
  function fb(){var ta=h("textarea");ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand("copy")}catch(e){}document.body.removeChild(ta);done()}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,fb);else fb();
}
function renderResult(res,box){
  box.textContent="";box.hidden=false;
  var vb=verdictBlock(res);box.appendChild(vb);
  var todo=h("div","card todo");todo.appendChild(h("h2",null,res.level==="ok"?"Still unsure? Do this":"What to do now"));
  var ol=h("ol");NEXT.forEach(function(s){ol.appendChild(h("li",null,s))});todo.appendChild(ol);
  if(res.truncated)todo.appendChild(h("p","meta","This message was long, so only the first 5,000 characters were checked."));
  var cb=btn("Copy a summary to share","btn"),st=h("span","meta");st.setAttribute("role","status");
  cb.onclick=function(){copyText(summaryText(res),function(){st.textContent="Copied. The message itself was not included."})};
  var cr=h("p");cr.appendChild(cb);todo.appendChild(cr);todo.appendChild(st);box.appendChild(todo);
  box.appendChild(h("h2","sec","What we noticed"));
  if(!res.findings.length)box.appendChild(h("div","card","We didn’t find the usual warning signs in this message."));
  res.findings.forEach(function(f){
    var c=h("div","card find "+(f.w>=20?"hi":f.w>=12?"mid":""));
    c.appendChild(h("h2",null,f.title));c.appendChild(h("p",null,f.why));
    if(f.snips.length){var p=h("p");f.snips.forEach(function(s){p.appendChild(h("q",null,s))});c.appendChild(p)}
    c.appendChild(h("p","tipline",f.tip));box.appendChild(c);
  });
  var mc=h("div","card");mc.appendChild(h("h2",null,"Your message, marked up"));mc.appendChild(highlight(res));
  mc.appendChild(h("p","meta","Yellow underline: a warning phrase. Red wavy underline: a suspicious link."));box.appendChild(mc);
  if(res.links.length){
    var lc=h("div","card");lc.appendChild(h("h2",null,"Links in this message"));
    res.links.forEach(function(l){
      var r=h("div","linkrow");r.appendChild(h("strong",null,l.host));
      if(l.flags.length){var ul=h("ul");l.flags.forEach(function(f){ul.appendChild(h("li",null,f))});r.appendChild(ul)}
      else r.appendChild(h("p","meta","Nothing odd about this address."));
      lc.appendChild(r);
    });
    lc.appendChild(h("p","meta","We only read the address. We never open the link."));box.appendChild(lc);
  }
  var hd=vb.querySelector("h2");hd.setAttribute("tabindex","-1");
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
  box.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});hd.focus({preventScroll:true});
}
function run(){
  var text=$("msg").value,err=$("err");
  if(!text.trim()){err.textContent="Paste a message first, then check it.";err.hidden=false;$("msg").focus();return}
  err.hidden=true;
  var before=reqCount(),res=A.analyze(text);
  renderResult(res,$("result"));
  setTimeout(function(){net+=Math.max(0,reqCount()-before);$("netcount").textContent=String(net)},150);
}

/* ---------- explanations shared by the quiz and the answer key ---------- */
function detailBlock(it,into){
  into.appendChild(h("p",null,it.why));
  into.appendChild(h("h3",null,it.scam?"What to look for":"Why it looks safe"));
  var ul=h("ul");it.signs.forEach(function(s){ul.appendChild(h("li",null,s))});into.appendChild(ul);
  var p=h("p");p.appendChild(h("strong",null,"What to do: "));p.appendChild(document.createTextNode(it.todo));into.appendChild(p);
}

/* ---------- practice quiz ---------- */
function quiz(){
  var box=$("quiz");box.textContent="";
  box.appendChild(h("h2",null,"Ready to practice?"));
  box.appendChild(h("p",null,"There are "+D.PRACTICE.length+" messages in all. Pick a short round or try them all. The answer key shows every message with its explanation any time."));
  var row=h("div","row2");
  row.appendChild(btn("Quick round (10)","btn primary",function(){play(10)}));
  row.appendChild(btn("All "+D.PRACTICE.length+" messages","btn",function(){play(D.PRACTICE.length)}));
  box.appendChild(row);
  var l=h("p"),a=h("a",null,"See all questions and answers");a.href="#/answers";l.appendChild(a);box.appendChild(l);
}
function play(count){
  var box=$("quiz"),items=shuffle(D.PRACTICE).slice(0,count),i=0,right=0,unsure=0,missed=[];
  function head(){box.appendChild(h("p","meta","Message "+(i+1)+" of "+items.length));box.appendChild(h("p","msg",items[i].text))}
  function show(){
    box.textContent="";
    if(i>=items.length)return finish();
    head();
    var row=h("div","row3");
    row.appendChild(btn("It’s a scam","btn",function(){pick(true)}));
    row.appendChild(btn("Looks real","btn",function(){pick(false)}));
    row.appendChild(btn("I’m not sure","btn",function(){pick(null)}));
    box.appendChild(row);
  }
  function pick(say){
    var it=items[i],ok=say===it.scam,cls,line;
    if(say===null){unsure++;cls="";line="No problem. Here is the answer: this "+(it.scam?"was a scam":"one was real")+"."}
    else if(ok){right++;cls="good";line="Correct. This "+(it.scam?"was a scam":"one was real")+"."}
    else{missed.push(it);cls="bad";line="Not quite. This "+(it.scam?"was a scam":"one was real")+"."}
    box.textContent="";head();
    var fb=h("div","feedback "+cls);fb.setAttribute("role","status");
    fb.appendChild(h("strong",null,line+" ("+it.kind+")"));detailBlock(it,fb);
    fb.appendChild(h("p","meta","Second Look’s score for this message: "+A.analyze(it.text).score+" of 100."));
    box.appendChild(fb);
    var nx=btn(i+1<items.length?"Next message":"See my score","btn primary",function(){i++;show()});box.appendChild(nx);nx.focus();
  }
  function finish(){
    box.appendChild(h("h2",null,"You got "+right+" of "+items.length+" right"));
    if(unsure)box.appendChild(h("p","meta",unsure+" marked “I’m not sure”."));
    box.appendChild(h("p",null,right>=items.length-1?"Great eye. You would spot most of these in real life.":"Good effort. Scammers count on you rushing, so slow down and look for pressure, fear, and requests for money."));
    if(missed.length){box.appendChild(h("h3",null,"Ones to review"));var ul=h("ul");missed.forEach(function(m){ul.appendChild(h("li",null,m.kind+": "+m.text.slice(0,70)+(m.text.length>70?"…":"")))});box.appendChild(ul);
      var a=h("a",null,"Open the answer key to study them");a.href="#/answers";var p=h("p");p.appendChild(a);box.appendChild(p)}
    var row=h("div","row2");row.appendChild(btn("Play again","btn primary",function(){play(count)}));row.appendChild(btn("Back to start","btn",quiz));box.appendChild(row);
  }
  show();
}

/* ---------- answer key ---------- */
var bank={f:"all",q:"",open:true};
function renderBank(){
  var list=$("bank");list.textContent="";var n=0,qq=bank.q.toLowerCase();
  D.PRACTICE.forEach(function(it){
    if(bank.f==="scam"&&!it.scam)return;if(bank.f==="real"&&it.scam)return;
    if(qq&&(it.text+" "+it.kind+" "+it.why).toLowerCase().indexOf(qq)<0)return;
    n++;
    var d=h("details","card bankitem");d.open=bank.open;
    var s=h("summary");s.appendChild(h("span","badge "+(it.scam?"scam":"real"),it.scam?"Scam":"Real"));s.appendChild(h("strong",null,it.kind));s.appendChild(h("span","bmsg",it.text));d.appendChild(s);
    var inner=h("div","inner");detailBlock(it,inner);inner.appendChild(h("p","meta","Second Look’s score for this message: "+A.analyze(it.text).score+" of 100."));d.appendChild(inner);list.appendChild(d);
  });
  if(!n)list.appendChild(h("div","card","No messages match. Try a different word."));
  $("bankCount").textContent="Showing "+n+" of "+D.PRACTICE.length+" messages";
}

/* ---------- accuracy tests ---------- */
function statBox(big,label){var d=h("div","stat");d.appendChild(h("strong",null,big));d.appendChild(h("span",null,label));return d}
function listBox(title,lines){var d=h("details");d.appendChild(h("summary",null,title+" ("+lines.length+")"));lines.forEach(function(l){d.appendChild(h("p",null,l))});return d}
function makeTests(){
  var scams=D.TESTSET.filter(function(x){return x.scam}),real=D.TESTSET.filter(function(x){return !x.scam}),links=D.LINKSET;
  var fakeN=links.filter(function(l){return l.fake}).length,goodN=links.length-fakeN;
  return [
  {name:"Scam message test",
   what:"Scores "+scams.length+" scam messages covering bank alerts, fake packages, family emergencies, fake checks, job offers and more.",
   how:"Each message is checked as it would be on the Check page. A score of 25 or more counts as a warning, and 55 or more as a likely scam.",
   trust:"If scams slip through, this test shows it, and it lists every one that did so you can see which kinds are hardest.",
   run:function(){var w=0,s=0,miss=[];scams.forEach(function(x){var r=A.analyze(x.text);if(r.score>=25)w++;else miss.push("Missed ("+r.score+"): "+x.text);if(r.score>=55)s++});
     return {stats:[[w+" of "+scams.length,"scams got a warning"],[s+" of "+scams.length,"were called a likely scam"]],lists:miss.length?[["Scams that were missed",miss]]:[]}}},
  {name:"Real message test",
   what:"Scores "+real.length+" ordinary messages: appointment reminders, delivery notices, bank alerts, login codes, bills and chats with friends.",
   how:"Each message is checked the same way. Any score of 25 or more counts as a false alarm.",
   trust:"A checker that warns about everything is useless. This test shows how often real messages get a wrongly worried result.",
   run:function(){var f=0,miss=[];real.forEach(function(x){var r=A.analyze(x.text);if(r.score>=25){f++;miss.push("False alarm ("+r.score+"): "+x.text)}});
     return {stats:[[f+" of "+real.length,"real messages wrongly warned about"],[(real.length-f)+" of "+real.length,"stayed calm"]],lists:miss.length?[["False alarms",miss]]:[]}}},
  {name:"Link test",
   what:"Checks "+links.length+" web addresses: "+goodN+" genuine ones, such as paypal.com and irs.gov, and "+fakeN+" fakes, such as paypa1.com, shortened links, number addresses and addresses with an @ trick.",
   how:"Each address goes through the link checker. Genuine addresses should raise no flags, and fakes should raise at least one.",
   trust:"Fake links are the most common way scams steal passwords. This test shows whether the checker can tell a real address from a lookalike.",
   run:function(){var okGood=0,okFake=0,miss=[];links.forEach(function(l){var n=A.analyzeUrl({raw:l.u}).flags.length;
       if(l.fake){if(n>0)okFake++;else miss.push("Fake address not flagged: "+l.u)}else{if(n===0)okGood++;else miss.push("Genuine address wrongly flagged: "+l.u)}});
     return {stats:[[okFake+" of "+fakeN,"fake addresses flagged"],[okGood+" of "+goodN,"genuine addresses left alone"]],lists:miss.length?[["Link mistakes",miss]]:[]}}},
  {name:"Disguise test",
   what:"Takes the same "+scams.length+" scam messages and changes how they look: first in ALL CAPITALS, then with extra spaces between words.",
   how:"The wording stays the same, only the formatting changes. The test counts how many scams still get a warning.",
   trust:"Scammers format messages oddly to dodge filters. If the results stay close to the Scam message test, formatting tricks are not fooling the checker.",
   run:function(){var base=0,up=0,sp=0,miss=[];scams.forEach(function(x){
       var b=A.analyze(x.text).score>=25,u=A.analyze(x.text.toUpperCase()).score>=25,s=A.analyze(x.text.replace(/ /g,"   ")).score>=25;
       if(b)base++;if(u)up++;if(s)sp++;if(b&&!(u&&s))miss.push("Stopped warning after formatting changed: "+x.text)});
     return {stats:[[base+" of "+scams.length,"warned as written"],[up+" of "+scams.length,"warned in all capitals"],[sp+" of "+scams.length,"warned with extra spaces"]],lists:miss.length?[["Changed results",miss]]:[]}}},
  {name:"Speed test",
   what:"Checks a message of 5,000 characters, the longest the app reads, 30 times in a row.",
   how:"It measures how long each check takes in your browser.",
   trust:"Safety help has to be quick, even on an older phone. This test measures the time on your own device instead of quoting a number.",
   run:function(){var base=D.EXAMPLES[0].text+" ",t="";while(t.length<5000)t+=base;t=t.slice(0,5000);
     var p=window.performance,times=[];for(var i=0;i<30;i++){var a=p.now();A.analyze(t);times.push(p.now()-a)}
     var sum=0,max=0;times.forEach(function(x){sum+=x;if(x>max)max=x});
     return {stats:[[(sum/30).toFixed(1)+" ms","average time per check"],[max.toFixed(1)+" ms","slowest single check"]],lists:[]}}}
  ];
}
var TESTS=null;
function runTest(i,out){
  var r=TESTS[i].run();out.textContent="";
  var g=h("div","stats");r.stats.forEach(function(s){g.appendChild(statBox(s[0],s[1]))});out.appendChild(g);
  r.lists.forEach(function(l){out.appendChild(listBox(l[0],l[1]))});
  if(!r.lists.length)out.appendChild(h("p","meta","No mistakes in this test."));
}
function buildTests(){
  TESTS=makeTests();var box=$("tests");
  TESTS.forEach(function(t,i){
    var c=h("div","card test");c.appendChild(h("h2",null,(i+1)+". "+t.name));
    [["What it checks: ",t.what],["How it works: ",t.how],["Why it builds trust: ",t.trust]].forEach(function(x){var p=h("p");p.appendChild(h("span","k",x[0]));p.appendChild(document.createTextNode(x[1]));c.appendChild(p)});
    var out=h("div","testout");out.setAttribute("aria-live","polite");
    var a=h("div","actions");a.appendChild(btn("Run this test","btn",function(){runTest(i,out)}));c.appendChild(a);c.appendChild(out);c.dataset.i=i;box.appendChild(c);
  });
  $("runAll").onclick=function(){box.querySelectorAll(".test").forEach(function(c){runTest(+c.dataset.i,c.querySelector(".testout"))})};
}

/* ---------- setup ---------- */
function init(){
  D.EXAMPLES.forEach(function(e){var b=btn(e.label,"chip",function(){$("msg").value=e.text;run()});$(e.kind==="scam"?"exScam":"exReal").appendChild(b)});
  $("run").onclick=run;
  $("clear").onclick=function(){$("msg").value="";$("result").hidden=true;$("err").hidden=true;$("msg").focus()};
  $("msg").addEventListener("keydown",function(e){if((e.ctrlKey||e.metaKey)&&e.key==="Enter")run()});
  var pills=$("pills");["Pressure to hurry","Scary threats","Gift cards and crypto","Requests for codes or passwords","Fake and lookalike links","Fake senders","Family emergency stories","Fake checks","Job and rental scams","Tech support alarms","Surprise charges","Disguised letters"].forEach(function(t){pills.appendChild(h("li",null,t))});
  var demo=$("demo"),r=A.analyze(D.EXAMPLES[0].text);demo.appendChild(verdictBlock(r));
  var ul=h("ul","mini");r.findings.slice(0,3).forEach(function(f){ul.appendChild(h("li",null,f.title))});demo.appendChild(ul);
  var sc=$("scams");D.SCAMS.forEach(function(s){
    var c=h("div","card scam");c.appendChild(h("h2",null,s.name));c.appendChild(h("q",null,s.looks));
    var a=h("p");a.appendChild(h("strong",null,"The giveaway: "));a.appendChild(document.createTextNode(s.tell));c.appendChild(a);
    var b=h("p");b.appendChild(h("strong",null,"What to do: "));b.appendChild(document.createTextNode(s.todo));c.appendChild(b);sc.appendChild(c)});
  var tm=$("terms");D.GLOSSARY.forEach(function(g){var c=h("div","card");c.appendChild(h("h2",null,g[0]));c.appendChild(h("p",null,g[1]));tm.appendChild(c)});
  var hl=$("helpList");D.HELP.forEach(function(x){var d=h("details","card bankitem");d.appendChild(h("summary",null,x.title));var inner=h("div","inner"),ol=h("ol");x.steps.forEach(function(s){ol.appendChild(h("li",null,s))});inner.appendChild(ol);d.appendChild(inner);hl.appendChild(d)});
  $("ruleCount").textContent=String(A.RULES.length+5);
  $("corpusCount").textContent=String(D.CORPUS.scam.length+D.CORPUS.ham.length);
  quiz();renderBank();buildTests();
  document.querySelectorAll(".filters .chip").forEach(function(b){b.onclick=function(){bank.f=b.dataset.f;document.querySelectorAll(".filters .chip").forEach(function(x){x.setAttribute("aria-pressed",String(x===b))});renderBank()}});
  $("bankSearch").addEventListener("input",function(e){bank.q=e.target.value;renderBank()});
  $("expand").onclick=function(){bank.open=true;renderBank()};$("collapse").onclick=function(){bank.open=false;renderBank()};
  $("print").onclick=function(){printEl($("wallet"))};$("printFam").onclick=function(){printEl($("famcard"))};
  loadPrefs();applyPrefs();
  $("smaller").onclick=function(){prefs.size=Math.max(0,prefs.size-1);applyPrefs()};
  $("bigger").onclick=function(){prefs.size=Math.min(3,prefs.size+1);applyPrefs()};
  $("contrast").onclick=function(){prefs.high=!prefs.high;applyPrefs()};
  if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(function(){});
  window.addEventListener("hashchange",route);route();
}
init();
})();
