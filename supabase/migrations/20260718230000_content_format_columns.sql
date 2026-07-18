ALTER TABLE public.user_projects
ADD COLUMN IF NOT EXISTS description_format text not null default 'text'
  check (description_format in ('text', 'markdown', 'html'));

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS bio_format text not null default 'text'
  check (bio_format in ('text', 'markdown', 'html'));
