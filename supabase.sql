-- 1) Notes table
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  speaker text,
  preached_on date,
  video_url text,
  summary text,
  content_html text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_notes_updated_at on public.notes;
create trigger trg_notes_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

-- 3) Row Level Security
alter table public.notes enable row level security;

-- Public can read
drop policy if exists "public can read notes" on public.notes;
create policy "public can read notes"
on public.notes
for select
to anon, authenticated
using (true);

-- Only signed in users can insert
drop policy if exists "authenticated can insert notes" on public.notes;
create policy "authenticated can insert notes"
on public.notes
for insert
to authenticated
with check (true);

-- Only signed in users can update
drop policy if exists "authenticated can update notes" on public.notes;
create policy "authenticated can update notes"
on public.notes
for update
to authenticated
using (true)
with check (true);

-- Only signed in users can delete
drop policy if exists "authenticated can delete notes" on public.notes;
create policy "authenticated can delete notes"
on public.notes
for delete
to authenticated
using (true);

-- 4) Helpful index for search
create index if not exists notes_title_idx on public.notes using gin (to_tsvector('english', coalesce(title,'')));
create index if not exists notes_speaker_idx on public.notes using gin (to_tsvector('english', coalesce(speaker,'')));
