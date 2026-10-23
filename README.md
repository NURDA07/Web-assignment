# PixelForge — Assignment 5

Advanced JavaScript and DOM Manipulation. This assignment continues the PixelForge gaming website from Assignments 3 and 4, adding an interactive **Player Lab** and keyboard navigation while keeping the shared dark theme.

## Team

- **Team:** PixelForge
- **Group:** SE-2501
- **Members:** Marat Nurdaulet, Kadyr Tlektes, Suinalin Azamat

## Open the project

- **Deployed website:** https://nurda07.github.io/Web-assignment/
- **Player Lab:** https://nurda07.github.io/Web-assignment/play.html
- **Assignment report:** [reports/Assignment-5-Report.pdf](reports/Assignment-5-Report.pdf)
- **Defense preparation:** [DEFENSE.md](DEFENSE.md)

From the extracted project root, run:

```sh
python3 -m http.server 8000 --directory assignment3
```

Then open http://localhost:8000/ or http://localhost:8000/play.html. Stop the server with `Ctrl+C`. There is no build step or package installation. HTML, CSS, images, and JavaScript are in `assignment3/`.

## What to demonstrate

1. Open **Player Lab** from the site navigation.
2. Choose different game categories. The cards and result count update without a page reload.
3. Select a gallery thumbnail. The large image, alternative text, and caption change.
4. Select a star rating. Selected stars and the feedback message update immediately.
5. Press **Play victory sound**. The control is temporarily disabled while the chime plays, preventing overlapping playback.
6. Press **Launch quest**. The badge animates and the session victory counter increases. Reduced-motion settings skip the animation.
7. Complete the player profile one step at a time. Go Back to confirm values are preserved, check the review step, and submit the demo. Try Reset to clear the form and return to its first step.
8. Focus a navigation link with `Tab`, then use arrow keys to move between links. `Home` and `End` move to the first and last links; `Enter` opens the focused link.
9. On Contact, try a short password with spaces. Password length counts only non-whitespace characters: `player1 ` contains seven counted characters and is rejected. Matching confirmation still compares the complete entered passwords.

## Assignment 5 requirements

The implementation choices below cover the required topics; the PDF report includes code and webpage screenshots with step-by-step explanations.

| Requirement | Implementation |
| --- | --- |
| Select and update DOM elements | `assignment3/js/play.js` uses `getElementById` and `querySelectorAll`; `renderGames(category)` creates cards and updates result text. |
| Dynamic styling | `selectRating(value)` in `assignment3/js/play.js` directly updates `star.style.color` and changes the `is-filled` class. The existing Home background control in `assignment3/js/script.js` updates `document.body.style.backgroundColor`. |
| Manipulate attributes | The thumbnail click handler in `assignment3/js/play.js` updates `featuredImage.src`, `featuredImage.alt`, and button `aria-pressed` states. |
| Button event listeners | `assignment3/js/play.js` handles category, thumbnail, rating, sound, and quest clicks. `assignment3/js/player-profile.js` handles Next, Back, and Reset. |
| Keyboard event handling | `assignment3/js/navigation.js` listens for `keydown` in each `nav`, chooses the next link with `switch`, and moves focus. |
| Callback-based interaction | In `assignment3/js/player-profile.js`, `changeStep(nextIndex, callback)` calls `onStepChange`; `profileState` preserves the user's input. |
| `switch` statement | `renderGames(category)` in `assignment3/js/play.js` selects category labels with `switch`; the same file and `navigation.js` use `switch` for keyboard handling. |
| Objects and methods | Each game in `assignment3/js/play.js` has a `getRating()` method. `profileState.reset()` and `profileState.summary()` in `assignment3/js/player-profile.js` manage player data and review output. |
| Arrays and loops | `games` and `scenes` in `assignment3/js/play.js` store collections. A `for...of` loop appends generated cards; the profile script maps step and genre arrays into controls. |
| Higher-order functions | `changeStep` accepts a function as an argument. In `assignment3/js/player-profile.js`, `map`, `filter`, and `forEach` also receive callbacks to build controls and collect checked genres. |
| Sound effects | The `play-sound` click handler in `assignment3/js/play.js` creates a three-note Web Audio chime. The `soundPlaying` guard and disabled button prevent overlap; ended nodes are disconnected. |
| Animations | `renderGames`, gallery selection, and the `start-quest` click handler in `assignment3/js/play.js` call `Element.animate()`. They check `prefers-reduced-motion` first. |
| Separation of concerns | HTML defines structure; external CSS defines presentation; external JavaScript defines behavior. Home styles are in `assignment3/css/home.css`; the earlier layout uses `assignment3/css/media-queries.css`. |
| Theme and user experience | The Player Lab uses PixelForge's gaming theme, responsive layout, keyboard controls, and form feedback. |
| Deployment | GitHub Actions publishes `assignment3/` to GitHub Pages from `main`; see `.github/workflows/pages.yml`. |

## Project structure

```text
assignment3/             Deployable website
  index.html            Home: newsletter demo, background control, live clock
  play.html             Assignment 5 Player Lab
  contact.html          Contact and registration demos
  about.html            About page and FAQ
  games.html            Game content
  guides.html           Guides
  team.html             Team information
  part1.html            Earlier project layout
  css/                  External stylesheets, including play.css and player-profile.css
  js/play.js            Catalog, gallery, rating, sound, and quest interactions
  js/player-profile.js  Callback-driven profile form
  js/navigation.js      Shared keyboard navigation
  js/script.js          Earlier form, FAQ, newsletter, background, and clock features
  images/               Local image assets
reports/                Assignment PDF report
DEFENSE.md              Feature explanations and defense questions
.github/workflows/      GitHub Pages deployment
```

## Demo data and validation

This is a static educational project. Registration, contact, newsletter, and player profile forms demonstrate client-side validation and DOM updates. They do not create accounts, send email, post messages, or save submitted personal data. Profile values remain in the current page while moving between steps and disappear on reset or reload.

Registration requires at least eight non-whitespace password characters. Spaces, tabs, and other whitespace do not increase the length count. Email inputs are checked before a demo succeeds. No real password or personal information is needed to demonstrate the assignment.

## Verification

Browser checks passed for all four catalog categories, gallery attributes, rating clicks and arrow keys, navigation ArrowRight and End, profile validation/Back/review/reset, and the sound/quest busy and completion states. Player Lab had no JavaScript console errors, and no horizontal overflow at the observed 1280px and 636px viewport widths.

- `node --check` passed for all four JavaScript files in `assignment3/js/`.
- All 161 local `href`/`src` references and 17 fragment targets across the eight HTML pages resolved, including exact filename casing for GitHub Pages.
- All eight HTML pages were checked for duplicate IDs; none were found.
- All eight HTML pages were checked for inline styles, event-handler attributes, style blocks, and inline scripts; none were found.

## Submission and defense

Submit the project ZIP and `reports/Assignment-5-Report.pdf` as required by the course. The report is also included in the project folder. Every team member must submit and defend the assignment; confirm the deadline in LMS. Review [DEFENSE.md](DEFENSE.md), run the project, and be ready to explain the source and modify a feature during the lesson.
