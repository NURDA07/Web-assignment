# PixelForge - Assignment 3 (Media Queries & Bootstrap)

**Team:** PixelForge  
**Group:** SE-2501  
**Members:** Marat Nurdaulet, Kadyr Tlektes, Suinalin Azamat

Live website: https://dazzling-paprenjak-589e9f.netlify.app/

This repository contains our submission for Assignment #3, demonstrating Responsive Design using both CSS Media Queries and the Bootstrap Grid/Components.

## Run locally

Open `assignment3/index.html`, or run `python3 -m http.server 8000 --directory assignment3` and visit http://localhost:8000.

## Assignment requirements fulfilled

### Part 1: Custom Media Queries
- **Task 1 & 2:** Displayed in `part1.html`. We created a fully custom responsive topology layout matching responsive text typographies alongside scaling Bootstrap-free grid cards natively handling Desktop (3 cols), Tablet (2 cols), and Mobile (Vertical stacking) states exclusively using custom `%` dimensions and Flex-wrap behaviors based on purely authored CSS logic.

### Part 2: Bootstrap Implemented Code Architecture
All remaining constraints handled effortlessly across pages:
- **Task 3 (Grid):** Executed responsive Bootstrap classings like `col-lg-6` and `col-lg-4` inside natively formatted Row wraps in `index.html`.
- **Task 4 (Spacing utils):** Abolished all previously written styles replacing entirely with responsive sizing utility interactions (`mt-lg-4`, `p-auto`) natively.
- **Task 5 (Navs):** Integrated standard Bootstrap Navbars containing brand icons and 4 links alongside responsive scaling Hamburger togglers.
- **Task 6 (Buttons):** Modernized components injecting interactions for grouping logic, border aesthetics (`btn-group`, `btn-primary`, `btn-outline-secondary`).
- **Task 7 (Carousel):** Produced dynamic cycling gallery of exactly 9 project images controlled completely by Bootstrap sliding navigation and slide bullets.
- **Task 8 (Cards):** Utilized modern standard flexible Cards aligned elegantly displaying descriptive text headers inside.
- **Task 9 (Form):** Engineered modern web logic via Bootstrap Semantic forms parsing `form-controls`, `form-check`, selects, embedded radio toggles entirely handling `contact.html`.
- **Task 10 (Accessibility):** Ensured HTML logic utilizes highly accessible, rich-contrast properties natively baked via frameworks (`<main>`, `<nav>`, `<footer>`).

No comments (`<!-- -->`/`/* */`) remained within the web logic. Team memberships appear globally inside `<footer>` elements universally.
