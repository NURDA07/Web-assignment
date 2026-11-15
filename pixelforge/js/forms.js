/* =========================================================
   Forms: shared validation helpers + Contact page + Registration page.
   Validators return a translation key ("" when valid), so error
   messages switch language together with the rest of the page.
   ========================================================= */
(function () {
  "use strict";
  const $ = function (id) { return document.getElementById(id); };

  function emailKey(value) {
    value = value.trim();
    if (!value) return "err.emailEmpty";
    const parts = value.split("@");
    const domain = parts[1] || "";
    const labels = domain.split(".");
    const validDomain = labels.length > 1 && labels.every(function (label) {
      return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label);
    }) && /^[a-z]{2,}$/i.test(labels[labels.length - 1]);
    const local = parts[0] || "";
    if (value.length > 254 || /\s/.test(value) || parts.length !== 2 || !local || local.length > 64 ||
        local.startsWith(".") || local.endsWith(".") || local.includes("..") || !validDomain) {
      return "err.email";
    }
    return "";
  }

  // Phone: digits, spaces, (), - and an optional leading +; 10–15 digits in total.
  function phoneKey(value) {
    value = value.trim();
    if (!value) return "err.phoneEmpty";
    const digits = value.replace(/\D/g, "");
    return /^\+?[\d\s()-]+$/.test(value) && digits.length >= 10 && digits.length <= 15 ? "" : "err.phone";
  }

  // Password: 8+ characters, no spaces, upper + lower case letters and a digit.
  function passwordKey(value) {
    if (!value) return "err.passEmpty";
    if (/\s/.test(value)) return "err.passSpace";
    if (value.length < 8) return "err.passShort";
    if (!/\p{Lu}/u.test(value) || !/\p{Ll}/u.test(value) || !/\d/.test(value)) return "err.passMix2";
    return "";
  }

  // Generic form controller: fields = [{ input, error, check(input) -> key }]
  function controller(form, fields, status) {
    let attempted = false;
    const shown = new Map();      // input -> error key currently displayed

    function show(field, key) {
      shown.set(field.input, key);
      field.error.textContent = key ? PF.t(key) : "";
      if (key) field.input.setAttribute("aria-invalid", "true");
      else field.input.removeAttribute("aria-invalid");
    }
    function validate() {
      let first = null;
      fields.forEach(function (field) {
        const key = field.input.disabled ? "" : field.check(field.input);
        show(field, key);
        if (key && !first) first = field.input;
      });
      return first;
    }
    function setStatus(type, text) {
      status.className = "form-status" + (type ? " " + type : "");
      status.textContent = text || "";
    }
    // Validate each field when the user leaves it, then live once a submit was tried.
    fields.forEach(function (field) {
      field.input.addEventListener("blur", function () {
        if (field.input.value || attempted) show(field, field.input.disabled ? "" : field.check(field.input));
      });
    });
    form.addEventListener("input", function () { if (attempted) validate(); setStatus(); });
    form.addEventListener("change", function () { if (attempted) validate(); });
    PF.onLang(function () {
      fields.forEach(function (field) { if (shown.get(field.input)) show(field, shown.get(field.input)); });
      if (status.dataset.key) setStatus(status.dataset.type, PF.t(status.dataset.key, JSON.parse(status.dataset.vars || "{}")));
    });

    return {
      submit: function () {
        attempted = true;
        const first = validate();
        if (first) { this.status("error", "form.fix"); first.focus(); return false; }
        attempted = false;
        return true;
      },
      // Status messages are stored as keys so they can be re-translated.
      status: function (type, key, vars) {
        status.dataset.type = type; status.dataset.key = key; status.dataset.vars = JSON.stringify(vars || {});
        setStatus(type, PF.t(key, vars));
      },
      clear: function () {
        attempted = false;
        fields.forEach(function (field) { show(field, ""); });
        delete status.dataset.key;
        setStatus();
      }
    };
  }

  function field(inputId, check) {
    return { input: $(inputId), error: $(inputId + "-error"), check: check };
  }
  function busy(button, on) {
    if (on) {
      button.dataset.label = button.textContent;
      button.disabled = true;
      button.innerHTML = '<span class="spinner" aria-hidden="true"></span> ';
      button.append(PF.t("common.wait"));
    } else {
      button.disabled = false;
      button.textContent = PF.t(button.getAttribute("data-i18n")) || button.dataset.label;
    }
  }

  window.PFForms = { emailError: function (input) { const key = emailKey(input.value); return key ? PF.t(key) : ""; } };

  /* ======================= Contact page ======================= */
  const contactForm = $("contact-form");
  if (contactForm) {
    const phoneField = $("phone-field");
    const phone = $("c-phone");
    const message = $("c-message");
    const counter = $("c-counter");
    const methods = contactForm.querySelectorAll("[name=method]");

    function updateMethod() {
      const byPhone = contactForm.querySelector("[name=method]:checked").value === "phone";
      phoneField.hidden = !byPhone;
      phone.disabled = !byPhone;
      if (!byPhone) { phone.removeAttribute("aria-invalid"); $("c-phone-error").textContent = ""; }
    }
    methods.forEach(function (radio) { radio.addEventListener("change", updateMethod); });
    updateMethod();

    function updateCounter() {
      const length = message.value.length;
      counter.textContent = length + " / 1000";
      counter.style.color = length > 950 ? "var(--danger)" : "";
    }
    message.addEventListener("input", updateCounter);
    updateCounter();

    const contact = controller(contactForm, [
      field("c-name", function (input) {
        const value = input.value.trim();
        if (!value) return "err.nameEmpty";
        return /^[\p{L}][\p{L}\s'.-]{1,79}$/u.test(value) ? "" : "err.name";
      }),
      field("c-email", function (input) { return emailKey(input.value); }),
      field("c-topic", function (input) { return input.value ? "" : "err.topic"; }),
      field("c-phone", function (input) { return phoneKey(input.value); }),
      field("c-message", function (input) {
        const length = input.value.trim().length;
        if (!length) return "err.messageEmpty";
        if (length > 1000) return "err.messageLong";
        return length >= 10 ? "" : "err.messageShort";
      })
    ], $("contact-status"));

    // Callback style: the request result is handed to this function.
    function onContactSent(error, data, name, method) {
      if (error) { contact.status("error", "contact.failed"); return; }
      contact.status("success", method === "phone" ? "contact.sentPhone" : "contact.sentEmail", { name: name, id: data.id });
      contactForm.reset();
      updateMethod();
      updateCounter();
    }

    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!contact.submit()) return;
      const button = contactForm.querySelector("button[type=submit]");
      const name = $("c-name").value.trim();
      const method = contactForm.querySelector("[name=method]:checked").value;
      busy(button, true);
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: $("c-topic").value, body: $("c-message").value.trim(), userId: 1 }),
          signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined
        });
        if (!response.ok) throw new Error("HTTP " + response.status);
        onContactSent(null, await response.json(), name, method);
      } catch (error) {
        onContactSent(error);
      } finally {
        busy(button, false);
      }
    });

    // Pre-fill name and email for signed-in players.
    const user = PF.getUser();
    if (user) { $("c-name").value = user.name; $("c-email").value = user.email; }
  }

  /* ===================== Show / hide password buttons ===================== */
  document.querySelectorAll(".toggle-pass").forEach(function (button) {
    const input = $(button.dataset.target);
    function label() { button.textContent = PF.t(input.type === "password" ? "reg.show" : "reg.hide"); }
    button.addEventListener("click", function () {
      input.type = input.type === "password" ? "text" : "password";
      button.setAttribute("aria-pressed", String(input.type === "text"));
      label();
    });
    PF.onLang(label);
  });

  /* ===================== Sign up page ===================== */
  const regForm = $("registration-form");
  if (regForm) {
    const password = $("r-password");
    const bar = $("strength-bar");
    const strengthLabel = $("strength-label");

    function strength(value) {
      let score = 0;
      if (value.length >= 8) score++;
      if (value.length >= 12) score++;
      if (/\p{Ll}/u.test(value) && /\p{Lu}/u.test(value)) score++;
      if (/\d/.test(value)) score++;
      if (/[^\p{L}\d\s]/u.test(value)) score++;
      return Math.min(4, score);
    }
    function updateStrength() {
      const value = password.value;
      const score = value ? Math.max(1, strength(value)) : 0;
      const colors = ["var(--danger)", "var(--danger)", "var(--warning)", "var(--accent)", "var(--success)"];
      bar.style.width = (score * 25) + "%";
      bar.style.backgroundColor = colors[score];
      strengthLabel.textContent = value ? PF.t("reg.strength" + score) : "";
    }
    password.addEventListener("input", updateStrength);
    PF.onLang(updateStrength);

    const reg = controller(regForm, [
      field("r-username", function (input) {
        const value = input.value.trim();
        if (!value) return "err.usernameEmpty";
        return /^[A-Za-z0-9_]{3,20}$/.test(value) ? "" : "err.username";
      }),
      field("r-email", function (input) {
        const key = emailKey(input.value);
        if (key) return key;
        return PF.findUser(input.value) ? "err.emailTaken" : "";
      }),
      field("r-phone", function (input) { return phoneKey(input.value); }),
      field("r-password", function (input) { return passwordKey(input.value); }),
      field("r-confirm", function (input) {
        if (!input.value) return "err.confirmEmpty";
        return input.value === password.value ? "" : "err.confirm";
      }),
      field("r-platform", function (input) { return input.value ? "" : "err.platform"; }),
      field("r-terms", function (input) { return input.checked ? "" : "err.terms"; })
    ], $("registration-status"));

    regForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!reg.submit()) return;
      const button = regForm.querySelector("button[type=submit]");
      const email = $("r-email").value.trim();
      busy(button, true);
      // Simulated sign up: the account (including the password) is stored in
      // localStorage only, because the site has no backend.
      PF.addUser({
        name: $("r-username").value.trim(),
        email: email,
        phone: $("r-phone").value.trim(),
        password: password.value,
        platform: $("r-platform").value,
        joined: new Date().toISOString()
      });
      reg.status("success", "reg.createdLogin");
      // Pass the email to the login page so the user only types the password.
      try { sessionStorage.setItem("pixelforge-new-email", email); } catch (e) { /* storage blocked */ }
      setTimeout(function () { window.location.href = "login.html"; }, 1200);
    });
  }

  /* ===================== Log in page ===================== */
  const loginForm = $("login-form");
  if (loginForm) {
    // Already signed in → go straight to the profile.
    if (PF.getUser()) window.location.replace("profile.html");

    const login = controller(loginForm, [
      field("l-email", function (input) { return emailKey(input.value); }),
      field("l-password", function (input) {
        if (!input.value) return "err.passEnter";
        return input.value.length >= 8 ? "" : "err.passShort";
      })
    ], $("login-status"));

    try {
      const newEmail = sessionStorage.getItem("pixelforge-new-email");
      if (newEmail) {
        sessionStorage.removeItem("pixelforge-new-email");
        $("l-email").value = newEmail;
        login.status("success", "login.registered");
      }
    } catch (e) { /* storage blocked */ }

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!login.submit()) return;
      const user = PF.checkLogin($("l-email").value, $("l-password").value);
      if (!user) {
        login.status("error", "login.wrong");
        $("l-password").value = "";
        $("l-password").focus();
        return;
      }
      PF.login(user);
      login.status("success", "login.ok", { name: user.name });
      window.location.href = "profile.html";
    });
  }

  /* ===================== Profile page ===================== */
  const profile = $("profile-view");
  if (profile) {
    const user = PF.getUser();
    // Profile is private: guests are sent to the login page.
    if (!user) {
      window.location.replace("login.html");
    } else {
      const render = function () {
        $("profile-avatar").textContent = user.name.charAt(0).toUpperCase();
        $("profile-name").textContent = PF.t("reg.hello", { name: user.name });
        $("profile-username").textContent = user.name;
        $("profile-email").textContent = user.email;
        $("profile-phone").textContent = user.phone || "—";
        $("profile-platform").textContent = user.platform === "Mobile" ? PF.t("reg.mobile") : user.platform;
        $("profile-joined").textContent = PF.formatDate(new Date(user.joined), { year: true });
      };
      render();
      PF.onLang(render);
      profile.hidden = false;
      $("sign-out").addEventListener("click", function () {
        PF.logout();
        window.location.href = "login.html";
      });
    }
  }
})();
