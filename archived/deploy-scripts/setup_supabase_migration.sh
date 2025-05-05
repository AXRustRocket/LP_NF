#!/bin/bash
set -euo pipefail

# Create migrations directory if it doesn't exist
mkdir -p supabase/migrations

# Create a timestamped migration file
TIMESTAMP=$(date +%Y%m%d%H%M%S)
MIGRATION_FILE="supabase/migrations/${TIMESTAMP}_waitlist_table_creation.sql"

# Copy the SQL content to the migration file
cat > "$MIGRATION_FILE" << 'EOF'
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
EOF

echo "Migration file created at: $MIGRATION_FILE"
echo "Please apply this migration to your Supabase project."
echo ""
echo "Instructions:"
echo "1. Go to Supabase SQL Editor"
echo "2. Copy and paste the contents of $MIGRATION_FILE"
echo "3. Run the SQL script" 