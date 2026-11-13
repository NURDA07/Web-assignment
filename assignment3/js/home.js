/* Home page: carousel, time-based greeting + clock, crew news (fetch), newsletter pop-up. */
(function () {
  "use strict";
  const $ = function (id) { return document.getElementById(id); };
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Carousel (keyboard: ← → when focused) ---------- */
  const carousel = $("hero-carousel");
  if (carousel) {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const dots = carousel.querySelector(".carousel-dots");
    let index = 0, timer;
    slides.forEach(function (slide, i) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.addEventListener("click", function () { go(i); restart(); });
      dots.append(dot);
    });
    function labelDots() {
      Array.from(dots.children).forEach(function (dot, i) {
        dot.setAttribute("aria-label", PF.t("home.slideN", { n: i + 1, total: slides.length }));
      });
    }
    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-100 * index) + "%)";
      slides.forEach(function (slide, n) { slide.setAttribute("aria-hidden", String(n !== index)); slide.inert = n !== index; });
      Array.from(dots.children).forEach(function (dot, n) { dot.setAttribute("aria-current", String(n === index)); });
    }
    function restart() {
      clearInterval(timer);
      if (!reducedMotion) timer = setInterval(function () { go(index + 1); }, 5000);
    }
    carousel.querySelector(".prev").addEventListener("click", function () { go(index - 1); restart(); });
    carousel.querySelector(".next").addEventListener("click", function () { go(index + 1); restart(); });
    carousel.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); restart(); }
      if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1); restart(); }
    });
    carousel.addEventListener("mouseenter", function () { clearInterval(timer); });
    carousel.addEventListener("mouseleave", restart);
    carousel.addEventListener("focusin", function () { clearInterval(timer); });
    PF.onLang(labelDots);
    labelDots();
    go(0);
    restart();
  }

  /* ---------- Greeting + live clock (switch on the hour) ---------- */
  const greeting = $("home-greeting");
  function greetingKey(hour) {
    switch (true) {
      case hour < 5: return "greet.night";
      case hour < 12: return "greet.morning";
      case hour < 18: return "greet.afternoon";
      default: return "greet.evening";
    }
  }
  function tick() {
    if (!greeting) return;
    const now = new Date();
    const user = PF.getUser();
    const hello = PF.t(greetingKey(now.getHours())) + (user ? ", " + user.username : "") + "!";
    const when = now.toLocaleString(PF.locale(), { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    greeting.textContent = hello + " · " + when;
  }
  tick();
  setInterval(tick, 1000);
  PF.onLang(tick);

  /* ---------- Crew news from data/posts.json ---------- */
  const feed = $("news-feed");
  if (feed) {
    let posts = [], all = [], category = "all";
    const loadButton = $("load-posts");
    const status = $("news-status");
    const pick = function (value) { return typeof value === "string" ? value : (value[PF.lang] || value.en); };

    function render() {
      let visible;
      switch (category) {
        case "games": visible = posts.filter(function (p) { return p.category === "games"; }); break;
        case "tech": visible = posts.filter(function (p) { return p.category === "tech"; }); break;
        default: visible = posts;
      }
      feed.replaceChildren();
      visible.forEach(function (post) {
        const article = document.createElement("article");
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = PF.t(post.category === "games" ? "home.newsGames" : "home.newsTech");
        const heading = document.createElement("h3");
        heading.style.marginTop = "10px";
        heading.textContent = pick(post.title);
        const body = document.createElement("p");
        body.textContent = pick(post.body);
        article.append(tag, heading, body);
        feed.append(article);
      });
      status.textContent = PF.t("home.newsShown", { n: visible.length });
      document.querySelectorAll("[data-feed]").forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.dataset.feed === category));
      });
      if (all.length && posts.length >= all.length) { loadButton.textContent = PF.t("home.newsAllLoaded"); loadButton.disabled = true; }
    }
    async function loadMore() {
      loadButton.disabled = true;
      status.textContent = PF.t("common.loading");
      try {
        if (!all.length) {
          const response = await fetch("data/posts.json");
          if (!response.ok) throw new Error("HTTP " + response.status);
          all = await response.json();
        }
        posts = all.slice(0, posts.length + 2);
        loadButton.disabled = posts.length >= all.length;
        render();
      } catch (error) {
        status.textContent = PF.t("home.newsError");
        loadButton.disabled = false;
      }
    }
    document.querySelectorAll("[data-feed]").forEach(function (button) {
      button.addEventListener("click", function () { category = button.dataset.feed; render(); });
    });
    loadButton.addEventListener("click", loadMore);
    PF.onLang(function () { if (posts.length) render(); });
    loadMore();
  }

  /* ---------- Newsletter pop-up with validation ---------- */
  const open = $("open-popup");
  const overlay = $("newsletter");
  if (open && overlay) {
    const form = $("newsletter-form");
    const email = $("nl-email");
    const error = $("nl-email-error");
    const status = $("nl-status");
    open.addEventListener("click", function () {
      error.textContent = ""; status.textContent = ""; status.className = "form-status";
      email.removeAttribute("aria-invalid");
      PF.modal(overlay, open);
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const message = window.PFForms ? PFForms.emailError(email) : (email.value.trim() ? "" : "Email required");
      error.textContent = message;
      email.setAttribute("aria-invalid", String(Boolean(message)));
      status.className = "form-status " + (message ? "error" : "success");
      if (message) { status.textContent = PF.t("form.fix"); email.focus(); return; }
      status.textContent = PF.t("home.nlDone", { email: email.value.trim() });
      form.reset();
    });
  }
})();
