ALTER TABLE public.user_projects
ADD COLUMN first_euro_at timestamptz DEFAULT NULL,
ADD COLUMN has_declared_first_euro boolean DEFAULT false;
