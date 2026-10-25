-- Supabase SQL Editor에 그대로 붙여넣고 실행하세요.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9][a-z0-9_-]{2,19}$'),
  card jsonb not null,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 공개된 카드는 누구나 볼 수 있고, 내 카드는 공개 여부와 관계없이 볼 수 있다.
create policy "공개 카드 읽기" on public.profiles
  for select using (published or auth.uid() = id);

create policy "내 카드 만들기" on public.profiles
  for insert with check (auth.uid() = id);

create policy "내 카드 고치기" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "내 카드 지우기" on public.profiles
  for delete using (auth.uid() = id);
