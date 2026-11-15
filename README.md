# PixelForge — gaming hub

Team: PixelForge | Group: SE-2501
Members: Marat Nurdaulet; Kadyr Tlektes; Suinalin Azamat

Website: https://nurda07.github.io/Web-assignment/
Repository: https://github.com/NURDA07/Web-assignment

## Run locally

```sh
python3 -m http.server 8000 --directory pixelforge
```

Open http://localhost:8000/. jQuery 4.0.0 loads from the official CDN.

## Pages

| Page | What is on it |
| --- | --- |
| `index.html` — Home | Hero + carousel, greeting and live clock, animated counters, top 3 of the month, crew news (fetch + filter), newsletter pop-up |
| `games.html` — Top Games | Crew favourites with category filter, **live free-to-play games from the FreeToGame API**, top-10 table with live search, autocomplete and highlight, "suggest a game" form |
| `guides.html` — Guides | Guide cards and an accordion with step-by-step walkthroughs |
| `gallery.html` — Gallery | Featured image switcher, lazy-loaded image wall, copy-link button |
| `play.html` — Player Lab | 3-step player card form, star rating, quest animation, Web Audio sound, greeting, random fact, background colour |
| `about.html` — About & Team | Story, timeline, values, team cards, FAQ accordion |
| `contact.html` — Contact us | Validated contact form (topic, reply by email/phone, message counter), sent with `fetch` to JSONPlaceholder |
| `register.html` — Sign up | Validated registration (player name, email, phone, password strength + show/hide, confirm, platform, rules) |
| `login.html` — Log in | Checks email + password against the accounts saved in `localStorage`, then redirects to the profile |
| `profile.html` — Profile | Shows the signed-in user's stored details, sign out (guests are redirected to Log in) |
| `responsive.html` — Responsive design | Media-query breakpoints demo |

## Final project requirements — where each one lives

| Requirement | Implementation |
| --- | --- |
| Responsiveness | CSS Grid + Flexbox with breakpoints at 1100 / 960 / 640 / 520 px (`css/style.css`) |
| Hosting | GitHub Pages workflow `.github/workflows/pages.yml` deploys `pixelforge/` |
| Light / dark mode | ☀/☾ button in the header, saved in `localStorage` (`js/core.js`) |
| Authentication simulation | Sign up stores name, email, phone and password in `localStorage` → Log in checks credentials → Profile page (`js/core.js`, `js/forms.js`) |
| Form validation | All forms use `novalidate` and JavaScript checks: required fields, email format, password length + upper/lower case + digit, phone pattern (10–15 digits). Errors appear under each field. No HTML validation attributes. |
| Search / filtering | Games category filter, live table search, FreeToGame genre filter, news filter. The last filter, search and genre are saved in `localStorage`. |
| Animations | Hover transitions on buttons and cards, spinners, carousel, counters, quest animation |
| External API | FreeToGame API (`js/api.js`) with `async/await`, loading state, error message and "Try again" button |

## Site-wide features

- **Light / dark theme** — ☀/☾ button in the header, saved in `localStorage`. All colours are CSS variables
  redefined for the light theme, so button text stays readable in both themes.
- **Language EN / RU / KZ** — selector in the header translates every page (static text, form errors, script messages)
  and is remembered between pages. Translations live in `js/i18n.js`.
- **Keyboard** — arrow keys / Space / PgDn scroll normally; `J`/`K` next/previous section, `T`/`B` top/bottom,
  `1`–`7` open menu pages, `/` search, `L` theme, `?` help dialog, `Esc` closes dialogs. Shortcuts use physical keys,
  so they also work on a Russian or Kazakh keyboard layout. Arrow keys move between menu links.
- **Account** — after logging in, the player name appears in the header on every page and links to the profile.
  This is a front-end simulation: accounts (including the password) are stored only in this browser's `localStorage`.

## Files

```
pixelforge/
  *.html            pages (shared header, footer and theme on all of them)
  css/style.css     the only stylesheet
  js/script.js      shared jQuery script (search, progress bar, counters, notifications)
  js/core.js        theme, language, menu, keyboard shortcuts, auth helpers
  js/i18n.js        EN / RU / KZ translations
  js/forms.js       validation + contact, sign up, log in, profile
  js/api.js         FreeToGame API
  js/home.js  js/games.js  js/gallery.js  js/lab.js  js/player-profile.js
  data/*.json       news and facts (with translations)
  images/           compressed images
```

## Report and deployment

Reports: `reports/Assignment-5-Report.pdf`, `reports/Assignment-6-Report.pdf`.
The GitHub Pages workflow deploys `pixelforge/` on every push to `main`.
