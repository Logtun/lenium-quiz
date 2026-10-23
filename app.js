(() => {
"use strict";
// Lenium Quiz: a fan-made quiz on how Lenium works. No backend.
// Every question is drawn from lenium.capital's own pages, read Oct 23, 2026.
const W = 1200, H = 675;
const SITE_URL = location.origin;        // this site's own address, wherever it is deployed
const SITE_SHORT = location.host;
const C = {
  bg: "#0f1222", bg2: "#0a0c18", blue: "#6d85ff", yes: "#00e87a", no: "#ff5c5c",
  text: "#f2f4f8", sub: "#9aa3b8", line: "rgba(255,255,255,0.10)", card: "rgba(255,255,255,0.04)"
};
const QUESTIONS = [
 {
  "q": "On a prediction market, what does one winning contract pay out?",
  "a": "$1",
  "w": [
   "The price you paid, doubled",
   "$100",
   "Whatever the crowd votes at close"
  ],
  "e": "Every contract is a yes/no question that settles at $1 or $0. If the event happens, a YES contract pays $1.",
  "src": "Learn: How to Make Money on Prediction Markets"
 },
 {
  "q": "Lenium’s example market “Fed cuts rates at the next meeting?” shows YES at 48¢. Roughly what chance is the market giving it?",
  "a": "About 48%",
  "w": [
   "About 52%",
   "About 4.8%",
   "About 96%"
  ],
  "e": "A YES price in cents reads as the crowd’s odds: the card shows 48¢ next to 48%. Buying YES at 40¢ says you think the chance is better than 40%.",
  "src": "Home (example markets) and Learn"
 },
 {
  "q": "What is Lenium?",
  "a": "A prediction market prop firm with simulated accounts",
  "w": [
   "A prediction market exchange where you bet your own money",
   "A sportsbook that sets its own odds",
   "A crypto lending platform"
  ],
  "e": "Lenium calls itself “an independent prediction market proprietary trading firm”. Every account is simulated: virtual balances on live market prices.",
  "src": "Home"
 },
 {
  "q": "What profit target do you need to hit to pass the evaluation?",
  "a": "10%, on every account size",
  "w": [
   "8% on small accounts, 10% on large ones",
   "6%",
   "12%"
  ],
  "e": "A flat 10% profit target, the same on every size: $5K, $10K, $25K, $50K, $75K and $100K.",
  "src": "Rules and Pricing"
 },
 {
  "q": "How does the evaluation’s 10% drawdown floor work?",
  "a": "It’s static: set on day one and never rises",
  "w": [
   "It trails your highest balance",
   "It resets every morning",
   "It rises 1% each week"
  ],
  "e": "“Your floor is set on day one and never rises during evaluation.” There’s also no daily loss limit and no minimum trading days.",
  "src": "Rules"
 },
 {
  "q": "What does Lenium’s Instant funding let you do?",
  "a": "Skip the evaluation: pay once for a simulated funded account",
  "w": [
   "Double your account size overnight",
   "Get your profits paid out the same day",
   "Try a funded account free for 7 days"
  ],
  "e": "Instant funding: “Skip the evaluation. Trade a funded account today.” You pay once, from $79, with tighter limits than the evaluation path.",
  "src": "Instant"
 },
 {
  "q": "How long do you have to pass the evaluation?",
  "a": "30 calendar days (60 with Double Time)",
  "w": [
   "14 trading days",
   "90 calendar days",
   "No time limit"
  ],
  "e": "30 calendar days from activation; the Double Time add-on extends it to 60. An expired evaluation is treated like a breach.",
  "src": "Rules and Pricing"
 },
 {
  "q": "During the evaluation, can you open a NO position at 85¢?",
  "a": "No: it’s checked as YES at 15¢, outside 20¢–80¢",
  "w": [
   "Yes, NO positions have no price limit",
   "Yes, anything under 90¢ is allowed",
   "Only on accounts of $50K or more"
  ],
  "e": "Contracts must be priced between 20¢ and 80¢ at entry, and a NO at price p is checked as YES 100 − p. Closing a position is always allowed.",
  "src": "Rules"
 },
 {
  "q": "What are the evaluation’s position limits?",
  "a": "Max 5% per position, 10% total exposure",
  "w": [
   "Max 10% per position, 25% total exposure",
   "Max 2% per position, 5% total exposure",
   "Max 25% per position, no total limit"
  ],
  "e": "No single position may exceed 5% of your balance, and all open positions together cannot exceed 10%.",
  "src": "Rules"
 },
 {
  "q": "What happens if one market brings in more than 15% of your profit target?",
  "a": "Your target goes up; the account isn’t ended",
  "w": [
   "The account fails on the spot",
   "The extra profit is wiped from your balance",
   "You’re blocked from that market"
  ],
  "e": "That’s the consistency rule: “Exceeding it raises the target. It never ends your account.”",
  "src": "Rules"
 },
 {
  "q": "What’s the profit split on a funded account?",
  "a": "70%, or 90% with the split add-on",
  "w": [
   "50%, or 80% with an add-on",
   "A flat 80%",
   "90% on every account"
  ],
  "e": "The standard split is 70/30. The 90% profit split add-on raises it to 90%, which is where “up to 90%” comes from.",
  "src": "Pricing and Rules"
 },
 {
  "q": "How does Lenium work out the simulated trading fee on a fill?",
  "a": "0.07 × contracts × price × (1 − price)",
  "w": [
   "A flat 1% of your stake",
   "$1 per trade",
   "7% of your profit"
  ],
  "e": "Fee = rate × contracts × P × (1 − P) at the standard 0.07 rate, rounded up to the next cent. It peaks at 50¢.",
  "src": "Tools: Fee calculator and Rules"
 }
];
const N = QUESTIONS.length;
const RANKS = [
  { min: 0,  title: "Curious Newcomer", blurb: "Everyone starts somewhere. Read the Rules page and run it back." },
  { min: 4,  title: "Rising Trader",    blurb: "You’ve got the basics. A few rules still to lock in." },
  { min: 7,  title: "Sharp Forecaster", blurb: "Solid read on how Lenium works." },
  { min: 10, title: "Edge Finder",      blurb: "You know the rules better than most." },
  { min: 12, title: "Lenium Oracle",    blurb: "Perfect score. You priced every question right." }
];
function rankFor(n) { const f = n / N * 12; let r = RANKS[0]; for (const x of RANKS) if (f >= x.min) r = x; return r; }

const $ = (id) => document.getElementById(id);
const canvas = $("card"), ctx = canvas.getContext("2d");
const els = { handle: $("handle"), caption: $("caption") };
const state = { avatar: null, avatarUrl: "", xName: "", idx: 0, marks: [], order: [], picked: false };
const STORE = "leniumQuiz1";
try { const s = JSON.parse(localStorage.getItem(STORE) || "{}"); if (s.handle) els.handle.value = s.handle; } catch (e) {}
function persist() { try { localStorage.setItem(STORE, JSON.stringify({ handle: els.handle.value })); } catch (e) {} }

// ---------- assets ----------
function loadImg(src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
}
const assets = {};
const ready = Promise.all([
  loadImg("assets/mark.png").then((i) => (assets.mark = i)).catch(() => {}),
  loadImg("assets/word.png").then((i) => (assets.word = i)).catch(() => {}),
  document.fonts ? Promise.all([
    document.fonts.load('800 80px "Bricolage Grotesque"'), document.fonts.load('700 40px "Bricolage Grotesque"'),
    document.fonts.load('500 20px "Geist"'), document.fonts.load('600 20px "Geist"'), document.fonts.load('500 18px "Geist Mono"')
  ]).catch(() => {}) : Promise.resolve()
]);

// ---------- helpers ----------
const FB = ', system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const fD = (w, s) => `${w} ${s}px "Bricolage Grotesque"${FB}`;
const fS = (w, s) => `${w} ${s}px "Geist"${FB}`;
const fM = (w, s) => `${w} ${s}px "Geist Mono", ui-monospace, Menlo, monospace`;
function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function setLS(px) { if ("letterSpacing" in ctx) ctx.letterSpacing = px + "px"; }
function wrap(text, width) {
  const words = text.split(/\s+/).filter(Boolean), lines = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width <= width || !line) line = t; else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "L";
  const a = Array.from(parts[0])[0] || "";
  const b = parts.length > 1 ? (Array.from(parts[parts.length - 1])[0] || "") : (Array.from(parts[0])[1] || "");
  return (a + b).toUpperCase();
}

function cleanHandle(h) { return h.trim().replace(/^@+/, "").replace(/\s+/g, ""); }
function displayName() { return (state.xName || "").trim() || cleanHandle(els.handle.value); }
function score() { return state.marks.filter(Boolean).length; }

// ---------- quiz flow ----------
function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function show(screen) {
  ["start", "quiz", "result"].forEach((s) => ($("s-" + s).hidden = s !== screen));
  document.documentElement.dataset.screen = screen;
  window.scrollTo(0, 0);
}
function startQuiz() {
  state.idx = 0; state.marks = []; show("quiz"); renderQ();
}
function renderQ() {
  const q = QUESTIONS[state.idx];
  state.picked = false;
  state.order = shuffle([{ t: q.a, ok: true }].concat(q.w.map((t) => ({ t, ok: false }))));
  $("qNum").textContent = `Question ${state.idx + 1} of ${N}`;
  $("qScore").textContent = `${score()} correct`;
  $("progFill").style.width = (state.idx / N * 100) + "%";
  $("qText").textContent = q.q;
  const box = $("opts"); box.textContent = "";
  state.order.forEach((o, i) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "opt";
    b.innerHTML = `<span class="opt-l">${"ABCD"[i]}</span><span class="opt-t"></span>`;
    b.querySelector(".opt-t").textContent = o.t;
    b.addEventListener("click", () => pick(i));
    box.append(b);
  });
  $("fb").hidden = true;
  $("btnNext").hidden = true;
}
function pick(i) {
  if (state.picked) return;
  state.picked = true;
  const q = QUESTIONS[state.idx], ok = state.order[i].ok;
  state.marks.push(ok);
  const btns = $("opts").querySelectorAll(".opt");
  btns.forEach((b, j) => {
    b.disabled = true;
    if (state.order[j].ok) b.classList.add("right");
    else if (j === i) b.classList.add("wrong");
    else b.classList.add("dim");
  });
  const fb = $("fb"); fb.hidden = false; fb.className = "fb " + (ok ? "fb-ok" : "fb-no");
  $("fbHead").textContent = ok ? "Correct ✓" : "Not quite ✕";
  $("fbText").textContent = q.e;
  $("fbSrc").textContent = "Source: " + q.src + " · lenium.capital";
  $("qScore").textContent = `${score()} correct`;
  $("progFill").style.width = ((state.idx + 1) / N * 100) + "%";
  const nb = $("btnNext"); nb.hidden = false; nb.textContent = state.idx + 1 < N ? "Next question →" : "See my score →";
  setTimeout(() => nb.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
}
function next() {
  if (!state.picked) return;
  if (state.idx + 1 < N) { state.idx++; renderQ(); return; }
  finish();
}
function finish() {
  const n = score(), r = rankFor(n);
  $("rScore").textContent = `${n}/${N}`;
  $("rRank").textContent = r.title;
  $("rBlurb").textContent = r.blurb;
  show("result");
  draw();
}
$("btnStart").addEventListener("click", startQuiz);
$("btnNext").addEventListener("click", next);
$("btnRetry").addEventListener("click", startQuiz);

// ---------- score card ----------
let drawVer = 0;
function draw() {
  drawVer++; if (typeof queuePre === "function") queuePre();
  const handle = cleanHandle(els.handle.value);
  const name = displayName() || "Lenium Quiz player";
  const n = score(), r = rankFor(n);
  ctx.save(); ctx.clearRect(0, 0, W, H); setLS(0);
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  let g = ctx.createRadialGradient(140, -60, 0, 140, -60, 620);
  g.addColorStop(0, "rgba(109,133,255,0.30)"); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  g = ctx.createRadialGradient(930, 330, 0, 930, 330, 460);
  g.addColorStop(0, hexA(C.yes, 0.10)); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(255,255,255,0.035)"; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = 0.5; x < W; x += 48) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = 0.5; y < H; y += 48) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();
  g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(10,12,24,0)"); g.addColorStop(1, "rgba(10,12,24,0.55)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // top row: avatar + name + handle, quiz chip
  const ax = 64, ay = 56, ad = 84, acx = ax + ad / 2, acy = ay + ad / 2;
  ctx.beginPath(); ctx.arc(acx, acy, ad / 2 + 5, 0, Math.PI * 2); ctx.lineWidth = 3; ctx.strokeStyle = C.blue; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.arc(acx, acy, ad / 2, 0, Math.PI * 2); ctx.clip();
  if (state.avatar) {
    const im = state.avatar, s = Math.min(im.width, im.height);
    ctx.drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, ax, ay, ad, ad);
  } else {
    const og = ctx.createLinearGradient(ax, ay, ax + ad, ay + ad);
    og.addColorStop(0, "#6d85ff"); og.addColorStop(1, "#3b4bb8"); ctx.fillStyle = og; ctx.fillRect(ax, ay, ad, ad);
    if (handle || state.xName) {
      ctx.fillStyle = "#fff"; ctx.font = fD(700, 34); ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(initials(name), acx, acy + 2);
    } else if (assets.mark) { ctx.drawImage(assets.mark, ax + 18, ay + 18, ad - 36, ad - 36); }
  }
  ctx.restore();
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.font = fM(600, 18); setLS(2);
  const chipTxt = "LENIUM QUIZ", cw = ctx.measureText(chipTxt).width + 64, chx = W - 64 - cw, chy = 74;
  rr(chx, chy, cw, 48, 24); ctx.fillStyle = "rgba(109,133,255,0.14)"; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(109,133,255,0.55)"; ctx.stroke();
  ctx.beginPath(); ctx.arc(chx + 24, chy + 24, 5, 0, Math.PI * 2); ctx.fillStyle = C.blue; ctx.fill();
  ctx.fillStyle = C.text; ctx.textBaseline = "middle"; ctx.fillText(chipTxt, chx + 38, chy + 25); setLS(0); ctx.textBaseline = "alphabetic";
  const nameMax = chx - 40 - (ax + ad + 24);
  let ns = 36; ctx.font = fD(700, ns);
  while (ns > 22 && ctx.measureText(name).width > nameMax) { ns--; ctx.font = fD(700, ns); }
  let nm = name; while (ctx.measureText(nm).width > nameMax && nm.length > 2) nm = nm.slice(0, -2) + "…";
  ctx.fillStyle = C.text; ctx.fillText(nm, ax + ad + 24, ay + (handle ? 40 : 54));
  if (handle) { ctx.font = fM(500, 20); ctx.fillStyle = C.sub; ctx.fillText("@" + handle, ax + ad + 24, ay + 72); }

  // left: score + rank
  const lx = 64;
  ctx.font = fM(600, 18); setLS(3); ctx.fillStyle = C.blue; ctx.fillText("MY SCORE", lx, 218); setLS(0);
  ctx.save(); ctx.shadowColor = hexA(C.yes, 0.45); ctx.shadowBlur = 36;
  ctx.font = fD(800, 150); setLS(-5); ctx.fillStyle = C.yes; ctx.fillText(String(n), lx - 4, 360);
  const sw = ctx.measureText(String(n)).width; ctx.restore(); setLS(0);
  ctx.font = fD(700, 70); ctx.fillStyle = C.sub; ctx.fillText("/" + N, lx + sw + 8, 360);
  ctx.font = fM(600, 17); setLS(3); ctx.fillStyle = C.sub; ctx.fillText("RANK", lx, 418); setLS(0);
  let rs = 52; ctx.font = fD(800, rs); while (rs > 30 && ctx.measureText(r.title).width > 600) { rs -= 2; ctx.font = fD(800, rs); }
  ctx.fillStyle = C.text; setLS(-1); ctx.fillText(r.title, lx, 470); setLS(0);

  // right: per-question marks, 4 x 3 grid
  const px = 700, py = 176, pw = 436, ph = 330;
  rr(px, py, pw, ph, 28); ctx.fillStyle = "rgba(255,255,255,0.035)"; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(109,133,255,0.35)"; ctx.stroke();
  ctx.textAlign = "center"; ctx.font = fM(600, 16); setLS(3); ctx.fillStyle = C.sub; ctx.fillText(N + " QUESTIONS", px + pw / 2, py + 44); setLS(0);
  const cols = 4, rows = Math.ceil(N / cols), cell = 78, gap = 16;
  const gx = px + (pw - (cols * cell + (cols - 1) * gap)) / 2, gy = py + 72;
  for (let i = 0; i < N; i++) {
    const cx = gx + (i % cols) * (cell + gap), cy = gy + Math.floor(i / cols) * (cell - 6 + gap);
    const m = state.marks[i], col = m === true ? C.yes : m === false ? C.no : C.sub;
    rr(cx, cy, cell, cell - 6, 16); ctx.fillStyle = hexA(col, 0.12); ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = hexA(col, 0.6); ctx.stroke();
    ctx.fillStyle = col; ctx.font = fD(800, 30); ctx.fillText(m === true ? "✓" : m === false ? "✕" : "·", cx + cell / 2, cy + 38);
    ctx.font = fM(500, 13); ctx.fillStyle = C.sub; ctx.fillText("Q" + (i + 1), cx + cell / 2, cy + 60);
  }
  ctx.textAlign = "left";
  ctx.font = fS(500, 19); ctx.fillStyle = C.sub; ctx.fillText("Think you know prediction market prop trading? → " + SITE_SHORT, lx, 528);

  // footer
  ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(64, 572.5); ctx.lineTo(W - 64, 572.5); ctx.stroke();
  let fx = 64;
  if (assets.mark) { ctx.drawImage(assets.mark, fx, 594, 44, 44); fx += 54; }
  if (assets.word) { const wh = 30, ww = wh * assets.word.width / assets.word.height; ctx.drawImage(assets.word, fx, 601, ww, wh); fx += ww + 18; }
  ctx.textAlign = "left"; ctx.font = fM(500, 18); ctx.fillStyle = C.sub; ctx.fillText("lenium.capital", fx, 623);
  ctx.textAlign = "right"; ctx.font = fS(500, 17); ctx.fillStyle = "rgba(242,244,248,0.55)";
  ctx.fillText("made by @iamlogtun · not official", W - 64, 623);
  ctx.restore();
  updateCaption();
}
let raf = 0;
function schedule() { if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { raf = 0; draw(); persist(); }); }

