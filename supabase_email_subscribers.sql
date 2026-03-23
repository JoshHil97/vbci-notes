create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_email_subscribers_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_email_subscribers_updated_at on public.email_subscribers;
create trigger trg_email_subscribers_updated_at
before update on public.email_subscribers
for each row execute function public.set_email_subscribers_updated_at();

alter table public.email_subscribers enable row level security;

create index if not exists email_subscribers_email_idx
on public.email_subscribers (email);
