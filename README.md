# Clearway Junk Removal

A Next.js website for a Hayward, California junk hauling and debris removal company. The public site is written as long, local, question-and-answer copy for Alameda County and Contra Costa County. Customers can set a city for the closest technician, book a haul, sign in, and edit or cancel jobs. The operations dashboard handles dispatch, scheduling, technician assignment, and review requests.

## What is included

- SEO-focused homepage with a hero photo, crew photo, and service photography
- Service pages for household junk, construction debris, estate cleanouts, appliances, yard waste, furniture, garage cleanouts, commercial hauls, and e-waste
- A service-area page plus an individual page for every listed city and community in Alameda County and Contra Costa County
- Guides, FAQ, about, contact, schedule, privacy, and terms
- Location picker that ranks the nearest technicians
- Customer accounts for job status, edits, and cancellation
- Ops dashboard for jobs, dispatch, a seven-day schedule, technicians, and review requests
- Email through [Resend](https://resend.com) when an API key is present
- SMS hooks with recommended phone companies
- No schema markup, by design

## Run it locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

### Demo logins

| Role | Email | Password |
| --- | --- | --- |
| Customer | customer@clearwayjunk.com | customer123 |
| Dispatch | ops@clearwayjunk.com | ops123 |
| Technician | tech@clearwayjunk.com | tech123 |

Jobs are stored in `data/runtime-store.json` on this machine when no database is configured. That file is created on first use and is gitignored.

## GitHub and Railway Postgres

Users and customers persist in PostgreSQL when `DATABASE_URL` is set (Railway injects this from the Postgres plugin). Without it, the app still runs on the local file store.

1. Authorize GitHub, create the repository, and push this project.
2. In [Railway](https://railway.app), create a project from that GitHub repo.
3. Add a Postgres plugin. Railway sets `DATABASE_URL`.
4. Redeploy. The app creates the `users` and `customers` tables on first request and seeds the demo accounts.

`railway.toml` and `Dockerfile` are included for that deploy.

## Email and SMS

Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in `.env.local` to send real mail. Without those keys, messages are written to the ops notification log as mocked sends so you can still demo booking, dispatch, and review requests.

SMS recommendations for schedule reminders and review texts:

1. **Telnyx** — often the best cost and 10DLC tools for a local East Bay shop
2. **Twilio** — the most tutorials and the easiest Node SDK
3. **Bandwidth** — strong if you also want voice or to port a 510 / 925 number
4. **Plivo** — a simpler SMS-only API
5. **Vonage** — useful if dispatchers also want click-to-call

United States application-to-person SMS requires 10DLC brand registration. Set `SMS_PROVIDER` and `SMS_API_KEY` when you connect one. Until then, SMS is logged as mocked.

## Notes on the writing

Pages are written in full sentences with local entities, questions as headings, and separate sections for process, materials, geography, and pricing. That is the BERT- and MUVERA-aligned structure: each block can stand on its own as a retrieval passage. The tone stays helpful and specific. There is no JSON-LD or microdata schema on the site.
