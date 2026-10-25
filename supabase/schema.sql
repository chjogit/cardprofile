-- Supabase SQL Editor에 그대로 붙여넣고 실행하세요. 여러 번 실행해도 괜찮아요.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9][a-z0-9_-]{2,19}$'),
  card jsonb not null,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 공개된 카드는 누구나 볼 수 있고, 내 카드는 공개 여부와 관계없이 볼 수 있다.
drop policy if exists "공개 카드 읽기" on public.profiles;
create policy "공개 카드 읽기" on public.profiles
  for select using (published or auth.uid() = id);

drop policy if exists "내 카드 만들기" on public.profiles;
create policy "내 카드 만들기" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "내 카드 고치기" on public.profiles;
create policy "내 카드 고치기" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "내 카드 지우기" on public.profiles;
create policy "내 카드 지우기" on public.profiles
  for delete using (auth.uid() = id);

-- 프로필 사진과 이미지 블록을 저장하는 공개 버킷. 각자 자기 폴더(user id)에만 올릴 수 있다.
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "이미지 누구나 보기" on storage.objects;
create policy "이미지 누구나 보기" on storage.objects
  for select using (bucket_id = 'images');

drop policy if exists "내 폴더에 이미지 올리기" on storage.objects;
create policy "내 폴더에 이미지 올리기" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "내 이미지 지우기" on storage.objects;
create policy "내 이미지 지우기" on storage.objects
  for delete to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text);
