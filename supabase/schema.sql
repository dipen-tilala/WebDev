create table if not exists public.dashboard_state (
  id text primary key,
  details jsonb not null,
  notifications boolean not null default true,
  checked_in boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  department text not null,
  appointment_date date not null,
  appointment_time text not null,
  status text not null default 'Confirmed',
  created_at timestamptz not null default now()
);

alter table public.dashboard_state enable row level security;
alter table public.appointments enable row level security;

grant all on public.dashboard_state to service_role;
grant all on public.appointments to service_role;