// ---------- caption ----------
function shareText() {
  const n = score(), r = rankFor(n);
  return `I scored ${n}/${N} on the Lenium Quiz 🧠 Rank: ${r.title}.\n\nThink you know prediction market prop trading? 👉 ${SITE_URL}\n\n@Lenium_Capital`;
}
function updateCaption() { if (els.caption) els.caption.value = shareText(); }
$("btnCopyCaption").addEventListener("click", async () => {
  const t = shareText();
  try { await navigator.clipboard.writeText(t); toast("Caption copied ✓"); }
  catch (e) { els.caption.focus(); els.caption.select(); toast("Select the caption and copy it."); }
});

// ---------- X lookup: display name + photo from the handle ----------
const xl = { box: $("xLookup"), av: $("xlAv"), text: $("xlText") };
let avatarSource = "none"; // "x" | "none"
let lookupTimer = 0, lookupSeq = 0, lookupCtl = null, lastLooked = "";
const HANDLE_RE = /^[A-Za-z0-9_]{1,15}$/;
function setLookup(st, html, avUrl) {
  xl.box.dataset.state = st; xl.text.innerHTML = html;
  xl.av.style.backgroundImage = avUrl ? `url("${avUrl}")` : "";
}
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function withTimeout(ms, outer) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  if (outer) outer.addEventListener("abort", () => c.abort());
  return { signal: c.signal, done: () => clearTimeout(t) };
}
// Fetch an image as a blob (CORS) and copy it onto our own canvas, so the card canvas
// never gets tainted and Download / Share / Copy keep working.
async function blobAvatar(url, outer) {
  const to = withTimeout(8000, outer);
  try {
    const r = await fetch(url, { mode: "cors", signal: to.signal, credentials: "omit" });
    if (!r.ok) throw new Error("img " + r.status);
    const b = await r.blob();
    if (!/^image\//.test(b.type) || b.size < 200) throw new Error("not an image");
    const u = URL.createObjectURL(b);
    try {
      const im = await loadImg(u);
      const s = Math.min(im.naturalWidth, im.naturalHeight), size = Math.min(s, 400);
      const c = document.createElement("canvas"); c.width = c.height = size;
      c.getContext("2d").drawImage(im, (im.naturalWidth - s) / 2, (im.naturalHeight - s) / 2, s, s, 0, 0, size, size);
      return { canvas: c, thumb: c.toDataURL("image/jpeg", 0.8) };
    } finally { URL.revokeObjectURL(u); }
  } finally { to.done(); }
}
async function fetchProfile(handle, outer) {
  const to = withTimeout(7000, outer);
  try {
    const r = await fetch("https://api.fxtwitter.com/" + encodeURIComponent(handle), { signal: to.signal, credentials: "omit" });
    const j = await r.json().catch(() => null);
    if (!j || !j.user) return { notFound: r.status === 404 || (j && j.code === 404) };
    return { name: j.user.name, screen: j.user.screen_name, avatar: j.user.avatar_url };
  } finally { to.done(); }
}
async function lookup(handle) {
  const seq = ++lookupSeq;
  if (lookupCtl) lookupCtl.abort();
  const ctl = (lookupCtl = new AbortController());
  lastLooked = handle.toLowerCase();
  setLookup("loading", `Looking up @${esc(handle)} on X…`);
  let prof = null;
  // the name service sometimes answers "not found" for real accounts; ask up to 3 times
  for (let i = 0; i < 3; i++) {
    try { prof = await fetchProfile(handle, ctl.signal); } catch (e) { prof = null; }
    if (seq !== lookupSeq || (prof && prof.name)) break;
    await new Promise((r) => setTimeout(r, 700 + i * 600));
    if (seq !== lookupSeq) return;
  }
  if (seq !== lookupSeq) return;
  if (prof && prof.name) {
    state.xName = prof.name;
    if (prof.screen && prof.screen.toLowerCase() === handle.toLowerCase() && prof.screen !== els.handle.value && document.activeElement !== els.handle) els.handle.value = prof.screen;
    schedule();
  }
  // photo: X's own image first (full size), then unavatar as a fallback
  let av = null;
  {
    const urls = [];
    if (prof && prof.avatar) urls.push(prof.avatar.replace(/_normal(\.[a-z]+)$/i, "_400x400$1"), prof.avatar);
    urls.push("https://unavatar.io/x/" + encodeURIComponent(handle) + "?fallback=false");
    for (const u of urls) {
      try { av = await blobAvatar(u, ctl.signal); av.url = u; break; } catch (e) { if (seq !== lookupSeq) return; }
    }
    if (seq !== lookupSeq) return;
    if (av) { state.avatar = av.canvas; state.avatarUrl = av.url; avatarSource = "x"; schedule(); }
  }
  if (prof && prof.name) {
    setLookup("found", `✓ <b>${esc(prof.name)}</b>${av ? "" : " <span class=\"muted\">(no photo, using initials)</span>"}`, av ? av.thumb : "");
  } else if (prof && prof.notFound) {
    setLookup("error", `Couldn’t find @${esc(handle)} on X. Check the spelling. Your handle will show as your name for now.`, av ? av.thumb : "");
  } else {
    setLookup("error", `Couldn’t reach X right now. Your handle will show as your name${av ? "" : ", with initials for the photo"}.`, av ? av.thumb : "");
  }
}
function onHandleInput(immediate) {
  clearTimeout(lookupTimer);
  const h = cleanHandle(els.handle.value);
  if (!h) {
    lookupSeq++; if (lookupCtl) lookupCtl.abort(); lastLooked = "";
    state.xName = "";
    if (avatarSource === "x") { state.avatar = null; state.avatarUrl = ""; avatarSource = "none"; }
    setLookup("idle", "Enter your handle and we’ll pull your X name and photo.");
    schedule(); return;
  }
  if (!HANDLE_RE.test(h)) { setLookup("error", "X handles are letters, numbers and _ only (max 15)."); schedule(); return; }
  if (h.toLowerCase() === lastLooked) return;
  // a different person: don't keep the previous person's auto-filled name/photo
  state.xName = "";
  if (avatarSource === "x") { state.avatar = null; state.avatarUrl = ""; avatarSource = "none"; }
  schedule();
  setLookup("loading", `Looking up @${esc(h)} on X…`);
  lookupTimer = setTimeout(() => lookup(h), immediate ? 0 : 650);
}
els.handle.addEventListener("input", () => { schedule(); onHandleInput(false); });
els.handle.addEventListener("change", () => onHandleInput(true));


// ---------- output ----------
function fileName() {
  const h = cleanHandle(els.handle.value).replace(/[^A-Za-z0-9_]/g, "");
  return `lenium-quiz-${score()}of${N}${h ? "-" + h : ""}.png`;
}
function getBlob() { draw(); return new Promise((res) => canvas.toBlob((b) => res(b), "image/png")); }
const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isInApp = /FBAN|FBAV|Instagram|Line\/|WhatsApp|Twitter|; wv\)/i.test(navigator.userAgent);

