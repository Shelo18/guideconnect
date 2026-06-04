# GuideConnect 🌿

Georgia's guide discovery platform — tourists find verified guides, guides register once and get discovered forever.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your Supabase credentials
cp .env.example .env

# 3. Run in development
npm run dev
```

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste the entire contents of `schema.sql` — run it
3. Copy your **Project URL** and **anon public key** from Project Settings → API
4. Paste them into your `.env` file:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## Make yourself admin

After signing up as a user, run this in the Supabase SQL editor:

```sql
update profiles set role = 'admin' where email = 'your@email.com';
```

Then visit `/admin` to approve guide applications.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Hero / landing page |
| `/guides` | Browse & filter all approved guides |
| `/guides/:id` | Guide profile + reviews |
| `/register` | Guide registration (4-step with ₾50 fee) |
| `/login` | Sign in |
| `/admin` | Admin panel — approve / reject guides |

## How ranking works (automatic via Supabase trigger)

| Rank | Requirement |
|------|------------|
| Newcomer | Default |
| Rising | 3+ reviews |
| Trusted | 4.0+ avg · 10+ reviews |
| Expert | 4.5+ avg · 20+ reviews |
| Elite | 4.8+ avg · 50+ reviews |
