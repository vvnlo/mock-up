# Mockup tool + work page

This repo holds two pages:

- `/` is the screenshot mockup tool.
- `/work/` is the portfolio work page (the "See my work" page linked from vvnlo.com).
- `/work-b/` is version B of the same page, styled after vvnlo.com. It shares `src/work/content.js`.

Run `npm install`, then `npm run dev` and open http://localhost:5173/work/.

## Editing the work page

All copy, gallery frames and case study links live in `src/work/content.js`.
Put images and videos in `public/work/<company>/` and set each frame's `src`
(for example `'/work/shopify/search.mp4'`). Use muted `.mp4`/`.webm` loops instead of `.gif`.
Frames without a `src` show a grey placeholder.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