let lastUrl = null;
function showModal(url, withX) {
  $("modalImg").src = url;
  $("modalTitle").textContent = withX ? "Save your card, then post" : "Save your card";
  $("modalSteps").innerHTML = withX
    ? "Press and hold the image, tap <strong>Save to Photos</strong>, then tap <strong>Open X</strong> and attach it to your post."
    : "Press and hold the image, then tap <strong>Save to Photos</strong>.";
  const ox = $("modalOpenX"); ox.hidden = !withX; if (withX) ox.href = intentUrl();
  $("modal").hidden = false;
}
$("btnDownload").addEventListener("click", async () => {
  const blob = await getBlob();
  if (!blob) return toast("Something went wrong. Try again.");
  if (lastUrl) URL.revokeObjectURL(lastUrl);
  lastUrl = URL.createObjectURL(blob);
  if (isIOS || isInApp) {
    // iOS saves downloads to Files and in-app browsers often block them: show the image to long-press instead
    showModal(lastUrl, false);
    
    return;
  }
  const a = document.createElement("a");
  a.href = lastUrl; a.download = fileName(); document.body.append(a); a.click(); a.remove();
  toast("Card downloaded. Now attach it to your post on X.");
  
});

// ---------- Share on X ----------
// (X web intents can't attach images, and a second link only adds a second preview card.)
function intentUrl() { return "https://x.com/intent/tweet?text=" + encodeURIComponent(shareText()); }

