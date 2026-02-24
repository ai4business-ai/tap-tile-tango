import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string | null;
  course_type: string;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useCourses = () => {
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses' as any)
        .select('*')
        .eq('is_published', true)
        .order('order_index');
      
      if (error) throw error;
      return (data || []) as unknown as Course[];
    },
  });

  return { courses, loading: isLoading, error };
};
