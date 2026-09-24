# Clearway Junk Removal

A Next.js website for a Hayward, California junk hauling and debris removal company. The public site is written as long, local, question-and-answer copy for Alameda County and Contra Costa County. Customers can set a city for the closest technician, book a haul, sign in, and edit or cancel jobs. The operations dashboard handles dispatch, scheduling, technician assignment, and review requests.

## What is included

- SEO-focused homepage with a hero photo, crew photo, and service photography
- Service pages for household junk, construction debris, estate cleanouts, appliances, yard waste, furniture, garage cleanouts, commercial hauls, and e-waste
- A service-area page plus an individual page for every listed city and community in Alameda County and Contra Costa County
- Guides, FAQ, about, contact, schedule, privacy, and terms
- Location picker that ranks the nearest technicians
- Customer accounts for job status, edits, and cancellation
- Admin area to create customers, technicians, dispatch, and admin users
- Resend email for marketing, welcome, account-opening, and notification messages
- SignalWire SMS, review texts, and call tracking
- Ops dashboard for jobs, dispatch, a seven-day schedule, technicians, and review requests
- No schema markup, by design

## Run it locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

If no staff account exists yet, open `/admin/setup` and create the first admin. Customers can still register from `/login`.

Jobs are stored in `data/runtime-store.json` on this machine when no database is configured. Email, SMS, and call logs persist in Postgres when `DATABASE_URL` is set.

## GitHub and Railway Postgres

- GitHub: [jordannpearce/clearway-junk-removal](https://github.com/jordannpearce/clearway-junk-removal)
- Live site: [https://clearwayjunkhaul.com](https://clearwayjunkhaul.com)

Users and customers persist in PostgreSQL when `DATABASE_URL` is set (Railway injects this from the Postgres plugin). Without it, the app still runs on the local file store.

The Railway project `clearway-junk-removal` deploys the `web` service from the `main` branch of that GitHub repo and attaches a Postgres plugin. `DATABASE_URL` on `web` is `${{Postgres.DATABASE_URL}}`. The first request that needs accounts creates the tables. Old demo logins are removed. Create a real admin at `/admin/setup`.

`railway.toml` and `Dockerfile` are included for that deploy. Sitemap, robots, and canonical URLs use `https://clearwayjunkhaul.com`. Set `SITE_URL` on the web service if that domain changes.

## Email, SMS, and calls

The safest place for keys is Railway Variables on the `web` service, not the dashboard form. You can also paste them in Admin → API keys. Railway environment variables override anything saved in admin.

On Railway: open the project, choose the `web` service, then Variables. Set:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `SIGNALWIRE_SPACE` — your space host, such as `example.signalwire.com`
- `SIGNALWIRE_PROJECT_ID`
- `SIGNALWIRE_API_TOKEN`
- `SIGNALWIRE_FROM_NUMBER` — E.164, such as `+13412503505`
- `SITE_URL=https://clearwayjunkhaul.com`

The Admin → API keys form stores values in the Postgres `settings` table when `DATABASE_URL` is set, or in `data/app-settings.json` on this machine. After save, the form never shows a full secret again — only a mask such as `••••last4`. Leave a secret field blank to keep the value that is already stored.

Point the SignalWire number’s messaging webhook at `https://clearwayjunkhaul.com/api/signalwire/sms`. Without those keys, email, SMS, and calls are stored in the admin log so you can still write copy and practice the desk.

Create the first live admin at `/admin/setup` if you have not already, then add Resend and SignalWire keys in either Railway or Admin → API keys.

United States application-to-person SMS still needs 10DLC brand registration on the SignalWire number.

## Notes on the writing

Pages are written in full sentences with local entities, questions as headings, and separate sections for process, materials, geography, and pricing. That is the BERT- and MUVERA-aligned structure: each block can stand on its own as a retrieval passage. The tone stays helpful and specific. There is no JSON-LD or microdata schema on the site.
