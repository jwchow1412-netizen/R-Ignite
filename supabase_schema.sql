-- Gamification & Rewards Portal Schema setup for R-Ignite
-- Safe to rerun after partial application.

create extension if not exists "uuid-ossp";


-- 1. Profiles
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  total_points integer default 0 not null,
  is_checked_in boolean default false not null,
  role text default 'participant'::text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles
  add column if not exists email text,
  add column if not exists full_name text,
  add column if not exists total_points integer default 0 not null,
  add column if not exists is_checked_in boolean default false not null,
  add column if not exists role text default 'participant'::text not null,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name),
        updated_at = timezone('utc'::text, now());

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Tasks
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  points integer not null default 50,
  type text not null,
  requires_proof boolean default false not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tasks
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists points integer default 50 not null,
  add column if not exists type text,
  add column if not exists requires_proof boolean default false not null,
  add column if not exists image_url text,
  add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null;

alter table public.tasks enable row level security;

drop policy if exists "Tasks are viewable by everyone." on public.tasks;
create policy "Tasks are viewable by everyone." on public.tasks
  for select using (true);

drop policy if exists "Only admins can modify tasks" on public.tasks;
create policy "Only admins can modify tasks" on public.tasks
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

update public.tasks
set
  title = 'Share an official MASA Hackathon post',
  description = 'Repost an official MASA Hackathon banner or campaign update on Instagram, Facebook, or LinkedIn.',
  points = 50,
  type = 'social',
  requires_proof = true
where title = 'Share Official Post';

update public.tasks
set
  title = 'Attend an in-person workshop',
  description = 'Earn points when you scan the event QR code at the workshop entrance or organiser checkpoint.',
  points = 50,
  type = 'attendance',
  requires_proof = false
where title = 'Attend Workshop 1';

update public.tasks
set
  title = 'Post your team''s progress story',
  description = 'Publish a LinkedIn post or blog entry about your team progress, approach, or insights during the hackathon.',
  points = 100,
  type = 'social',
  requires_proof = true
where title = 'Post Team Progress';

insert into public.tasks (title, description, points, type, requires_proof)
select seed.title, seed.description, seed.points, seed.type, seed.requires_proof
from (
  values
    ('Share an official MASA Hackathon post', 'Repost an official MASA Hackathon banner or campaign update on Instagram, Facebook, or LinkedIn.', 50, 'social', true),
    ('Post your team''s progress story', 'Publish a LinkedIn post or blog entry about your team progress, approach, or insights during the hackathon.', 100, 'social', true),
    ('Comment on another team post', 'Leave a meaningful comment that supports or engages another participant team during the campaign period.', 10, 'community', true),
    ('Attend an in-person workshop', 'Earn points when you scan the event QR code at the workshop entrance or organiser checkpoint.', 50, 'attendance', false),
    ('Grand final event check-in', 'Physical attendance is required to redeem gifts on site and to qualify for the lucky draw.', 0, 'attendance', false),
    ('Submit preliminary round deliverables', 'Complete your team submission on time to unlock another milestone in the rewards journey.', 120, 'submission', true)
) as seed(title, description, points, type, requires_proof)
where not exists (
  select 1 from public.tasks existing where existing.title = seed.title
);


-- 3. Submissions
create table if not exists public.submissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  task_id uuid references public.tasks(id) not null,
  proof_url text,
  status text default 'pending' not null check (status in ('pending', 'approved', 'rejected')),
  points_awarded integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.submissions
  add column if not exists user_id uuid references public.profiles(id),
  add column if not exists task_id uuid references public.tasks(id),
  add column if not exists proof_url text,
  add column if not exists status text default 'pending' not null,
  add column if not exists points_awarded integer default 0 not null,
  add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null;

create unique index if not exists submissions_user_task_unique_idx
  on public.submissions (user_id, task_id);

alter table public.submissions enable row level security;

drop policy if exists "Users can view own submissions." on public.submissions;
create policy "Users can view own submissions." on public.submissions
  for select using (auth.uid() = user_id);

drop policy if exists "Admins can view all submissions." on public.submissions;
create policy "Admins can view all submissions." on public.submissions
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Users can insert own submissions." on public.submissions;
create policy "Users can insert own submissions." on public.submissions
  for insert with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "Users can update own pending submissions." on public.submissions;
create policy "Users can update own pending submissions." on public.submissions
  for update using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "Admins can update submissions." on public.submissions;
create policy "Admins can update submissions." on public.submissions
  for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create or replace function public.update_user_points()
returns trigger as $$
declare
  task_points integer;
begin
  if new.status = 'approved' and old.status != 'approved' then
    select points into task_points from public.tasks where id = new.task_id;

    new.points_awarded := coalesce(task_points, 0);

    update public.profiles
      set total_points = total_points + new.points_awarded,
          updated_at = timezone('utc'::text, now())
    where id = new.user_id;
  elsif new.status != 'approved' and old.status = 'approved' then
    update public.profiles
      set total_points = total_points - old.points_awarded,
          updated_at = timezone('utc'::text, now())
    where id = new.user_id;

    new.points_awarded := 0;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists on_submission_status_change on public.submissions;
create trigger on_submission_status_change
  before update on public.submissions
  for each row execute procedure public.update_user_points();


-- 4. Attendance scans and QR check-ins
create table if not exists public.attendance_scans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  checkpoint_slug text not null,
  checkpoint_name text not null,
  points_awarded integer default 0 not null,
  sets_checked_in boolean default false not null,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.attendance_scans
  add column if not exists user_id uuid references public.profiles(id),
  add column if not exists checkpoint_slug text,
  add column if not exists checkpoint_name text,
  add column if not exists points_awarded integer default 0 not null,
  add column if not exists sets_checked_in boolean default false not null,
  add column if not exists created_by uuid references public.profiles(id),
  add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null;

