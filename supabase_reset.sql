-- Hard reset of Supabase schema
drop schema public cascade;
create schema public;
alter schema public owner to postgres;

create extension if not exists "pgcrypto";

-- Create fresh waitlist table with all required fields
create table public.waitlist (
  id           uuid primary key default gen_random_uuid(),
  email        text unique not null,
  full_name    text,
  marketing_ok boolean not null default false,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_term     text,
  utm_content  text,
  gclid        text,
  fbclid       text,
  referral_code text,
  created_at   timestamptz default now()
);

-- Enable row level security and create insert policy
alter table public.waitlist enable row level security;
create policy "service inserts" on public.waitlist
  for insert with check (true); 