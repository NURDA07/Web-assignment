/* Assignment 5: a callback-driven, in-memory gaming preference builder. */
(() => {
  "use strict";

  const host = document.querySelector("#player-profile");
  if (!host) return;

  const stepNames = ["Player name", "Playstyle", "Review"];
  const platformNames = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"];
  const genreNames = ["Adventure", "Strategy", "Action", "Racing", "Co-op", "Sandbox"];

  // This object is the source of truth when moving forward and backward.
  // Nothing is sent, saved to storage, or used to create an account.
  const profileState = {
    step: 0,
    nickname: "",
    platform: "",
    genres: [],
    completed: false,
    reset() {
      this.step = 0;
      this.nickname = "";
      this.platform = "";
      this.genres = [];
      this.completed = false;
    },
    summary() {
      return {
        "Player name": this.nickname.trim(),
        Platform: this.platform,
        "Favourite genres": this.genres.join(", ")
      };
    }
  };

  function createElement(tag, attributes = {}, content = "") {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([name, value]) => {
      element.setAttribute(name, value);
    });
    if (content) element.textContent = content;
    return element;
  }

  const kicker = createElement("p", { class: "lab-kicker" }, "YOUR NEXT PLAYER CARD");
  const heading = createElement("h2", { id: "profile-heading", class: "lab-heading" }, "Build your playstyle");
  const note = createElement("p", { id: "profile-note", class: "profile-note" },
    "A three-step demo preference builder. Try a player name and pick your favourites. Nothing is sent or saved.");
  const steps = createElement("ol", { class: "profile-steps", "aria-label": "Profile setup steps" });
  const indicators = stepNames.map((name, index) => {
    const item = createElement("li", { class: "profile-step-indicator" });
    item.append(
      createElement("span", { class: "profile-step-number", "aria-hidden": "true" }, String(index + 1)),
      createElement("span", {}, name)
    );
    steps.append(item);
    return item;
  });
  const progress = createElement("progress", {
    class: "profile-progress", max: "3", value: "1", "aria-label": "Profile setup progress"
  });
  const status = createElement("p", {
    class: "profile-status", role: "status", "aria-live": "polite", "aria-atomic": "true"
  });
  const form = createElement("form", {
    id: "profile-form", "aria-describedby": "profile-note", novalidate: ""
  });
  const panels = stepNames.map((name, index) => {
    const panel = createElement("fieldset", { class: "profile-step", id: `profile-step-${index + 1}` });
    const legend = createElement("legend", { tabindex: "-1", class: "profile-step-title" }, name);
    panel.append(legend);
    form.append(panel);
    return panel;
  });

  const nicknameLabel = createElement("label", { for: "profile-nickname" }, "Player name");
  const nickname = createElement("input", {
    type: "text", id: "profile-nickname", name: "nickname", maxlength: "24",
    autocomplete: "off", spellcheck: "false", required: "",
    "aria-describedby": "profile-name-hint profile-name-error", placeholder: "e.g. PixelPilot"
  });
  const nicknameHint = createElement("p", { id: "profile-name-hint", class: "profile-hint" },
    "Use 2–24 characters. A made-up name works perfectly.");
  const nicknameError = createElement("p", {
    id: "profile-name-error", class: "profile-error", "aria-live": "polite"
  });
  panels[0].append(nicknameLabel, nickname, nicknameHint, nicknameError);

  const platformLabel = createElement("label", { for: "profile-platform" }, "Preferred platform");
  const platform = createElement("select", {
    id: "profile-platform", name: "platform", required: "", "aria-describedby": "profile-platform-error"
  });
  platform.append(createElement("option", { value: "" }, "Choose your platform"));
  platformNames.forEach(name => platform.append(createElement("option", { value: name }, name)));
  const platformError = createElement("p", {
    id: "profile-platform-error", class: "profile-error", "aria-live": "polite"
  });
  const genreFieldset = createElement("fieldset", {
    class: "profile-genres", "aria-describedby": "profile-genres-hint profile-genres-error"
  });
  genreFieldset.append(createElement("legend", {}, "Favourite genres"));
  const genreHint = createElement("p", { id: "profile-genres-hint", class: "profile-hint" }, "Pick at least one. You can choose several.");
  const genreChoices = createElement("div", { class: "profile-genre-grid" });
  const genreInputs = genreNames.map((genre, index) => {
    const label = createElement("label", { class: "profile-genre-choice", for: `profile-genre-${index}` });
    const input = createElement("input", {
      type: "checkbox", id: `profile-genre-${index}`, name: "genres", value: genre,
      "aria-describedby": "profile-genres-error"
    });
    label.append(input, createElement("span", {}, genre));
    genreChoices.append(label);
    return input;
  });
  const genresError = createElement("p", {
    id: "profile-genres-error", class: "profile-error", "aria-live": "polite"
  });
  genreFieldset.append(genreHint, genreChoices, genresError);
  panels[1].append(platformLabel, platform, platformError, genreFieldset);

  const reviewNote = createElement("p", { class: "profile-hint" }, "Check your choices, then build your demo card.");
  const summary = createElement("dl", { class: "profile-summary" });
  const completion = createElement("p", { class: "profile-completion", hidden: "" });
  panels[2].append(reviewNote, summary, completion);

  const actions = createElement("div", { class: "profile-actions" });
  const backButton = createElement("button", { type: "button", class: "profile-button profile-button-secondary" }, "Back");
  const nextButton = createElement("button", { type: "submit", class: "profile-button profile-button-primary" }, "Next: playstyle");
  const resetButton = createElement("button", { type: "button", class: "profile-button profile-button-reset" }, "Reset form");
  actions.append(backButton, nextButton, resetButton);
  form.append(actions);
  host.append(kicker, heading, note, steps, progress, status, form);

  function setError(input, errorElement, message) {
    errorElement.textContent = message;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  // Only the currently visible step can block Next.
  function validateCurrentStep() {
    if (profileState.step === 0) {
      const nameLength = Array.from(profileState.nickname.trim()).length;
      const valid = nameLength >= 2 && nameLength <= 24;
      setError(nickname, nicknameError, valid ? "" : "Enter a player name with 2–24 characters.");
      if (!valid) nickname.focus();
      return valid;
    }
    if (profileState.step === 1) {
      const validPlatform = platformNames.includes(profileState.platform);
      const validGenres = profileState.genres.length > 0;
      setError(platform, platformError, validPlatform ? "" : "Choose a preferred platform.");
      genreInputs.forEach(input => {
        if (validGenres) input.removeAttribute("aria-invalid");
        else input.setAttribute("aria-invalid", "true");
      });
      genresError.textContent = validGenres ? "" : "Choose at least one favourite genre.";
      if (!validPlatform) platform.focus();
      else if (!validGenres) genreInputs[0].focus();
      return validPlatform && validGenres;
    }
    return true;
  }

  function renderSummary() {
    summary.replaceChildren();
    Object.entries(profileState.summary()).forEach(([label, value]) => {
      const item = createElement("div", { class: "profile-summary-item" });
      item.append(createElement("dt", {}, label), createElement("dd", {}, value));
      summary.append(item);
    });
  }

  function onStepChange(stepIndex, moveFocus = true) {
    panels.forEach((panel, index) => { panel.hidden = index !== stepIndex; });
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("is-active", index === stepIndex);
      indicator.classList.toggle("is-complete", index < stepIndex);
      if (index === stepIndex) indicator.setAttribute("aria-current", "step");
      else indicator.removeAttribute("aria-current");
    });
    progress.value = stepIndex + 1;
    status.textContent = `Step ${stepIndex + 1} of ${stepNames.length}: ${stepNames[stepIndex]}.`;
    backButton.disabled = stepIndex === 0;
    nextButton.disabled = false;
    nextButton.textContent = ["Next: playstyle", "Next: review", "Build demo profile"][stepIndex];
    completion.hidden = true;
    if (stepIndex === 2) renderSummary();
    if (moveFocus) panels[stepIndex].querySelector("legend").focus();
  }

  // A higher-order function: the callback receives the new step and renders it.
  function changeStep(nextIndex, callback) {
    profileState.step = Math.max(0, Math.min(nextIndex, stepNames.length - 1));
    profileState.completed = false;
    callback(profileState.step);
  }

  nickname.addEventListener("input", () => {
    profileState.nickname = nickname.value;
    if (nicknameError.textContent) setError(nickname, nicknameError, "");
  });
  platform.addEventListener("change", () => {
    profileState.platform = platform.value;
    if (platform.value) setError(platform, platformError, "");
  });
  genreInputs.forEach(input => {
    input.addEventListener("change", () => {
      profileState.genres = genreInputs.filter(option => option.checked).map(option => option.value);
      if (profileState.genres.length) {
        genresError.textContent = "";
        genreInputs.forEach(option => option.removeAttribute("aria-invalid"));
      }
    });
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!validateCurrentStep()) return;
    if (profileState.step < stepNames.length - 1) {
      changeStep(profileState.step + 1, onStepChange);
      return;
    }
    profileState.completed = true;
    completion.textContent = `${profileState.nickname.trim()}, your demo profile is ready. Enjoy your next ${profileState.platform} adventure!`;
    completion.hidden = false;
    nextButton.disabled = true;
    nextButton.textContent = "Demo profile built";
    status.textContent = "Demo profile built. Nothing was sent or saved. Use Back to edit or Reset form to start again.";
    completion.setAttribute("tabindex", "-1");
    completion.focus();
  });
  backButton.addEventListener("click", () => changeStep(profileState.step - 1, onStepChange));
  resetButton.addEventListener("click", () => {
    form.reset();
    profileState.reset();
    setError(nickname, nicknameError, "");
    setError(platform, platformError, "");
    genresError.textContent = "";
    genreInputs.forEach(input => input.removeAttribute("aria-invalid"));
    completion.textContent = "";
    changeStep(0, onStepChange);
    status.textContent = "Form reset. Step 1 of 3: Player name.";
    nickname.focus();
  });

  onStepChange(0, false);
})();
