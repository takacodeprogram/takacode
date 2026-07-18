ALTER TABLE public.user_lesson_progress
ADD COLUMN project_id uuid REFERENCES public.user_projects(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_project_id ON public.user_lesson_progress(project_id);