create unique index if not exists attendance_scans_user_checkpoint_unique_idx
  on public.attendance_scans (user_id, checkpoint_slug);

alter table public.attendance_scans enable row level security;

drop policy if exists "Users can view own attendance scans." on public.attendance_scans;
create policy "Users can view own attendance scans." on public.attendance_scans
  for select using (auth.uid() = user_id);

drop policy if exists "Admins can view all attendance scans." on public.attendance_scans;
create policy "Admins can view all attendance scans." on public.attendance_scans
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Users can insert own attendance scans." on public.attendance_scans;
create policy "Users can insert own attendance scans." on public.attendance_scans
  for insert with check (auth.uid() = user_id);

drop policy if exists "Admins can insert attendance scans for anyone." on public.attendance_scans;
create policy "Admins can insert attendance scans for anyone." on public.attendance_scans
  for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create or replace function public.apply_attendance_scan()
returns trigger as $$
begin
  update public.profiles
    set total_points = total_points + new.points_awarded,
        is_checked_in = is_checked_in or new.sets_checked_in,
        updated_at = timezone('utc'::text, now())
  where id = new.user_id;

  return new;
end;
$$ language plpgsql;

drop trigger if exists on_attendance_scan_created on public.attendance_scans;
create trigger on_attendance_scan_created
  after insert on public.attendance_scans
  for each row execute procedure public.apply_attendance_scan();


-- 5. Lucky draw results
create table if not exists public.lucky_draw_results (
  id uuid default uuid_generate_v4() primary key,
  draw_label text not null,
  winner_id uuid references public.profiles(id) not null,
  winner_points integer default 0 not null,
  min_points integer not null,
  drawn_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lucky_draw_results
  add column if not exists draw_label text,
  add column if not exists winner_id uuid references public.profiles(id),
  add column if not exists winner_points integer default 0 not null,
  add column if not exists min_points integer,
  add column if not exists drawn_by uuid references public.profiles(id),
  add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null;

alter table public.lucky_draw_results enable row level security;

drop policy if exists "Admins can view lucky draw results." on public.lucky_draw_results;
create policy "Admins can view lucky draw results." on public.lucky_draw_results
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Admins can insert lucky draw results." on public.lucky_draw_results;
create policy "Admins can insert lucky draw results." on public.lucky_draw_results
  for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));


-- 6. Tier redemptions
create table if not exists public.tier_redemptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  tier_name text not null,
  tier_points_required integer not null,
  redeemed_by uuid references public.profiles(id),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tier_redemptions
  add column if not exists user_id uuid references public.profiles(id),
  add column if not exists tier_name text,
  add column if not exists tier_points_required integer,
  add column if not exists redeemed_by uuid references public.profiles(id),
  add column if not exists notes text,
  add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null;

create unique index if not exists tier_redemptions_user_tier_unique_idx
  on public.tier_redemptions (user_id, tier_name);

alter table public.tier_redemptions enable row level security;

drop policy if exists "Users can view own tier redemptions." on public.tier_redemptions;
create policy "Users can view own tier redemptions." on public.tier_redemptions
  for select using (auth.uid() = user_id);

drop policy if exists "Admins can view all tier redemptions." on public.tier_redemptions;
create policy "Admins can view all tier redemptions." on public.tier_redemptions
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Admins can insert tier redemptions." on public.tier_redemptions;
create policy "Admins can insert tier redemptions." on public.tier_redemptions
  for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));


-- 7. Storage bucket for proof uploads
insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', true)
on conflict (id) do update
  set name = excluded.name,
      public = excluded.public;

drop policy if exists "Anyone can upload a proof file." on storage.objects;
create policy "Anyone can upload a proof file."
  on storage.objects for insert
  with check (bucket_id = 'proofs');

drop policy if exists "Anyone can view proofs." on storage.objects;
create policy "Anyone can view proofs."
  on storage.objects for select
  using (bucket_id = 'proofs');

-- 7. Storage bucket for task thumbnails
insert into storage.buckets (id, name, public)
values ('task-thumbnails', 'task-thumbnails', true)
on conflict (id) do update
  set name = excluded.name,
      public = excluded.public;

drop policy if exists "Admins can upload task thumbnails." on storage.objects;
create policy "Admins can upload task thumbnails."
  on storage.objects for insert
  with check (bucket_id = 'task-thumbnails' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Admins can update task thumbnails." on storage.objects;
create policy "Admins can update task thumbnails."
  on storage.objects for update
  using (bucket_id = 'task-thumbnails' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Admins can delete task thumbnails." on storage.objects;
create policy "Admins can delete task thumbnails."
  on storage.objects for delete
  using (bucket_id = 'task-thumbnails' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Anyone can view task thumbnails." on storage.objects;
create policy "Anyone can view task thumbnails."
  on storage.objects for select
  using (bucket_id = 'task-thumbnails');

-- 8. Site Settings
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

insert into public.site_settings (key, value) values ('rewards_portal_status', '{"is_open": true}') on conflict (key) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "Anyone can read site settings." on public.site_settings;
create policy "Anyone can read site settings."
  on public.site_settings for select
  using (true);

drop policy if exists "Admins can update site settings." on public.site_settings;
create policy "Admins can update site settings."
  on public.site_settings for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Admins can insert site settings." on public.site_settings;
create policy "Admins can insert site settings."
  on public.site_settings for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
