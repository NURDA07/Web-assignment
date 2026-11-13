/* Gallery: thumbnails change the featured image's src, alt and caption. */
(function () {
  "use strict";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scenes = [
    { title: "Minecraft", image: "img/minecraft.jpg", alt: "Minecraft landscape with block-built terrain", caption: "gallery.s1" },
    { title: "Counter-Strike 2", image: "img/counterstrike2.jpg", alt: "Counter-Strike 2 tactical shooter artwork", caption: "gallery.s2" },
    { title: "Brawl Stars", image: "img/brawlstars.jpg", alt: "Colourful Brawl Stars characters", caption: "gallery.s3" }
  ];
  const image = document.getElementById("featured-image");
  const title = document.getElementById("featured-title-text");
  const caption = document.getElementById("featured-caption");
  const status = document.getElementById("gallery-status");
  const thumbs = Array.from(document.querySelectorAll("#gallery-thumbnails [data-image]"));
  let current = 0;

  function show(index, announce) {
    current = index;
    const scene = scenes[index];
    image.src = scene.image;
    image.alt = scene.alt;
    title.textContent = scene.title;
    caption.textContent = " — " + PF.t(scene.caption);
    if (announce) status.textContent = PF.t("gallery.changed", { name: scene.title });
    thumbs.forEach(function (thumb, n) { thumb.setAttribute("aria-pressed", String(n === index)); });
    if (announce && !reducedMotion && image.animate) image.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 260 });
  }

  thumbs.forEach(function (thumb, index) {
    thumb.addEventListener("click", function () { show(index, true); });
    // Up / Down arrows move between thumbnails.
    thumb.addEventListener("keydown", function (event) {
      let next;
      switch (event.key) {
        case "ArrowDown": case "ArrowRight": next = (index + 1) % thumbs.length; break;
        case "ArrowUp": case "ArrowLeft": next = (index - 1 + thumbs.length) % thumbs.length; break;
        default: return;
      }
      event.preventDefault();
      thumbs[next].focus();
      show(next, true);
    });
  });
  PF.onLang(function () { show(current, false); });
  show(0, false);
})();
