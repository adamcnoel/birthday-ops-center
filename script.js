// ======================
//  EDIT THESE DETAILS
// ======================
const EVENT = {
  personName: "[NAME HERE]",

  // Phoenix local time. Feb 22, 2026 is Sunday.
  drinks: {
    title: "Drinks @ Platform 18",
    startISO: "2026-02-22T16:30:00",
    endISO:   "2026-02-22T18:00:00", // 90 min reservation
    location: "Platform 18",
    description: "Birthday drinks. Reservation is 90 minutes. Arrive with confidence.",
  },

  dinner: {
    title: "Dinner @ Sugar 44",
    startISO: "2026-02-22T18:15:00",
    endISO:   "2026-02-22T19:45:00", // change if you want
    location: "Steak 44",
    description: "Birthday dinner. Bring stories, not speeches.",
  },

  dateText: "Sunday, Feb 22",
};

// Wait for DOM so we don't get stuck on placeholder text
document.addEventListener("DOMContentLoaded", () => {
  // ========== DOM ==========
  const $ = (id) => document.getElementById(id);

  const personNameEl = $("personName");
  const eventDateTextEl = $("eventDateText");
  const stop1TextEl = $("stop1Text");
  const stop2TextEl = $("stop2Text");

  const countTextEl = $("countText");
  const announcementEl = $("announcement");

  const partyBtn = $("partyBtn");
  const icsBtn = $("icsBtn");
  const themeBtn = $("themeBtn");
  const announceBtn = $("announceBtn");
  const panicBtn = $("panicBtn");
  const secretLink = $("secretLink");
  const cakeBtn = $("cakeBtn");

  const eggDialog = $("eggDialog");
  const eggClose = $("eggClose");
  const canvas = $("confettiCanvas");
  const ctx = canvas.getContext("2d");

  // ========== INIT TEXT ==========
  personNameEl.textContent = EVENT.personName;
  eventDateTextEl.textContent = EVENT.dateText;

  stop1TextEl.textContent = `Platform 18 — 4:30 PM (90 min)`;
  // stop2TextEl.textContent = `Sugar 44 — 6:15 PM`;
  stop2TextEl.innerHTML = `<s>Sugar</s> Steak 44 — 6:15 PM`;

  // ========== COUNTDOWN ==========
  function safeDate(iso) {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }

  function formatDuration(ms) {
    if (ms <= 0) return "NOW (probably).";

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours || days) parts.push(`${hours}h`);
    parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(" ");
  }

  function updateCountdown() {
    const start = safeDate(EVENT.drinks.startISO);
    if (!start) {
      countTextEl.textContent = "Set EVENT.drinks.startISO in script.js";
      return;
    }
    const now = new Date();
    countTextEl.textContent = formatDuration(start.getTime() - now.getTime());
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ========== ANNOUNCEMENTS ==========
  const MEMOS = [
    "Reminder: the birthday person is legally entitled to at least 3 compliments and 1 suspiciously specific snack.",
    "Official Notice: The Department of Vibes has issued a Level-4 Party Watch. Stay hydrated and emotionally available.",
    "Agenda update: cake is both a food and a philosophy.",
    "Please bring: yourself. Optional: a dramatic entrance. Required: no actual drama.",
    "If you see a disco ball, make eye contact and say: “I respect your work.”",
    "This is not a cult. This is simply an enthusiastic group project called ‘friendship’.",
    "Parking instructions: place your vehicle into a safe emotional state and proceed carefully.",
    "Safety briefing: confetti is not edible, but it is spiritually delicious.",
    "In case of awkward silence, deploy: ‘So… what’s your most controversial sandwich opinion?’",
    "The birthday person requests: zero singing until cake appears. Then: controlled chaos.",
    "Platform 18 is not a train station. Do not attempt to validate your ticket. There is no ticket.",
    "Steak 44 will not accept payment in ‘vibes’. They will accept payment in money. Please plan accordingly.",
  ];

  function pickMemo() {
    return MEMOS[Math.floor(Math.random() * MEMOS.length)];
  }
  announcementEl.textContent = pickMemo();

  announceBtn.addEventListener("click", () => {
    announcementEl.textContent = pickMemo();
  });

  // ========== THEME ==========
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("alt");
  });

  // ========== ICS (2 events) ==========
  function pad2(n) { return String(n).padStart(2, "0"); }

  function toICSDate(d) {
    // floating local time: YYYYMMDDTHHMMSS
    return (
      d.getFullYear() +
      pad2(d.getMonth() + 1) +
      pad2(d.getDate()) +
      "T" +
      pad2(d.getHours()) +
      pad2(d.getMinutes()) +
      pad2(d.getSeconds())
    );
  }

  function escapeICS(s) {
    return String(s ?? "")
      .replaceAll("\\", "\\\\")
      .replaceAll("\n", "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;");
  }

  function vevent({ title, startISO, endISO, location, description }) {
    const start = safeDate(startISO);
    const end = safeDate(endISO);
    if (!start || !end) return [];

    const uid = `birthday-${Math.random().toString(16).slice(2)}@absurd-birthday`;
    const dtstamp = toICSDate(new Date());

    return [
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${toICSDate(start)}`,
      `DTEND:${toICSDate(end)}`,
      `SUMMARY:${escapeICS(title)}`,
      `LOCATION:${escapeICS(location)}`,
      `DESCRIPTION:${escapeICS(description)}`,
      "END:VEVENT",
    ];
  }

  function downloadICS() {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Absurd Birthday//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      ...vevent(EVENT.drinks),
      ...vevent(EVENT.dinner),
      "END:VCALENDAR",
    ];

    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "birthday-itinerary.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  icsBtn.addEventListener("click", downloadICS);

  // ========== CONFETTI ==========
  let W = 0, H = 0;
  function resize() {
    W = canvas.width = window.innerWidth * devicePixelRatio;
    H = canvas.height = window.innerHeight * devicePixelRatio;
  }
  window.addEventListener("resize", resize);
  resize();

  let confetti = [];
  let animId = null;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function burstConfetti(count = 180) {
    const originX = (window.innerWidth / 2) * devicePixelRatio;
    const originY = (window.innerHeight / 5) * devicePixelRatio;

    for (let i = 0; i < count; i++) {
      confetti.push({
        x: originX + rand(-80, 80) * devicePixelRatio,
        y: originY + rand(-20, 20) * devicePixelRatio,
        vx: rand(-3.2, 3.2) * devicePixelRatio,
        vy: rand(1.2, 5.5) * devicePixelRatio,
        g: rand(0.02, 0.08) * devicePixelRatio,
        s: rand(2, 6) * devicePixelRatio,
        r: rand(0, Math.PI * 2),
        vr: rand(-0.12, 0.12),
        life: rand(140, 260),
        hue: rand(0, 360),
      });
    }

    if (!animId) animate();
  }

  function animate() {
    animId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);

    confetti = confetti.filter(p => p.life > 0);

    for (const p of confetti) {
      p.life -= 1;
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;

      const alpha = Math.max(0, Math.min(1, p.life / 180));
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${alpha})`;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 1.4);
      ctx.restore();
    }

    if (confetti.length === 0) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  // ========== TOAST ==========
  let toastTimer = null;
  function flash(text) {
    const t = document.createElement("div");
    t.textContent = text;
    t.style.position = "fixed";
    t.style.left = "50%";
    t.style.top = "70px";
    t.style.transform = "translateX(-50%)";
    t.style.zIndex = "50";
    t.style.padding = "10px 12px";
    t.style.borderRadius = "12px";
    t.style.border = "1px solid rgba(238,241,255,.22)";
    t.style.background = "rgba(10,14,26,.82)";
    t.style.backdropFilter = "blur(10px)";
    t.style.color = "rgba(238,241,255,.95)";
    t.style.fontFamily = "ui-monospace, Menlo, Monaco, Consolas, monospace";
    t.style.fontSize = "12px";
    t.style.boxShadow = "0 12px 40px rgba(0,0,0,.35)";
    document.body.appendChild(t);

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), 1200);
  }

  // ========== BUTTONS ==========
  partyBtn.addEventListener("click", () => {
    flash("PARTY PROTOCOL: ON");
    burstConfetti(220);
    announcementEl.textContent = "Party protocol engaged. Proceed with confidence and minimal hazard.";
  });

  panicBtn.addEventListener("click", () => {
    flash("PANIC SUCCESSFUL ✅");
    burstConfetti(120);
  });

  // ========== EASTER EGGS ==========
  function openEgg() {
    burstConfetti(140);
    if (typeof eggDialog.showModal === "function") eggDialog.showModal();
    else alert("EASTER EGG: Your browser does not support <dialog>, but you still win.");
  }

  eggClose.addEventListener("click", () => eggDialog.close());

  secretLink.addEventListener("click", (e) => {
    e.preventDefault();
    openEgg();
  });

  // Cake icon: 7 clicks triggers egg
  let cakeClicks = 0;
  cakeBtn.addEventListener("click", () => {
    cakeClicks++;
    burstConfetti(40);
    if (cakeClicks === 7) {
      flash("CAKE PROTOCOL: UNLOCKED");
      openEgg();
      cakeClicks = 0;
    }
  });

  // Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let keyBuffer = [];

  window.addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    keyBuffer.push(k);
    if (keyBuffer.length > KONAMI.length) keyBuffer.shift();

    const match = KONAMI.every((key, i) => keyBuffer[i] === key);
    if (match) {
      document.body.classList.toggle("alt");
      openEgg();
      flash("KONAMI ACCEPTED");
      keyBuffer = [];
    }
  });
});
