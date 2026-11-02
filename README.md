# PixelForge - Assignment 6: jQuery

Team: PixelForge | Group: SE-2501
Members: Marat Nurdaulet; Kadyr Tlektes; Suinalin Azamat

Website: https://nurda07.github.io/Web-assignment/games.html
Repository: https://github.com/NURDA07/Web-assignment

## Run

```sh
python3 -m http.server 8000 --directory assignment3
```

Open http://localhost:8000/games.html. jQuery 4.0.0 loads from the required CDN.

## Required tasks

0. CDN in the head, external script.js, document.ready and console message.
1. Real-time ranking search.
2. Clickable autocomplete suggestions.
3. Matching text highlights.
4. Gradient scroll progress bar.
5. Animated community counters.
6. Disabled submit button, spinner and simulated delay.
7. Temporary fading notifications.
8. Clipboard button, checkmark and confirmation tooltip.
9. jQuery viewport image lazy loading.

Implementation: assignment3/games.html, assignment3/script.js, assignment3/css/jquery.css.
The previous project pages and exercises remain available. The form simulates submission.

## Report and deployment

Report: reports/Assignment-6-Report.pdf.
The existing GitHub Pages workflow deploys assignment3/ on main changes.
Implementation commit: 5e20aa6.
Verified Pages run: https://github.com/NURDA07/Web-assignment/actions/runs/41486820433.

Chrome checks cover tasks 0-9, clipboard contents, invalid search input, empty results,
restored controls, loaded images, no page errors and no overflow at 390px.
Local browser QA used the identical CDN jQuery file downloaded for the test.
