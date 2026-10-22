# Editor Portfolio — Next.js + TypeScript

A responsive, monochrome portfolio starter for a video editor. Includes animated hero, selected-work cards, approach/manifesto section, services and contact footer.

## Requirements
- Node.js 20.9 or newer
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## First edits
1. Change `EDITOR` in `src/app/page.tsx` to your name/brand.
2. Replace `hello@example.com` in `src/app/page.tsx` with your contact email.
3. Update the placeholder projects in `src/lib/projects.ts`.
4. The current art cards are CSS-based visual placeholders. Real video thumbnails and playback will be added when we connect your media storage.

## Next build stage
- Supabase Auth for administrator login
- Supabase database for project metadata
- Cloudinary (or another video platform) for media storage/transcoding
- Protected admin routes and server-side authorization
- Direct upload flow with progress, validation, and safe deletion

Do not place service-role keys or media API secrets in client-side code. Add real secrets to `.env.local` only and keep that file out of Git.
