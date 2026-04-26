# fog-frontend

Fog segmentation thesis frontend for presentation, experiment review, and lightweight demo deployment.

## Deploy to Vercel

1. Import this repository into Vercel.
2. Framework preset: `Next.js`
3. Build command: `npm run build`
4. Output: default

This repository already includes a lightweight `retrieved_artifacts/` bundle, so the homepage, experiments page, and visual samples can render without the original training workspace.

## Local run

```bash
npm install
npm run dev
```

## Notes

- The dashboard is designed to work in display-first mode.
- The demo page can still be extended later with a local inference backend.
- For low-spec laptops, use the built-in presentation mode first.
