-- Tabellen erstellen
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz default now(),
  welcome_email_sent boolean default false
);

create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text,
  created_at timestamptz default now()
);

-- RLS (Row Level Security) aktivieren
alter table waitlist enable row level security;
create policy "Public insert" on waitlist for insert with check (true);

alter table contact_requests enable row level security;
create policy "Public insert" on contact_requests for insert with check (true);

-- Leaderboard View für öffentlichen Zugriff konfigurieren
alter view if exists top_referrers set (security_invoker = true); 