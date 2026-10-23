// Scam analyzer: rule checks + link checks + a tiny word model. Pure logic, no network, no DOM.
(function(root){
"use strict";
var Data=(typeof module!=="undefined"&&module.exports)?require("./data.js"):root.AppData;
var BRANDS=["paypal","amazon","apple","microsoft","netflix","usps","fedex","ups","irs","chase","wellsfargo","bankofamerica","venmo","zelle","google","facebook","walmart","medicare","citibank"];
var SHORT=/^(bit\.ly|tinyurl\.com|t\.co|ow\.ly|is\.gd|cutt\.ly|rb\.gy|shorturl\.at|goo\.gl|tiny\.cc)$/i;
var BADTLD=/\.(top|xyz|click|link|icu|buzz|rest|sbs|cfd|support|zip|mov)$/i;

var RULES=[
{id:"urgency",w:14,re:/\b(urgent(ly)?|immediately|right away|act now|asap|final (notice|warning)|last (chance|warning)|within \d+ ?(hours?|hrs?|minutes?|mins?|days?)|expires? (today|soon)|today only|respond now)/gi,title:"Pressure to hurry",why:"Scammers rush you so you don’t stop to think or check.",tip:"Real companies give you time. Slow down."},
{id:"threat",w:16,re:/\b(suspend(ed)?|locked|deactivat\w+|terminat\w+|legal action|lawsuit|arrest(ed)?|warrant|penalt(y|ies)|frozen|closed your account|unauthorized (charge|activity|login)|compromised)\b/gi,title:"A scary threat",why:"Fear makes people act fast. Scammers use it on purpose.",tip:"Don’t react to the threat. Check with the company directly."},
{id:"payment",w:26,re:/\b(gift ?cards?|itunes card|google play card|steam card|western union|moneygram|wire (the )?(money|transfer)|zelle|cash ?app|venmo|bitcoin|btc|crypto(currency)?|prepaid card|money order)\b/gi,title:"Asks for hard-to-trace payment",why:"Gift cards, wire transfers and crypto are favorites of scammers because the money can’t be taken back.",tip:"Never pay a stranger with gift cards, wires or crypto."},
{id:"secrets",w:22,re:/\b(?:send|reply with|give|tell|read (?:back|out)|share|enter|provide|confirm|verify|update)\b[^.\n]{0,40}?\b(?:codes?|password|pin|ssn|social security(?: number)?|card number|account number|account|login|identity|banking (?:info|details))\b/gi,neg:/(not|never|n't|don't)\s*$/i,title:"Asks for private information",why:"Banks and agencies don’t ask you to send passwords, codes or your Social Security number by message.",tip:"Never share codes or passwords. Call the company on a number you trust."},
{id:"prize",w:20,re:/\b(you(?:'ve| have)? (?:won|been selected)|congratulations|winner|prize|lottery|sweepstakes|claim your (?:reward|gift|prize)|free (?:gift|iphone|reward)|inheritance|unclaimed (?:funds|money))\b/gi,title:"A prize you didn’t enter for",why:"If you didn’t enter, you didn’t win. Prizes that ask for a fee are scams.",tip:"Ignore it. Real prizes never ask you to pay."},
{id:"secrecy",w:18,re:/\b(don'?t tell|do not tell|keep this (?:private|secret|between us)|between you and me|don'?t (?:share|mention) this|tell no one)\b/gi,title:"Asks you to keep it secret",why:"Scammers isolate you so no one can warn you.",tip:"Tell someone you trust right away."},
{id:"impersonation",w:10,re:/\b(irs|internal revenue|social security administration|medicare|your bank|chase|wells fargo|bank of america|citibank|amazon|apple support|microsoft|geek squad|norton|mcafee|paypal|fedex|usps|ups|dmv|sheriff|fbi)\b/gi,title:"Uses a trusted name",why:"Scammers borrow names you trust. Anyone can type a famous name.",tip:"Contact the real organization using a number or website you already know."},
{id:"package",w:20,re:/\b(unpaid toll|toll (?:balance|violation)|package (?:is )?(?:on hold|held|undeliverable)|redelivery|customs fee|failed (?:to deliver|delivery))\b/gi,title:"A package or toll problem",why:"Fake delivery and toll notices are among the most common scam texts.",tip:"Check in the carrier’s real app or website, typed by you."},
{id:"family",w:20,re:/\b(new number|lost my phone|(?:in|from) jail|need bail|bail money|car accident|stranded)\b/gi,title:"A family emergency story",why:"Scammers pretend to be a relative in trouble to get quick money.",tip:"Call your relative on a number you already have."},
{id:"tech",w:44,re:/\b(your (?:computer|device|pc|iphone|ipad) (?:has|is|may be) (?:a )?(?:virus|infected|hacked|compromised)|call (?:this|our|the) (?:number|support|helpline)|remote access|anydesk|teamviewer|tech(?:nical)? support)/gi,title:"Tech support alarm",why:"Real companies don’t contact you out of the blue about a virus.",tip:"Don’t call. Never give anyone control of your computer."},
{id:"invest",w:22,re:/\b(guaranteed (?:returns?|profit)|risk[- ]free|double your (?:money|investment)|crypto (?:trading|investment)|investment opportunity|passive income)\b/gi,title:"Too-good-to-be-true profit",why:"No honest investment can guarantee profit.",tip:"Talk to someone you trust before sending money."},
{id:"greeting",w:6,re:/\b(dear (?:customer|user|member|client|account holder|sir|madam)|valued customer)\b/gi,title:"A generic greeting",why:"Real companies usually use your name.",tip:"Treat it as one more reason to be careful."},
{id:"click",w:6,re:/\b(click (?:the )?(?:link|here|below)|tap (?:the )?(?:link|here)|follow this link|open the attachment)\b/gi,title:"Tells you to click",why:"Scam messages push you toward a link or file.",tip:"Don’t tap links in unexpected messages."}
];

function findAll(re,text,neg){var out=[],m;re.lastIndex=0;while((m=re.exec(text))){if(!m[0].length){re.lastIndex++;continue}var s=m.index;if(neg&&neg.test(text.slice(Math.max(0,s-14),s)))continue;out.push([s,s+m[0].length])}return out}

var URL_RE=/(?:https?:\/\/|www\.)[^\s<>"')]+|\b[a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)*\.(?:com|net|org|co|io|top|xyz|click|link|info|us|biz|support|me|gov|edu|icu|live|shop|site|online|ly)(?:\/[^\s<>"')]*)?/gi;
function extractUrls(text){var out=[],m;URL_RE.lastIndex=0;while((m=URL_RE.exec(text))){var raw=m[0].replace(/[.,;:!?]+$/,"");if(m.index>0&&text.charAt(m.index-1)==="@")continue;out.push({raw:raw,start:m.index,end:m.index+raw.length})}return out}
function norm(h){return h.replace(/rn/g,"m").replace(/0/g,"o").replace(/1/g,"l").replace(/3/g,"e").replace(/\$/g,"s")}
var NAMES={paypal:"PayPal",usps:"USPS",fedex:"FedEx",ups:"UPS",irs:"the IRS",wellsfargo:"Wells Fargo",bankofamerica:"Bank of America",citibank:"Citibank"};
function cap(s){return NAMES[s]||s.charAt(0).toUpperCase()+s.slice(1)}
function analyzeUrl(u){
  var s=u.raw.replace(/^https?:\/\//i,""),auth=s.split(/[\/?#]/)[0],at=false;
  if(auth.indexOf("@")>-1){at=true;auth=auth.split("@").pop()}
  var h=auth.replace(/:\d+$/,"").toLowerCase().replace(/^www\./,""),f=[],L=h.split("."),tld=L[L.length-1],first=L.length>1?L[L.length-2]:h,reg=L.slice(-2).join(".");
  if(at)f.push("Has an @ sign that hides the real website.");
  if(SHORT.test(h))f.push("A shortened link hides where it really goes.");
  if(/^\d{1,3}(\.\d{1,3}){3}$/.test(h))f.push("Uses a string of numbers instead of a website name.");
  if(/xn--/.test(h))f.push("Uses look-alike international letters to imitate another site.");
  if(BADTLD.test(h))f.push("Ends in ."+tld+", an ending scam sites use a lot.");
  if((h.match(/-/g)||[]).length>=3)f.push("A long, hyphen-filled name is common on fake sites.");
  var n=norm(h);
  for(var i=0;i<BRANDS.length;i++){var b=BRANDS[i];
    if(n.indexOf(b)>-1){
      var ok=(first===b&&/^(com|gov|org)$/.test(tld))||(L.length>=3&&/^(co|com)$/.test(first)&&L[L.length-3]===b);
      if(!ok){f.push("The name imitates "+cap(b)+", but the real website here is "+reg+".");break}
    }}
  return {raw:u.raw,host:h,flags:f,start:u.start,end:u.end};
}

// Tiny naive Bayes word model, trained when the page loads from the example messages in data.js.
var MODEL=null;
function tokens(t){t=t.toLowerCase().replace(/https?:\/\/\S+|www\.\S+/g," urltoken ").replace(/\d+/g," numtoken ");return t.match(/[a-z']+|[$!]/g)||[]}
function train(){
  var c={s:{},h:{}},N={s:0,h:0},V={};
  function add(k){return function(msg){tokens(msg).forEach(function(w){c[k][w]=(c[k][w]||0)+1;N[k]++;V[w]=1})}}
  Data.CORPUS.scam.forEach(add("s"));Data.CORPUS.ham.forEach(add("h"));
  var size=Object.keys(V).length,llr={};
  Object.keys(V).forEach(function(w){llr[w]=Math.log(((c.s[w]||0)+1)/(N.s+size))-Math.log(((c.h[w]||0)+1)/(N.h+size))});
  MODEL=llr;
}
function classify(text){
  if(!MODEL)train();
  var seen={},sum=0;
  tokens(text).forEach(function(w){if(!seen[w]&&MODEL[w]!==undefined){seen[w]=1;sum+=MODEL[w]}});
  return 1/(1+Math.exp(-sum/2));
}

function analyze(text){
  text=String(text||"");
  var findings=[],marks=[],raw=0,ids={};
  RULES.forEach(function(r){
    var hits=findAll(r.re,text,r.neg);
    if(!hits.length)return;
    ids[r.id]=1;raw+=r.w+Math.min(hits.length-1,2)*2;
    findings.push({id:r.id,w:r.w,title:r.title,why:r.why,tip:r.tip,snips:hits.slice(0,3).map(function(h){return text.slice(h[0],h[1])})});
    hits.forEach(function(h){marks.push({s:h[0],e:h[1],id:r.id})});
  });
  var words=text.match(/[A-Za-z]{3,}/g)||[],caps=words.filter(function(w){return w===w.toUpperCase()}).length;
  if((caps>=4&&caps/Math.max(words.length,1)>0.3)||/!{3,}/.test(text)){ids.shout=1;raw+=6;findings.push({id:"shout",w:6,title:"Shouting",why:"ALL CAPS and lots of exclamation marks are used to alarm you.",tip:"Calm, official messages rarely shout.",snips:[]})}
  var links=extractUrls(text).map(analyzeUrl),bad=links.filter(function(l){return l.flags.length}),nf=0;
  bad.forEach(function(l){nf+=l.flags.length;marks.push({s:l.start,e:l.end,id:"links"})});
  if(bad.length){ids.links=1;raw+=Math.min(40,20+8*nf);findings.push({id:"links",w:30,title:"A suspicious link",why:"The web address looks fake or hides where it goes. Scammers copy real sites to steal passwords.",tip:"Don’t tap it. Type the company’s real web address yourself.",snips:bad.map(function(l){return l.host})})}
  var bonus=0;
  if(ids.links&&(ids.urgency||ids.threat))bonus+=10;
  if(ids.payment&&(ids.urgency||ids.secrecy||ids.impersonation||ids.family))bonus+=10;
  if(ids.secrets&&(ids.links||ids.impersonation))bonus+=8;
  var rule=Math.min(100,raw+bonus),nb=text.trim()?classify(text):0;
  var score=text.trim()?Math.round(rule*0.8+nb*100*0.2):0;
  findings.sort(function(a,b){return b.w-a.w});
  return {score:score,level:score>=55?"scam":score>=25?"warn":"ok",rule:rule,model:nb,findings:findings,links:links,marks:marks};
}
var api={analyze:analyze,classify:classify,analyzeUrl:analyzeUrl,extractUrls:extractUrls,RULES:RULES};
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.Analyzer=api;
})(this);
