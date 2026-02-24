import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LessonProgress {
  id: string;
  lesson_id: string;
  user_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at: string | null;
  score: number | null;
}

export const useLessonProgress = (userId: string | undefined, lessonIds: string[]) => {
  return useQuery({
    queryKey: ['lesson-progress', userId, lessonIds],
    queryFn: async (): Promise<Record<string, LessonProgress>> => {
      if (!userId || lessonIds.length === 0) return {};

      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .in('lesson_id', lessonIds);

      if (error) return {};

      const map: Record<string, LessonProgress> = {};
      (data || []).forEach((p: any) => {
        map[p.lesson_id] = p as LessonProgress;
      });
      return map;
    },
    enabled: !!userId && lessonIds.length > 0,
  });
};

export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, lessonId }: { userId: string; lessonId: string }) => {
      // Upsert lesson progress
      const { error } = await supabase
        .from('user_lesson_progress')
        .upsert(
          {
            user_id: userId,
            lesson_id: lessonId,
            status: 'completed' as const,
            completed_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_id,environment' }
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-courses'] });
    },
  });
};
