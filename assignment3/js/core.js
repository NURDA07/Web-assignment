/* =========================================================
   PixelForge core — loaded on every page.
   1. Theme (light / dark) saved in localStorage
   2. Language (EN / RU / KZ) for ALL pages, saved in localStorage
   3. Header: mobile menu, arrow-key navigation, account chip
   4. Keyboard scrolling + shortcuts dialog, back-to-top button
   5. Small helpers shared by page scripts (PF.t, PF.notify, PF.modal)
   ========================================================= */
(function () {
  "use strict";

  const STORE = { theme: "pixelforge-theme", lang: "pixelforge-lang", user: "pixelforge-user" };
  const LANGS = ["en", "ru", "kk"];
  const root = document.documentElement;

  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function write(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* storage blocked */ } }
  function remove(key) { try { localStorage.removeItem(key); } catch (e) { /* storage blocked */ } }

  /* ---------- 1. Theme: applied immediately to avoid a flash ---------- */
  let theme = read(STORE.theme) || (window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  root.dataset.theme = theme;

  /* ---------- 2. Language ---------- */
  let lang = read(STORE.lang);
  if (!LANGS.includes(lang)) lang = "en";
  root.lang = lang;

  const dict = window.PF_DICT || { en: {}, ru: {}, kk: {} };
  const base = {};          // English text captured from the HTML
  const listeners = [];     // page scripts re-render dynamic text here

  function t(key, vars) {
    let text = (dict[lang] && dict[lang][key]) || (dict.en && dict.en[key]) || base[key] || key;
    if (vars) Object.keys(vars).forEach(function (name) { text = text.split("{" + name + "}").join(vars[name]); });
    return text;
  }

  const ATTRS = [["data-i18n-ph", "placeholder"], ["data-i18n-aria", "aria-label"], ["data-i18n-title", "title"]];

  function captureBase() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (!(key in base)) base[key] = el.textContent.trim();
    });
    ATTRS.forEach(function (pair) {
      document.querySelectorAll("[" + pair[0] + "]").forEach(function (el) {
        const key = el.getAttribute(pair[0]);
        if (!(key in base)) base[key] = el.getAttribute(pair[1]) || "";
      });
    });
  }

  function applyLanguage() {
    root.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    ATTRS.forEach(function (pair) {
      document.querySelectorAll("[" + pair[0] + "]").forEach(function (el) { el.setAttribute(pair[1], t(el.getAttribute(pair[0]))); });
    });
    const select = document.getElementById("lang-select");
    if (select) select.value = lang;
    updateThemeButton();
    updateAccount();
    listeners.forEach(function (fn) { fn(lang); });
  }

  function setLanguage(value) {
    lang = LANGS.includes(value) ? value : "en";
    write(STORE.lang, lang);
    applyLanguage();
  }

  /* ---------- Theme button ---------- */
  function updateThemeButton() {
    const button = document.getElementById("theme-toggle");
    if (!button) return;
    const dark = theme === "dark";
    button.textContent = dark ? "☀" : "☾";
    button.setAttribute("aria-label", t(dark ? "theme.toLight" : "theme.toDark"));
    button.title = button.getAttribute("aria-label");
    button.setAttribute("aria-pressed", String(!dark));
  }
  function setTheme(value) {
    theme = value === "light" ? "light" : "dark";
    root.dataset.theme = theme;
    write(STORE.theme, theme);
    updateThemeButton();
  }

  /* ---------- Account chip in the header ---------- */
  function getUser() {
    try { return JSON.parse(read(STORE.user) || "null"); } catch (e) { return null; }
  }
  function updateAccount() {
    const link = document.getElementById("account-link");
    if (!link) return;
    const user = getUser();
    link.textContent = user ? "👤 " + user.username : t("nav.signup");
    link.title = user ? t("nav.account") : "";
  }

  /* ---------- Toast + modal helpers ---------- */
  let toastTimer;
  function notify(message) {
    let box = document.getElementById("notification");
    if (!box) {
      box = document.createElement("div");
      box.id = "notification"; box.setAttribute("role", "status"); box.setAttribute("aria-live", "polite"); box.hidden = true;
      document.body.append(box);
    }
    clearTimeout(toastTimer);
    box.textContent = message;
    box.hidden = false;
    toastTimer = setTimeout(function () { box.hidden = true; }, 2600);
  }

  // Opens an overlay, keeps Tab focus inside, closes on Escape / backdrop click.
  function modal(overlay, opener) {
    const box = overlay.querySelector(".modal");
    let previous = document.activeElement;
    function focusables() {
      return Array.from(box.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"))
        .filter(function (el) { return !el.disabled && el.getClientRects().length; });
    }
    function onKey(event) {
      if (event.key === "Escape") { event.preventDefault(); close(); }
      if (event.key === "Tab") {
        const items = focusables(); if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    function onClick(event) { if (event.target === overlay || event.target.closest("[data-close]")) close(); }
    function close() {
      overlay.hidden = true;
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey, true);
      overlay.removeEventListener("click", onClick);
      if (opener) opener.setAttribute("aria-expanded", "false");
      if (previous && previous.focus) previous.focus();
    }
    previous = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey, true);
    overlay.addEventListener("click", onClick);
    if (opener) opener.setAttribute("aria-expanded", "true");
    const first = box.querySelector("input, select, textarea") || focusables()[0];
    if (first) first.focus();
    return { close: close };
  }

  /* ---------- 4. Keyboard scrolling ---------- */
  function isTyping(el) {
    return el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  }
  function sections() {
    return Array.from(document.querySelectorAll("main > section, main > .section, main [data-section]"))
      .filter(function (el) { return el.getClientRects().length; });
  }
  function headerOffset() {
    const header = document.querySelector(".site-header");
    return (header ? header.offsetHeight : 0) + 12;
  }
  function scrollToSection(direction) {
    const list = sections();
    const current = window.scrollY + headerOffset() + 4;
    let target;
    if (direction > 0) target = list.find(function (el) { return el.getBoundingClientRect().top + window.scrollY > current; });
    else target = list.slice().reverse().find(function (el) { return el.getBoundingClientRect().top + window.scrollY < current - 8; });
    if (target) {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerOffset(), behavior: smooth() });
      // Move focus with the scroll so Tab continues from the new section.
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    } else if (direction > 0) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: smooth() });
    } else {
      window.scrollTo({ top: 0, behavior: smooth() });
    }
  }
  function smooth() { return matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"; }

  let shortcutsDialog = null;
  function openShortcuts(opener) {
    let overlay = document.getElementById("shortcuts-dialog");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "shortcuts-dialog"; overlay.className = "modal-bg"; overlay.hidden = true;
      overlay.innerHTML =
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="kbd-title">' +
        '<button type="button" class="icon-btn modal-close" data-close data-i18n-aria="common.close" aria-label="Close">✕</button>' +
        '<h2 id="kbd-title" data-i18n="kbd.title">Keyboard shortcuts</h2>' +
        '<dl class="kbd-list">' +
        '<dt><kbd>↓</kbd> <kbd>↑</kbd></dt><dd data-i18n="kbd.arrows">Scroll the page a little</dd>' +
        '<dt><kbd>Space</kbd> <kbd>PgDn</kbd></dt><dd data-i18n="kbd.page">Scroll one screen</dd>' +
        '<dt><kbd>J</kbd> / <kbd>K</kbd></dt><dd data-i18n="kbd.section">Next / previous section</dd>' +
        '<dt><kbd>T</kbd> / <kbd>B</kbd></dt><dd data-i18n="kbd.topBottom">Jump to top / bottom</dd>' +
        '<dt><kbd>1</kbd> … <kbd>7</kbd></dt><dd data-i18n="kbd.pages">Open a page from the menu</dd>' +
        '<dt><kbd>/</kbd></dt><dd data-i18n="kbd.search">Focus the search field</dd>' +
        '<dt><kbd>L</kbd></dt><dd data-i18n="kbd.theme">Switch light / dark theme</dd>' +
        '<dt><kbd>?</kbd></dt><dd data-i18n="kbd.help">Show this help</dd>' +
        '<dt><kbd>Esc</kbd></dt><dd data-i18n="kbd.esc">Close dialogs and menus</dd>' +
        "</dl></div>";
      document.body.append(overlay);
      captureBase();
      applyLanguage();
    }
    shortcutsDialog = modal(overlay, opener);
  }

  function onGlobalKey(event) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
    if (isTyping(event.target)) return;
    if (document.querySelector(".modal-bg:not([hidden])")) return;
    // event.code is the physical key, so shortcuts also work on a Russian / Kazakh layout
    // (there the J key types "о", but its code is still "KeyJ").
    if (event.key === "?" || (event.code === "Slash" && event.shiftKey)) { event.preventDefault(); openShortcuts(); return; }
    if (event.shiftKey) return;
    const navLinks = Array.from(document.querySelectorAll(".nav-menu li:not(.nav-account) a"));
    switch (event.code) {
      case "KeyJ": scrollToSection(1); break;
      case "KeyK": scrollToSection(-1); break;
      case "KeyT": window.scrollTo({ top: 0, behavior: smooth() }); break;
      case "KeyB": window.scrollTo({ top: document.documentElement.scrollHeight, behavior: smooth() }); break;
      case "KeyL": setTheme(theme === "dark" ? "light" : "dark"); notify(t(theme === "dark" ? "theme.nowDark" : "theme.nowLight")); break;
      case "Slash": {
        const search = document.querySelector("input[type='search']");
        if (!search) return;
        search.focus();
        break;
      }
      default: {
        const digit = /^(?:Digit|Numpad)([1-7])$/.exec(event.code);
        if (digit && navLinks[Number(digit[1]) - 1]) { window.location.href = navLinks[Number(digit[1]) - 1].href; break; }
        return;
      }
    }
    event.preventDefault();
  }

  /* ---------- Header behaviour ---------- */
  function initHeader() {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.textContent = open ? "✕" : "☰";
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && nav.classList.contains("open")) { toggle.click(); toggle.focus(); }
      });
    }
    // Arrow keys move between menu links (Tab still works normally).
    document.querySelectorAll(".nav-menu").forEach(function (menu) {
      menu.addEventListener("keydown", function (event) {
        const links = Array.from(menu.querySelectorAll("a")).filter(function (a) { return a.getClientRects().length; });
        const index = links.indexOf(document.activeElement);
        if (index < 0) return;
        let next;
        switch (event.key) {
          case "ArrowRight": case "ArrowDown": next = (index + 1) % links.length; break;
          case "ArrowLeft": case "ArrowUp": next = (index - 1 + links.length) % links.length; break;
          case "Home": next = 0; break;
          case "End": next = links.length - 1; break;
          default: return;
        }
        event.preventDefault();
        links[next].focus();
      });
    });

    const themeButton = document.getElementById("theme-toggle");
    if (themeButton) themeButton.addEventListener("click", function () { setTheme(theme === "dark" ? "light" : "dark"); });
    const select = document.getElementById("lang-select");
    if (select) select.addEventListener("change", function () { setLanguage(select.value); });
    document.querySelectorAll("[data-shortcuts]").forEach(function (button) {
      button.addEventListener("click", function () { openShortcuts(button); });
    });
  }

  /* ---------- Back to top ---------- */
  function initToTop() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-soft to-top icon-btn";
    button.textContent = "↑";
    button.setAttribute("data-i18n-aria", "common.toTop");
    button.setAttribute("aria-label", "Back to top");
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: smooth() });
      const skip = document.querySelector(".skip-link");
      if (skip) skip.focus({ preventScroll: true });
    });
    document.body.append(button);
    function update() { button.classList.toggle("show", window.scrollY > 500); }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- Accordions (FAQ / guides): one panel open at a time ---------- */
  function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach(function (group) {
      const buttons = group.querySelectorAll(".acc-btn");
      buttons.forEach(function (button) {
        const panel = document.getElementById(button.getAttribute("aria-controls"));
        panel.hidden = button.getAttribute("aria-expanded") !== "true";
        button.addEventListener("click", function () {
          const willOpen = button.getAttribute("aria-expanded") !== "true";
          buttons.forEach(function (other) {
            other.setAttribute("aria-expanded", "false");
            document.getElementById(other.getAttribute("aria-controls")).hidden = true;
          });
          button.setAttribute("aria-expanded", String(willOpen));
          panel.hidden = !willOpen;
        });
      });
      // Open the item named in the URL hash, e.g. guides.html#cs-guide
      document.querySelectorAll("[data-open-guide]").forEach(function (link) {
        link.addEventListener("click", function () {
          const target = group.querySelector("#" + link.dataset.openGuide + " .acc-btn");
          if (target && target.getAttribute("aria-expanded") !== "true") target.click();
        });
      });
      if (location.hash) {
        const target = group.querySelector(location.hash + " .acc-btn, .acc-btn[aria-controls='" + location.hash.slice(1) + "']");
        if (target && target.getAttribute("aria-expanded") !== "true") target.click();
      }
    });
  }

  /* ---------- Public API for page scripts ---------- */
  window.PF = {
    t: t,
    get lang() { return lang; },
    onLang: function (fn) { listeners.push(fn); },
    notify: notify,
    modal: modal,
    getUser: getUser,
    setUser: function (user) { if (user) write(STORE.user, JSON.stringify(user)); else remove(STORE.user); updateAccount(); },
    read: read,
    write: write,
    locale: function () { return { en: "en-US", ru: "ru-RU", kk: "kk-KZ" }[lang]; },
    // opts: { weekday, year, time }
    formatDate: function (date, opts) {
      opts = opts || {};
      const pad = function (n) { return String(n).padStart(2, "0"); };
      const time = pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
      if (lang === "kk") {
        const months = ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"];
        const days = ["жексенбі", "дүйсенбі", "сейсенбі", "сәрсенбі", "бейсенбі", "жұма", "сенбі"];
        let text = (opts.year ? date.getFullYear() + " ж. " : "") + date.getDate() + " " + months[date.getMonth()];
        if (opts.weekday) text += ", " + days[date.getDay()];
        return opts.time ? text + ", " + time : text;
      }
      const format = { day: "numeric", month: "long" };
      if (opts.weekday) format.weekday = "long";
      if (opts.year) format.year = "numeric";
      if (opts.time) { format.hour = "2-digit"; format.minute = "2-digit"; format.second = "2-digit"; }
      return date.toLocaleString(this.locale(), format);
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    captureBase();
    initHeader();
    initToTop();
    initAccordions();
    applyLanguage();
    document.addEventListener("keydown", onGlobalKey);
  });
})();
