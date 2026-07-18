-- Exclut TOUS les admins du classement public.
--
-- Bug corrige : lib/auth.ts reconnait un admin par 3 sources (role profil,
-- app_metadata, email bootstrap). Le RPC public_leaderboard n'excluait que le
-- role profil : un admin dont user_profiles.role vaut encore 'user' (admin via
-- app_metadata pose par 002_bootstrap_admin.sql) apparaissait au classement —
-- avec les 1500 points offerts par le bootstrap, il trônait en tete.

-- 1. Synchronise le role profil depuis app_metadata (aligne les 2 sources).
update public.user_profiles p
set role = 'admin'
from auth.users u
where u.id = p.id
  and lower(coalesce(u.raw_app_meta_data ->> 'role', '')) = 'admin'
  and lower(coalesce(p.role, '')) <> 'admin';

-- 2. RPC : exclusion par role profil ET par app_metadata.
create or replace function public.public_leaderboard(p_limit integer default 50)
returns jsonb
language sql stable security definer
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(row), '[]'::jsonb)
  from (
    select jsonb_build_object(
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
