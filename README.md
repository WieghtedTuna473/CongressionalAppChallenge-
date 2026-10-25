# Second Look

A scam-message checker that runs entirely on your device. Paste a suspicious text or email and it explains each warning sign in plain language. Nothing is uploaded, saved, or tracked.

## Run or host it
- Open `index.html` in a browser, or host these files together in one folder (GitHub Pages works): `index.html`, `sw.js`, `manifest.webmanifest`, `icon.svg`. No subfolders are needed for the app to run.
- `index.html` alone also works. The other three files only add "install as an app" and offline use.
- Tests: `node tests/analyzer.test.js`. Held-out results: `node tests/evaluate.js`.
- To rebuild `index.html` after editing `src/`: `python3 build.py`.

## Pages
- **Home**: what the app is, with a live example result.
- **Check**: paste a message and get a score, reasons, a marked-up message, link analysis, and 15 examples.
- **Practice**: a quiz of 24 messages (quick round of 10, or all), with explanations and an "I'm not sure" button.
- **Answer key**: all 24 messages with answers and explanations, searchable and filterable.
- **Learn**: 14 common scams, Georgia help, and a printable wallet card.
- **Get help**: step-by-step recovery for seven situations, and where to report.
- **Words to know**: plain-language glossary.
- **Family plan**: a code word, a call-back rule, and a printable family agreement.
- **Accuracy**: five tests you can run live, each with what it checks, how it works, and why it matters.
- **Privacy**: why nothing leaves the device, with a live network-request counter.
- **About**: why it exists and how it is built.

## What it checks
- 25 rule checks, plus link, sender, shouting, disguised-letter and hidden-character checks: pressure, threats, hard-to-trace payment, payment apps, requests for codes or passwords, prizes, secrecy, trusted-name impersonation, package and toll notices, family-emergency stories, tech-support alarms, investment promises, generic greetings, click prompts, phone numbers to call, code requests, fake checks, job offers, utility threats, free-money offers, rental deposits, surprise charges, donations, romance stories, QR codes.
- Link analysis: shortened links, number addresses, odd endings, `@` tricks, lookalike brand names such as `paypa1.com`.
- Email headers: a `From:` name that doesn't match its address, or a different `Reply-To`.
- Disguised letters (mixed alphabets) and hidden characters. Odd spacing, hidden characters and lookalike letters are cleaned up before matching so they can't hide a phrase.
- A small naive Bayes word model, trained in the browser on 64 short messages, contributes 20% of the score. Rules contribute 80%.
- Input over 5,000 characters is truncated, and the page says so.

## Accessibility
Large type, text size buttons, a high-contrast mode, keyboard-friendly pages, focus moves to the page heading or result, light and dark mode, reduced motion respected. Only your text-size and contrast choices are stored, in your browser.

## Limits
- Pasted text only. Reading screenshots (OCR) is a planned next step.
- The test messages were written by the developer, and some rules were adjusted after seeing which test messages were missed. Real-world results can differ.
- It reads link text but never opens a link.

## Files
`src/js/analyzer.js` (the checker, no DOM, no network), `src/js/data.js` (training, test, practice and help content), `src/js/app.js` (interface), `src/css/style.css`, `src/pwa/` (offline files), `build.py`, `tests/`.
