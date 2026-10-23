// Run with: node tests/analyzer.test.js
const assert=require("assert"),A=require("../src/js/analyzer.js"),D=require("../src/js/data.js");
let n=0;function t(name,fn){fn();n++;console.log("ok -",name)}
const SCAMS=[D.EXAMPLES[0].text,D.EXAMPLES[1].text,D.EXAMPLES[2].text,
 "Hi grandma it's me, I'm in jail and need bail money. Please don't tell mom. Send gift cards today!",
 "IRS NOTICE: a warrant will be issued unless you call immediately. Pay with bitcoin to resolve.",
 "Your computer has a virus. Call this number now for tech support."];
const LEGIT=[D.EXAMPLES[3].text,
 "Amazon: Your verification code is 482913. Do not share this code with anyone.",
 "Hey, are you free for lunch on Thursday? Let me know what works.",
 "The council meeting moved to 7 PM. Agenda: https://peachtreefalls.gov/agenda",
 "Your prescription is ready for pickup at the pharmacy.",
 "Thanks for your order! It shipped and will arrive Thursday."];
t("obvious scams score as likely scams",()=>SCAMS.forEach(s=>{const r=A.analyze(s);assert.ok(r.score>=55,s+" => "+r.score)}));
t("ordinary messages stay low",()=>LEGIT.forEach(s=>{const r=A.analyze(s);assert.ok(r.score<25,s+" => "+r.score)}));
t("shortened links are flagged",()=>assert.ok(A.analyzeUrl({raw:"bit.ly/abc"}).flags.length));
t("lookalike brand domains are flagged",()=>{
  assert.ok(A.analyzeUrl({raw:"http://paypa1.com/login"}).flags.some(f=>/PayPal/.test(f)));
  assert.ok(A.analyzeUrl({raw:"https://chase.com.secure-id.net"}).flags.length);
});
t("real brand domains are not flagged",()=>["https://www.paypal.com/signin","https://secure.chase.com/x","https://irs.gov"].forEach(u=>assert.strictEqual(A.analyzeUrl({raw:u}).flags.length,0,u)));
t("emails are not mistaken for links",()=>assert.strictEqual(A.extractUrls("write to clerk@peachtreefalls.gov today").length,0));
t("do-not-share codes are not treated as a request",()=>assert.ok(!A.analyze("Your code is 123456. Do not share it.").findings.some(f=>f.id==="secrets")));
t("empty text scores zero",()=>assert.strictEqual(A.analyze("").score,0));
console.log(n+" tests passed");
