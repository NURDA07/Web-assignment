# PixelForge

A student-built gaming hub with reviews, rankings, and beginner-friendly guides. PixelForge is the project for the **Front-End Basics** course, built with plain HTML and CSS plus Bootstrap 5 for some pages.

**Team:** PixelForge  
**Group:** SE-2501  
**Members:** Marat Nurdaulet · Kadyr Tlektes · Suinalin Azamat

**Live website:** https://singular-klepon-a00276.netlify.app/

## Run locally

Open `assignment3/index.html`, or run `python3 -m http.server 8000 --directory assignment3` and visit http://localhost:8000.

---

## Features

- **Home page** with a 9-slide Bootstrap carousel, hero section, and highlight cards
- **Top Games** page with genre tags, a rankings table, and a 9-tile hover/focus image gallery
- **Guides** page with game walkthrough cards and short step-by-step guides (Brawl Stars, Counter-Strike 2, Minecraft)
- **Team** page with profile cards for each member
- **Contact** page with a form (text, email, select, radio buttons, checkbox, textarea)
- **Media Queries demo** showing responsive typography and a 1 → 2 → 3 column card layout
- Responsive layouts, a dark neon theme, a skip-to-content link, ARIA labels, and `alt` text on images

## Pages

| Page | File | Styling |
|------|------|---------|
| Home | `index.html` | Bootstrap 5 |
| About | `about.html` | Custom CSS |
| Top Games | `games.html` | Custom CSS |
| Guides | `guides.html` | Custom CSS |
| Team | `team.html` | Custom CSS |
| Contact | `contact.html` | Bootstrap 5 |
| Media Queries (Part 1) | `part1.html` | Inline CSS |

## Project Structure

```
assignment3/
├── index.html
├── about.html
├── games.html
├── guides.html
├── team.html
├── contact.html
├── part1.html
├── css/
│   └── style.css        # shared dark-mode theme for About, Games, Guides, Team
├── js/
│   └── contact.js       # contact-form draft generator (see Known Issues)
└── images/              # game artwork and team portraits
```

## Tech Stack

- HTML5
- CSS3 (custom properties, Flexbox, CSS Grid, media queries)
- [Bootstrap 5.3.0](https://getbootstrap.com/) via CDN (Home and Contact pages)
- [Orbitron](https://fonts.google.com/specimen/Orbitron) via Google Fonts
- Vanilla JavaScript

## Getting Started

No build step or dependencies to install.

1. Download or clone the project.
2. Open `index.html` in a browser, or serve the folder locally:

   ```bash
   cd assignment3
   python -m http.server 8000
   ```

   Then visit <http://localhost:8000>.

An internet connection is needed to load Bootstrap and Google Fonts from their CDNs.

## Design Notes

- **Palette:** purple `#6c2bd9`, cyan `#00e5ff`, pink `#ff3d81` on a dark `#0f0f1a` background, defined as CSS variables in `css/style.css`.
- **Layout:** the custom-styled pages use a CSS Grid shell (header, sidebar, main, footer). It collapses to a single column below 700px, with an intermediate layout at 1050px.

## Work Split

| Member | Pages |
|--------|-------|
| Marat Nurdaulet | Home, About |
| Kadyr Tlektes | Top Games, Guides |
| Suinalin Azamat | Team, Contact |

## Known Issues

- `team.html` references `images/azamat.png`, but the file is named `Azamat.png`. This will break on case-sensitive hosts such as GitHub Pages or Linux servers. Rename the file or fix the path.
- `js/contact.js` expects a form with `id="contact-form"` and elements such as `#message-draft` and `#form-status`, but `contact.html` doesn't include them and doesn't load the script, so the script is currently unused.
- The navigation differs between the Bootstrap pages (Home, Contact) and the custom-styled pages, and the Bootstrap navbar has no links to Top Games, Guides, or Team.

## License

Created for educational purposes as a university course assignment.
