/* WeatherGPT — app.js
   Vanilla JS. No build step. Renders mock data from data.js and wires
   up all interactive prototype behaviour described in the brief. */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------------
     0. LOADER
  --------------------------------------------------------------- */
  const loaderStage = document.getElementById("loaderStage");
  const stages = ["Connecting weather data…", "Loading AI engine…", "Preparing hyperlocal insights…"];
  let si = 0;
  const loaderTimer = setInterval(() => {
    si++;
    if (si < stages.length) loaderStage.textContent = stages[si];
  }, 420);
  window.addEventListener("load", () => {
    setTimeout(() => {
      clearInterval(loaderTimer);
      document.getElementById("loader").classList.add("hide");
      initHeroCanvas();
    }, 1500);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => document.getElementById("loader").classList.add("hide"), 4500);

  /* ---------------------------------------------------------------
     Icons
  --------------------------------------------------------------- */
  function icons() { if (window.lucide) lucide.createIcons(); }
  icons();

  /* ---------------------------------------------------------------
     1. NAV — scroll spy + mobile toggle
  --------------------------------------------------------------- */
  const navLinks = document.querySelectorAll("#navLinks a");
  const sectionsForNav = ["hero","chat","map","farmer","travel","alerts","architecture"]
    .map(id => document.getElementById(id)).filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove("active"));
        const match = document.querySelector(`#navLinks a[href="#${e.target.id}"]`);
        if (match) match.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  sectionsForNav.forEach(s => navObserver.observe(s));

  document.getElementById("navToggle").addEventListener("click", () => {
    const nl = document.getElementById("navLinks");
    nl.style.display = nl.style.display === "flex" ? "none" : "flex";
    nl.style.cssText += "position:absolute; top:64px; left:0; right:0; background:#0a0f1cf0; flex-direction:column; padding:20px 28px; gap:18px; border-bottom:1px solid rgba(255,255,255,.08);";
  });

  /* ---------------------------------------------------------------
     2. HERO CANVAS — animated cloud + rain particles
  --------------------------------------------------------------- */
  function initHeroCanvas() {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;
    function resize() {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    resize();
    window.addEventListener("resize", resize);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Cloud blobs
    const clouds = Array.from({length: 5}, () => ({
      x: Math.random(), y: Math.random()*0.5, r: 90+Math.random()*160, speed: 0.00006+Math.random()*0.00008
    }));
    // Rain particles
    const drops = Array.from({length: 90}, () => ({
      x: Math.random(), y: Math.random(), speed: 0.4+Math.random()*0.6, len: 10+Math.random()*16
    }));

    let t = 0;
    function frame() {
      ctx.clearRect(0,0,w,h);
      // clouds
      clouds.forEach(c => {
        c.x += c.speed;
        if (c.x > 1.3) c.x = -0.3;
        const cx = c.x*w, cy = c.y*h + 40;
        const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,c.r*devicePixelRatio);
        grad.addColorStop(0, "rgba(73,211,255,0.07)");
        grad.addColorStop(1, "rgba(73,211,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx,cy,c.r*devicePixelRatio,0,Math.PI*2);
        ctx.fill();
      });
      // rain
      ctx.strokeStyle = "rgba(180,220,255,0.18)";
      ctx.lineWidth = 1*devicePixelRatio;
      drops.forEach(d => {
        d.y += d.speed*0.01;
        if (d.y > 1) d.y = -0.05;
        const x = d.x*w, y = d.y*h;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x-3*devicePixelRatio, y+d.len*devicePixelRatio);
        ctx.stroke();
      });
      t++;
      if (!reduceMotion) requestAnimationFrame(frame);
    }
    frame();
  }

  /* ---------------------------------------------------------------
     3. REVEAL ON SCROLL
  --------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); revealObserver.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------
     4. DASHBOARD
  --------------------------------------------------------------- */
  (function renderDashboard(){
    const c = WGPT_DATA.current;
    document.getElementById("dashCity").textContent = c.city;
    document.getElementById("dashTemp").textContent = c.temp;
    document.getElementById("dashCond").textContent = c.condition;
    document.getElementById("dashFeels").textContent = c.feelsLike;

    const metrics = [
      { label: "Humidity", value: c.humidity + "%" },
      { label: "Wind", value: c.wind + " km/h" },
      { label: "Rain chance", value: c.rainChance + "%" },
      { label: "Visibility", value: c.visibility + " km" },
      { label: "UV Index", value: c.uv },
      { label: "Pressure", value: c.pressure + " hPa" },
    ];
    document.getElementById("metricGrid").innerHTML = metrics.map(m =>
      `<div class="metric"><div class="m-label">${m.label}</div><div class="m-value">${m.value}</div></div>`
    ).join("");

    document.getElementById("hourlyRow").innerHTML = WGPT_DATA.hourly.map(h => `
      <div class="hour-chip">
        <div class="t">${h.t}</div>
        <i data-lucide="${h.icon}" style="width:22px; color:var(--cyan);"></i>
        <div class="temp">${h.temp}°</div>
        <div class="rain">${h.rain}%</div>
      </div>`).join("");

    document.getElementById("dailyList").innerHTML = WGPT_DATA.daily.map(d => `
      <div class="daily-row">
        <div>${d.d}</div>
        <div style="display:flex; align-items:center; gap:8px;"><i data-lucide="${d.icon}" style="width:18px; color:var(--text-1);"></i></div>
        <div class="rain">${d.rain}% rain</div>
        <div class="range">${d.hi}° / ${d.lo}°</div>
      </div>`).join("");
    icons();
  })();

  /* ---------------------------------------------------------------
     5. AI CHAT
  --------------------------------------------------------------- */
  (function chat(){
    const body = document.getElementById("chatBody");
    const chips = document.getElementById("chatChips");
    const input = document.getElementById("chatInput");
    const send = document.getElementById("chatSend");
    let busy = false;

    chips.innerHTML = WGPT_DATA.chatSamples.map(s => `<button class="chip" data-id="${s.id}">${s.q}</button>`).join("");

    body.innerHTML = `<div class="msg bot">Hi! Ask me about rain, your commute, farm irrigation, travel routes or active alerts — try one of the quick questions below.</div>`;

    function addUserMsg(text) {
      const el = document.createElement("div");
      el.className = "msg user";
      el.textContent = text;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }

    function runSample(sample) {
      if (busy) return;
      busy = true;
      addUserMsg(sample.q);

      const think = document.createElement("div");
      think.className = "think-row";
      think.innerHTML = sample.steps.map(s => `<div class="think-step"><span class="stepdot"></span>${s}</div>`).join("");
      body.appendChild(think);
      body.scrollTop = body.scrollHeight;
      const stepEls = think.querySelectorAll(".think-step");

      let idx = 0;
      const stepTimer = setInterval(() => {
        stepEls.forEach(s => s.classList.remove("active"));
        if (stepEls[idx]) stepEls[idx].classList.add("active");
        idx++;
        if (idx > stepEls.length) {
          clearInterval(stepTimer);
          think.remove();
          const msg = document.createElement("div");
          msg.className = "msg bot";
          msg.innerHTML = sample.a + (sample.note ? `<span class="note">${sample.note}</span>` : "");
          body.appendChild(msg);
          if (sample.cards) {
            const cardsWrap = document.createElement("div");
            cardsWrap.className = "answer-cards";
            cardsWrap.innerHTML = sample.cards.map(c => `<div class="ac"><div class="l">${c.label}</div><div class="v">${c.value}</div></div>`).join("");
            body.appendChild(cardsWrap);
          }
          body.scrollTop = body.scrollHeight;
          busy = false;
        }
      }, 480);
    }

    chips.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      const sample = WGPT_DATA.chatSamples.find(s => s.id === btn.dataset.id);
      if (sample) runSample(sample);
    });

    function handleFreeText() {
      const text = input.value.trim();
      if (!text || busy) return;
      input.value = "";
      // Match loosely against sample keywords, else fall back to a generic sample
      const lower = text.toLowerCase();
      let sample = WGPT_DATA.chatSamples.find(s =>
        lower.includes("irrigat") && s.id === "irrigate" ||
        lower.includes("umbrella") && s.id === "umbrella" ||
        (lower.includes("trip") || lower.includes("route") || lower.includes("travel")) && s.id === "roadtrip" ||
        (lower.includes("alert") || lower.includes("severe") || lower.includes("warning")) && s.id === "severe" ||
        (lower.includes("college") || lower.includes("commute") || lower.includes("rain")) && s.id === "commute"
      );
      if (!sample) sample = { ...WGPT_DATA.chatSamples[0], q: text };
      else sample = { ...sample, q: text };
      runSample(sample);
    }
    send.addEventListener("click", handleFreeText);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") handleFreeText(); });
  })();

  /* ---------------------------------------------------------------
     6. PERSONAS
  --------------------------------------------------------------- */
  (function personas(){
    const list = document.getElementById("personaList");
    const adviceBox = document.getElementById("personaAdvice");
    list.innerHTML = WGPT_DATA.personas.map((p,i) => `
      <button class="persona-btn ${i===0?'active':''}" data-id="${p.id}">
        <span class="p-icon"><i data-lucide="${p.icon}" style="width:18px;"></i></span>
        <span>${p.label}</span>
      </button>`).join("");
    icons();
    adviceBox.textContent = WGPT_DATA.personas[0].advice;
    list.addEventListener("click", (e) => {
      const btn = e.target.closest(".persona-btn");
      if (!btn) return;
      list.querySelectorAll(".persona-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const p = WGPT_DATA.personas.find(p => p.id === btn.dataset.id);
      adviceBox.style.opacity = 0;
      setTimeout(() => { adviceBox.textContent = p.advice; adviceBox.style.opacity = 1; }, 150);
    });
    adviceBox.style.transition = "opacity .2s";
  })();

  /* ---------------------------------------------------------------
     7. FARMER MODE
  --------------------------------------------------------------- */
  (function farmer(){
    const f = WGPT_DATA.farmer;
    document.getElementById("farmerLoc").textContent = f.location;
    document.getElementById("farmerAdvisory").textContent = f.advisory;
    document.getElementById("farmerRecommendation").textContent = f.recommendation;
    document.getElementById("farmerStats").innerHTML = `
      <div class="farmer-stat"><div class="m-label">Rain forecast</div><div class="m-value" style="font-size:1.1rem;">${f.rain}</div></div>
      <div class="farmer-stat"><div class="m-label">Temperature</div><div class="m-value" style="font-size:1.1rem;">${f.temp}</div></div>
      <div class="farmer-stat"><div class="m-label">Humidity</div><div class="m-value" style="font-size:1.1rem;">${f.humidity}</div></div>
      <div class="farmer-stat"><div class="m-label">Wind</div><div class="m-value" style="font-size:1.1rem;">${f.wind}</div></div>`;
    document.getElementById("farmerAdvisoryGrid").innerHTML = f.cards.map(c => `
      <div class="advisory-card">
        <div class="icn"><i data-lucide="${c.icon}" style="width:20px;"></i></div>
        <div class="title">${c.title}</div>
        <div class="val">${c.value}</div>
      </div>`).join("");
    icons();
  })();

  /* ---------------------------------------------------------------
     8. TRAVEL PLANNER
  --------------------------------------------------------------- */
  (function travel(){
    const r = WGPT_DATA.route;
    document.getElementById("routeFrom").textContent = r.from;
    document.getElementById("routeTo").textContent = r.to;
    document.getElementById("riskPill").textContent = "Overall risk: " + r.risk;
    document.getElementById("routeRecommendation").textContent = r.recommendation;

    const colorFor = sev => sev === "high" ? "var(--red)" : sev === "medium" ? "var(--amber)" : "var(--green)";

    function drawRoute() {
      const svg = document.getElementById("routeSvg");
      let path = `M ${r.stops[0].x} ${r.stops[0].y}`;
      for (let i=1;i<r.stops.length;i++) path += ` L ${r.stops[i].x} ${r.stops[i].y}`;

      let markers = r.stops.map(s => `
        <g class="route-stop" data-name="${s.name}" data-cond="${s.condition}">
          <circle cx="${s.x}" cy="${s.y}" r="9" fill="${colorFor(s.severity)}" opacity="0.25">
            <animate attributeName="r" values="9;16;9" dur="2.2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.25;0;0.25" dur="2.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="${s.x}" cy="${s.y}" r="6" fill="${colorFor(s.severity)}" stroke="#05070d" stroke-width="2"/>
          <text x="${s.x}" y="${s.y-16}" fill="#aab3c5" font-size="11" text-anchor="middle" font-family="Inter">${s.name}</text>
        </g>`).join("");

      svg.innerHTML = `
        <path d="${path}" fill="none" stroke="#2a3654" stroke-width="3" stroke-dasharray="1 0"/>
        <path d="${path}" fill="none" stroke="#49d3ff" stroke-width="2" stroke-dasharray="6 8" opacity="0.6">
          <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1.4s" repeatCount="indefinite"/>
        </path>
        ${markers}`;
    }
    drawRoute();

    const slider = document.getElementById("departSlider");
    const label = document.getElementById("departLabel");
    const times = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM"];
    const riskByTime = ["Moderate","Moderate","High","High","Moderate","Low","Low","Moderate","High"];
    slider.addEventListener("input", () => {
      label.textContent = times[slider.value];
      const risk = riskByTime[slider.value];
      document.getElementById("riskPill").textContent = "Overall risk: " + risk;
    });

    document.getElementById("analyzeRoute").addEventListener("click", () => {
      const svg = document.getElementById("routeSvg");
      svg.style.opacity = 0.3;
      setTimeout(() => { svg.style.opacity = 1; drawRoute(); icons(); }, 400);
    });
  })();

  /* ---------------------------------------------------------------
     9. ALERTS
  --------------------------------------------------------------- */
  (function alerts(){
    const sevClass = { "Advisory":"sev-advisory","Watch":"sev-watch","Warning":"sev-warning","Severe":"sev-severe" };
    document.getElementById("alertGrid").innerHTML = WGPT_DATA.alerts.map(a => `
      <div class="alert-card">
        <span class="sev ${sevClass[a.severity]}">${a.severity}</span>
        <h4>${a.type}</h4>
        <div class="alert-meta">${a.area} · ${a.time}</div>
        <p>${a.action}</p>
      </div>`).join("");
  })();

  /* ---------------------------------------------------------------
     10. HYPERLOCAL MAP
  --------------------------------------------------------------- */
  (function map(){
    const colors = { clear: "#52d999", cloudy: "#6b7690", rain: "#49d3ff", thunder: "#ffb454" };
    function draw(layer) {
      const svg = document.getElementById("citySvg");
      const roads = `
        <path d="M0 150 H500" stroke="#1c2740" stroke-width="10"/>
        <path d="M0 90 H500" stroke="#1c2740" stroke-width="6"/>
        <path d="M0 220 H500" stroke="#1c2740" stroke-width="6"/>
        <path d="M120 0 V300" stroke="#1c2740" stroke-width="6"/>
        <path d="M340 0 V300" stroke="#1c2740" stroke-width="6"/>`;
      const you = `<g><circle cx="250" cy="150" r="14" fill="#49d3ff" opacity="0.2"><animate attributeName="r" values="14;26;14" dur="2s" repeatCount="indefinite"/></circle>
        <circle cx="250" cy="150" r="6" fill="#49d3ff" stroke="#05070d" stroke-width="2"/>
        <text x="250" y="136" fill="#f4f7fb" font-size="11" text-anchor="middle" font-family="Inter">You are here</text></g>`;
      const markers = WGPT_DATA.mapMarkers.map(m => `
        <g>
          <circle cx="${m.x}" cy="${m.y}" r="8" fill="${colors[m.type]}"/>
          <text x="${m.x}" y="${m.y+20}" fill="#8b96ab" font-size="10" text-anchor="middle" font-family="Inter">${m.label}</text>
        </g>`).join("");
      svg.innerHTML = roads + markers + you;
    }
    draw("temp");
    document.getElementById("mapToggles").addEventListener("click", (e) => {
      const btn = e.target.closest(".toggle-btn");
      if (!btn) return;
      document.querySelectorAll("#mapToggles .toggle-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      draw(btn.dataset.layer);
    });
  })();

  /* ---------------------------------------------------------------
     11. SCHEDULE TIMELINE
  --------------------------------------------------------------- */
  (function timeline(){
    document.getElementById("timeline").innerHTML = WGPT_DATA.schedule.map(s => `
      <div class="tl-item ${s.alert ? 'alert':''}">
        <div class="tl-time">${s.time}</div>
        <div class="tl-label">${s.label}</div>
        <div class="tl-weather"><i data-lucide="${s.icon}" style="width:16px; color:var(--cyan);"></i>${s.weather}</div>
        ${s.alert ? `<div class="tl-note">You normally leave for college around 9 AM. Rain is expected around that time — carry an umbrella.</div>` : ""}
      </div>`).join("");
    icons();
  })();

  /* ---------------------------------------------------------------
     12. NOTIFICATIONS — reveal on scroll
  --------------------------------------------------------------- */
  (function notifications(){
    const stack = document.getElementById("notifStack");
    stack.innerHTML = WGPT_DATA.notifications.map(n => `
      <div class="phone-notif">
        <div class="n-icon"><i data-lucide="bell" style="width:16px;"></i></div>
        <div>
          <div class="n-app">WeatherGPT</div>
          <div class="n-text">${n}</div>
        </div>
      </div>`).join("");
    icons();
    const items = stack.querySelectorAll(".phone-notif");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e,i) => {
        if (e.isIntersecting) {
          const idx = [...items].indexOf(e.target);
          setTimeout(() => e.target.classList.add("show"), idx*150);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    items.forEach(i => obs.observe(i));
  })();

  /* ---------------------------------------------------------------
     13. VOICE DEMO
  --------------------------------------------------------------- */
  (function voice(){
    const micBtn = document.getElementById("micBtn");
    const wave = document.getElementById("wave");
    const voiceQ = document.getElementById("voiceQ");
    const voiceA = document.getElementById("voiceA");
    let currentLang = "en";

    for (let i=0;i<20;i++) { const b = document.createElement("span"); b.style.height="8px"; wave.appendChild(b); }
    const bars = wave.querySelectorAll("span");

    function setLang(lang) {
      currentLang = lang;
      const v = WGPT_DATA.voice[lang];
      voiceQ.textContent = v.q;
      voiceA.textContent = v.a;
    }
    setLang("en");

    document.getElementById("langRow").addEventListener("click", (e) => {
      const btn = e.target.closest(".toggle-btn");
      if (!btn) return;
      document.querySelectorAll("#langRow .toggle-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      setLang(btn.dataset.lang);
    });

    let waveTimer = null;
    micBtn.addEventListener("click", () => {
      const listening = micBtn.classList.toggle("listening");
      if (listening) {
        waveTimer = setInterval(() => {
          bars.forEach(b => b.style.height = (6 + Math.random()*30) + "px");
        }, 120);
        setTimeout(() => {
          clearInterval(waveTimer);
          bars.forEach(b => b.style.height = "8px");
          micBtn.classList.remove("listening");
        }, 2200);
      } else {
        clearInterval(waveTimer);
        bars.forEach(b => b.style.height = "8px");
      }
    });
  })();

  /* ---------------------------------------------------------------
     14. AI ARCHITECTURE DIAGRAM
  --------------------------------------------------------------- */
  (function architecture(){
    const wrap = document.getElementById("archDiagram");
    const detail = document.getElementById("archDetail");
    wrap.innerHTML = WGPT_DATA.architecture.map((a,i) => `<div class="arch-node" data-i="${i}">${a.label}</div>`).join("");
    wrap.addEventListener("mouseover", (e) => {
      const node = e.target.closest(".arch-node");
      if (!node) return;
      wrap.querySelectorAll(".arch-node").forEach(n => n.classList.remove("active"));
      node.classList.add("active");
      detail.textContent = WGPT_DATA.architecture[node.dataset.i].detail;
    });
    wrap.addEventListener("click", (e) => {
      const node = e.target.closest(".arch-node");
      if (!node) return;
      detail.textContent = WGPT_DATA.architecture[node.dataset.i].detail;
    });
  })();

  /* ---------------------------------------------------------------
     15. SOURCES
  --------------------------------------------------------------- */
  (function sources(){
    document.getElementById("sourceGrid").innerHTML = WGPT_DATA.sources.map(s => `
      <div class="source-card">
        <div class="sname">${s.name}</div>
        <div class="sdesc">${s.desc}</div>
      </div>`).join("");
  })();

  /* ---------------------------------------------------------------
     16. CHALLENGES (flip/expand)
  --------------------------------------------------------------- */
  (function challenges(){
    const grid = document.getElementById("challengeGrid");
    grid.innerHTML = WGPT_DATA.challenges.map(c => `
      <div class="challenge-card">
        <h4>${c.title}<span class="plus">+</span></h4>
        <div class="sol">${c.solution}</div>
      </div>`).join("");
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".challenge-card");
      if (!card) return;
      card.classList.toggle("open");
      card.querySelector(".plus").textContent = card.classList.contains("open") ? "–" : "+";
    });
  })();

  /* ---------------------------------------------------------------
     17. IMPACT
  --------------------------------------------------------------- */
  (function impact(){
    document.getElementById("impactGrid").innerHTML = WGPT_DATA.impact.map(i => `
      <div class="impact-card"><h4>${i.title}</h4><p>${i.desc}</p></div>`).join("");
  })();

  /* ---------------------------------------------------------------
     18. FEASIBILITY ORBIT
  --------------------------------------------------------------- */
  (function feasibility(){
    const wrap = document.getElementById("orbitWrap");
    const items = ["Weather APIs","AI","Cloud","GPS","Maps","Geolocation","Voice","Databases"];
    const radius = wrap.offsetWidth < 500 ? 130 : 180;
    wrap.insertAdjacentHTML("beforeend", `<div class="orbit-ring" style="width:${radius*2}px; height:${radius*2}px;"></div>`);
    items.forEach((label, i) => {
      const angle = (i / items.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const el = document.createElement("div");
      el.className = "orbit-item";
      el.textContent = label;
      el.style.left = `calc(50% + ${x}px)`;
      el.style.top = `calc(50% + ${y}px)`;
      el.style.transform = "translate(-50%,-50%)";
      wrap.appendChild(el);
    });
  })();

  /* ---------------------------------------------------------------
     19. FINAL STORYTELLING — scroll driven
  --------------------------------------------------------------- */
  (function finale(){
    const final = document.getElementById("final");
    const stagesEls = final.querySelectorAll(".final-stage");
    const dotsWrap = document.getElementById("finalDots");
    stagesEls.forEach((_,i) => dotsWrap.insertAdjacentHTML("beforeend", `<span data-i="${i}"></span>`));
    const dots = dotsWrap.querySelectorAll("span");

    function update() {
      const rect = final.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      const stageIdx = Math.min(stagesEls.length - 1, Math.floor(progress * stagesEls.length));
      stagesEls.forEach((s,i) => s.classList.toggle("show", i === stageIdx));
      dots.forEach((d,i) => d.classList.toggle("on", i === stageIdx));
    }
    // Give final section extra scroll height for the sequence
    final.style.height = (window.innerHeight * 3) + "px";
    window.addEventListener("scroll", update, { passive: true });
    update();
  })();

  icons();
});
