# PixelForge - Assignment 5 extended submission

Team: PixelForge | Group: SE-2501
Members: Marat Nurdaulet; Kadyr Tlektes; Suinalin Azamat

## Start

From this folder run:

```sh
python3 -m http.server 8000 --directory assignment3
```

Open http://localhost:8000/play.html. No install or build required. Use HTTP for JSON fetch exercises.

## Extended features

- Bottom-right Day/Night theme control on every page; choice persists on reload.
- All original required Player Lab exercises retained.
- Extra lab at the bottom of play.html: Read More, player greeting, time-based switch greeting, current-time button, fetched random fact, progressively loaded news, news categories, EN/RU/KZ selector, async demo contact POST and reset.
- The language selector translates the extra lab; original content remains English.
- JSONPlaceholder accepts a demonstration POST. Use invented data. No email is delivered and no message is permanently saved.
- data/facts.json and data/posts.json are served by the local server or static hosting.

## Submission

The updated 18-page PDF is in reports/Assignment-5-Report.pdf and also supplied separately. Pages 13-18 supersede earlier dark-only, four-script and no-network statements in the original report and notes.

## Deployment

Published on 29 October 2026 from commit 94164d7 on main.

- Website: https://nurda07.github.io/Web-assignment/
- Player Lab: https://nurda07.github.io/Web-assignment/play.html
- Repository: https://github.com/NURDA07/Web-assignment
- Successful Pages run: https://github.com/NURDA07/Web-assignment/actions/runs/40871795670

The published HTML was fetched and contains the new theme and extra-lab scripts. The included workflow publishes assignment3/.

## Verification

Automated Chrome checks: theme switching and persistence, catalog, rating and arrow key, gallery, profile completion/reset, quest, Read More, greeting, time, fact fetch, 2/4 news loading, technology filter, live POST success (ID 101), Russian/Kazakh selection. No page JS errors; no horizontal overflow at 390px. Audio entered its playing state; audible output/completion need a normal-browser check. Report includes original screenshots and new captures/code excerpts.

