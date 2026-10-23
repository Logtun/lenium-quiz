# Lenium Quiz

A fan-made quiz that teaches how [Lenium](https://www.lenium.capital/) ([@Lenium_Capital](https://x.com/Lenium_Capital)), the prediction market prop firm, works.

12 questions, one at a time, with an instant right or wrong and a short explanation that names the Lenium page it comes from. At the end you get a score, a rank, a score card PNG (add your X handle to put your name and photo on it), a ready-made caption, a Share on X button and a retry button.

- Every question is drawn from Lenium's own public pages (Home, How It Works, Rules, Pricing, Instant, Tools, Learn), read on Oct 23, 2026. Rules can change; re-check lenium.capital before reusing the questions.
- Static site: plain HTML, CSS and JavaScript. No backend, no build step, no API keys.
- Lenium accounts are simulated evaluation accounts.

made by [@iamlogtun](https://x.com/iamlogtun) · not official. This is a community project and is not endorsed by Lenium.

## Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import this repo (`lenium-quiz`).
3. Framework preset: **Other**. Leave the build command empty.
4. Click **Deploy**.

The caption link and the address on the score card use whatever address the site is opened on, so they pick up your Vercel URL by themselves.

## After deploying: fix the link preview image

X and WhatsApp need an absolute URL for the preview image. In `index.html`, change both

```html
<meta property="og:image" content="og.jpg?v=1">
<meta name="twitter:image" content="og.jpg?v=1">
```

to your deployed address, for example `https://lenium-quiz.vercel.app/og.jpg?v=1`, and add

```html
<meta property="og:url" content="https://lenium-quiz.vercel.app/">
```

Commit, and Vercel redeploys on its own.

## Editing the questions

The questions live at the top of `app.js` in `QUESTIONS`: each has the question, the correct answer, three wrong answers, the explanation and its source page. Answer order is shuffled on every run, and the total adapts to the number of questions.
