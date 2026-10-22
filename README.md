# Muhammed Mustafa — Video Editor Portfolio

A responsive black-and-white Next.js portfolio with a video-category filter.

## Run locally
Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Current state
- Functional category dropdown for Reels & Shorts, YouTube Videos, Podcasts, Commercial Ads, Cinematic Edits, and Motion Design.
- Responsive monochrome layout with Space Grotesk headings and DM Sans body text.
- Project cards are explicitly demo layouts, not real client work. Replace them with real video URLs, thumbnails, titles and descriptions before sharing as a finished portfolio.
- Contact details are intentionally not fabricated; add a real email or social link in `src/app/page.tsx`.

## Deploy
Push the project files to GitHub and import the repository into Vercel. The project uses the Next.js framework preset.

## Planned next stage
Supabase Auth, a protected admin dashboard, project database, and media upload/storage. These features are not implemented in this starter yet.

## Environment variables
Configure these in Vercel Project Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`: the Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: the Supabase publishable/anon key.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp number in international format using digits only (for example, Egypt numbers begin with `20`; do not include `+`, spaces, or dashes).

## Project assets
The admin dashboard supports image covers and project assets up to 100 MB per file. Supported uploads: JPEG, PNG, WebP, AVIF, MP4, WebM, MOV, MKV, PDF, ZIP, and TXT. Uploaded assets are stored in the public `portfolio-assets` bucket; only upload files intended to be public. Supabase plan quotas and storage bandwidth limits still apply.
