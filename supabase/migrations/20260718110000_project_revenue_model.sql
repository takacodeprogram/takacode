-- Modele de revenu vise pour le projet (visible des la creation)
alter table public.user_projects
  add column if not exists revenue_model text not null default ''
  check (revenue_model in ('', 'vente', 'abonnement', 'publicite', 'affiliation', 'freelance'));
