"use strict";

// Assignment 5: event listeners connect our data and the visible DOM.
document.addEventListener("DOMContentLoaded", () => {
  const welcome = document.getElementById("lab-welcome");
  welcome.textContent = "Your next adventure starts here. Build a card and find your game.";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Objects keep each game's data together. Their method formats the rating.
  const games = [
    {
      title: "Counter-Strike 2", category: "fps", platform: "PC", rating: 9.5,
      image: "images/counterstrike2.png", alt: "Counter-Strike 2 tactical shooter artwork",
      description: "Think together. Hold the angle. Make every round count.",
      getRating() { return `${this.rating.toFixed(1)} / 10`; }
    },
    {
      title: "Minecraft", category: "sandbox", platform: "PC · Console · Mobile", rating: 9.8,
      image: "images/minecraft.png", alt: "Minecraft landscape with block-built terrain and scenery",
      description: "Build, explore and turn your imagination into a world.",
      getRating() { return `${this.rating.toFixed(1)} / 10`; }
    },
    {
      title: "Brawl Stars", category: "arena", platform: "Mobile", rating: 9.2,
      image: "images/brawlstars.png", alt: "Colourful characters from Brawl Stars",
      description: "Pick your brawler and team up for a quick arena match.",
      getRating() { return `${this.rating.toFixed(1)} / 10`; }
    }
  ];

  const catalog = document.getElementById("game-catalog");
  const catalogStatus = document.getElementById("catalog-status");
  const filterButtons = document.querySelectorAll("#game-filters [data-category]");

  // A switch selects the filter; filter(), map(), and a loop prepare the cards.
  function renderGames(category) {
    let categoryName;
    switch (category) {
      case "fps": categoryName = "Tactical FPS"; break;
      case "sandbox": categoryName = "Sandbox"; break;
      case "arena": categoryName = "Arena"; break;
      default: category = "all"; categoryName = "All games";
    }

    const visibleGames = games.filter((game) => category === "all" || game.category === category);
    const cards = visibleGames.map((game) => {
      const card = document.createElement("article");
      card.className = "catalog-card";
      const image = document.createElement("img");
      image.src = game.image;
      image.alt = game.alt;
      image.loading = "lazy";
      const body = document.createElement("div");
      body.className = "catalog-card-body";
      const platform = document.createElement("p");
      platform.className = "game-platform";
      platform.textContent = game.platform;
      const title = document.createElement("h3");
      title.textContent = game.title;
      const description = document.createElement("p");
      description.textContent = game.description;
      const rating = document.createElement("span");
      rating.className = "game-rating";
      rating.textContent = `Crew score: ${game.getRating()}`;
      body.append(platform, title, description, rating);
      card.append(image, body);
      return card;
    });

    catalog.replaceChildren();
    for (const card of cards) {
      catalog.append(card);
    }
    catalogStatus.textContent = `${categoryName} · ${visibleGames.length} ${visibleGames.length === 1 ? "game" : "games"} shown`;
    filterButtons.forEach((button) => {
      const selected = button.dataset.category === category;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    if (!reducedMotion.matches && typeof catalog.animate === "function") {
      catalog.animate([{ opacity: .4, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 220, easing: "ease-out" });
    }
  }

  filterButtons.forEach((button) => button.addEventListener("click", () => renderGames(button.dataset.category)));
  renderGames("all");

  // Accessible custom radio buttons: arrows change the rating and focus together.
  const stars = Array.from(document.querySelectorAll("#rating-stars [data-rating]"));
  const ratingStatus = document.getElementById("rating-status");

  function selectRating(value) {
    stars.forEach((star) => {
      const starValue = Number(star.dataset.rating);
      star.classList.toggle("is-filled", starValue <= value);
      // Direct DOM styling: the selected rating lights up this star and all before it.
      star.style.color = starValue <= value ? "#ffd36b" : "#777797";
      star.setAttribute("aria-checked", String(starValue === value));
      star.tabIndex = starValue === value ? 0 : -1;
    });
    ratingStatus.textContent = `Your rating: ${value} / 5. Thanks for playing!`;
  }

  stars.forEach((star, index) => {
    star.addEventListener("click", () => selectRating(Number(star.dataset.rating)));
    star.addEventListener("keydown", (event) => {
      let nextIndex;
      switch (event.key) {
        case "ArrowRight": case "ArrowDown": nextIndex = (index + 1) % stars.length; break;
        case "ArrowLeft": case "ArrowUp": nextIndex = (index + stars.length - 1) % stars.length; break;
        case "Home": nextIndex = 0; break;
        case "End": nextIndex = stars.length - 1; break;
        default: return;
      }
      event.preventDefault();
      selectRating(nextIndex + 1);
      stars[nextIndex].focus();
    });
  });

  // Thumbnail events update both the image source and its text alternative.
  const scenes = [
    { title: "Minecraft", image: "images/minecraft.png", alt: "Minecraft landscape with block-built terrain and scenery", caption: "One block. Endless possibilities." },
    { title: "Counter-Strike 2", image: "images/counterstrike2.png", alt: "Counter-Strike 2 tactical shooter artwork", caption: "Good strategy starts with your team." },
    { title: "Brawl Stars", image: "images/brawlstars.png", alt: "Colourful characters from Brawl Stars", caption: "Quick matches. Big team energy." }
  ];
  const featuredImage = document.getElementById("featured-image");
  const thumbnails = document.querySelectorAll("#gallery-thumbnails [data-image]");

  thumbnails.forEach((button) => button.addEventListener("click", () => {
    const scene = scenes[Number(button.dataset.image)];
    featuredImage.src = scene.image;
    featuredImage.alt = scene.alt;
    document.getElementById("featured-title").textContent = scene.title;
    document.getElementById("featured-caption").textContent = scene.caption;
    document.getElementById("gallery-status").textContent = `Featured image changed to ${scene.title}.`;
    thumbnails.forEach((thumbnail) => {
      const selected = thumbnail === button;
      thumbnail.classList.toggle("is-selected", selected);
      thumbnail.setAttribute("aria-pressed", String(selected));
    });
    if (!reducedMotion.matches && typeof featuredImage.animate === "function") {
      featuredImage.animate([{ opacity: .35 }, { opacity: 1 }], { duration: 250 });
    }
  }));

  const questButton = document.getElementById("start-quest");
  const questCard = document.getElementById("quest-card");
  const questStatus = document.getElementById("quest-status");
  let completedQuests = 0;

  // Event-triggered motion has an immediate alternative for reduced-motion users.
  questButton.addEventListener("click", async () => {
    questButton.disabled = true;
    questCard.setAttribute("aria-busy", "true");
    questStatus.textContent = "Quest in progress…";
    if (!reducedMotion.matches && typeof questCard.animate === "function") {
      const animation = questCard.animate([
        { transform: "translateY(0) scale(1)" },
        { transform: "translateY(-8px) scale(1.025)", offset: .45 },
        { transform: "translateY(0) scale(1)" }
      ], { duration: 650, easing: "ease-in-out" });
      try { await animation.finished; } catch { /* A cancelled animation still completes the demo quest. */ }
    }
    completedQuests += 1;
    questStatus.textContent = `Quest complete! ${completedQuests} ${completedQuests === 1 ? "victory" : "victories"} this session.`;
    questButton.textContent = "Play another quest";
    questCard.removeAttribute("aria-busy");
    questButton.disabled = false;
  });

  // Web Audio creates a short original chime, only after a deliberate click.
  const soundButton = document.getElementById("play-sound");
  const soundStatus = document.getElementById("sound-status");
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  let audioContext;
  let soundPlaying = false;

  if (!AudioContextClass) {
    soundButton.disabled = true;
    soundStatus.textContent = "This browser does not support Web Audio. The other activities still work.";
  }

  soundButton.addEventListener("click", async () => {
    if (soundPlaying || !AudioContextClass) return;
    soundPlaying = true;
    soundButton.disabled = true;
    try {
      audioContext = audioContext || new AudioContextClass();
      if (audioContext.state === "suspended") await audioContext.resume();
      if (audioContext.state !== "running") throw new Error("Audio is not available");
      const frequencies = [523.25, 659.25, 783.99];
      let remainingNotes = frequencies.length;
      frequencies.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const volume = audioContext.createGain();
        const start = audioContext.currentTime + index * .18;
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        volume.gain.setValueAtTime(0, start);
        volume.gain.linearRampToValueAtTime(.08, start + .015);
        volume.gain.exponentialRampToValueAtTime(.001, start + .16);
        oscillator.connect(volume);
        volume.connect(audioContext.destination);
        oscillator.onended = () => {
          oscillator.disconnect();
          volume.disconnect();
          remainingNotes -= 1;
          if (remainingNotes === 0) {
            soundPlaying = false;
            soundButton.disabled = false;
            soundStatus.textContent = "Victory sound finished. You can play it again.";
          }
        };
        oscillator.start(start);
        oscillator.stop(start + .17);
      });
      soundStatus.textContent = "Playing a short victory chime…";
    } catch {
      soundPlaying = false;
      soundButton.disabled = false;
      soundStatus.textContent = "Sound could not start. Check your browser sound settings and try again.";
    }
  });
});
