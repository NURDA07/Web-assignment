/* Assignment 5: a callback-driven, three-step player card builder.
   All labels come from PF.t() so the form follows the site language. */
(function () {
  "use strict";
  const host = document.getElementById("player-profile");
  if (!host) return;

  const stepKeys = ["pp.step1", "pp.step2", "pp.step3"];
  const platformNames = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"];
  const genreKeys = ["pp.gAdventure", "pp.gStrategy", "pp.gAction", "pp.gRacing", "pp.gCoop", "pp.gSandbox"];

  // Source of truth while moving forward and backward. Nothing is sent or saved.
  const profileState = {
    step: 0, nickname: "", platform: "", genres: [], completed: false,
    reset: function () { this.step = 0; this.nickname = ""; this.platform = ""; this.genres = []; this.completed = false; },
    summary: function () {
      return [
        ["pp.sumName", this.nickname.trim()],
        ["pp.sumPlatform", this.platform === "Mobile" ? PF.t("reg.mobile") : this.platform],
        ["pp.sumGenres", this.genres.map(function (key) { return PF.t(key); }).join(", ")]
      ];
    }
  };

  function el(tag, attrs, text) {
    const node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (name) { node.setAttribute(name, attrs[name]); });
    if (text) node.textContent = text;
    return node;
  }

  const kicker = el("p", { class: "eyebrow" });
  const heading = el("h2", { id: "profile-heading" });
  const note = el("p", { id: "profile-note", class: "muted small" });
  const steps = el("ol", { class: "profile-steps" });
  const indicators = stepKeys.map(function (key, i) {
    const item = el("li", { class: "profile-step-indicator" });
    item.append(el("span", { class: "profile-step-number", "aria-hidden": "true" }, String(i + 1)), el("span"));
    steps.append(item);
    return item;
  });
  const progress = el("progress", { class: "profile-progress", max: "3", value: "1" });
  const status = el("p", { class: "profile-status", role: "status", "aria-live": "polite", "aria-atomic": "true" });
  const form = el("form", { id: "profile-form", class: "form", "aria-describedby": "profile-note", novalidate: "" });
  const panels = stepKeys.map(function (key, i) {
    const panel = el("fieldset", { class: "profile-step", id: "profile-step-" + (i + 1) });
    panel.append(el("legend", { tabindex: "-1", class: "profile-step-title" }));
    form.append(panel);
    return panel;
  });

  // Step 1 — name
  const nameLabel = el("label", { for: "profile-nickname" });
  const nickname = el("input", { type: "text", id: "profile-nickname", maxlength: "24", autocomplete: "off", spellcheck: "false", required: "", "aria-describedby": "profile-name-hint profile-name-error", placeholder: "PixelPilot" });
  const nameHint = el("p", { id: "profile-name-hint", class: "profile-hint" });
  const nameError = el("p", { id: "profile-name-error", class: "profile-error", "aria-live": "polite" });
  panels[0].append(nameLabel, nickname, nameHint, nameError);

  // Step 2 — platform + genres
  const platformLabel = el("label", { for: "profile-platform" });
  const platform = el("select", { id: "profile-platform", required: "", "aria-describedby": "profile-platform-error" });
  const platformPlaceholder = el("option", { value: "" });
  platform.append(platformPlaceholder);
  const platformOptions = platformNames.map(function (name) { const o = el("option", { value: name }, name); platform.append(o); return o; });
  const platformError = el("p", { id: "profile-platform-error", class: "profile-error", "aria-live": "polite" });
  const genreSet = el("fieldset", { class: "profile-genres", "aria-describedby": "profile-genres-hint profile-genres-error" });
  const genreLegend = el("legend");
  const genreHint = el("p", { id: "profile-genres-hint", class: "profile-hint" });
  const genreGrid = el("div", { class: "profile-genre-grid" });
  const genreLabels = [];
  const genreInputs = genreKeys.map(function (key, i) {
    const label = el("label", { class: "profile-genre-choice", for: "profile-genre-" + i });
    const input = el("input", { type: "checkbox", id: "profile-genre-" + i, value: key, "aria-describedby": "profile-genres-error" });
    const text = el("span");
    label.append(input, text);
    genreLabels.push(text);
    genreGrid.append(label);
    return input;
  });
  const genreError = el("p", { id: "profile-genres-error", class: "profile-error", "aria-live": "polite" });
  genreSet.append(genreLegend, genreHint, genreGrid, genreError);
  panels[1].append(platformLabel, platform, platformError, genreSet);

  // Step 3 — review
  const reviewNote = el("p", { class: "profile-hint" });
  const summary = el("dl", { class: "profile-summary" });
  const completion = el("p", { class: "profile-completion", hidden: "" });
  panels[2].append(reviewNote, summary, completion);

  const actions = el("div", { class: "profile-actions" });
  const backButton = el("button", { type: "button", class: "btn btn-ghost" });
  const nextButton = el("button", { type: "submit", class: "btn" });
  const resetButton = el("button", { type: "button", class: "btn btn-soft" });
  actions.append(backButton, nextButton, resetButton);
  form.append(actions);
  host.append(kicker, heading, note, steps, progress, status, form);

  // Errors are kept as keys so they can be re-translated.
  const errors = { name: "", platform: "", genres: "" };
  function setError(input, box, slot, key) {
    errors[slot] = key;
    box.textContent = key ? PF.t(key) : "";
    if (key) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
  }

  function validateCurrentStep() {
    if (profileState.step === 0) {
      const length = Array.from(profileState.nickname.trim()).length;
      const ok = length >= 2 && length <= 24;
      setError(nickname, nameError, "name", ok ? "" : "pp.errName");
      if (!ok) nickname.focus();
      return ok;
    }
    if (profileState.step === 1) {
      const okPlatform = platformNames.includes(profileState.platform);
      const okGenres = profileState.genres.length > 0;
      setError(platform, platformError, "platform", okPlatform ? "" : "pp.errPlatform");
      errors.genres = okGenres ? "" : "pp.errGenres";
      genreError.textContent = okGenres ? "" : PF.t("pp.errGenres");
      genreInputs.forEach(function (input) { if (okGenres) input.removeAttribute("aria-invalid"); else input.setAttribute("aria-invalid", "true"); });
      if (!okPlatform) platform.focus(); else if (!okGenres) genreInputs[0].focus();
      return okPlatform && okGenres;
    }
    return true;
  }

  function renderSummary() {
    summary.replaceChildren();
    profileState.summary().forEach(function (row) {
      const item = el("div", { class: "profile-summary-item" });
      item.append(el("dt", {}, PF.t(row[0])), el("dd", {}, row[1]));
      summary.append(item);
    });
  }

  function translate() {
    kicker.textContent = PF.t("pp.kicker");
    heading.textContent = PF.t("pp.title");
    note.textContent = PF.t("pp.note");
    steps.setAttribute("aria-label", PF.t("pp.stepsLabel"));
    progress.setAttribute("aria-label", PF.t("pp.progress"));
    indicators.forEach(function (item, i) { item.lastChild.textContent = PF.t(stepKeys[i]); });
    panels.forEach(function (panel, i) { panel.querySelector("legend").textContent = PF.t(stepKeys[i]); });
    nameLabel.textContent = PF.t("pp.nameLabel");
    nameHint.textContent = PF.t("pp.nameHint");
    platformLabel.textContent = PF.t("pp.platformLabel");
    platformPlaceholder.textContent = PF.t("pp.platformChoose");
    platformOptions[4].textContent = PF.t("reg.mobile");
    genreLegend.textContent = PF.t("pp.genres");
    genreHint.textContent = PF.t("pp.genresHint");
    genreLabels.forEach(function (label, i) { label.textContent = PF.t(genreKeys[i]); });
    reviewNote.textContent = PF.t("pp.review");
    backButton.textContent = PF.t("pp.back");
    resetButton.textContent = PF.t("pp.reset");
    nameError.textContent = errors.name ? PF.t(errors.name) : "";
    platformError.textContent = errors.platform ? PF.t(errors.platform) : "";
    genreError.textContent = errors.genres ? PF.t(errors.genres) : "";
    renderStepText();
  }

  function renderStepText() {
    const i = profileState.step;
    if (profileState.completed) {
      nextButton.textContent = PF.t("pp.built");
      completion.textContent = PF.t("pp.done", { name: profileState.nickname.trim(), platform: profileState.platform === "Mobile" ? PF.t("reg.mobile") : profileState.platform });
      status.textContent = PF.t("pp.doneStatus");
    } else {
      nextButton.textContent = PF.t(["pp.next1", "pp.next2", "pp.build"][i]);
      status.textContent = PF.t("pp.stepOf", { n: i + 1, total: stepKeys.length, name: PF.t(stepKeys[i]) });
    }
    if (i === 2) renderSummary();
  }

  function onStepChange(index, moveFocus) {
    panels.forEach(function (panel, n) { panel.hidden = n !== index; });
    indicators.forEach(function (item, n) {
      item.classList.toggle("is-active", n === index);
      item.classList.toggle("is-complete", n < index);
      if (n === index) item.setAttribute("aria-current", "step"); else item.removeAttribute("aria-current");
    });
    progress.value = index + 1;
    backButton.disabled = index === 0;
    nextButton.disabled = false;
    completion.hidden = true;
    renderStepText();
    if (moveFocus !== false) panels[index].querySelector("legend").focus();
  }

  // Higher-order function: the callback receives the new step and renders it.
  function changeStep(nextIndex, callback) {
    profileState.step = Math.max(0, Math.min(nextIndex, stepKeys.length - 1));
    profileState.completed = false;
    callback(profileState.step);
  }

  nickname.addEventListener("input", function () {
    profileState.nickname = nickname.value;
    if (errors.name) setError(nickname, nameError, "name", "");
  });
  platform.addEventListener("change", function () {
    profileState.platform = platform.value;
    if (platform.value) setError(platform, platformError, "platform", "");
  });
  genreInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      profileState.genres = genreInputs.filter(function (o) { return o.checked; }).map(function (o) { return o.value; });
      if (profileState.genres.length) {
        errors.genres = ""; genreError.textContent = "";
        genreInputs.forEach(function (o) { o.removeAttribute("aria-invalid"); });
      }
    });
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateCurrentStep()) return;
    if (profileState.step < stepKeys.length - 1) { changeStep(profileState.step + 1, onStepChange); return; }
    profileState.completed = true;
    completion.hidden = false;
    nextButton.disabled = true;
    renderStepText();
    completion.setAttribute("tabindex", "-1");
    completion.focus();
  });
  backButton.addEventListener("click", function () { changeStep(profileState.step - 1, onStepChange); });
  resetButton.addEventListener("click", function () {
    form.reset();
    profileState.reset();
    setError(nickname, nameError, "name", "");
    setError(platform, platformError, "platform", "");
    errors.genres = ""; genreError.textContent = "";
    genreInputs.forEach(function (o) { o.removeAttribute("aria-invalid"); });
    changeStep(0, function (i) { onStepChange(i, false); });
    nickname.focus();
  });

  PF.onLang(translate);
  translate();
  onStepChange(0, false);
})();
