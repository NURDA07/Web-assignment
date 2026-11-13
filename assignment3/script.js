/* =========================================================
   Assignment 6 — jQuery. Loaded from the CDN in <head> on every
   page; each task runs only on the page that has its elements:
     • Tasks 1–3  search, autocomplete, highlight ... games.html
     • Task 4     scroll progress bar ............. every page
     • Task 5     animated counters ............... index.html
     • Task 6–7   spinner submit + notification ... games.html
     • Task 8     copy to clipboard ............... gallery.html
     • Task 9     lazy-loaded images .............. gallery.html
   ========================================================= */
$(document).ready(function () {
  console.log("jQuery is ready!");
  const t = function (key, vars) { return window.PF ? PF.t(key, vars) : key; };

  // ---------- Tasks 1–3: live search, autocomplete, highlight ----------
  const $search = $("#game-search");
  if ($search.length) {
    const $rows = $("#game-results tr");
    const names = $rows.map(function () { return $(this).find("td").eq(1).text(); }).get();
    const $scope = $("#game-results td, #rank-title");

    function clearHighlights() {
      $("mark.search-match").each(function () {
        const parent = this.parentNode;
        $(this).replaceWith(document.createTextNode($(this).text()));
        parent.normalize();
      });
    }
    function highlight(query) {
      clearHighlights();
      if (!query) return;
      $scope.each(function () {
        const walker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(function (node) {
          const value = node.nodeValue;
          const lower = value.toLowerCase();
          let start = 0, at = lower.indexOf(query);
          if (at < 0) return;
          const fragment = document.createDocumentFragment();
          while (at >= 0) {
            fragment.append(document.createTextNode(value.slice(start, at)));
            const mark = document.createElement("mark");
            mark.className = "search-match";
            mark.textContent = value.slice(at, at + query.length);
            fragment.append(mark);
            start = at + query.length;
            at = lower.indexOf(query, start);
          }
          fragment.append(document.createTextNode(value.slice(start)));
          node.replaceWith(fragment);
        });
      });
    }
    function closeSuggestions() {
      $("#search-suggestions").prop("hidden", true).empty();
      $search.attr("aria-expanded", "false");
    }
    function runSearch() {
      const query = $search.val().trim().toLowerCase();
      clearHighlights();
      let count = 0;
      $rows.each(function () {
        // Visible text (any language) + English keywords, so "fps" works in RU / KZ too.
        const haystack = ($(this).text() + " " + ($(this).attr("data-keywords") || "")).toLowerCase();
        const match = haystack.includes(query);
        $(this).toggle(match);
        if (match) count++;
      });
      $("#game-results .empty-row").remove();
      if (!count) $("#game-results").append($("<tr>", { class: "empty-row" }).append($("<td>", { colspan: 5, text: t("games.noResults") })));
      $("#search-status").text(t(count === 1 ? "games.found1" : "games.foundN", { n: count }));
      highlight(query);
      return query;
    }

    $search.on("input", function () {
      const query = runSearch();
      closeSuggestions();
      // Suggest the names of every matching game (by name, genre or platform).
      const suggestions = query ? names.filter(function (name, i) { return $rows.eq(i).css("display") !== "none"; }) : [];
      suggestions.forEach(function (name) {
        $("<li>").append($("<button>", { type: "button", text: name })).appendTo("#search-suggestions");
      });
      $("#search-suggestions").prop("hidden", !suggestions.length);
      $search.attr("aria-expanded", String(!!suggestions.length));
    }).on("keydown", function (event) {
      if (event.key === "Escape") closeSuggestions();
      if (event.key === "ArrowDown" && !$("#search-suggestions").prop("hidden")) {
        event.preventDefault();
        $("#search-suggestions button:first").trigger("focus");
      }
    });
    // Arrow keys move through the suggestion list.
    $("#search-suggestions").on("keydown", "button", function (event) {
      const $items = $("#search-suggestions button");
      const index = $items.index(this);
      if (event.key === "ArrowDown") { event.preventDefault(); $items.eq(Math.min(index + 1, $items.length - 1)).trigger("focus"); }
      if (event.key === "ArrowUp") { event.preventDefault(); index === 0 ? $search.trigger("focus") : $items.eq(index - 1).trigger("focus"); }
      if (event.key === "Escape") { closeSuggestions(); $search.trigger("focus"); }
    }).on("click", "button", function () {
      $search.val($(this).text());
      runSearch();
      closeSuggestions();
      $search.trigger("focus");
    });
    $(document).on("click", function (event) {
      if (!$(event.target).closest(".jq-search").length) closeSuggestions();
    });
    // Re-run after a language switch so status text and highlights match.
    if (window.PF) PF.onLang(function () { setTimeout(runSearch, 0); });
    runSearch();
  }

  // ---------- Tasks 4, 5, 9: scroll progress, counters, lazy images ----------
  const counted = new Set();
  function formatNumber(value) { return Math.floor(value).toLocaleString(window.PF ? PF.locale() : "en-US"); }
  function updateViewport() {
    const top = $(window).scrollTop();
    const bottom = top + $(window).height();
    const distance = $(document).height() - $(window).height();
    const progress = distance > 0 ? Math.min(100, (top / distance) * 100) : 100;
    $("#scroll-progress").css("width", progress + "%").attr("aria-valuenow", Math.round(progress));

    $("img[data-src]").each(function () {
      const $img = $(this);
      const offset = $img.offset().top;
      if (offset < bottom + 200 && offset + $img.height() > top - 200) {
        $img.one("load", function () { $(this).addClass("loaded"); })
          .attr("src", $img.attr("data-src")).removeAttr("data-src");
      }
    });

    $(".number-counter").each(function () {
      if (counted.has(this) || $(this).offset().top >= bottom) return;
      counted.add(this);
      const element = this;
      const target = Number($(this).attr("data-count"));
      $({ value: 0 }).animate({ value: target }, {
        duration: 1400, easing: "swing",
        step: function (value) { $(element).text(formatNumber(value)); },
        complete: function () { $(element).text(formatNumber(target)); }
      });
    });
  }
  $(window).on("scroll resize", updateViewport);
  updateViewport();

  // ---------- Tasks 6–7: disabled button + spinner, fading notification ----------
  let toastTimer;
  function notify(message) {
    let $box = $("#notification");
    if (!$box.length) $box = $("<div>", { id: "notification", role: "status", "aria-live": "polite" }).appendTo("body");
    clearTimeout(toastTimer);
    $box.stop(true, true).text(message).prop("hidden", false).hide().fadeIn(180);
    toastTimer = setTimeout(function () {
      $box.fadeOut(400, function () { $(this).prop("hidden", true); });
    }, 2600);
  }

  $("#game-suggestion-form").on("submit", function (event) {
    event.preventDefault();
    const $input = $("#suggested-game");
    const $button = $(this).find("button[type=submit]");
    const name = $input.val().trim();
    if (name.length < 2) {
      $("#suggest-error").text(t("games.sugError"));
      $input.attr("aria-invalid", "true").trigger("focus");
      return;
    }
    $("#suggest-error").text("");
    $input.removeAttr("aria-invalid");
    if ($button.prop("disabled")) return;
    const label = $button.text();
    $button.prop("disabled", true).html('<span class="spinner" aria-hidden="true"></span> ' + $("<span>").text(t("common.wait")).html());
    setTimeout(function () {
      $button.prop("disabled", false).text(label);
      $input.val("");
      notify(t("games.sugDone", { game: name }));
    }, 1600);
  });

  // ---------- Task 8: copy to clipboard with checkmark + tooltip ----------
  $("#copy-link").on("click", async function () {
    const $button = $(this);
    try {
      await navigator.clipboard.writeText($("#share-text").text());
      $button.find(".copy-icon").text("✓");
      $("#copy-tooltip").prop("hidden", false);
      notify(t("gallery.copied"));
      setTimeout(function () {
        $button.find(".copy-icon").text("⧉");
        $("#copy-tooltip").prop("hidden", true);
      }, 2400);
    } catch (error) {
      notify(t("gallery.copyFail"));
    }
  });
});
