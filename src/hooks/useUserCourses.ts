import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Course } from './useCourses';

export interface UserCourse {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  last_lesson_id: string | null;
  progress_percent: number;
  environment: string;
  course: Course;
}

export const useUserCourses = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: userCourses = [], isLoading, error } = useQuery({
    queryKey: ['user-courses', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_courses' as any)
        .select('*, course:courses(*)')
        .eq('user_id', userId);
      
      if (error) throw error;
      return (data || []).map((uc: any) => ({
        ...uc,
        course: uc.course,
      })) as UserCourse[];
    },
    enabled: !!userId,
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!userId) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('user_courses' as any)
        .insert({ user_id: userId, course_id: courseId } as any)
        .select('*, course:courses(*)')
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-courses', userId] });
    },
  });

  const isEnrolled = (courseId: string) => userCourses.some(uc => uc.course_id === courseId);

  return { 
    userCourses, 
    loading: isLoading, 
    error, 
    enroll: enrollMutation.mutateAsync, 
    enrolling: enrollMutation.isPending,
    isEnrolled,
  };
};
