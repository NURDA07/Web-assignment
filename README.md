# PixelForge — gaming hub

Team: PixelForge | Group: SE-2501
Members: Marat Nurdaulet; Kadyr Tlektes; Suinalin Azamat

Website: https://nurda07.github.io/Web-assignment/
Repository: https://github.com/NURDA07/Web-assignment

## Run locally

```sh
python3 -m http.server 8000 --directory assignment3
```

Open http://localhost:8000/. jQuery 4.0.0 loads from the official CDN.

## Pages

| Page | What is on it |
| --- | --- |
| `index.html` — Home | Hero + carousel, greeting and live clock, animated counters, top 3 of the month, crew news (fetch + filter), newsletter pop-up |
| `games.html` — Top Games | Crew favourites with category filter, top-10 table with live search, autocomplete and highlight, "suggest a game" form |
| `guides.html` — Guides | Guide cards and an accordion with step-by-step walkthroughs |
| `gallery.html` — Gallery | Featured image switcher, lazy-loaded image wall, copy-link button |
| `play.html` — Player Lab | 3-step player card form, star rating, quest animation, Web Audio sound, greeting, random fact, background colour |
| `about.html` — About & Team | Story, timeline, values, team cards, FAQ accordion |
| `contact.html` — Contact us | Validated contact form (topic, reply by email/phone, message counter), sent with `fetch` to JSONPlaceholder |
| `register.html` — Sign up | Validated registration (username, email, password strength + show/hide, confirm, platform, rules) |
| `part1.html` — Responsive design | Media-query breakpoints demo |

## Site-wide features

- **Light / dark theme** — ☀/☾ button in the header, saved in `localStorage`. All colours are CSS variables
  redefined for the light theme, so button text stays readable in both themes.
- **Language EN / RU / KZ** — selector in the header translates every page (static text, form errors, script messages)
  and is remembered between pages. Translations live in `js/i18n.js`.
- **Keyboard** — arrow keys / Space / PgDn scroll normally; `J`/`K` next/previous section, `T`/`B` top/bottom,
  `1`–`7` open menu pages, `/` search, `L` theme, `?` help dialog, `Esc` closes dialogs. Shortcuts use physical keys,
  so they also work on a Russian or Kazakh keyboard layout. Arrow keys move between menu links.
- **Account** — after registration the player name appears in the header on every page. Only name, email and
  platform are kept in `localStorage`; the password is validated but never saved.

## Assignment 6 (jQuery) — where each task lives

`script.js` is loaded in `<head>` right after the jQuery CDN on every page and runs inside `$(document).ready()`.

0. CDN, external `script.js`, `document.ready`, console message — every page.
1–3. Real-time search, autocomplete, highlight — `games.html`.
4. Scroll progress bar — every page.
5. Animated counters — `index.html`.
6–7. Disabled submit + spinner, fading notification — `games.html` (suggest a game).
8. Copy to clipboard with checkmark and tooltip — `gallery.html`.
9. Lazy-loaded images — `gallery.html`.

## Files

```
assignment3/
  *.html            pages (shared header, footer and theme on all of them)
  script.js         jQuery tasks
  css/site.css      the only stylesheet
  js/i18n.js        EN / RU / KZ translations
  js/core.js        theme, language, menu, keyboard shortcuts, helpers
  js/home.js  js/games.js  js/gallery.js  js/lab.js  js/player-profile.js  js/forms.js
  data/*.json       news and facts (with translations)
  img/              compressed images
```

## Report and deployment

Reports: `reports/Assignment-5-Report.pdf`, `reports/Assignment-6-Report.pdf`.
The GitHub Pages workflow deploys `assignment3/` on every push to `main`.
