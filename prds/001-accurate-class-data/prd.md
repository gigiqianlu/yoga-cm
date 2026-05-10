# PRD-001: Accurate & Up-to-Date Class Data

## Introduction

The Chiang Mai Yoga Class Finder (yoga-cm) currently displays class schedules that are **manually seeded and often inaccurate**. Studios change their schedules weekly, but our data is static — leading to wrong class times, missing classes, and user distrust.

This PRD defines a hybrid data pipeline that combines **automated scraping** (where possible) with **community-driven corrections** and an **admin override UI**, ensuring class data is always accurate and fresh. It also lays the groundwork for the app to grow from 5 studios to any studio in Chiang Mai that wants to list itself.

### The Core Problem

1. **No clean APIs exist.** None of the 5 current studios use booking platforms (Mindbody, Momoyoga, etc.) that expose APIs. Schedules are published via WordPress timetable plugins (noo-timetable, WP FullCalendar, MP Timetable), custom JavaScript widgets, or literal JPG images of schedules.
2. **Schedules change weekly.** Studios update their timetables regularly — sometimes day-to-day for special events. Static seed data rots immediately.
3. **Manual research is error-prone.** Web search results and AI-generated schedule summaries hallucinate class details (wrong times, wrong instructors, invented classes).

### What This PRD Covers

A three-layer data system:
- **Layer 1 — Scrapers:** Automated extraction from studio websites where technically feasible
- **Layer 2 — Community Submissions:** Anyone can suggest new studios or corrections
- **Layer 3 — Admin UI:** The app owner can review, approve, and override all data

---

## Goals

| # | Goal | Metric |
|---|------|--------|
| G-1 | Every class shown in the app matches the studio's actual current schedule | <5% error rate on spot-checks |
| G-2 | Data freshness: schedule updates reflected within 1 week | Median staleness < 7 days |
| G-3 | Any Chiang Mai yoga studio can self-list | Studio submission form live and functional |
| G-4 | Community can flag/correct errors | Correction flow end-to-end working |
| G-5 | Multi-language support (EN/TH/ZH) | All user-facing text translatable |
| G-6 | Zero operational cost | No paid services required for MVP |

---

## User Stories

### US-001: Studio Owner Submits Their Studio
**As a** yoga studio owner in Chiang Mai, **I want to** submit my studio and schedule to the app, **so that** my classes appear to potential students.

- [ ] A "List Your Studio" button is visible on the homepage
- [ ] The submission form collects: studio name, location, contact info, website/social links, and weekly class schedule (day, time, class name, style, instructor, price)
- [ ] The form works on mobile (most studio owners use phones)
- [ ] After submission, the owner sees a confirmation message saying "Your studio will appear after review"
- [ ] The submission is stored in the database with status `pending`
- [ ] Verify in browser: fill out form, submit, see confirmation

### US-002: Community Member Suggests a Correction
**As a** yoga practitioner, **I want to** report that a class time or detail is wrong, **so that** other users see accurate information.

- [ ] Each class card has a small "Report issue" or "Suggest edit" link
- [ ] Clicking it opens a lightweight form (no login required) with fields: what's wrong, what's correct, optional contact
- [ ] The suggestion is stored in the database with status `pending`
- [ ] A "thank you" confirmation appears after submission
- [ ] Verify in browser: click "Suggest edit" on a class, submit correction, see confirmation

### US-003: Community Member Suggests a New Studio
**As a** user, **I want to** suggest a yoga studio that's not listed, **so that** more options appear in the app.

