create or replace function public.public_leaderboard(p_limit integer default 50)
returns jsonb
language sql stable security definer
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(row), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'id', p.id,
      'rank', row_number() over (order by p.points desc, p.updated_at asc),
      'public_name', case when btrim(p.public_name) = '' then 'Membre anonyme' else p.public_name end,
      'points', p.points,
      'grade', p.grade,
      'avatar_url', p.avatar_url,
      'country_code', p.country_code
    ) as row
    from public.user_profiles p
    join auth.users u on u.id = p.id
    where p.points > 0
      and lower(coalesce(p.role, '')) <> 'admin'
      and lower(coalesce(u.raw_app_meta_data ->> 'role', '')) <> 'admin'
    order by p.points desc, p.updated_at asc
    limit greatest(1, least(coalesce(p_limit, 50), 100))
  ) ranked;
$$;

revoke all on function public.public_leaderboard(integer) from public;
grant execute on function public.public_leaderboard(integer) to anon, authenticated;
