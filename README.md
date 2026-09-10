# Dossios

Marketing site for Dossios, an immigration law/case-management brand.
Includes the homepage, About, and Contact pages built on a shared design
system (colors, type, components).

## Stack

- [Next.js](https://nextjs.org) (App Router)
- React
- TypeScript
- Tailwind CSS v4
- [Framer Motion](https://www.framer.com/motion/) (button hover/tap, scroll reveals)
- ESLint

## Getting Started

Install dependencies, then run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint

## Pages

- `/` — homepage (hero, case-status preview)
- `/about` — story, values, CTA
- `/contact` — contact form + contact info
- `/attorneys` — attorney panel roster, "how we work", FAQ
- `/families` — family-based immigration: why-us, coverage, process, FAQ
- `/employers` — employer-sponsored immigration: why-us, coverage, process, FAQ

`WhySection`, `CoverageSection`, `ProcessSection`, and `FaqSection` are all
shared across `/`, `/families`, and `/employers` via optional props (content
defaults to the homepage's copy, so `<WhySection />` etc. with no props is
unchanged) — only `*Hero` components are page-specific.

## Design system

- **Fonts**: Plus Jakarta Sans, a single sans-serif family for both headings
  and body text (loaded via `next/font/google` in `app/layout.tsx`). Chosen
  as the closest Google Fonts match to the reference site's "Gellix" font.
- **Colors**: modeled on tryalma.com's live palette — `cream` (#fff7ee, page
  background), `lime` (#e0f0bc, hero/feature section backgrounds), `ink`
  (#000000, primary text — high contrast by design), `sage` (#2f5b50,
  secondary accent text/links), `teal` (#207460, primary buttons and
  "complete" badges), `white` (#ffffff, elevated card surfaces), and
  `peach`/`peach-ink` (#fbe5c2 / #8c5a18, "in progress" badges). Defined as
  CSS variables in `app/globals.css` and exposed as Tailwind utilities
  (`bg-teal`, `text-ink`, etc.) via `@theme inline`.
- **Components**: `components/ui/Button.tsx` (primary/inverse/ghost
  variants), `components/ui/icons.tsx` (inline SVG icon set),
  `components/sections/*` (Hero, StatsBar, WhySection, AudienceSection,
  CoverageSection, ProcessSection, PlatformSection, FaqSection, PageHero,
  CTASection, ContactForm).
- **Motion**: `components/motion/Reveal.tsx` exports `Reveal` (single-block
  scroll-triggered fade/slide-in) and `RevealGroup`/`RevealItem` (staggered
  list/grid entrances). `Button` and the mobile nav use Framer Motion
  directly for hover/tap scale and open/close transitions.

## Project Structure

```text
app/            Routes: / (home), /about, /contact, layout, robots, sitemap
components/
  ui/           Low-level, reusable UI primitives (Button, icons)
  layout/       Header, Footer, MobileNav
  sections/     Page sections (Hero, PageHero, CTASection, ContactForm)
lib/            Shared logic (API clients, integrations, server-side helpers)
hooks/          Reusable client-side React hooks
types/          Shared TypeScript types
utils/          Small, pure helper functions
config/         Site-wide configuration, nav, brand copy (config/site.ts)
data/           Static content used by pages (data/about.ts)
styles/         Additional stylesheets beyond app/globals.css
public/
  images/       Image assets
  icons/        Icon assets
```

`lib/`, `hooks/`, `types/`, `utils/`, and `styles/` are still empty
placeholders reserved for future features.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values as needed:

```bash
cp .env.example .env.local
```

## Notes

- Path alias `@/*` resolves to the project root (see `tsconfig.json`).
- Site-wide metadata defaults live in `config/site.ts` and are consumed by
  `app/layout.tsx`, `app/robots.ts`, and `app/sitemap.ts`.
- The contact form is UI-only for now (no backend/email wiring) — it shows a
  local success state on submit.