- [ ] A "Suggest a Studio" option exists (can be combined with US-001's form in a simpler version)
- [ ] Minimum info required: studio name + location or website
- [ ] Stored as a `pending` studio suggestion
- [ ] Verify in browser: submit suggestion, see confirmation

### US-004: Admin Reviews & Approves Submissions
**As the** app admin, **I want to** review pending studio submissions and corrections, **so that** only verified data goes live.

- [ ] Admin panel accessible at `/admin` (protected by a simple password or token — no OAuth needed for MVP)
- [ ] Dashboard shows counts: pending studios, pending corrections, pending class edits
- [ ] Admin can view each pending submission with all details
- [ ] Admin can approve (data goes live), reject (with optional reason), or edit-then-approve
- [ ] Admin can directly edit any studio's class schedule (add/remove/modify classes)
- [ ] Verify in browser: log into admin, see pending items, approve one, see it go live

### US-005: Admin Manually Updates a Studio's Schedule
**As the** app admin, **I want to** quickly update a studio's full weekly schedule, **so that** I can correct data that scrapers missed or got wrong.

- [ ] Admin can select a studio and see its current full weekly timetable in an editable grid
- [ ] Admin can add a class (day, time, title, style, instructor, duration, price)
- [ ] Admin can edit any existing class field inline
- [ ] Admin can delete/deactivate a class
- [ ] Changes take effect immediately (no deploy needed)
- [ ] Verify in browser: edit a class time in admin, check the public page, see the update

### US-006: Scraper Fetches Schedule from a Studio Website
**As the** system, **I want to** automatically scrape class schedules from studio websites, **so that** data stays fresh without manual intervention.

- [ ] Scrapers exist for studios whose websites have scrapeable HTML (currently: Freedom Yoga with MP Timetable, CM Holistic with Rs Timetable)
- [ ] Scrapers run on a schedule (at minimum weekly, ideally daily)
- [ ] Scraped data is stored as `draft` — not auto-published — so admin can review before it goes live (prevents scraper bugs from corrupting data)
- [ ] If a scraper fails (site changed, WAF blocked, etc.), admin is notified and existing data is preserved
- [ ] Each class record tracks `source`: `manual`, `scraped`, or `community`
- [ ] Verify: trigger scraper, see draft data appear in admin review queue

### US-007: User Sees "Last Updated" Indicator
**As a** user, **I want to** know how fresh the schedule data is, **so that** I can judge whether to trust it or check the studio directly.

- [ ] Each studio's section shows "Schedule last verified: [date]"
- [ ] If data is older than 14 days, show a subtle warning: "This schedule may be outdated — check the studio's website"
- [ ] Verify in browser: see "last verified" date on a studio's classes

### US-008: Multi-Language Support
**As a** user who speaks Thai or Chinese, **I want to** use the app in my language, **so that** I can find classes easily.

- [ ] Language switcher in the header (EN / ไทย / 中文)
- [ ] All UI chrome (buttons, labels, filters, headers) translated
- [ ] Class data itself remains in original language (usually English) — not auto-translated
- [ ] User's language preference persisted via cookie or localStorage
- [ ] Verify in browser: switch to Thai, see all UI text in Thai

---

## Functional Requirements

### Data Model Changes

| # | Requirement |
|---|------------|
| FR-1 | Add `source` field to `YogaClass`: enum of `manual`, `scraped`, `community` — tracks where data came from |
| FR-2 | Add `status` field to `YogaClass`: enum of `live`, `draft`, `pending_review` — controls visibility |
| FR-3 | Add `lastVerifiedAt` field to `Studio` — timestamp of last admin verification or successful scrape review |
| FR-4 | Add `status` field to `Studio`: enum of `live`, `pending`, `rejected` — for new studio submissions |
| FR-5 | Create `Suggestion` model: `id`, `type` (correction / new_studio / new_class), `targetStudioId?`, `targetClassId?`, `data` (JSON), `submitterContact?`, `status` (pending / approved / rejected), `adminNotes?`, `createdAt` |
| FR-6 | Only classes with `status = live` and `isActive = true` are returned by the public API |

### Scraping Pipeline

| # | Requirement |
|---|------------|
| FR-7 | Scrapers are studio-specific — each studio that can be scraped has its own scraper class |
| FR-8 | Scraped classes are saved with `status = draft` — they require admin approval to go `live` |
| FR-9 | Scraper runs should be triggerable manually from admin UI (button click) and on a cron schedule |
| FR-10 | If a scraper run produces significantly different results from current live data (>30% classes changed), flag for manual review rather than auto-drafting |
| FR-11 | Scraper failures are logged and do NOT affect live data |
| FR-12 | For studios that can't be scraped (image-based schedules, WAF-blocked), the system should still work — data is entered manually via admin UI |

### Community Submissions

| # | Requirement |
|---|------------|
| FR-13 | Submission forms use basic spam protection (honeypot field + rate limiting, NOT captcha — keep it simple) |
| FR-14 | All community submissions go to `pending` status — never auto-published |
| FR-15 | Submitters don't need to create an account or log in |
| FR-16 | The correction form pre-fills with current class data so the user only needs to change what's wrong |

### Admin UI

| # | Requirement |
|---|------------|
| FR-17 | Admin auth is a simple shared password/token (stored as env var `ADMIN_TOKEN`). No OAuth, no user accounts for MVP |
| FR-18 | Admin can perform full CRUD on studios and classes |
| FR-19 | Admin can bulk-update a studio's entire weekly schedule (e.g., paste from a spreadsheet or edit a grid) |
| FR-20 | Admin can mark a studio as "verified" which updates `lastVerifiedAt` |
| FR-21 | Admin actions are logged (who did what, when) for auditability |

### Internationalization (i18n)

| # | Requirement |
|---|------------|
| FR-22 | Use Next.js built-in i18n or a lightweight library (e.g., `next-intl`) |
| FR-23 | Translation strings stored in JSON files: `messages/en.json`, `messages/th.json`, `messages/zh.json` |
| FR-24 | Language detection: use browser `Accept-Language` header as default, allow manual override |
| FR-25 | URL structure: `/en/`, `/th/`, `/zh/` prefixes (good for SEO) |

---

## Non-Goals

| # | What we will NOT do |
|---|-------------------|
| NG-1 | **Real-time booking integration** — we show schedules, we don't handle bookings. Link to studio's own booking method (WhatsApp, website, walk-in) |
| NG-2 | **User accounts for regular users** — no login needed to browse classes or submit suggestions |
| NG-3 | **AI/LLM-based schedule extraction** — too unreliable for this use case; better to admit "we don't know" than show wrong data |
| NG-4 | **Payment processing** — no monetization features in this phase |
| NG-5 | **Native mobile app** — mobile web is sufficient |
| NG-6 | **Automated Instagram/Facebook scraping** — against TOS, fragile, and not worth the complexity |

---

## Design Considerations

### Public UI Changes
- Add "Last verified [date]" badge per studio (subtle, gray text)
- Add "Suggest edit" micro-link on each class card (small pencil icon or text link)
- Add "List Your Studio" CTA button in the header or footer
- Add language switcher (compact dropdown or flag icons) in the header
- Show "⚠️ Schedule may be outdated" warning when `lastVerifiedAt` > 14 days ago

### Admin UI Design
- Simple, functional dashboard — not beautiful, just usable
- Route: `/admin` with token-based auth (enter password → set cookie)
- Navigation: Studios | Classes | Submissions | Scraper Status
- Studio editor: inline-editable timetable grid (7 columns for days, rows for time slots)
- Submission review: card-based list with approve/reject/edit buttons

### Submission Forms
- Modal or slide-up panel (no separate page — keep it lightweight)
- "Suggest Edit" form fields: What's wrong? (dropdown: wrong time / wrong instructor / class doesn't exist / missing class / other) + free text + optional email
- "List Your Studio" form: multi-step (1. studio info → 2. class schedule → 3. confirm)