// Phones: share the card PNG + text through the native share sheet (pick X → image attached).
// The PNG is pre-rendered after every change so navigator.share() runs straight inside the tap.
var canShareFiles = false;
try {
  const probe = new File([new Blob(["x"], { type: "image/png" })], "probe.png", { type: "image/png" });
  canShareFiles = !!(navigator.share && navigator.canShare && navigator.canShare({ files: [probe] }));
} catch (e) {}
var pre = { ver: -1, blob: null, file: null };
var preTimer = 0;
function queuePre() {
  clearTimeout(preTimer);
  preTimer = setTimeout(() => {
    const v = drawVer;
    canvas.toBlob((b) => { if (b && v === drawVer) pre = { ver: v, blob: b, file: new File([b], fileName(), { type: "image/png" }) }; }, "image/png");
  }, 250);
}
// synchronous fallback when the tap lands before the pre-render caught up
function blobNowSync() {
  const d = canvas.toDataURL("image/png"), bin = atob(d.split(",")[1]), u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return new Blob([u], { type: "image/png" });
}
function currentFile() {
  if (raf) { cancelAnimationFrame(raf); raf = 0; draw(); persist(); }
  if (pre.file && pre.ver === drawVer && pre.file.name === fileName()) return pre.file;
  const b = blobNowSync();
  pre = { ver: drawVer, blob: b, file: new File([b], fileName(), { type: "image/png" }) };
  return pre.file;
}
const shareDbg = (window.__shareDbg = { branch: "", intent: "", text: "" });

