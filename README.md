# AD&D365 Configuration Training Academy

An interactive, gamified training guide for the **Advanced Dungeons & Dynamics 365** labs. It is a plain static website (HTML, CSS and JavaScript) with no build step, no dependencies and no server, so it can be hosted anywhere that serves static files.

## Modules

| # | Module | Status |
| --- | --- | --- |
| 1 | Faerûn Address Localizations (6 labs, 2,120 XP) | Available |
| 2 to 8 | Currency, Units of Measure, Languages, Ethnic Groups, Calendar, Communication Methods, Salutations | Planned |

Module 1 is sourced from `ADNDDOCS/docs_parts/guide-01.5-configuring-localizations/module-01-faerun-address-localizations`.

## What learners get

Each lab has six sections: **Briefing**, **Reference** data, **Walkthrough** (tickable steps, click-to-copy values, "Copy for Excel" tables), **Practice** (simulated Dynamics 365 forms, drills and builders), **Knowledge Check** (shuffled quizzes with explanations) and **Wrap-Up & XP** (claim the lab's XP once everything is done). Finishing all labs and the final check unlocks a printable certificate. Progress is stored only in the learner's browser (`localStorage`).

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```powershell
python -m http.server 8080
# then browse to http://localhost:8080
```

## Host publicly

Upload the folder contents as-is to any static host. Routing uses URL hashes (`#/module-01/lab-01/quiz`), so no rewrite rules are needed.

- **GitHub Pages**: push this folder to a repo and enable Pages. The included `.github/workflows/pages.yml` deploys on every push to `main`.
- **Azure Static Web Apps / Netlify / Cloudflare Pages / S3 + CDN**: set the app location to the repo root with no build command and no output folder.

## Project layout

```
index.html                  App shell
assets/css/styles.css       Theme (dark/light), layout, print styles
assets/js/registry.js       Module registry and "coming soon" list
assets/js/core.js           DOM helpers, safe rich text, storage, tables
assets/js/widgets.js        Practice simulators and quiz engine
assets/js/app.js            Router, views, progress and XP
assets/img/                 Logo, hero art, favicon
data/modules/module-01.js   All content for Module 1
```

## Add or edit content

Content lives in `data/modules/module-NN.js` as a single object. Strings support `**bold**` and `` `code` `` (code spans become click-to-copy). Anything else is treated as plain text, so content cannot inject HTML.

To add a module:

1. Copy `data/modules/module-01.js` to `module-02.js`, change the `id`, `number` and content.
2. Add `<script src="data/modules/module-02.js"></script>` to `index.html` before `app.js`.
3. Remove that module from the `upcoming` list in `assets/js/registry.js`.

Practice exercise types: `form`, `components`, `drill`, `pick` and `compose` (see `widgets.js`). Each lab needs a `quiz` array of `{ q, options, answer, why }`, where `answer` is the index of the correct option (options are shuffled at display time).

## Notes on the source material

- Lab 6 (Postal Codes) has no click-by-click task in the source, so its two walkthrough tasks were drafted for this edition and are flagged with a "Web edition steps" badge. Confirm field names against your Dynamics 365 version.
- The published XP values and criteria text are copied from the source labs as written.
