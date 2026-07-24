create or replace function public.exec_sql(sql text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  execute sql;
end;
$$;

revoke all on function public.exec_sql(text) from public;
grant execute on function public.exec_sql(text) to service_role;