function fallbackShare(blob) {
  shareDbg.intent = intentUrl();
  
  if (lastUrl) URL.revokeObjectURL(lastUrl);
  lastUrl = URL.createObjectURL(blob);
  if (isIOS || isInApp) { shareDbg.branch = "modal"; showModal(lastUrl, true); return; }
  shareDbg.branch = "download";
  const a = document.createElement("a");
  a.href = lastUrl; a.download = fileName(); document.body.append(a); a.click(); a.remove();
  let copy = Promise.resolve(false);
  try {
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write && !isIOS)
      copy = navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]).then(() => true, () => false);
  } catch (e) {}
  const late = new Promise((r) => setTimeout(() => r(false), 700));
  Promise.race([copy, late]).then((copied) => {
    shareDbg.copied = copied;
    toast(copied ? "Card saved, attach it to your post 📎 (on desktop you can paste with Ctrl/Cmd+V)"
                 : "Card saved, attach it to your post 📎", null, 9000);
    setTimeout(() => {
      const w = window.open(shareDbg.intent, "_blank");
      if (w) { try { w.opener = null; } catch (e) {} }
      shareDbg.opened = !!w;
      if (!w) toast("Card saved 📎 Now open X and attach it.", { label: "Open X →", href: shareDbg.intent }, 12000);
    }, 600);
  });
}

