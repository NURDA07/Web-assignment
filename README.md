# PixelForge - Assignment 2

**Team:** PixelForge  
**Group:** SE-2501  
**Members:** Marat Nurdaulet, Kadyr Tlektes, Suinalin Azamat

Live website: https://nurda07.github.io/Web-assignment/

This extends the existing six-page Assignment 1 site. No CSS framework or build step is required.

## Run locally

Open `pixelforge/index.html`, or run `python3 -m http.server 8000 --directory pixelforge` and visit http://localhost:8000.

## Assignment requirements

- Task 1: all six headers use Flexbox, with a linked PixelForge logo at the left and navigation at the right, `align-items: center`, wrapping and consistent gaps.
- Task 2: Home, Guides and Team have Flexbox card rows. Every card has an image, title, description and working link styled as a button. Cards stretch equally within each row; column Flexbox pushes buttons to the bottom. Hover and keyboard focus add lift and shadow.
- Task 3: every page uses named Grid areas: full-width header, left sidebar, right main, full-width footer. Below 700px the areas stack vertically.
- Task 4: Top Games includes nine distinct local images in an equal-column Grid with equal row heights, consistent gaps and caption overlays on hover or keyboard focus. Touch devices show captions by default.
- Part 3: all pages share one responsive stylesheet. Cards and gallery switch from three to two to one column. The rankings table scrolls inside its own container.
- Part 4: GitHub Actions deploys only `pixelforge/` to GitHub Pages on changes to the site.

## Page ownership from Assignment 1

- Marat Nurdaulet: Home and About.
- Kadyr Tlektes: Top Games and Guides.
- Suinalin Azamat: Team and Contact.

## Additional behavior

Guide buttons jump to practical guide sections. The contact form validates inputs and prepares a local message draft; it does not claim to send mail or require a server. A skip link, visible focus outlines and reduced-motion support improve accessibility. Existing artwork and portraits are reused from the original repository.

## Validation

All six pages were checked in a browser at desktop (1440px) and mobile (390px) widths for Grid placement and horizontal overflow. Desktop card heights match within each row. Gallery keyboard focus reveals its caption. Contact draft generation was exercised with sample input. Local links and image paths were checked separately.