---

## Technical Considerations

### Current Stack (Keep)
- **Next.js 16** (App Router) on **Vercel** (free tier)
- **Turso** (LibSQL) database (free tier: 9GB, 500M reads/mo — more than enough)
- **Prisma 7** ORM with `@prisma/adapter-libsql`

### New Dependencies (Minimal)
- **`next-intl`** — lightweight i18n for Next.js App Router
- **`cheerio`** — already installed, used for HTML scraping
- No additional infrastructure needed

### Scraper Architecture
- Each scrapeable studio gets a dedicated scraper file: `src/lib/scrapers/[studio-slug].ts`
- Scrapers extend the existing `BaseScraper` class
- Non-scrapeable studios (image-based schedules, WAF-blocked) are marked as `scrapeMethod: 'manual'` in the Studio model
- Scraper cron: use Vercel Cron Jobs (free tier supports 1 cron per day) or trigger via API route

### Data Integrity
- The public API (`/api/classes`) only returns `status = 'live'` classes — drafts and pending items are invisible to users
- Admin API routes (`/api/admin/*`) are protected by `ADMIN_TOKEN` middleware
- Community submissions are stored in a separate `Suggestion` table — they don't modify live data directly

### Migration Path
- Add new fields to existing schema (non-breaking: new fields with defaults)
- Set all current classes to `source = 'manual'`, `status = 'live'`
- Set all current studios to `status = 'live'`, `lastVerifiedAt = now()`
- No data loss during migration

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Data accuracy | <5% error on spot-check | Monthly: pick 10 random classes, verify against studio website |
| Data freshness | Median staleness < 7 days | Track `lastVerifiedAt` across studios |
| Community engagement | ≥5 suggestions/month within 3 months | Count `Suggestion` records |
| Studio growth | ≥10 studios listed within 6 months | Count `Studio` records with `status = live` |
| User trust | No "wrong schedule" complaints | Track correction suggestions (fewer = better) |

---

## Open Questions

| # | Question | Impact |
|---|----------|--------|
| OQ-1 | Should scraped data auto-publish after N days without admin review, or always require manual approval? | Affects how much admin effort is needed |
| OQ-2 | For the "List Your Studio" flow — should studios be able to update their own schedule after initial listing? (requires some form of studio auth) | Affects whether we need studio accounts |
| OQ-3 | For i18n — should class names/descriptions be translatable, or only UI chrome? Translating class data (e.g., "Yin Yoga" → "瑜伽") may be confusing since studios use English names | Affects translation scope |
| OQ-4 | Should we support studios outside Chiang Mai eventually? (e.g., Bangkok, Pai) | Affects data model (need city/region field) |
| OQ-5 | What's the admin's preferred way to be notified of new submissions? (email, Telegram bot, just check the dashboard) | Affects notification implementation |

---

## Implementation Priority

Recommended build order:

1. **Phase 1 — Admin UI + Manual Data Entry** (highest impact, fixes the core problem)
   - Admin auth, studio CRUD, class CRUD, timetable grid editor
   - Verify & correct all current data manually
   - Add `lastVerifiedAt` display to public UI

2. **Phase 2 — Community Submissions**
   - "Suggest Edit" form on class cards
   - "List Your Studio" submission form
   - Admin review queue for submissions

3. **Phase 3 — Scrapers**
   - Build scrapers for scrapeable studios (Freedom Yoga, CM Holistic)
   - Scraper → draft → admin review pipeline
   - Cron job for automated runs

4. **Phase 4 — i18n**
   - Language switcher + translated UI chrome
   - EN → TH → ZH translation
