// Run with: node tests/evaluate.js   (prints accuracy on the held-out messages)
const A=require("../src/js/analyzer.js"),D=require("../src/js/data.js");
const r=A.evaluate(D.TESTSET),pc=x=>Math.round(x*100)+"%";
console.log(`Scams flagged (score >= 25): ${r.caught} of ${r.scamN} (${pc(r.caught/r.scamN)}); strongly flagged (>= 55): ${r.strong}`);
console.log(`Real messages wrongly flagged: ${r.falseFlags} of ${r.legitN} (${pc(r.falseFlags/r.legitN)}); wrongly strong: ${r.falseStrong}`);
console.log(`Overall accuracy: ${pc(r.accuracy)}`);
r.misses.forEach(m=>console.log(`  ${m.scam?"MISSED SCAM":"FALSE ALARM"} (${m.score}): ${m.text}`));
