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
{id:"payment",w:26,re:/\b(gift ?cards?|itunes card|google play card|steam card|western union|moneygram|wire (the )?(money|transfer)|bitcoin|btc|crypto(currency)?|prepaid card|money order)\b/gi,title:"Asks for hard-to-trace payment",why:"Gift cards, wire transfers and crypto are favorites of scammers because the money can’t be taken back.",tip:"Never pay a stranger with gift cards, wires or crypto."},
{id:"apppay",w:12,re:/\b(zelle|cash ?app|venmo)\b/gi,title:"Mentions a payment app",why:"Payment apps are fine between friends, but scammers ask for them because payments are hard to reverse.",tip:"Only use them with people you know in person."},
{id:"secrets",w:22,re:/\b(?:send|reply with|give|tell|read (?:back|out)|share|enter|provide|confirm|verify|update)\b[^.\n]{0,40}?\b(?:codes?|password|pin|ssn|social security(?: number)?|card number|account number|account|login|identity|banking (?:info|details))\b/gi,neg:/(not|never|n't|don't)\s*$/i,title:"Asks for private information",why:"Banks and agencies don’t ask you to send passwords, codes or your Social Security number by message.",tip:"Never share codes or passwords. Call the company on a number you trust."},
{id:"prize",w:20,re:/\b(you(?:'ve| have)? (?:won|been selected)|congratulations|winner|prize|lottery|sweepstakes|claim your (?:reward|gift|prize)|free (?:gift|iphone|reward)|inheritance|unclaimed (?:funds|money))\b/gi,title:"A prize you didn’t enter for",why:"If you didn’t enter, you didn’t win. Prizes that ask for a fee are scams.",tip:"Ignore it. Real prizes never ask you to pay."},
{id:"secrecy",w:18,re:/\b(don'?t tell|do not tell|keep this (?:private|secret|between us)|between you and me|don'?t (?:share|mention) this|tell no one)\b/gi,title:"Asks you to keep it secret",why:"Scammers isolate you so no one can warn you.",tip:"Tell someone you trust right away."},
{id:"impersonation",w:10,re:/\b(irs|internal revenue|social security administration|medicare|your bank|chase|wells fargo|bank of america|citibank|amazon|apple support|microsoft|geek squad|norton|mcafee|paypal|fedex|usps|ups|dmv|sheriff|fbi)\b/gi,title:"Uses a trusted name",why:"Scammers borrow names you trust. Anyone can type a famous name.",tip:"Contact the real organization using a number or website you already know."},
{id:"package",w:20,re:/\b(unpaid toll|toll (?:balance|violation)|package (?:is )?(?:on hold|held|undeliverable)|redelivery|customs fee|failed (?:to deliver|delivery))\b/gi,title:"A package or toll problem",why:"Fake delivery and toll notices are among the most common scam texts.",tip:"Check in the carrier’s real app or website, typed by you."},
{id:"family",w:20,re:/\b(new number|lost my phone|(?:in|from) jail|need bail|bail money|car accident|stranded)\b/gi,title:"A family emergency story",why:"Scammers pretend to be a relative in trouble to get quick money.",tip:"Call your relative on a number you already have."},
{id:"tech",w:44,re:/\b(your (?:computer|device|pc|iphone|ipad) (?:has|is|may be) (?:a )?(?:virus|infected|hacked|compromised)|call (?:this|our|the) (?:number|support|helpline)|remote access|anydesk|teamviewer|tech(?:nical)? support)/gi,title:"Tech support alarm",why:"Real companies don’t contact you out of the blue about a virus.",tip:"Don’t call. Never give anyone control of your computer."},
{id:"invest",w:22,re:/\b(guaranteed (?:returns?|profit)|risk[- ]free|double your (?:money|investment)|crypto (?:trading|investment)|investment opportunity|passive income)\b/gi,title:"Too-good-to-be-true profit",why:"No honest investment can guarantee profit.",tip:"Talk to someone you trust before sending money."},
{id:"greeting",w:6,re:/\b(dear (?:customer|user|member|client|account holder|sir|madam)|valued customer)\b/gi,title:"A generic greeting",why:"Real companies usually use your name.",tip:"Treat it as one more reason to be careful."},
{id:"click",w:6,re:/\b(click (?:the )?(?:link|here|below)|tap (?:the )?(?:link|here)|follow this link|open the attachment)\b/gi,title:"Tells you to click",why:"Scam messages push you toward a link or file.",tip:"Don’t tap links in unexpected messages."},
{id:"callnum",w:14,re:/\bcall (?:us |now |immediately )*(?:at |on )?(?:\+?1[- ]?)?\(?\d{3}\)?[- .]?\d{3}[- .]?\d{4}/gi,title:"Tells you to call a number",why:"A phone number inside a message leads to the scammer, even when it looks official.",tip:"Look up the real number yourself on a card, bill or official website."},
{id:"takeover",w:30,re:/\b(?:i (?:accidentally|mistakenly) sent (?:you )?(?:a )?(?:code|number)|sent (?:a|the) code to your phone|read (?:it|the code|the digits|the number) (?:back )?to me|read me the (?:code|digits|number))/gi,title:"Asks you to pass on a code",why:"That code is the key to your own account. Scammers trigger a login, then ask you to hand over the code that proves you’re the owner.",tip:"Never share a code with anyone."},
{id:"check",w:28,re:/\b(cashier'?s check|deposit the check|overpay(?:ment|ed)?|send back the (?:difference|extra|balance)|refund the (?:difference|extra))\b/gi,title:"Fake check or overpayment",why:"Scammers send a check for too much and ask you to return the difference. The check bounces later, and the money you sent is gone.",tip:"Accept the exact price only, and wait until a check fully clears."},
{id:"job",w:22,re:/\b(work from home|no experience (?:needed|required)|you(?:'ve| have) been hired|mystery shopper|earn \$?\d[\d,]*\s?(?:a|per) (?:day|week|hour)|reshipping|package handler)\b/gi,title:"Too-good job offer",why:"Scam job offers promise easy pay and then ask for bank details or money for equipment.",tip:"Look up real job openings yourself. Never give bank details before a verified offer."},
{id:"utility",w:22,re:/\b(?:power|electric(?:ity)?|gas|water|utility|internet|cable|service)\b[^.\n]{0,25}\b(?:disconnected|shut off|cut off|terminated|suspended)\b/gi,title:"Utility shut-off threat",why:"Real utilities send notices by mail and give you time. Scammers demand instant payment.",tip:"Call the number on your bill, not the one in the message."},
{id:"loan",w:22,re:/\b(student loan (?:forgiveness|relief|debt)|loan forgiveness|pre-?approved (?:loan|for)|government grant|grant money|stimulus (?:payment|check))\b/gi,title:"A free-money offer",why:"Offers of forgiveness or grants that ask for a fee or your details are a common trick.",tip:"Go to the official government website yourself. Real programs don’t charge a fee to apply."},
{id:"rental",w:22,re:/\b(landlord is (?:out of|overseas|abroad)|deposit (?:to|before) (?:hold|reserve|see)|can'?t show (?:you )?the (?:apartment|house|unit))\b/gi,title:"A rental deposit scam",why:"Scammers advertise places they don’t own and collect a deposit before you can visit.",tip:"See the property in person and confirm who owns it before paying."},
{id:"charge",w:26,re:/\b(?:you(?:'ve| have) been charged|charge of \$\d[\d,.]*|your (?:order|subscription) (?:for|of) \$\d[\d,.]*)\b[\s\S]{0,140}?\b(?:call|contact|dispute)\b/gi,title:"A surprise charge with a number to call",why:"There was no charge. The aim is to get you to call a number where a scammer asks for remote access or bank details.",tip:"Check your real bank statement. Don’t call the number in the message."},
{id:"charity",w:12,re:/\b(donate (?:now|today)|disaster relief|urgent (?:donation|appeal)|help the victims|flood victims)\b/gi,title:"Pressure to donate",why:"After disasters, scammers pose as charities and ask for payment that can’t be traced.",tip:"Give only to charities you looked up yourself."},
{id:"romance",w:16,re:/\b(i(?:'m| am) (?:a )?(?:soldier|deployed|stationed overseas|on an oil rig)|we'?d be great together|my late (?:husband|wife))\b/gi,title:"A romance scam story",why:"Scammers build trust with a sympathetic story, then ask for money.",tip:"Never send money to someone you’ve only met online."},
{id:"qr",w:14,re:/\b(scan (?:this|the) (?:qr|code)|qr code)\b/gi,title:"A QR code request",why:"A QR code can hide a fake web address. You can’t read it until after you scan.",tip:"Scan only codes you trust, and check the address that appears."}
];

function findAll(re,text,neg){var out=[],m;re.lastIndex=0;while((m=re.exec(text))){if(!m[0].length){re.lastIndex++;continue}var s=m.index;if(neg&&neg.test(text.slice(Math.max(0,s-14),s)))continue;out.push([s,s+m[0].length])}return out}

var URL_RE=/(?:https?:\/\/|www\.)[^\s<>"')]+|\b[a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)*\.(?:com|net|org|co|io|top|xyz|click|link|info|us|biz|support|me|gov|edu|icu|live|shop|site|online|ly)(?:\/[^\s<>"')]*)?/gi;
function extractUrls(text){var out=[],m;URL_RE.lastIndex=0;while((m=URL_RE.exec(text))){var raw=m[0].replace(/[.,;:!?]+$/,"");if(m.index>0&&text.charAt(m.index-1)==="@")continue;out.push({raw:raw,start:m.index,end:m.index+raw.length})}return out}
function norm(h){return h.replace(/rn/g,"m").replace(/0/g,"o").replace(/1/g,"l").replace(/3/g,"e").replace(/\$/g,"s")}
var NAMES={paypal:"PayPal",usps:"USPS",fedex:"FedEx",ups:"UPS",irs:"the IRS",wellsfargo:"Wells Fargo",bankofamerica:"Bank of America",citibank:"Citibank"};
function genuine(h,b){var L=h.split("."),tld=L[L.length-1],first=L.length>1?L[L.length-2]:h;return(first===b&&/^(com|gov|org)$/.test(tld))||(L.length>=3&&/^(co|com)$/.test(first)&&L[L.length-3]===b)}
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
      var ok=genuine(h,b);
      if(!ok){f.push("The name imitates "+cap(b)+", but the real website here is "+reg+".");break}
    }}
  return {raw:u.raw,host:h,flags:f,start:u.start,end:u.end};
}

var FROM_RE=/^[ \t]*(from|reply-to)[ \t]*:[ \t]*(.+)$/gim;
function senderChecks(text){
  var froms=[],reps=[],m,notes=[],marks=[];
  FROM_RE.lastIndex=0;
  while((m=FROM_RE.exec(text))){
    var em=m[2].match(/<?([A-Z0-9._%+-]+)@([A-Z0-9.-]+\.[A-Z]{2,})>?/i);if(!em)continue;
    var o={name:m[2].replace(/<.*$/,"").replace(/["']/g,"").trim().toLowerCase().replace(/[^a-z]/g,""),dom:em[2].toLowerCase(),s:m.index,e:m.index+m[0].length};
    (/^reply/i.test(m[1])?reps:froms).push(o);
  }
  froms.forEach(function(f){
    var hit=false;
    analyzeUrl({raw:f.dom}).flags.forEach(function(x){notes.push("Sender address "+f.dom+": "+x);hit=true});
    BRANDS.forEach(function(b){if(f.name.indexOf(b)>-1&&!genuine(f.dom,b)){notes.push("The sender’s name says "+cap(b)+", but the address is "+f.dom+".");hit=true}});
    reps.forEach(function(r){if(r.dom.split(".").slice(-2).join(".")!==f.dom.split(".").slice(-2).join(".")){notes.push("Replies go to "+r.dom+", not to "+f.dom+".");hit=true;marks.push({s:r.s,e:r.e})}});
    if(hit)marks.push({s:f.s,e:f.e});
  });
  return {notes:notes,marks:marks};
}
var MIXED=/[A-Za-z][\u0370-\u03FF\u0400-\u04FF]|[\u0370-\u03FF\u0400-\u04FF][A-Za-z]/g,HIDDEN=/[\u200B-\u200D\u2060\uFEFF]/g,MAXLEN=5000;
var CONF={"\u0430":"a","\u0435":"e","\u043e":"o","\u0440":"p","\u0441":"c","\u0445":"x","\u0443":"y","\u0456":"i","\u0455":"s","\u0501":"d","\u03bf":"o","\u03b1":"a","\u03bd":"v","\u0410":"A","\u0412":"B","\u0415":"E","\u041a":"K","\u041c":"M","\u041d":"H","\u041e":"O","\u0420":"P","\u0421":"C","\u0422":"T","\u0425":"X","\u0391":"A","\u0392":"B","\u0395":"E","\u0396":"Z","\u0397":"H","\u0399":"I","\u039a":"K","\u039c":"M","\u039d":"N","\u039f":"O","\u03a1":"P","\u03a4":"T","\u03a7":"X"};

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
  var truncated=text.length>MAXLEN;if(truncated)text=text.slice(0,MAXLEN);
  // Clean up spacing and hidden characters so tricks like double spaces can't hide a phrase.
  text=text.replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g," ").replace(/[ \t]+/g," ");
  var hiddenFound=text.search(HIDDEN)>-1;text=text.replace(HIDDEN,"");
  var fold=text.replace(/[\u0370-\u03FF\u0400-\u052F]/g,function(c){return CONF[c]||c}).replace(/[\u2018\u2019\u02BC]/g,"'");
  var findings=[],marks=[],raw=0,ids={};
  RULES.forEach(function(r){
    var hits=findAll(r.re,fold,r.neg);
    if(!hits.length)return;
    ids[r.id]=1;raw+=r.w+Math.min(hits.length-1,2)*2;
    findings.push({id:r.id,w:r.w,title:r.title,why:r.why,tip:r.tip,snips:hits.slice(0,3).map(function(h){return text.slice(h[0],h[1])})});
    hits.forEach(function(h){marks.push({s:h[0],e:h[1],id:r.id})});
  });
  var words=text.match(/[A-Za-z]{3,}/g)||[],caps=words.filter(function(w){return w===w.toUpperCase()}).length;
  if((caps>=4&&caps/Math.max(words.length,1)>0.3)||/!{3,}/.test(text)){ids.shout=1;raw+=6;findings.push({id:"shout",w:6,title:"Shouting",why:"ALL CAPS and lots of exclamation marks are used to alarm you.",tip:"Calm, official messages rarely shout.",snips:[]})}
  var sc=senderChecks(fold);
  if(sc.notes.length){ids.sender=1;raw+=Math.min(40,24+8*sc.notes.length);findings.push({id:"sender",w:34,title:"The sender doesn’t add up",why:"The name shown and the real address don’t match, or the address imitates a real company.",tip:"Don’t reply. Contact the company using a number or website you already know.",snips:sc.notes});sc.marks.forEach(function(k){marks.push({s:k.s,e:k.e,id:"sender"})})}
  var mixed=findAll(MIXED,text);
  if(mixed.length){ids.homoglyph=1;raw+=28;findings.push({id:"homoglyph",w:30,title:"Disguised letters",why:"Some letters come from other alphabets and look identical to ours. Scammers use them to imitate real names and slip past filters.",tip:"Treat the message as fake unless you can confirm it another way.",snips:[]});mixed.forEach(function(h){marks.push({s:h[0],e:h[1],id:"homoglyph"})})}
  if(hiddenFound){ids.hidden=1;raw+=10;findings.push({id:"hidden",w:10,title:"Hidden characters",why:"Invisible characters are sometimes used to hide a message from spam filters.",tip:"Be extra careful with this one.",snips:[]})}
  var links=extractUrls(fold).map(analyzeUrl),bad=links.filter(function(l){return l.flags.length}),nf=0;
  bad.forEach(function(l){nf+=l.flags.length;marks.push({s:l.start,e:l.end,id:"links"})});
  if(bad.length){ids.links=1;raw+=Math.min(40,20+8*nf);findings.push({id:"links",w:30,title:"A suspicious link",why:"The web address looks fake or hides where it goes. Scammers copy real sites to steal passwords.",tip:"Don’t tap it. Type the company’s real web address yourself.",snips:bad.map(function(l){return l.host})})}
  var bonus=0;
  if(ids.links&&(ids.urgency||ids.threat))bonus+=10;
  if(ids.payment&&(ids.urgency||ids.secrecy||ids.impersonation||ids.family))bonus+=10;
  if(ids.secrets&&(ids.links||ids.impersonation))bonus+=8;
  if(ids.callnum&&(ids.threat||ids.impersonation||ids.charge))bonus+=8;
  if(ids.sender&&(ids.urgency||ids.threat||ids.secrets))bonus+=10;
  var rule=Math.min(100,raw+bonus),nb=text.trim()?classify(fold):0;
  var score=text.trim()?Math.round(rule*0.8+nb*100*0.2):0;
  findings.sort(function(a,b){return b.w-a.w});
  return {score:score,level:score>=55?"scam":score>=25?"warn":"ok",rule:rule,model:nb,truncated:truncated,text:text,findings:findings,links:links,marks:marks};
}
function evaluate(set){
  var r={n:set.length,scamN:0,legitN:0,caught:0,strong:0,falseFlags:0,falseStrong:0,misses:[]};
  set.forEach(function(x){
    var res=analyze(x.text);
    if(x.scam){r.scamN++;if(res.score>=25)r.caught++;else r.misses.push({text:x.text,scam:true,score:res.score});if(res.score>=55)r.strong++}
    else{r.legitN++;if(res.score>=25){r.falseFlags++;r.misses.push({text:x.text,scam:false,score:res.score})}if(res.score>=55)r.falseStrong++}
  });
  r.accuracy=(r.caught+r.legitN-r.falseFlags)/r.n;return r;
}
var api={evaluate:evaluate,analyze:analyze,classify:classify,analyzeUrl:analyzeUrl,extractUrls:extractUrls,RULES:RULES};
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.Analyzer=api;
})(this);
