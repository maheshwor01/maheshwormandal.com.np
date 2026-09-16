# Maheshwor Mandal — Portfolio

Single-page portfolio of **Maheshwor Mandal**, a BSc IT student and aspiring AI/ML engineer. Built with React and Vite, styled with a custom CSS design system, and deployed on Cloudflare Pages.

## Features

- **Hero** — intro, resume download, and quick links to GitHub
- **About** — background, education, and focus areas
- **Skills** — categorized skill list with tabbed navigation
- **Projects** — showcased project work
- **Achievements** — certificates and achievements
- **Contact** — form that emails submissions straight to the inbox via Resend
- **Scroll spy navigation** — the navbar highlights the section currently in view
- **Fully local certificate storage** — certificates are stored inline in IndexedDB, so uploading, viewing, and deleting all work offline and persist across sessions

## Tech Stack

| Area | Tech |
| --- | --- |
| Framework | [React 19](https://react.dev) |
| Build tool | [Vite](https://vite.dev) |
| Linting | [oxlint](https://oxc.rs/docs/guide/usage/linter.html) |
| Email | [Resend](https://resend.com) |
| Serverless function | Cloudflare Pages Functions |
| Client storage | IndexedDB |

## Getting Started

Requirements: [Node.js](https://nodejs.org) (18+).

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview

# Lint the codebase
npm run lint
```

## Project Structure

```
portfolio/
├─ api/                      # Transport-agnostic email logic
│  └─ _sendContactEmail.js   # Validation + Resend send (shared)
├─ functions/
│  └─ api/
│     └─ contact.js          # Cloudflare Pages Function → POST /api/contact
├─ public/
│  ├─ favicon.svg
│  ├─ icons.svg
│  └─ resume.pdf
├─ src/
│  ├─ components/            # Hero, About, Skills, Projects, Achievements, Contact, ...
│  ├─ data/                  # initialAchievements.js (seed data)
│  ├─ db/                    # localAchievementsDb.js (IndexedDB layer)
│  ├─ hooks/                 # useScrollSpy.js
│  ├─ services/              # achievementService.js (CRUD over IndexedDB)
│  ├─ styles/                # portfolio.css
│  ├─ App.jsx
│  └─ main.jsx
├─ .env.example
├─ index.html
├─ package.json
└─ vite.config.js
```

## Contact Form Setup

The contact form posts to `POST /api/contact`, which is handled by a Cloudflare Pages Function (`functions/api/contact.js`) running on Cloudflare's edge — the Resend API key is never exposed in the browser.

1. Create a free account at [resend.com](https://resend.com) and generate an API key.
2. For local testing, copy `.env.example` to `.env` and set `RESEND_API_KEY`:

   ```bash
   cp .env.example .env
   ```

3. In production, add `RESEND_API_KEY` under Cloudflare Pages → **Settings → Environment Variables** (never commit a `.env` file).

Emails are sent from `onboarding@resend.dev`, which works out of the box. If you connect your own domain in Resend, update the `from` address in `api/_sendContactEmail.js`.

## Deployment

### Cloudflare Pages

1. Push this repo to GitHub and connect it in the Cloudflare dashboard (Workers & Pages → Create → Pages → Connect to Git).
2. Build command: `npm run build`
3. Build output directory: `dist`
4. The function under `functions/api/contact.js` is deployed automatically as a Pages Function.
5. Add `RESEND_API_KEY` in **Settings → Environment Variables**.

### Local Dev Server + Functions

To run the Pages Function locally alongside Vite, use [Wrangler](https://developers.cloudflare.com/workers/wrangler/):

```bash
npx wrangler pages dev dist --port 8788
cd dist
npx wrangler pages dev --port 3000
```

> Note: `vite preview` serves the static build only — the `/api/contact` route is not included, so the contact form will show an error there. Use Wrangler or deploy to Cloudflare to test email end-to-end.

## License

Private portfolio project — all rights reserved.