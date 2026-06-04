-- ============================================================
--  GuideConnect — Supabase SQL Schema
--  Run this once in your Supabase SQL editor
-- ============================================================

-- PROFILES (tourists & guides & admins)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null default 'tourist', -- 'tourist' | 'guide' | 'admin'
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

-- GUIDES
create table guides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique,
  city text,
  regions text[],
  languages text[],
  specialties text[],
  experience_years int,
  price_per_day numeric,
  bio text,
  license_number text,
  certificates text[],
  status text default 'pending', -- 'pending' | 'approved' | 'rejected'
  paid boolean default false,
  rating numeric default 0,
  review_count int default 0,
  rank text default 'Newcomer', -- 'Newcomer'|'Rising'|'Trusted'|'Expert'|'Elite'
  created_at timestamptz default now()
);

-- REVIEWS
create table reviews (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid references guides(id) on delete cascade,
  tourist_id uuid references profiles(id) on delete cascade,
  stars int check (stars between 1 and 5),
  body text,
  created_at timestamptz default now(),
  unique(guide_id, tourist_id)
);

-- ── Auto-update guide rating & rank after each review ──────
create or replace function update_guide_rating()
returns trigger as $$
declare
  avg_stars numeric;
  total_reviews int;
  new_rank text;
begin
  select avg(stars), count(*) into avg_stars, total_reviews
  from reviews where guide_id = NEW.guide_id;

  if avg_stars >= 4.8 and total_reviews >= 50 then new_rank := 'Elite';
  elsif avg_stars >= 4.5 and total_reviews >= 20 then new_rank := 'Expert';
  elsif avg_stars >= 4.0 and total_reviews >= 10 then new_rank := 'Trusted';
  elsif total_reviews >= 3 then new_rank := 'Rising';
  else new_rank := 'Newcomer';
  end if;

  update guides set
    rating = round(avg_stars::numeric, 1),
    review_count = total_reviews,
    rank = new_rank
  where id = NEW.guide_id;

  return NEW;
end;
$$ language plpgsql;

create trigger after_review_insert
after insert or update on reviews
for each row execute procedure update_guide_rating();

-- ── Row-Level Security ──────────────────────────────────────
alter table profiles enable row level security;
alter table guides enable row level security;
alter table reviews enable row level security;

-- Profiles
create policy "Public profiles readable" on profiles for select using (true);
create policy "Own profile editable" on profiles for update using (auth.uid() = id);
create policy "Insert own profile" on profiles for insert with check (auth.uid() = id);

-- Guides
create policy "Approved guides readable" on guides for select using (status = 'approved' or auth.uid() = user_id);
create policy "Own guide editable" on guides for update using (auth.uid() = user_id);
create policy "Guide insert own" on guides for insert with check (auth.uid() = user_id);

-- Admins can read & update everything
create policy "Admin reads all guides" on guides for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin updates all guides" on guides for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Reviews
create policy "Reviews readable" on reviews for select using (true);
create policy "Tourist inserts review" on reviews for insert with check (auth.uid() = tourist_id);

-- ── To make a user admin: run in SQL editor ─────────────────
-- update profiles set role = 'admin' where email = 'your@email.com';
