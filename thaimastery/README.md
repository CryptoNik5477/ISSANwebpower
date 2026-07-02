# ThaiMastery 🇹🇭

**A premium language-learning platform that teaches foreigners to speak, read and write Thai in less than 60 days — with 15–20 minutes of practice a day.**

Built as a production-ready SaaS: marketing site, gamified student dashboard, two complete progressive courses with exam-gated levels, Stripe billing, AI-assisted practice, printable PDF certificates and a full admin panel — all trilingual (English / Français / Deutsch).

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React 19, TypeScript, RSC + Server Actions) |
| Styling | Tailwind CSS v4 — custom glassmorphism design system |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth (credentials + optional Google OAuth), JWT sessions, role-based access |
| Payments | Stripe Checkout (monthly / yearly / lifetime, promo codes, webhooks) |
| i18n | next-intl — localized routing `/en` `/fr` `/de`, fully translated UI **and** course content |
| AI | Claude API (`@anthropic-ai/sdk`) — conversation simulator, writing correction, pronunciation feedback (graceful heuristic fallback without a key) |
| Email | Resend HTTP API (welcome, reminders, level-complete, certificates, receipts, password reset, abandoned cart) — console fallback in dev |
| PDF | pdf-lib — official printable certificates |
| Testing | Vitest unit tests (gamification, quiz generation, content integrity) |
| Deploy | Docker + docker-compose, or Vercel/Netlify |

## Feature map

- **Landing page** — hero, features, "why the method works" (spaced repetition / active recall / habit loops), learning roadmap, testimonials, FAQ, pricing; JSON-LD structured data, Open Graph, sitemap, robots.txt, PWA manifest.
- **Course 1 · Master Spoken Thai** — 9 levels (greetings → fluency), each with daily lesson, vocabulary flashcards, speaking practice with pronunciation scoring, listening, quiz, review, and a **level exam (pass ≥ 80 % to unlock the next level)**.
- **Course 2 · Master Thai Reading & Writing** — 10 levels (consonant classes → vowels → tone marks → syllables → words → sentences → short stories) with an **interactive character-tracing canvas**, recognition quizzes and exams.
- **Daily learning system** — the dashboard auto-builds a ~20-minute daily plan mixing both courses.
- **Gamification** — XP, coins, levels, daily/longest streaks, 11 achievements, activity calendar, leaderboard, level-completion rewards.
- **Certificates** — passing the final exam of a course automatically issues an official certificate (unique serial) downloadable as a print-ready PDF in the student's language.
- **AI features** — role-play conversation partner per lesson topic, Thai writing/grammar correction, pronunciation comparison (speech recognition where the browser supports it + similarity scoring + AI coaching).
- **Admin panel** — analytics overview, lesson CRUD (JSON content blocks: text, vocab, dialogue, quiz, tracing, video, audio, image, PDF…), publish/unpublish, user & role management, manual certificate issuance, media library.
- **Security** — bcrypt password hashing, rate-limited APIs, CSRF-safe (NextAuth + same-site cookies + server actions), security headers (HSTS, nosniff, frame-options), account-enumeration-safe password reset, GDPR-ready privacy page.

## Getting started

```bash
cd thaimastery
cp .env.example .env        # fill in at least DATABASE_URL + NEXTAUTH_SECRET
npm install
npx prisma db push          # create tables
npm run db:seed             # seed courses, lessons, exams, achievements, demo users
npm run dev                 # http://localhost:3000
```

**Demo accounts** (created by the seed):

| Role | Email | Password |
|---|---|---|
| Admin | `admin@thaimastery.app` | `admin1234!` |
| Student | `demo@thaimastery.app` | `demo1234!` |

### Docker (one command)

```bash
docker compose up --build
# → PostgreSQL + app on http://localhost:3000 (schema pushed + seeded automatically)
```

## Environment variables

See [`.env.example`](.env.example) for the full annotated list. Summary:

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Session signing key (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` | ✅ (prod) | Public URL |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | for payments | Stripe Checkout + webhooks |
| `RESEND_API_KEY` / `EMAIL_FROM` | for emails | Transactional email (logs to console when empty) |
| `ANTHROPIC_API_KEY` | for AI | Claude-powered tutor/correction/feedback (heuristic fallback when empty) |
| `GOOGLE_CLIENT_ID/SECRET` | optional | Google sign-in |
| `CRON_SECRET` | optional | Protects `/api/cron/daily-reminder` |

### Stripe setup

1. Create a Stripe account and copy the test keys into `.env`.
2. Prices are created on the fly by the checkout API (`€14.90/mo`, `€89/yr`, `€199 lifetime` — edit `src/config/pricing.ts`).
3. Forward webhooks in dev: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
4. Promotion codes created in the Stripe dashboard work out of the box (`allow_promotion_codes`).

### Daily reminder emails

Schedule a POST to `/api/cron/daily-reminder` with header `Authorization: Bearer $CRON_SECRET` (e.g. Vercel Cron at `0 17 * * *`).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (runs `prisma generate` + schema push when `DATABASE_URL` is set) |
| `npm run start` | Production server |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run db:seed` | Idempotent content seed |
| `npm run prisma:studio` | Browse the database |

## Architecture

```
src/
  app/
    [locale]/            ← localized routes (en/fr/de)
      (marketing)/       ← landing, privacy, terms
      (auth)/            ← login, register, forgot/reset password
      (app)/             ← authenticated: dashboard, courses, learn, exam,
                            certificates, leaderboard, settings, admin/*
    api/                 ← auth, progress, exam, ai/*, stripe/*, certificates, cron
    sitemap.ts robots.ts manifest.ts
  components/            ← ui/ landing/ auth/ app/ learn/ admin/
  lib/                   ← prisma, auth, progress (level-locking), gamification,
                            ai, email, stripe, certificate (PDF), rate-limit
  i18n/  config/  types/
messages/                ← en.json fr.json de.json
prisma/                  ← schema.prisma, seed.ts, seed-data/ (both curricula)
tests/                   ← vitest unit tests
```

**Level locking** is computed, not stored: level *N* is unlocked iff every previous level's exam has a passing attempt (≥ its `passScore`). Certificates are issued transactionally when the last exam of a course is passed.

**Lesson content** is an ordered JSON array of typed blocks (`text`, `tip`, `vocab`, `flashcards`, `dialogue`, `quiz`, `speaking`, `tracing`, `video`, `audio`, `image`, `pdf`) rendered by `components/learn/content-blocks.tsx` — the admin panel edits these blocks directly, so new multimedia lessons need zero code changes.

## Deployment

**Vercel** — import the repo, set the root directory to `thaimastery/`, add the env vars, and attach a Postgres database (Neon/Supabase). The build script pushes the schema automatically; run `npm run db:seed` once via `vercel exec` or a local connection.

**Docker / VPS** — `docker compose up -d --build` behind any reverse proxy (Caddy/Traefik/Nginx) with TLS.

## License

Proprietary — all course content and code © ThaiMastery.
