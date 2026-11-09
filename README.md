# Leo Wendy Huts

A responsive React and TypeScript landing page, built with Vite, Tailwind CSS v4, Framer Motion and Lucide icons.

## Run

```sh
npm install
npm run dev
```

## Verify

```sh
npm run build
npx tsc --noEmit
npx playwright install --with-deps chromium
npx playwright test
```

The browser tests cover responsive navigation, structure details, quote validation, package configuration, keyboard interactions, contact destinations and automated WCAG AA checks. Screenshots are written to `artifacts/`.

## Content

- The page entry point is `src/App.tsx`.
- Business details, product descriptions, guide prices and FAQs are in `src/data.ts`.
- Design tokens and responsive styling are in `src/index.css`.
- Quote and product dialogs are in `src/components/Dialogs.tsx`.
- Concept floor plans are in `src/components/FloorPlan.tsx`.
- Images and the Inter font live in `src/assets/` and are embedded into the single built `dist/index.html`, so the page needs no separate asset files.

## Quote Requests

The quote form validates visitor details and opens an encoded, prefilled message to Leo's WhatsApp number. The visitor reviews and sends the message in WhatsApp. An email handoff is also available. The website does not store submissions or automatically send messages, and does not require API credentials or a backend.

Prices are indicative and subject to a confirmed quote. Generated imagery and floor plans are clearly presented as design inspiration, not photographs of completed business projects or final architectural drawings.

## Deployment

Deploy `dist/index.html` after building. Images, the font and the favicon are embedded in that one file. Add an absolute `og:image` URL to `index.html` once the final hosting domain is known, since social previews need a public image address.