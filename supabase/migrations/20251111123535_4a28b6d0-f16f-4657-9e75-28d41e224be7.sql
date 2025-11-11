-- Create enum for assignment status
CREATE TYPE public.assignment_status AS ENUM ('not_started', 'in_progress', 'submitted', 'completed');

-- Create skills table (reference table for skill definitions)
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignments table (reference table for assignment definitions)
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('Basic', 'Pro', 'AI-Native')),
  title TEXT NOT NULL,
  task_id TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_skills table (user progress by skill)
CREATE TABLE public.user_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  current_level INTEGER NOT NULL DEFAULT 1 CHECK (current_level >= 1 AND current_level <= 3),
  target_level INTEGER NOT NULL DEFAULT 1 CHECK (target_level >= 1 AND target_level <= 3),
  progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  is_goal_achieved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Create user_assignment_submissions table (user answers to assignments)
CREATE TABLE public.user_assignment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  status assignment_status NOT NULL DEFAULT 'not_started',
  user_answer TEXT,
  ai_feedback JSONB,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  submitted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, assignment_id)
);

-- Enable RLS on all tables
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assignment_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skills (public read)
CREATE POLICY "Anyone can view skills"
  ON public.skills FOR SELECT
  USING (true);

-- RLS Policies for assignments (public read)
CREATE POLICY "Anyone can view assignments"
  ON public.assignments FOR SELECT
  USING (true);

-- RLS Policies for user_skills
CREATE POLICY "Users can view their own skills"
  ON public.user_skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills"
  ON public.user_skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills"
  ON public.user_skills FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_assignment_submissions
CREATE POLICY "Users can view their own submissions"
  ON public.user_assignment_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions"
  ON public.user_assignment_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
  ON public.user_assignment_submissions FOR UPDATE
  USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_skills_updated_at
  BEFORE UPDATE ON public.user_skills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_assignment_submissions_updated_at
  BEFORE UPDATE ON public.user_assignment_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to recalculate skill progress
CREATE OR REPLACE FUNCTION public.recalculate_skill_progress(p_user_id UUID, p_skill_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_assignments INTEGER;
  v_completed_assignments INTEGER;
  v_max_level INTEGER;
  v_progress_percent INTEGER;
BEGIN
  -- Count total assignments for this skill
  SELECT count(*) INTO v_total_assignments
  FROM assignments
  WHERE skill_id = p_skill_id;
  
  -- Count completed assignments
  SELECT count(*) INTO v_completed_assignments
  FROM user_assignment_submissions uas
  JOIN assignments a ON a.id = uas.assignment_id
  WHERE uas.user_id = p_user_id
    AND a.skill_id = p_skill_id
    AND uas.status = 'completed';
  
  -- Determine maximum completed level
  SELECT max(
    CASE 
      WHEN a.level = 'Basic' THEN 1
      WHEN a.level = 'Pro' THEN 2
      WHEN a.level = 'AI-Native' THEN 3
      ELSE 0
    END
  ) INTO v_max_level
  FROM user_assignment_submissions uas
  JOIN assignments a ON a.id = uas.assignment_id
  WHERE uas.user_id = p_user_id
    AND a.skill_id = p_skill_id
    AND uas.status = 'completed';
  
  -- Calculate progress percentage
  v_progress_percent := CASE 
    WHEN v_total_assignments > 0 
    THEN (v_completed_assignments::FLOAT / v_total_assignments * 100)::INTEGER
    ELSE 0
  END;
  
  -- Update user_skills
  UPDATE user_skills
  SET 
    current_level = COALESCE(v_max_level, 1),
    progress_percent = v_progress_percent,
    is_goal_achieved = (COALESCE(v_max_level, 1) >= target_level),
    updated_at = now()
  WHERE user_id = p_user_id AND skill_id = p_skill_id;
END;
$$;

-- Trigger function to recalculate progress on submission updates
CREATE OR REPLACE FUNCTION public.trigger_recalculate_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_skill_id UUID;
BEGIN
  -- Get skill_id for the assignment
  SELECT skill_id INTO v_skill_id
  FROM assignments
  WHERE id = NEW.assignment_id;
  
  -- If status changed to completed or updated
  IF NEW.status = 'completed' OR TG_OP = 'UPDATE' THEN
    PERFORM recalculate_skill_progress(NEW.user_id, v_skill_id);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_assignment_submission_change
  AFTER INSERT OR UPDATE ON public.user_assignment_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_recalculate_progress();

-- Function to initialize user skills for new users
CREATE OR REPLACE FUNCTION public.initialize_user_skills(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create user_skills records for all skills
  INSERT INTO user_skills (user_id, skill_id, current_level, target_level, progress_percent, is_goal_achieved)
  SELECT 
    p_user_id,
    id,
    1, -- initial level Basic
    1, -- initial goal Basic
    0, -- 0% progress
    false
  FROM skills
  ON CONFLICT (user_id, skill_id) DO NOTHING;
END;
$$;

-- Insert skills data
INSERT INTO public.skills (name, slug, order_index) VALUES
('Коммуникация и работа в команде', 'communication', 1),
('Управление знаниями', 'knowledge-management', 2),
('Создание контента', 'content-creation', 3),
('Решение задач и принятие решений', 'problem-solving', 4),
('Исследования и обработка информации', 'research', 5),
('Автоматизация процессов', 'automation', 6),
('Анализ и визуализация данных', 'data-analysis', 7),
('Продуктивность', 'productivity', 8);

-- Insert assignments for "Коммуникация и работа в команде"
INSERT INTO public.assignments (skill_id, level, title, task_id, order_index)
SELECT 
  (SELECT id FROM skills WHERE slug = 'communication'),
  'Basic',
  'Подготовить ответ клиенту в нужном тоне',
  'client-response',
  1
UNION ALL
SELECT 
  (SELECT id FROM skills WHERE slug = 'communication'),
  'Basic',
  'Создать agenda и follow-up встречи',
  'meeting-agenda',
  2
UNION ALL
SELECT 
  (SELECT id FROM skills WHERE slug = 'communication'),
  'Basic',
  'Сформулировать конструктивный feedback',
  'feedback-colleagues',
  3;

-- Insert assignments for "Исследования и обработка информации"
INSERT INTO public.assignments (skill_id, level, title, task_id, order_index)
SELECT 
  (SELECT id FROM skills WHERE slug = 'research'),
  'Basic',
  'Анализ объемного документа',
  'document-analysis',
  1;

-- Insert placeholder assignments for other skills (can be filled in later)
INSERT INTO public.assignments (skill_id, level, title, task_id, order_index)
SELECT 
  (SELECT id FROM skills WHERE slug = 'knowledge-management'),
  'Basic',
  'Создать базу знаний',
  NULL,
  1
UNION ALL
SELECT 
  (SELECT id FROM skills WHERE slug = 'content-creation'),
  'Basic',
  'Написать статью для блога',
  NULL,
  1
UNION ALL
SELECT 
  (SELECT id FROM skills WHERE slug = 'problem-solving'),
  'Basic',
  'Решить бизнес-кейс',
  NULL,
  1
UNION ALL
SELECT 
  (SELECT id FROM skills WHERE slug = 'automation'),
  'Basic',
  'Автоматизировать повторяющуюся задачу',
  NULL,
  1
UNION ALL
SELECT 
  (SELECT id FROM skills WHERE slug = 'data-analysis'),
  'Basic',
  'Проанализировать данные продаж',
  NULL,
  1
UNION ALL
SELECT 
  (SELECT id FROM skills WHERE slug = 'productivity'),
  'Basic',
  'Оптимизировать рабочий процесс',
  NULL,
  1;