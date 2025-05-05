drop table if exists public.waitlist cascade;
create extension if not exists "pgcrypto";
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  marketing_ok boolean default false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  fbclid text,
  referral_code text,
  created_at timestamptz default now()
);
alter table public.waitlist enable row level security;
create policy "insert_any" on public.waitlist
  for insert with check (true); 