$("btnShareX").addEventListener("click", () => {
  const file = currentFile();
  shareDbg.text = shareText();
  if (canShareFiles) {
    shareDbg.branch = "share";
    let p;
    try { p = navigator.share({ files: [file], text: shareDbg.text }); }
    catch (e) { return fallbackShare(file); }
    p.then(() => {}, (e) => { if (!e || e.name !== "AbortError") fallbackShare(file); });
    return;
  }
  fallbackShare(file);
});

(function setupCopy() {
  if (!(window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) || isIOS) return;
  const btn = $("btnCopy"); btn.hidden = false;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": getBlob() })]);
      toast("Copied! Paste it straight into your post.");
    } catch (e) { toast("Your browser blocked copying. Use Download instead."); }
  });
})();

$("modalClose").addEventListener("click", () => ($("modal").hidden = true));
$("modal").addEventListener("click", (e) => { if (e.target.id === "modal") $("modal").hidden = true; });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("modal").hidden = true; });


let tt = 0;
function toast(msg, action, ms) {
  const t = $("toast"); t.textContent = msg;
  if (action) { const a = document.createElement("a"); a.href = action.href; a.target = "_blank"; a.rel = "noopener"; a.textContent = action.label; a.className = "toast-act"; t.append(" ", a); }
  t.classList.toggle("act", !!action); t.classList.add("show");
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), ms || 3200);
}


els.handle.addEventListener("blur", () => { els.handle.value = cleanHandle(els.handle.value); schedule(); });
$("totalQ").textContent = N; $("totalQ2").textContent = N;
show("start");
draw();
ready.then(() => { draw(); document.documentElement.dataset.ready = "1"; });
// test hook
window.__lq = {
  state, QUESTIONS, draw, getBlob, shareText, rankFor, start: startQuiz, next,
  pickCorrect: () => pick(state.order.findIndex((o) => o.ok)),
  pickWrong: () => pick(state.order.findIndex((o) => !o.ok)),
  canShareFiles: () => canShareFiles
};
if (cleanHandle(els.handle.value)) onHandleInput(true);
})();
