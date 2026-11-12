# no5tyle.github.io

The homepage at https://no5tyle.github.io/, linking to:

- [Beacon](https://no5tyle.github.io/Beacon/) ([source](https://github.com/no5tyle/Beacon))
- [Program Builder](https://no5tyle.github.io/programmer/) ([source](https://github.com/no5tyle/programmer))
- [Snag Calc](https://no5tyle.github.io/snagCalc/) ([source](https://github.com/no5tyle/snagCalc)), in progress
- [Pinewood Control](https://pinewood.nostyle.app/) ([source](https://github.com/no5tyle/pinewood-control)), hosted on its own server

It's one static page (`index.html`) in the same style as the apps: Apple's system colours and font, rounded cards and capsule buttons, and dark mode that follows the device.

## The shared stylesheet

`shared/no5tyle.css` holds the look every app shares: colours (light and dark), rounding, the see-through bar, Liquid Glass and the font, as CSS variables. Beacon, the Program Builder, Snag Calc and this page all link it before their own stylesheet:

```html
<link rel="stylesheet" href="https://no5tyle.github.io/shared/no5tyle.css">
```

Each app's own stylesheet keeps only what's particular to it. The bar across the top uses the `--n5-bar-*` sizes on every app: 60px tall with a 36px switcher on a computer, 52px with a 32px switcher on a phone. A change here reaches every app the next time it's opened, without redeploying them, so:

- add a new variable rather than changing what an existing one means;
- check the apps after a change (each one's tests load this file from the live site).

## The app switcher

`shared/app-switcher.js` defines `<n5-app-switcher current="…">`, the menu at the top left of every app for moving between them. Each app puts it where its icon was, with that icon inside as a stand-in until the script runs:

```html
<script src="https://no5tyle.github.io/shared/app-switcher.js" defer></script>
<n5-app-switcher current="programmer"><img src="…" alt="" width="36" height="36"></n5-app-switcher>
```

The list of apps lives in that file, and the icons are in `shared/icons/`. To add an app, add it there: every app's switcher shows it the next time it's opened. Its styles are the `n5-switch` rules in `shared/no5tyle.css`.

Every push to `main` is published to GitHub Pages by `.github/workflows/pages.yml`.
