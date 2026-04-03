# Clay & Light — Booking System Deployment Guide

Complete setup: Supabase → n8n → Next.js dashboard → Vercel

---

## 1. SUPABASE SETUP

### 1a. Create project
1. Go to https://supabase.com → New project
2. Name: `clay-and-light`, Region: `eu-central-1` (Frankfurt, nearest to Vienna)
3. Set a strong database password — save it

### 1b. Run the schema
1. Dashboard → **SQL Editor** → **New query**
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run**

### 1c. Grab your API keys
Dashboard → **Settings** → **API**:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (never expose this to the browser)

---

## 2. N8N SETUP

### Option A — n8n Cloud (recommended for beginners)
1. Sign up at https://n8n.io
2. **Workflows** → **Import from file**
3. Import both files from the `n8n/` folder

### Option B — Self-hosted n8n (Docker)
```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=yourpassword \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```
Then open http://localhost:5678

### 2a. Set up credentials

**Supabase credential:**
1. Settings → Credentials → Add credential → **Supabase**
2. Name: `Supabase — Clay & Light`
3. Host URL: your Supabase project URL
4. Service Role Secret: your `service_role` key

**Gmail credential:**
1. Settings → Credentials → Add credential → **Gmail OAuth2**
2. Name: `Gmail — Clay & Light`
3. Follow the OAuth flow — use the studio Gmail account
4. Required scopes: `https://www.googleapis.com/auth/gmail.send`

### 2b. Activate workflows
1. Open each workflow
2. Update the owner email in the "Email — Owner Notification" node
3. Toggle **Active** in the top-right corner
4. Copy the webhook URLs shown in the Webhook node (click the node → copy Production URL)

**Your webhook URLs will look like:**
```
https://your-n8n-instance.com/webhook/pottery-booking
https://your-n8n-instance.com/webhook/table-reservation
```

---

## 3. COOKIEBOT SETUP (GDPR)

1. Sign up at https://www.cookiebot.com
2. Add your domain
3. Copy your **CBID** (looks like a UUID)
4. Set it as `NEXT_PUBLIC_COOKIEBOT_ID` in your environment variables

---

## 4. NEXT.JS DASHBOARD

### 4a. Install dependencies
```bash
cd dashboard
npm install
```

### 4b. Configure environment
```bash
cp .env.example .env.local
```
Edit `.env.local` with your actual values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_N8N_POTTERY_WEBHOOK=https://your-n8n.com/webhook/pottery-booking
NEXT_PUBLIC_N8N_RESERVATION_WEBHOOK=https://your-n8n.com/webhook/table-reservation
NEXT_PUBLIC_COOKIEBOT_ID=your-cbid
```

### 4c. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### 4d. Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```
Or connect your GitHub repo in the Vercel dashboard and set the environment variables there (Project → Settings → Environment Variables).

**Build settings for Vercel:**
- Framework: Next.js (auto-detected)
- Root Directory: `dashboard`
- Build Command: `npm run build`
- Output Directory: `.next`

---

## 5. CONNECTING FORMS TO N8N

The public forms (`PotteryBookingForm` and `ReservationForm`) POST to your n8n webhook URLs.
These are configured via environment variables already. No code changes needed.

### Testing the flow end-to-end
1. Start the dev server (`npm run dev`)
2. Navigate to any page with a form (you can import and render the forms anywhere)
3. Submit a test booking
4. Check: Supabase table has a new row, both emails arrive, dashboard shows the booking

### Embedding forms on your existing site (index.html)
Replace the current `sendWebhook()` calls in `script.js` with direct POSTs to the n8n URLs:
```js
// In script.js — replace N8N_WEBHOOK_URL usage:
const POTTERY_WEBHOOK = 'https://your-n8n.com/webhook/pottery-booking';
const TABLE_WEBHOOK   = 'https://your-n8n.com/webhook/table-reservation';

// For pottery bookings:
fetch(POTTERY_WEBHOOK, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, phone, timeslot, persons, notes, marketing_consent })
});

// For table reservations:
fetch(TABLE_WEBHOOK, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, phone, reservation_time, persons, notes })
});
```

---

## 6. ARCHITECTURE OVERVIEW

```
Browser (clayandlight.at)
    │
    ├─ Pottery/Table form submits
    │       ↓
    │   n8n Webhook
    │       ├─ Validates fields
    │       ├─ Inserts → Supabase (pottery_bookings / reservations)
    │       ├─ Gmail → Customer confirmation email
    │       ├─ Gmail → Owner notification email
    │       └─ [Pottery only] Wait 24h → Reminder email
    │
    └─ Dashboard (Next.js, separate deploy)
            ↓
        Supabase (reads/writes via anon + service role)
            ├─ /dashboard  — overview + recent entries
            ├─ /bookings   — pottery_bookings table (sortable, filterable)
            ├─ /reservations — reservations table
            ├─ /analytics  — revenue charts + KPIs
            └─ /settings   — edit pricing via settings table
```

---

## 7. SECURITY CHECKLIST

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is only in `.env.local` — never in client-side code
- [ ] Supabase RLS is enabled (done in schema.sql)
- [ ] n8n instance is behind HTTPS
- [ ] n8n webhooks use the production URL (not test URL)
- [ ] Cookiebot is active on the public site
- [ ] Marketing consent is stored and respected
- [ ] `.env.local` is in `.gitignore`

---

## 8. FILE STRUCTURE

```
booking-system/
├── supabase/
│   └── schema.sql              ← Run in Supabase SQL Editor
├── n8n/
│   ├── pottery-booking-workflow.json   ← Import into n8n
│   └── reservation-workflow.json       ← Import into n8n
└── dashboard/                  ← Next.js 14 App Router
    ├── .env.example            ← Copy to .env.local
    ├── package.json
    ├── tailwind.config.ts      ← Clay & Light brand colors
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── dashboard/page.tsx
        │   ├── bookings/page.tsx
        │   ├── reservations/page.tsx
        │   ├── analytics/page.tsx
        │   ├── settings/page.tsx
        │   ├── impressum/page.tsx
        │   └── datenschutz/page.tsx
        ├── components/
        │   ├── layout/Sidebar.tsx
        │   ├── layout/Header.tsx
        │   ├── tables/BookingsTable.tsx
        │   ├── tables/ReservationsTable.tsx
        │   ├── tables/RevenueChart.tsx
        │   ├── forms/PotteryBookingForm.tsx
        │   ├── forms/ReservationForm.tsx
        │   └── forms/SettingsForm.tsx
        └── lib/
            ├── supabase.ts     ← All DB queries
            └── types.ts        ← TypeScript types
```
