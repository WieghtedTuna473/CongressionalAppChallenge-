// Interface: pages, rendering, and the privacy counter. All checking happens in analyzer.js.
(function(){
"use strict";
var A=window.Analyzer,D=window.AppData,NS="http://www.w3.org/2000/svg",first=true,net=0;
function $(i){return document.getElementById(i)}
function h(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n}
function reqCount(){try{return performance.getEntriesByType("resource").length}catch(e){return 0}}
var TITLES={home:"Second Look: check a message before you act",check:"Check a message | Second Look",learn:"Common scams | Second Look",privacy:"Privacy | Second Look"};
var VERDICT={
 scam:{head:"This looks like a scam",body:"Don’t click, reply, or send anything."},
 warn:{head:"Be careful with this one",body:"Some things don’t add up. Check before you act."},
 ok:{head:"No warning signs found",body:"That doesn’t make it safe. If it asks for money or personal details, check another way."}};
var NEXT=["Don’t use any link or phone number in the message.","Contact the company using the number on your card, or a website you already know.","Tell someone you trust before you send money or information.","Report scams at reportfraud.ftc.gov."];

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
  var ol=h("ol");NEXT.forEach(function(s){ol.appendChild(h("li",null,s))});todo.appendChild(ol);box.appendChild(todo);
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
  $("ruleCount").textContent=String(A.RULES.length+2);
  $("corpusCount").textContent=String(D.CORPUS.scam.length+D.CORPUS.ham.length);
  window.addEventListener("hashchange",route);route();
}
init();
})();
