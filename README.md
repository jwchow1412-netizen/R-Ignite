# MASA Hackathon 2026: R-Ignite — Website

Next.js 14 App Router + TypeScript + Tailwind CSS. Built for Vercel deployment with no database or CMS dependencies. Content follows the provided proposal; any missing items are marked “Coming Soon”.

## Local development

1) Install dependencies
```bash
npm install
```
2) Run the dev server
```bash
npm run dev
```
Visit http://localhost:3000 to view the site. Edit files under `app/` and `components/`; changes hot-reload.

## Project structure
- `app/` — App Router pages (Home, About, Track, Timeline, Resources, People subpages, FAQ, Register) and layout.
- `components/` — Navbar, Footer, Timeline, PersonCard, ResourceDownloadCard, and supporting UI pieces.
- `lib/data.ts` — Structured content for timelines, schedules, and bullet lists.
- `public/downloads/` — Placeholder PDFs (`handbook.pdf`, `problem-statement.pdf`, `rubric.pdf`, `terms-and-conditions.pdf`). Replace files here to update downloads without changing URLs.
- `public/team/` — Placeholder image (`placeholder.svg`) for team profiles. Add real photos with matching filenames and update components if needed.
- `app/globals.css` — Theme styles (dark maroon gradient) and shared utility classes.

## Updating content
- Replace placeholder PDFs in `public/downloads/` with final documents (keep filenames stable for live links).
- Swap profile photos by adding images to `public/team/` and updating `PersonCard` props if you introduce unique filenames.
- People pages (Judges, Mentors, Speakers, Organising Team) and Register CTA are marked Coming Soon until details are provided.
- Focus track currently displays “Cybersecurity Risk (subject to change)” per the proposal.

## Useful scripts
- `npm run dev` — start local dev server.
- `npm run lint` — run Next.js lint checks.
- `npm run build` — production build.
- `npm start` — run the production build locally.

## Deploying to Vercel
1) Push this repo to your Git provider (GitHub/GitLab/Bitbucket).
2) In Vercel, **Import Project** and select the repo.
3) Framework preset: **Next.js**. No env vars or database required.
4) Deploy. Vercel will build using `npm run build`.
5) (Optional) Enable automatic deployments from your main branch for updates.

## Custom domains on Vercel
1) In the Vercel project, go to **Settings → Domains**.
2) Add your domain (e.g., `ignite.masassociation.org`).
3) Follow the DNS instructions shown (CNAME or A/AAAA records).
4) Wait for propagation; Vercel will provision SSL automatically.
