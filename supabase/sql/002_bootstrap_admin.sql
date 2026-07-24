-- TakaCode - Bootstrap one admin account
-- 1) Replace EMAIL_PLACEHOLDER with your real email
-- 2) Run this after 001_roles_points_referrals.sql

with target as (
  select id
  from auth.users
  where email = 'EMAIL_PLACEHOLDER'
  limit 1
)
update auth.users u
set raw_app_meta_data = coalesce(u.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
from target
where u.id = target.id;

insert into public.user_profiles (id, role, points)
select id, 'admin', 1500
from auth.users
where email = 'EMAIL_PLACEHOLDER'
on conflict (id) do update
set role = 'admin',
    points = greatest(public.user_profiles.points, 1500);
