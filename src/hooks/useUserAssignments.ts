import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Assignment {
  id: string;
  skill_id: string;
  level: string;
  title: string;
  task_id: string | null;
  order_index: number;
  submission?: {
    id: string;
    status: string;
    user_answer: string | null;
    ai_feedback: any;
    score: number | null;
    submitted_at: string | null;
    completed_at: string | null;
  } | null;
}

export const useUserAssignments = (userId: string | undefined, skillSlug: string | undefined) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAssignments = async () => {
    if (!userId || !skillSlug) {
      setLoading(false);
      return;
    }

    try {
      // Get skill by slug
      const { data: skillData, error: skillError } = await supabase
        .from('skills')
        .select('id')
        .eq('slug', skillSlug)
        .single();

      if (skillError) throw skillError;

      // Get assignments for this skill
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .eq('skill_id', skillData.id)
        .order('order_index', { ascending: true });

      if (assignmentsError) throw assignmentsError;

      // Get user submissions for these assignments
      const assignmentIds = assignmentsData?.map(a => a.id) || [];
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('user_assignment_submissions')
        .select('*')
        .eq('user_id', userId)
        .in('assignment_id', assignmentIds);

      if (submissionsError) throw submissionsError;

      // Combine assignments with submissions
      const combinedData = assignmentsData?.map(assignment => ({
        ...assignment,
        submission: submissionsData?.find(s => s.assignment_id === assignment.id) || null
      }));

      setAssignments(combinedData || []);
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить задания',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [userId, skillSlug]);

  const submitAssignment = async (assignmentId: string, userAnswer: string) => {
    if (!userId) return { data: null, error: new Error('User not authenticated') };

    try {
      const { data, error } = await supabase
        .from('user_assignment_submissions')
        .upsert({
          user_id: userId,
          assignment_id: assignmentId,
          status: 'submitted',
          user_answer: userAnswer,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,assignment_id'
        })
        .select()
        .single();

      if (error) throw error;

      await fetchAssignments();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить задание',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const updateSubmissionStatus = async (
    assignmentId: string, 
    status: 'not_started' | 'in_progress' | 'submitted' | 'completed',
    aiFeedback?: any,
    score?: number
  ) => {
    if (!userId) return;

    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (aiFeedback !== undefined) updateData.ai_feedback = aiFeedback;
      if (score !== undefined) updateData.score = score;
      if (status === 'completed') updateData.completed_at = new Date().toISOString();

      const { error } = await supabase
        .from('user_assignment_submissions')
        .update(updateData)
        .eq('user_id', userId)
        .eq('assignment_id', assignmentId);

      if (error) throw error;

      await fetchAssignments();
    } catch (error: any) {
      console.error('Error updating submission status:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
    }
  };

  const getAssignmentByTaskId = (taskId: string): Assignment | undefined => {
    return assignments.find(a => a.task_id === taskId);
  };

  return { 
    assignments, 
    loading, 
    submitAssignment,
    updateSubmissionStatus,
    getAssignmentByTaskId,
    refetch: fetchAssignments 
  };
};
