$(document).ready(function () {
  console.log("jQuery is ready!");

  // Tasks 1-3: live filtering, autocomplete, and safe literal highlighting.
  const $rows = $("#game-results tr");
  const names = $rows.map(function () { return $(this).find("td:first").text(); }).get();
  const searchable = $("main h1, main h2, main p, main li, main td, main figcaption strong, main figcaption span")
    .not("#search-status, #search-suggestions *, .jq-stats *, .jq-panel *");
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
    const seen = new Set();
    searchable.each(function () {
      const walker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) if (!seen.has(walker.currentNode)) {
        seen.add(walker.currentNode); nodes.push(walker.currentNode);
      }
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
    $("#game-search").attr("aria-expanded", "false");
  }
  $("#game-search").on("input", function () {
    const query = $(this).val().trim().toLowerCase();
    clearHighlights();
    let count = 0;
    $rows.each(function () {
      const matches = $(this).text().toLowerCase().includes(query);
      $(this).toggle(matches);
      if (matches) count++;
    });
    $("#search-status").text(count + (count === 1 ? " game found" : " games found"));
    closeSuggestions();
    const suggestions = query ? names.filter(name => name.toLowerCase().includes(query)) : [];
    suggestions.forEach(function (name) {
      $("<li>").append($("<button>", {type: "button", text: name})).appendTo("#search-suggestions");
    });
    $("#search-suggestions").prop("hidden", !suggestions.length);
    $(this).attr("aria-expanded", String(!!suggestions.length));
    highlight(query);
  }).on("keydown", function (event) {
    if (event.key === "Escape") closeSuggestions();
    if (event.key === "ArrowDown" && !$("#search-suggestions").prop("hidden")) {
      event.preventDefault(); $("#search-suggestions button:first").trigger("focus");
    }
  });
  $("#search-suggestions").on("click", "button", function () {
    $("#game-search").val($(this).text()).trigger("input").trigger("focus");
    closeSuggestions();
  });
  $(document).on("click", function (event) {
    if (!$(event.target).closest(".jq-search").length) closeSuggestions();
  });

  // Tasks 4, 5, 9: scroll progress, counters, and viewport image loading.
  const counted = new Set();
  function updateViewport() {
    const top = $(window).scrollTop();
    const bottom = top + $(window).height();
    const distance = $(document).height() - $(window).height();
    const progress = distance > 0 ? Math.min(100, top / distance * 100) : 100;
    $("#scroll-progress").css("width", progress + "%").attr("aria-valuenow", Math.round(progress));
    $("img[data-src]").each(function () {
      if ($(this).offset().top < bottom && $(this).offset().top + $(this).height() > top) {
        $(this).attr("src", $(this).attr("data-src")).removeAttr("data-src");
      }
    });
    $(".number-counter").each(function () {
      if (counted.has(this) || $(this).offset().top >= bottom) return;
      counted.add(this);
      const element = this;
      $({value: 0}).animate({value: Number($(this).attr("data-count"))}, {
        duration: 1400, easing: "swing",
        step: function (value) { $(element).text(Math.floor(value).toLocaleString("en-US")); },
        complete: function () { $(element).text(Number($(element).attr("data-count")).toLocaleString("en-US")); }
      });
    });
  }
  $(window).on("scroll resize", updateViewport);
  $(".image-gallery img").on("load", updateViewport);
  updateViewport();

  // Tasks 6-7: simulated submission, disabled button, and fading notification.
  let toastTimer;
  function notify(message) {
    clearTimeout(toastTimer);
    $("#notification").stop(true, true).text(message).prop("hidden", false).hide().fadeIn(180);
    toastTimer = setTimeout(function () {
      $("#notification").fadeOut(400, function () { $(this).prop("hidden", true); });
    }, 2400);
  }
  $("#game-suggestion-form").on("submit", function (event) {
    event.preventDefault();
    const $button = $(this).find("button");
    if ($button.prop("disabled")) return;
    $button.prop("disabled", true).html('<span class="spinner" aria-hidden="true"></span>Please wait…');
    setTimeout(function () {
      $button.prop("disabled", false).text("Submit");
      notify("Game suggestion submitted successfully (demo).");
    }, 1600);
  });

  // Task 8: copy text; show confirmation only after clipboard success.
  $("#copy-link").on("click", async function () {
    const $button = $(this);
    try {
      await navigator.clipboard.writeText($("#share-text").text());
      $button.find(".copy-icon").text("✓");
      $("#copy-tooltip").prop("hidden", false);
      notify("Copied to clipboard!");
      setTimeout(function () {
        $button.find(".copy-icon").text("⧉");
        $("#copy-tooltip").prop("hidden", true);
      }, 2400);
    } catch (error) { notify("Unable to copy. Select and copy the link manually."); }
  });
});
