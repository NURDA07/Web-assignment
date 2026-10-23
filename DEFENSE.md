# PixelForge — Assignment 5 Defense Notes

**Team:** PixelForge · **Group:** SE-2501  
**Members:** Marat Nurdaulet, Kadyr Tlektes, Suinalin Azamat

These notes explain the implementation for practice. They do not assign individual contributions. Every member should understand the code, submit the required files, and defend the work themselves.

## Short presentation

“We continued our PixelForge gaming website and added a Player Lab. Users can filter games, select gallery images, rate the experience, play an interface sound, and create a temporary player profile using a multi-step form. The features demonstrate DOM manipulation, callbacks, objects, arrays, event handling, sound, and animation. The project uses HTML, external CSS, and vanilla JavaScript and is deployed with GitHub Pages.”

## Demonstration order

1. Open `/play.html` and filter the game catalog.
2. Select another gallery thumbnail and inspect the large image.
3. Set a star rating and show the new feedback.
4. Play a sound and show that the button is disabled until playback ends.
5. Launch a quest to show event-triggered animation and the victory counter.
6. Use Next and Back in the profile form. Show that values survive moving between steps, then submit the review step and reset.
7. Use arrow keys, Home, and End within the site navigation.
8. Open Contact and explain the password rule using `player1 ` as an invalid seven-character example.

## Key ideas to explain

| Topic | Explanation |
| --- | --- |
| DOM selection | `querySelector` selects one matching element; `querySelectorAll` selects a collection. Event handlers update the selected elements. |
| Text and attributes | `textContent` writes plain text. The gallery changes `src` to show another image and `alt` to describe it. |
| Classes and styles | CSS contains appearance rules. `selectRating(value)` directly changes `star.style.color` and toggles `is-filled` after the user chooses a rating. |
| Event listener | `addEventListener` connects a click, change, submit, or keydown event to a function. |
| Callback | `changeStep(nextIndex, callback)` updates the current step, then calls the supplied `onStepChange` function to render the panel. See `assignment3/js/player-profile.js`. |
| State | Current category, rating, gallery selection, and profile step are values used to render the current interface. Form inputs keep their values when their step is hidden. |
| `switch` | `renderGames(category)` chooses a category label, with a default branch for the full catalog. The keyboard handlers also use `switch` to choose the next focused item. |
| Objects | Game objects provide `getRating()` methods. `profileState` stores current profile values and provides `reset()` and `summary()` methods. |
| Arrays and loops | Arrays store collections. Loops and array callbacks create or update cards, controls, and steps. |
| Higher-order function | A function that accepts another function. `changeStep` accepts a rendering callback; `filter` calls a predicate for each item and returns matching items. |
| Web Audio | A user action starts a generated three-note sound. A playback guard and disabled button prevent another sound from starting until playback finishes. |
| Animation | Click handlers call `Element.animate()` to animate cards, gallery changes, and a quest. Reduced-motion settings skip the motion while preserving the result. |
| Static deployment | GitHub Pages serves project files. It does not provide an account database or mail server. |

## Likely questions

**Why use `preventDefault()` on the forms?**  
The browser's normal submission would navigate away or reload. The demo validates inputs and displays feedback on the same page.

**How is Next different from Back?**  
`validateCurrentStep()` checks the current step before Next advances. Back calls `changeStep` with the previous index. `profileState` keeps the values, and hiding a panel does not clear its inputs.

**What does Reset do?**  
The Reset listener calls `form.reset()` and `profileState.reset()`, clears validation feedback and completion, then uses `changeStep(0, onStepChange)` to display the initial step.

**Why use `textContent` for user-entered text?**  
It displays text without treating the input as HTML.

**How do you keep sounds from overlapping?**  
The `soundPlaying` flag rejects a second request, and the button stays disabled until all three oscillator nodes end. The nodes are then disconnected, the flag is cleared, and the button is enabled. Playback begins after a user interaction because browsers restrict automatic audio.

**Why does `player1 ` fail the password length check?**  
The length check removes whitespace with `replace(/\s/g, "")` before counting. Seven non-whitespace characters remain. The confirmation compares the full strings so the two entries must match exactly.

**Is the player profile saved?**  
No. It is a temporary demonstration in the current page. Reloading or resetting clears it. The form does not send data to a service.

**How is the site deployed?**  
The workflow in `.github/workflows/pages.yml` publishes `assignment3/` after changes are pushed to `main`. The published URL is https://nurda07.github.io/Web-assignment/.

**What implementation challenges can you discuss?**  
Use examples you can demonstrate: validating only the active form step, preserving inputs when moving back, preventing overlapping sound playback, keeping keyboard focus predictable, or separating legacy inline styles into external files. Describe the actual code and your own understanding; do not claim work or tests you did not perform.

## Before the lesson

Read the HTML, CSS, and JavaScript for each feature. Practice changing a category label, adding a game object, adjusting the number of required characters, and explaining a callback. Check the deployed URL and open the report. Confirm the LMS deadline and each member's submission.
