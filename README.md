# Second Look

A scam-message checker that runs entirely on your device. Paste a suspicious text or email and it explains each warning sign in plain language. Nothing is uploaded, saved, or tracked.

## Run it
Open `index.html` in a browser. It is one self-contained file, so it also works on GitHub Pages: upload just `index.html`.
Run the tests with `node tests/analyzer.test.js`. To rebuild `index.html` after editing `src/`, run `python3 build.py`.

## Pages
Home, Check a message, Common scams, Privacy (single page with hash routing, keyboard and screen-reader friendly, light and dark mode).

## How it works
- `src/js/analyzer.js`: the checker. No DOM, no network.
  - 13 rule checks (pressure, threats, hard-to-trace payment, requests for codes or passwords, prizes, secrecy, impersonation, package notices, family-emergency stories, tech-support alarms, investment promises, generic greetings, click prompts), plus a shouting check.
  - Link analysis: shortened links, number addresses, odd endings, `@` tricks, and lookalike brand names (for example `paypa1.com`), using character normalization.
  - A small naive Bayes word model trained on 32 short example messages (`src/js/data.js`) when the page loads. Final score = 80% rules + 20% model.
- `src/js/app.js`: pages, rendering, highlighting the exact phrases that triggered each finding.
- The Privacy page shows a counter of network requests made while checking, read from the browser's resource log.

## Limits (say these honestly)
- Pasted text only. Screenshot reading (OCR) is a planned next step.
- The word model is tiny, so the rules do most of the work. It can miss new scams and flag real messages.
- It analyzes the text of a link, never opens it, so it can't tell if a site's content is dangerous.

## Technical challenge (draft answer, edit in your own words)
The hardest part was catching scams without sending anyone's message to a server, and without crying wolf. A rule list alone either missed scams or flagged normal texts, such as a real "do not share this code" message. I fixed that by adding negation handling to the rules, combining signals (a link plus urgency scores higher than either alone), and adding a small word model that I wrote from scratch and train in the browser. I also wrote tests with real-looking scams and normal messages so that changing a rule can't quietly break the others. Finally, I made the explanations short and plain so that a grandparent could understand them.

## Demo video outline (under 3 minutes)
1. Problem: scam texts target older adults, and most checkers want you to upload your private message.
2. Paste the bank-text example and show the score, the plain reasons, and the marked-up message.
3. Show a real reminder scoring low, to prove it doesn't cry wolf.
4. Privacy page: turn on airplane mode, check a message, show the network counter at 0.
5. One sentence on the hardest part (above).

## Before you submit
- [ ] Confirm your district's deadline and rules. One project, one district.
- [ ] Add your name, school and district below.
- [ ] Disclose any AI help you used, exactly and honestly.
- [ ] Try it on your phone and on a laptop, in light and dark mode.

Team: (your name)  School: (your school)  District: (your Georgia district)
AI use disclosure: (describe any AI assistance honestly)
