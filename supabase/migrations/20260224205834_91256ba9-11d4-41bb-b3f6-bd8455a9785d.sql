
-- Enums
CREATE TYPE course_type AS ENUM ('trainer', 'theory_practice', 'video', 'quiz');
CREATE TYPE lesson_type AS ENUM ('theory', 'practice', 'video', 'quiz', 'trainer_task');
CREATE TYPE lesson_status AS ENUM ('not_started', 'in_progress', 'completed');

-- Courses
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  course_type course_type NOT NULL DEFAULT 'theory_practice',
  is_published BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Course modules
CREATE TABLE public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Course lessons
CREATE TABLE public.course_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  lesson_type lesson_type NOT NULL DEFAULT 'theory',
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  trainer_skill_id UUID REFERENCES public.skills(id),
  trainer_assignment_id UUID REFERENCES public.assignments(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User courses (enrollment + progress)
CREATE TABLE public.user_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_lesson_id UUID REFERENCES public.course_lessons(id),
  progress_percent INTEGER NOT NULL DEFAULT 0,
  environment environment_type NOT NULL DEFAULT 'dev',
  UNIQUE(user_id, course_id, environment)
);

-- User lesson progress
CREATE TABLE public.user_lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  status lesson_status NOT NULL DEFAULT 'not_started',
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  environment environment_type NOT NULL DEFAULT 'dev',
  UNIQUE(user_id, lesson_id, environment)
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS: courses, modules, lessons — public read
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Anyone can view course modules" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Anyone can view course lessons" ON public.course_lessons FOR SELECT USING (true);

-- RLS: user_courses — own records only
CREATE POLICY "Users can view own courses" ON public.user_courses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll in courses" ON public.user_courses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own courses" ON public.user_courses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own courses" ON public.user_courses FOR DELETE USING (auth.uid() = user_id);

-- RLS: user_lesson_progress — own records only
CREATE POLICY "Users can view own lesson progress" ON public.user_lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lesson progress" ON public.user_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress" ON public.user_lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-- Updated_at triggers
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_modules_updated_at BEFORE UPDATE ON public.course_modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON public.course_lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed: AI Trainer course
INSERT INTO public.courses (title, slug, description, course_type, is_published, order_index)
VALUES ('AI Тренажер', 'ai-trainer', 'Практический тренажер навыков работы с AI — от базовых промптов до продвинутых техник', 'trainer', true, 1);
