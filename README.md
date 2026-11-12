# no5tyle.github.io

The homepage at https://no5tyle.github.io/, linking to:

- [Beacon](https://no5tyle.github.io/Beacon/) ([source](https://github.com/no5tyle/Beacon))
- [Program Builder](https://no5tyle.github.io/programmer/) ([source](https://github.com/no5tyle/programmer))

It's one static page (`index.html`) in the same style as the apps: Apple's system colours and font, rounded cards and capsule buttons, and dark mode that follows the device.

## The shared stylesheet

`shared/no5tyle.css` holds the look every app shares: colours (light and dark), rounding, the see-through bar, Liquid Glass and the font, as CSS variables. Beacon, the Program Builder, Snag Calc and this page all link it before their own stylesheet:

```html
<link rel="stylesheet" href="https://no5tyle.github.io/shared/no5tyle.css">
```

Each app's own stylesheet keeps only what's particular to it. A change here reaches every app the next time it's opened, without redeploying them, so:

- add a new variable rather than changing what an existing one means;
- check the apps after a change (each one's tests load this file from the live site).

Every push to `main` is published to GitHub Pages by `.github/workflows/pages.yml`.
