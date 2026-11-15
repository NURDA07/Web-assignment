/* Player Lab: star rating, quest animation, Web Audio sound, greeting, facts (fetch), background colour. */
(function () {
  "use strict";
  const $ = function (id) { return document.getElementById(id); };
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Star rating (radio group with arrow keys) ---------- */
  const stars = Array.from(document.querySelectorAll("#rating-stars [data-rating]"));
  const ratingStatus = $("rating-status");
  let rating = 0;
  function renderRating() {
    stars.forEach(function (star) {
      const value = Number(star.dataset.rating);
      star.classList.toggle("is-filled", value <= rating);
      star.style.color = value <= rating ? "#ffc53d" : "";            // direct style change
      star.setAttribute("aria-checked", String(value === rating));
      star.setAttribute("aria-label", PF.t(value === 1 ? "lab.star1" : "lab.starN", { n: value }));
      star.tabIndex = (rating ? value === rating : value === 1) ? 0 : -1;
    });
    ratingStatus.textContent = rating ? PF.t("lab.rated", { n: rating }) : PF.t("lab.noRating");
  }
  stars.forEach(function (star, index) {
    star.addEventListener("click", function () { rating = index + 1; renderRating(); });
    star.addEventListener("keydown", function (event) {
      let next;
      switch (event.key) {
        case "ArrowRight": case "ArrowUp": next = Math.min(index + 1, stars.length - 1); break;
        case "ArrowLeft": case "ArrowDown": next = Math.max(index - 1, 0); break;
        case "Home": next = 0; break;
        case "End": next = stars.length - 1; break;
        default: return;
      }
      event.preventDefault();
      rating = next + 1;
      renderRating();
      stars[next].focus();
    });
  });

  /* ---------- Quest (animation on click) ---------- */
  const questButton = $("start-quest");
  const questCard = $("quest-card");
  const questStatus = $("quest-status");
  let quests = 0, questRunning = false;
  function renderQuest() {
    questButton.textContent = PF.t(quests ? "lab.questAgain" : "lab.questStart");
    if (!questRunning) questStatus.textContent = quests ? PF.t(quests === 1 ? "lab.questDone1" : "lab.questDoneN", { n: quests }) : PF.t("lab.questIdle");
  }
  questButton.addEventListener("click", async function () {
    questButton.disabled = true;
    questRunning = true;
    questStatus.textContent = PF.t("lab.questBusy");
    if (!reducedMotion && questCard.animate) {
      const animation = questCard.animate([
        { transform: "translateY(0) scale(1)" },
        { transform: "translateY(-8px) scale(1.03)", offset: .45 },
        { transform: "translateY(0) scale(1)" }
      ], { duration: 650, easing: "ease-in-out" });
      try { await animation.finished; } catch (e) { /* cancelled */ }
    }
    quests += 1;
    questRunning = false;
    questButton.disabled = false;
    renderQuest();
  });

  /* ---------- Victory sound (Web Audio, never overlaps) ---------- */
  const soundButton = $("play-sound");
  const soundStatus = $("sound-status");
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audio, playing = false, soundKey = AudioCtx ? "lab.soundIdle" : "lab.soundNone";
  function renderSound() { soundStatus.textContent = PF.t(soundKey); }
  if (!AudioCtx) soundButton.disabled = true;
  soundButton.addEventListener("click", async function () {
    if (playing || !AudioCtx) return;
    playing = true;
    soundButton.disabled = true;
    try {
      audio = audio || new AudioCtx();
      if (audio.state === "suspended") await audio.resume();
      const notes = [523.25, 659.25, 783.99];
      let left = notes.length;
      notes.forEach(function (frequency, i) {
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        const start = audio.currentTime + i * 0.18;
        osc.type = "sine";
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.08, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
        osc.connect(gain); gain.connect(audio.destination);
        osc.onended = function () {
          osc.disconnect(); gain.disconnect();
          if (--left === 0) { playing = false; soundButton.disabled = false; soundKey = "lab.soundDone"; renderSound(); }
        };
        osc.start(start); osc.stop(start + 0.17);
      });
      soundKey = "lab.soundPlaying";
    } catch (e) {
      playing = false; soundButton.disabled = false; soundKey = "lab.soundError";
    }
    renderSound();
  });

  /* ---------- Greeting (switch on the hour) + current time ---------- */
  const greetForm = $("greeting-form");
  const greetResult = $("personal-greeting");
  let greetState = null;
  function greetingKey(hour) {
    switch (true) {
      case hour < 5: return "greet.night";
      case hour < 12: return "greet.morning";
      case hour < 18: return "greet.afternoon";
      default: return "greet.evening";
    }
  }
  function renderGreeting() {
    if (!greetState) { greetResult.textContent = ""; return; }
    if (greetState.type === "time") greetResult.textContent = PF.t("lab.timeIs", { time: new Date().toLocaleTimeString(PF.lang === "kk" ? "ru-RU" : PF.locale()) });
    else if (greetState.name) greetResult.textContent = PF.t(greetingKey(new Date().getHours())) + ", " + greetState.name + "!";
    else greetResult.textContent = PF.t("lab.enterName");
  }
  greetForm.addEventListener("submit", function (event) {
    event.preventDefault();
    greetState = { type: "greet", name: $("greeting-name").value.trim() };
    renderGreeting();
  });
  $("show-time").addEventListener("click", function () { greetState = { type: "time" }; renderGreeting(); });
  const user = PF.getUser();
  if (user) $("greeting-name").value = user.name;

  /* ---------- Random fact from data/facts.json ---------- */
  const factButton = $("fetch-fact");
  const factResult = $("fact-result");
  let facts = null, factIndex = -1;
  function renderFact() {
    if (facts && factIndex >= 0) { const fact = facts[factIndex]; factResult.textContent = fact[PF.lang] || fact.en; }
  }
  factButton.addEventListener("click", async function () {
    factButton.disabled = true;
    factResult.textContent = PF.t("common.loading");
    try {
      if (!facts) {
        const response = await fetch("data/facts.json");
        if (!response.ok) throw new Error("HTTP " + response.status);
        facts = await response.json();
      }
      let next = Math.floor(Math.random() * facts.length);
      if (next === factIndex) next = (next + 1) % facts.length;
      factIndex = next;
      renderFact();
    } catch (e) {
      factResult.textContent = PF.t("lab.factError");
    } finally {
      factButton.disabled = false;
    }
  });

  /* ---------- Background colour ---------- */
  const palettes = {
    dark: [["lab.cMidnight", ""], ["lab.cPurple", "#1b1030"], ["lab.cNavy", "#0c1830"], ["lab.cForest", "#0b2019"]],
    light: [["lab.cMidnight", ""], ["lab.cLavender", "#f1eafc"], ["lab.cSky", "#e7f3fc"], ["lab.cMint", "#e8f7ef"]]
  };
  let colorIndex = 0;
  function themeName() { return document.documentElement.dataset.theme === "light" ? "light" : "dark"; }
  function applyColor() {
    const entry = palettes[themeName()][colorIndex];
    if (entry[1]) document.documentElement.style.setProperty("--bg", entry[1]);
    else document.documentElement.style.removeProperty("--bg");
    $("color-text").textContent = PF.t("lab.colorNow", { name: PF.t(colorIndex ? entry[0] : "lab.cDefault") });
  }
  $("change-color").addEventListener("click", function () { colorIndex = (colorIndex + 1) % 4; applyColor(); });
  $("reset-color").addEventListener("click", function () { colorIndex = 0; applyColor(); });
  // Keep colours matched to the theme when it changes.
  new MutationObserver(function () { if (colorIndex) applyColor(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  PF.onLang(function () { renderRating(); renderQuest(); renderSound(); renderGreeting(); renderFact(); applyColor(); });
  renderRating(); renderQuest(); renderSound(); applyColor();
})();
