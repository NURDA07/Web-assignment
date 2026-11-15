/* Top Games: crew favourites built from an array of objects, filtered with a switch. */
(function () {
  "use strict";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Objects keep each game's data together; the method formats the rating.
  const games = [
    { title: "Counter-Strike 2", category: "fps", platform: "PC", rating: 9.5, image: "images/counterstrike2.jpg",
      alt: "Counter-Strike 2 tactical shooter artwork", text: "games.cs2",
      getRating: function () { return this.rating.toFixed(1) + " / 10"; } },
    { title: "Minecraft", category: "sandbox", platform: "PC · Console · Mobile", rating: 9.8, image: "images/minecraft.jpg",
      alt: "Minecraft landscape with block-built terrain", text: "games.mc",
      getRating: function () { return this.rating.toFixed(1) + " / 10"; } },
    { title: "Brawl Stars", category: "arena", platform: "Mobile", rating: 9.2, image: "images/brawlstars.jpg",
      alt: "Colourful Brawl Stars characters", text: "games.bs",
      getRating: function () { return this.rating.toFixed(1) + " / 10"; } }
  ];

  const catalog = document.getElementById("game-catalog");
  const status = document.getElementById("catalog-status");
  const buttons = document.querySelectorAll("#game-filters [data-category]");
  // The last chosen category is saved in localStorage and restored on the next visit.
  const FILTER_KEY = "pixelforge-games-filter";
  let current = PF.read(FILTER_KEY) || "all";

  function render(category) {
    let labelKey;
    switch (category) {
      case "fps": labelKey = "games.fFps"; break;
      case "sandbox": labelKey = "games.fSandbox"; break;
      case "arena": labelKey = "games.fArena"; break;
      default: category = "all"; labelKey = "games.fAll";
    }
    current = category;
    PF.write(FILTER_KEY, category);
    const visible = games.filter(function (game) { return category === "all" || game.category === category; });
    catalog.replaceChildren();
    visible.forEach(function (game) {
      const card = document.createElement("article");
      card.className = "card card-media catalog-card";
      const image = document.createElement("img");
      image.src = game.image; image.alt = game.alt; image.loading = "lazy";
      const body = document.createElement("div");
      body.className = "card-body";
      const platform = document.createElement("p");
      platform.className = "platform"; platform.textContent = game.platform;
      const title = document.createElement("h3"); title.textContent = game.title;
      const text = document.createElement("p"); text.className = "muted"; text.textContent = PF.t(game.text);
      const score = document.createElement("span");
      score.className = "score"; score.textContent = PF.t("games.crewScore") + ": " + game.getRating();
      body.append(platform, title, text, score);
      card.append(image, body);
      catalog.append(card);
    });
    status.textContent = PF.t(labelKey) + " · " + PF.t(visible.length === 1 ? "games.shown1" : "games.shownN", { n: visible.length });
    buttons.forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.category === category)); });
    if (!reducedMotion && catalog.animate) {
      catalog.animate([{ opacity: .4, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: "ease-out" });
    }
  }

  buttons.forEach(function (button) { button.addEventListener("click", function () { render(button.dataset.category); }); });
  PF.onLang(function () { render(current); });
  render(current);
})();
