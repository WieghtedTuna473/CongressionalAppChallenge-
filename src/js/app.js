// Interface: pages, rendering, and the privacy counter. All checking happens in analyzer.js.
(function(){
"use strict";
var A=window.Analyzer,D=window.AppData,NS="http://www.w3.org/2000/svg",first=true,net=0;
function $(i){return document.getElementById(i)}
function h(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n}
function reqCount(){try{return performance.getEntriesByType("resource").length}catch(e){return 0}}
var TITLES={practice:"Practice | Second Look",accuracy:"Accuracy | Second Look",home:"Second Look: check a message before you act",check:"Check a message | Second Look",learn:"Common scams | Second Look",privacy:"Privacy | Second Look"};
var VERDICT={
 scam:{head:"This looks like a scam",body:"Don’t click, reply, or send anything."},
 warn:{head:"Be careful with this one",body:"Some things don’t add up. Check before you act."},
 ok:{head:"No warning signs found",body:"That doesn’t make it safe. If it asks for money or personal details, check another way."}};
var NEXT=["Don’t use any link or phone number in the message.","Contact the company using the number on your card, or a website you already know.","Tell someone you trust before you send money or information.","Report scams at reportfraud.ftc.gov."];

var prefs={size:0,high:false},SIZES=[100,115,130,150];
function loadPrefs(){try{var p=JSON.parse(localStorage.getItem("sl-prefs")||"{}");prefs.size=Math.max(0,Math.min(3,+p.size||0));prefs.high=!!p.high}catch(e){}}
function applyPrefs(){
  document.documentElement.style.fontSize=SIZES[prefs.size]+"%";
  if(prefs.high)document.documentElement.setAttribute("data-contrast","high");else document.documentElement.removeAttribute("data-contrast");
  $("contrast").setAttribute("aria-pressed",String(prefs.high));
  try{localStorage.setItem("sl-prefs",JSON.stringify(prefs))}catch(e){}
}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function summaryText(res){
  var V=VERDICT[res.level];
  return "Second Look checked a message. Result: "+V.head+" (warning score "+res.score+" of 100)."+(res.findings.length?" Reasons: "+res.findings.slice(0,4).map(function(f){return f.title}).join("; ")+".":"")+" Advice: don’t use links or phone numbers in the message, and contact the company using a number you already trust.";
}
function copyText(t,done){
  function fb(){var ta=h("textarea");ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand("copy")}catch(e){}document.body.removeChild(ta);done()}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,fb);else fb();
}
function quiz(){
  var box=$("quiz"),items=shuffle(D.PRACTICE),i=0,right=0;
  function head(){box.appendChild(h("p","meta","Message "+(i+1)+" of "+items.length));box.appendChild(h("p","msg",items[i].text))}
  function show(){
    box.textContent="";
    if(i>=items.length){
      box.appendChild(h("h2",null,"You got "+right+" of "+items.length+" right"));
      box.appendChild(h("p",null,right>=items.length-1?"Great eye. You would spot most of these in real life.":"Good effort. Scammers count on you rushing, so slow down and look for pressure, fear, and requests for money."));
      var again=h("button","btn primary","Play again");again.type="button";again.onclick=quiz;box.appendChild(again);return;
    }
    head();
    var row=h("div","row2"),a=h("button","btn","It’s a scam"),b=h("button","btn","Looks real");a.type=b.type="button";
    function pick(say){
      var it=items[i],ok=say===it.scam;if(ok)right++;
      box.textContent="";head();
      var fb=h("div","feedback "+(ok?"good":"bad"));fb.setAttribute("role","status");
      fb.appendChild(h("strong",null,(ok?"Correct. ":"Not quite. ")+(it.scam?"This was a scam.":"This one was real.")));
      fb.appendChild(h("p",null,it.why));
      fb.appendChild(h("p","meta","Second Look’s score for this message: "+A.analyze(it.text).score+" of 100."));
      box.appendChild(fb);
      var nx=h("button","btn primary",i+1<items.length?"Next message":"See my score");nx.type="button";nx.onclick=function(){i++;show()};box.appendChild(nx);nx.focus();
    }
    a.onclick=function(){pick(true)};b.onclick=function(){pick(false)};
    row.appendChild(a);row.appendChild(b);box.appendChild(row);
  }
  show();
}
function runEval(){
  var r=A.evaluate(D.TESTSET),o=$("evalOut");o.textContent="";
  function stat(big,label){var d=h("div","stat");d.appendChild(h("strong",null,big));d.appendChild(h("span",null,label));return d}
  var g=h("div","stats");
  g.appendChild(stat(r.caught+" of "+r.scamN,"scam messages got a warning"));
  g.appendChild(stat(r.strong+" of "+r.scamN,"were called a likely scam"));
  g.appendChild(stat(r.falseFlags+" of "+r.legitN,"real messages wrongly warned about"));
  o.appendChild(g);
  if(r.misses.length){
    var d=h("details");d.appendChild(h("summary",null,"Show the mistakes ("+r.misses.length+")"));
    r.misses.forEach(function(m){d.appendChild(h("p",null,(m.scam?"Missed scam: ":"False alarm: ")+m.text+" (score "+m.score+")"))});o.appendChild(d);
  }else o.appendChild(h("p","meta","No mistakes on this set. That does not mean it is perfect. See the notes below."));
  o.appendChild(h("p","meta","Tested on "+r.n+" messages the word model was never trained on."));
}
function route(){
  var k=location.hash.replace(/^#\/?/,"").split("?")[0]||"home";
  if(!TITLES[k])k="home";
  Object.keys(TITLES).forEach(function(p){$("p-"+p).hidden=p!==k});
  document.querySelectorAll("nav a").forEach(function(a){if(a.dataset.p===k)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  document.title=TITLES[k];
  var hd=document.querySelector("#p-"+k+" h1");
  if(hd&&!first){hd.setAttribute("tabindex","-1");hd.focus({preventScroll:true})}
  first=false;window.scrollTo(0,0);
}

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
function highlight(text,res){
  var title={};res.findings.forEach(function(f){title[f.id]=f.title});
  var m=res.marks.slice().sort(function(a,b){return a.s-b.s||b.e-a.e}),last=0,p=h("p","msg");
  m.forEach(function(k){
    if(k.s<last)return;
    if(k.s>last)p.appendChild(document.createTextNode(text.slice(last,k.s)));
    var el=h("mark","hl-"+(k.id==="links"?"link":"flag"),text.slice(k.s,k.e));el.title=title[k.id]||"";p.appendChild(el);last=k.e;
  });
  if(last<text.length)p.appendChild(document.createTextNode(text.slice(last)));
  return p;
}
function renderResult(res,text,box){
  box.textContent="";box.hidden=false;
  var vb=verdictBlock(res);box.appendChild(vb);
  var todo=h("div","card todo");todo.appendChild(h("h2",null,res.level==="ok"?"Still unsure? Do this":"What to do now"));
  var ol=h("ol");NEXT.forEach(function(s){ol.appendChild(h("li",null,s))});todo.appendChild(ol);
  if(res.truncated)todo.appendChild(h("p","meta","This message was long, so only the first 5,000 characters were checked."));
  var cb=h("button","btn","Copy a summary to share"),st=h("span","meta");cb.type="button";st.setAttribute("role","status");
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
  var mc=h("div","card");mc.appendChild(h("h2",null,"Your message, marked up"));mc.appendChild(highlight(text,res));
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
  renderResult(res,text,$("result"));
  setTimeout(function(){net+=Math.max(0,reqCount()-before);$("netcount").textContent=String(net)},150);
}

function init(){
  var ex=$("examples");
  D.EXAMPLES.forEach(function(e){var b=h("button","chip",e.label);b.type="button";b.onclick=function(){$("msg").value=e.text;run()};ex.appendChild(b)});
  $("run").onclick=run;
  $("clear").onclick=function(){$("msg").value="";$("result").hidden=true;$("err").hidden=true;$("msg").focus()};
  $("msg").addEventListener("keydown",function(e){if((e.ctrlKey||e.metaKey)&&e.key==="Enter")run()});
  var pills=$("pills");["Pressure to hurry","Scary threats","Gift cards and crypto","Requests for codes or passwords","Fake and lookalike links","Family emergency stories","Fake package notices","Tech support alarms"].forEach(function(t){pills.appendChild(h("li",null,t))});
  var demo=$("demo"),r=A.analyze(D.EXAMPLES[0].text);
  demo.appendChild(verdictBlock(r));
  var ul=h("ul","mini");r.findings.slice(0,3).forEach(function(f){ul.appendChild(h("li",null,f.title))});demo.appendChild(ul);
  var sc=$("scams");
  D.SCAMS.forEach(function(s){
    var c=h("div","card scam");c.appendChild(h("h2",null,s.name));c.appendChild(h("q",null,s.looks));
    var a=h("p");a.appendChild(h("strong",null,"The giveaway: "));a.appendChild(document.createTextNode(s.tell));c.appendChild(a);
    var b=h("p");b.appendChild(h("strong",null,"What to do: "));b.appendChild(document.createTextNode(s.todo));c.appendChild(b);sc.appendChild(c);
  });
  $("ruleCount").textContent=String(A.RULES.length+5);
  $("corpusCount").textContent=String(D.CORPUS.scam.length+D.CORPUS.ham.length);
  $("runEval").onclick=runEval;
  $("print").onclick=function(){window.print()};
  quiz();
  loadPrefs();applyPrefs();
  $("smaller").onclick=function(){prefs.size=Math.max(0,prefs.size-1);applyPrefs()};
  $("bigger").onclick=function(){prefs.size=Math.min(3,prefs.size+1);applyPrefs()};
  $("contrast").onclick=function(){prefs.high=!prefs.high;applyPrefs()};
  if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(function(){});
  window.addEventListener("hashchange",route);route();
}
init();
})();
