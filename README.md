# WeatherGPT — SIH26068 Prototype

**AI/ML based Weather Chatbot for Real-Time, Hyperlocal Weather Information & Advisory**
Team: Bihari Tech Titans · Theme: Disaster Management · Category: Software

This is a presentation-ready, interactive frontend prototype for judges to click through.
It is pure HTML/CSS/JS — **no build step, no npm install required.**

## How to run it

**Option A — just open it**
Double-click `index.html`, or right-click → Open With → your browser.

**Option B — local server (recommended, avoids any browser file:// restrictions)**

```bash
cd weathergpt
python3 -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

Or, if you have Node:
```bash
npx serve .
```

## What's inside

| File | Purpose |
|---|---|
| `index.html` | All 19 sections: hero, live dashboard, AI chat, comparison, personas, Farmer Mode, Travel Planner, Alert Center, hyperlocal map, schedule timeline, notifications, voice/multilingual demo, AI safety architecture, technical architecture, data sources, challenges, impact, feasibility, final storytelling |
| `styles.css` | Design tokens (color/type/spacing) + all section styling, fully responsive |
| `app.js` | All interactivity: chat engine, route map (SVG), city map (SVG), persona switcher, architecture hover states, scroll-driven finale, reveal-on-scroll, hero canvas animation |
| `data.js` | **Centralized mock data.** Every number/response on the site comes from here. Each block has a `// REAL API HERE` comment marking exactly where a real IMD/weather API call would replace the mock data later. |

## Design notes for the pitch

- The whole site is built around one line: **"WeatherGPT doesn't just tell you what the weather is — it helps you decide what to do."** It repeats visually in the hero, the comparison section, and the final scroll sequence.
- Section 13 (AI Safety) is the most important slide for judges worried about LLM hallucination: it visually proves the LLM never predicts weather — it only phrases already-validated facts.
- All claims are written to avoid overpromising (no "100% accurate," no "AI creates disaster warnings," farmer advice is explicitly framed as decision *support*, not expert replacement).

## Swapping in real data later

Everything judges see as "live" data is centralized in `data.js`. To connect real APIs:
1. Replace the static objects in `data.js` with `fetch()` calls to IMD / weather APIs.
2. Keep the same object shape (`current`, `hourly`, `daily`, etc.) so `app.js` doesn't need to change.
3. For the chat, swap the canned `chatSamples` responses for real calls to your retrieval + rule-engine + LLM pipeline described in Section 13/14.

No other files need to change for a basic real-data swap.
