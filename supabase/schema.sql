-- 사용자 프로필 테이블
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  favorite_team text,
  favorite_players bigint[] default '{}',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "본인 프로필만 조회 가능"
  on public.profiles for select
  using (auth.uid() = id);

create policy "본인 프로필만 수정 가능"
  on public.profiles for update
  using (auth.uid() = id);

create policy "회원가입 시 프로필 생성 가능"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 회원가입 시 프로필 자동 생성 트리거
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 선수 테이블 (KBO 전체 선수, 크롤링으로 갱신)
create table public.players (
  id bigint generated always as identity primary key,
  player_id text unique,
  name text not null,
  team text not null,
  position text,
  back_number text,
  updated_at timestamptz default now()
);

alter table public.players enable row level security;

create policy "누구나 선수 목록 조회 가능"
  on public.players for select
  using (true);

create index idx_players_team on public.players (team);

-- 직관 기록 테이블
create table public.observations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  game_date date not null,
  home_team text not null,
  away_team text not null,
  stadium text not null,
  seat text,
  home_score integer,
  away_score integer,
  memo text,
  image_urls text[] default '{}',
  created_at timestamptz default now()
);

alter table public.observations enable row level security;

create policy "본인 직관 기록만 조회 가능"
  on public.observations for select
  using (auth.uid() = user_id);

create policy "본인 직관 기록만 등록 가능"
  on public.observations for insert
  with check (auth.uid() = user_id);

create policy "본인 직관 기록만 수정 가능"
  on public.observations for update
  using (auth.uid() = user_id);

create policy "본인 직관 기록만 삭제 가능"
  on public.observations for delete
  using (auth.uid() = user_id);
