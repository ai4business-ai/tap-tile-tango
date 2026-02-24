import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ContentBlock {
  type: 'heading' | 'text' | 'list' | 'callout';
  content?: string;
  items?: string[];
  variant?: string;
}

export interface LessonContentJson {
  duration?: string;
  blocks?: ContentBlock[];
  homework?: {
    title: string;
    tasks: string[];
  };
  tools?: string[];
  goal?: string;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  lesson_type: string;
  order_index: number;
  content_json: LessonContentJson;
  trainer_skill_id: string | null;
  trainer_assignment_id: string | null;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons: CourseLesson[];
}

export interface CourseWithContent {
  id: string;
  title: string;
  slug: string;
  description: string;
  course_type: string;
  modules: CourseModule[];
  totalLessons: number;
}

export const useCourseContent = (courseSlug: string | undefined) => {
  return useQuery({
    queryKey: ['course-content', courseSlug],
    queryFn: async (): Promise<CourseWithContent | null> => {
      if (!courseSlug) return null;

      // Fetch course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', courseSlug)
        .single();

      if (courseError || !course) return null;

      // Fetch modules
      const { data: modules, error: modError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', course.id)
        .order('order_index');

      if (modError) return null;

      // Fetch all lessons for these modules
      const moduleIds = (modules || []).map((m: any) => m.id);
      const { data: lessons, error: lessError } = await supabase
        .from('course_lessons')
        .select('*')
        .in('module_id', moduleIds)
        .order('order_index');

      if (lessError) return null;

      const lessonsArray = (lessons || []) as any[];
      const modulesWithLessons: CourseModule[] = (modules || []).map((mod: any) => ({
        ...mod,
        lessons: lessonsArray
          .filter((l) => l.module_id === mod.id)
          .map((l) => ({ ...l, content_json: l.content_json as LessonContentJson })),
      }));

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        course_type: course.course_type,
        modules: modulesWithLessons,
        totalLessons: lessonsArray.length,
      };
    },
    enabled: !!courseSlug,
  });
};
