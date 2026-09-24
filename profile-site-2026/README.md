# vvnlo.com

Personal site for Vivian Lo: a short bio beside an illustrated portrait that runs a grid of
print-style WebGL filters (duotone, halftone, dither, mosaic, ASCII…). Hovering the portrait clears
the filters. Includes a cobalt (default) and parchment light theme.

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # static site in dist/
```

Deployed on Vercel from `main` (framework preset: Vite, output: `dist`).

## Where things live

- `index.html`: copy, links and meta tags
- `src/style.css`: layout, links, themes
- `src/portrait-fx.js`, `src/shaders.js`: the portrait effect grid (WebGL)
- `src/palette.js`: effect colours
- `public/`: illustrations (`vivian.png` dark, `vivian-light.png` light), company logos, favicon, `og.png` social preview
