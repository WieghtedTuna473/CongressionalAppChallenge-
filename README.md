# Second Look

A scam-message checker that runs entirely on your device. Paste a suspicious text or email and it explains each warning sign in plain language. Nothing is uploaded, saved, or tracked.

## Run or host it
- Open `index.html` in a browser, or host these four files together in one folder (GitHub Pages works): `index.html`, `sw.js`, `manifest.webmanifest`, `icon.svg`. No subfolders are needed.
- `index.html` alone also works. The other three files only add "install as an app" and offline use.
- Tests: `node tests/analyzer.test.js`. Accuracy on held-out messages: `node tests/evaluate.js`.
- To rebuild after editing `src/`: `python3 build.py`.

## Pages
Home, Check, Practice (a 10-question spot-the-scam quiz), Learn (common scams, Georgia help, printable wallet card), Accuracy (run the test live, with mistakes shown), Privacy (with a live network-request counter).

## What it checks
- 13 rule checks: pressure, threats, hard-to-trace payment, requests for codes or passwords, prizes, secrecy, trusted-name impersonation, package and toll notices, family-emergency stories, tech-support alarms, investment promises, generic greetings, click prompts.
- Link analysis: shortened links, number addresses, odd endings, `@` tricks, lookalike brand names such as `paypa1.com`.
- Email headers: a `From:` name that doesn't match its address, or a different `Reply-To`.
- Disguised letters (mixed alphabets) and hidden characters.
- A small naive Bayes word model, trained in the browser on 48 short messages, contributes 20% of the score. Rules contribute 80%.
- Input over 5,000 characters is truncated, and the page says so.

## Accessibility
Large type, text size buttons, a high-contrast mode, keyboard-friendly pages, focus moves to the page heading or result, light and dark mode, reduced-motion respected. Only your text-size and contrast choices are stored, in your browser.

## Limits
- Pasted text only. Reading screenshots (OCR) is a planned next step.
- Examples and the test set are written by the developer. Real-world accuracy is likely lower.
- It reads link text but never opens a link.

## Files
`src/js/analyzer.js` (the checker, no DOM, no network), `src/js/data.js` (training, test and practice messages), `src/js/app.js` (interface), `src/css/style.css`, `src/pwa/` (offline files), `build.py`, `tests/`.
