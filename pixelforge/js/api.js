/* =========================================================
   Top Games: live free-to-play games from the public FreeToGame API
   (https://www.freetogame.com/api-doc). The chosen genre is saved in
   localStorage, so the same list opens on the next visit.
   ========================================================= */
(function () {
  "use strict";
  const API_URL = "https://www.freetogame.com/api/games";
  const STORE_KEY = "pixelforge-f2p-genre";
  const LIMIT = 6;

  const list = document.getElementById("f2p-list");
  if (!list) return;
  const status = document.getElementById("f2p-status");
  const errorBox = document.getElementById("f2p-error");
  const buttons = document.querySelectorAll("#f2p-filters [data-genre]");
  const genres = Array.from(buttons).map(function (button) { return button.dataset.genre; });

  let genre = PF.read(STORE_KEY);
  if (!genres.includes(genre)) genre = genres[0];
  let games = [];
  let requestId = 0;       // ignores late answers when the user switches genre quickly

  function card(game) {
    const article = document.createElement("article");
    article.className = "card card-media catalog-card";
    const image = document.createElement("img");
    image.src = game.thumbnail; image.alt = game.title; image.loading = "lazy";
    image.width = 365; image.height = 206;
    const body = document.createElement("div");
    body.className = "card-body";
    const platform = document.createElement("p");
    platform.className = "platform";
    platform.textContent = game.genre + " · " + game.platform;
    const title = document.createElement("h3");
    title.textContent = game.title;
    const text = document.createElement("p");
    text.className = "muted";
    text.textContent = game.short_description;
    const link = document.createElement("a");
    link.className = "btn btn-sm";
    link.href = game.game_url; link.target = "_blank"; link.rel = "noopener";
    link.textContent = PF.t("api.play");
    body.append(platform, title, text, link);
    article.append(image, body);
    return article;
  }

  function render() {
    list.replaceChildren.apply(list, games.map(card));
    status.textContent = games.length ? PF.t("api.shown", { n: games.length }) : PF.t("api.empty");
  }

  // async/await + fetch, with a loading state and error handling.
  async function load() {
    const id = ++requestId;
    buttons.forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.genre === genre)); });
    errorBox.hidden = true;
    list.replaceChildren();
    list.setAttribute("aria-busy", "true");
    status.innerHTML = '<span class="spinner" aria-hidden="true"></span> ';
    status.append(PF.t("common.loading"));
    try {
      const response = await fetch(API_URL + "?category=" + encodeURIComponent(genre) + "&sort-by=popularity");
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      if (id !== requestId) return;
      // The API returns an object instead of an array when nothing matches.
      games = Array.isArray(data) ? data.slice(0, LIMIT) : [];
      render();
    } catch (error) {
      if (id !== requestId) return;
      games = [];
      status.textContent = "";
      errorBox.hidden = false;
    } finally {
      if (id === requestId) list.setAttribute("aria-busy", "false");
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.dataset.genre === genre && games.length) return;   // already shown
      genre = button.dataset.genre;
      PF.write(STORE_KEY, genre);
      load();
    });
  });
  document.getElementById("f2p-retry").addEventListener("click", load);
  PF.onLang(function () { if (games.length) render(); });
  load();
})();
