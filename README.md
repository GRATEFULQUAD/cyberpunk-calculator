# Neon Calc — Cyberpunk Calculator

A complete, production-ready, mobile-first cyberpunk calculator PWA. No login, no accounts, no paid backend — everything runs locally in your browser.

## Included tools

- **Standard Calculator** — full expression evaluation, chained calculations, percent handling
- **Scientific Calculator** — trig (+ inverse), log/ln, powers/roots, factorial, memory (MC/MR/M+/M-), degrees/radians
- **Tip Calculator** — quick + custom tip %, per-person splits
- **Split Expense** — equal / percentage / custom dollar splits, named people, remaining-unassigned warnings
- **Discount · Tax · Percent** — discount, tax, "X% of Y", percent change, increase/decrease
- **Unit Price Comparison** — compare up to 5 products, auto-highlights best value, unit-compatibility checks
- **Converter** — length, weight, temperature, volume, speed, area, plus **live currency conversion** (free, no API key, via a small serverless proxy route with local caching + offline fallback labeling)
- **Loan / Mortgage Calculator** — amortization schedule grouped by year, expandable detail rows
- **BMI & Health** — BMI gauge, healthy weight range, Mifflin-St Jeor calorie estimate (informational only, not medical advice)
- **Settings** — 12 full themes, particle density, reduce-motion, remember-last-screen, decimal precision, reset

## Visual identity

Pitch-black background with a canvas-rendered field of ~2,300 neon particles (dots, glowing blobs, streaks, rings) that **randomizes on every load** while the UI layout stays fixed. Every control is a frosted-glass "island" with its own neon border color. 12 complete themes re-skin the entire app (not just one accent color).

## Privacy

No accounts, no server-side storage, no analytics. All settings and calculator inputs stay on your device (`localStorage`). The **only** network request the app ever makes is fetching public currency exchange rates when you use the Currency tab — everything else works fully offline once loaded (installable as a PWA).

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploying to Vercel

This is a zero-config Next.js 15 app. Import this repo directly into Vercel — no environment variables required.

## Tech stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, hand-written safe expression parser (no `eval`), Canvas 2D for the particle field, a tiny serverless API route for currency rates (proxying the free Frankfurter/ECB exchange rate API — no API key needed).
