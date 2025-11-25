import { useAuth } from './useAuth';
import { useGuestMode } from './useGuestMode';
import { demoSkills } from '@/data/demoSkills';
import { supabase } from '@/integrations/supabase/client';

// Only unlocked skills for guests
const UNLOCKED_SKILL_SLUGS = ['communication', 'research'];

export const useNextAssignment = () => {
  const { user } = useAuth();
  const { getAssignments } = useGuestMode();

  const getNextTaskPath = async (): Promise<string> => {
    if (!user) {
      // Guest mode - only check unlocked skills
      const unlockedSkills = demoSkills.filter(skill => 
        UNLOCKED_SKILL_SLUGS.includes(skill.slug)
      );
      
      for (const skill of unlockedSkills) {
        const assignments = getAssignments(skill.slug);
        const nextAssignment = assignments.find(
          a => a.task_id !== null && 
               (!a.submission || (a.submission.status !== 'completed' && a.submission.status !== 'submitted'))
        );
        
        if (nextAssignment && nextAssignment.task_id) {
          return `/task/${nextAssignment.task_id}`;
        }
      }
    } else {
      // Authenticated user - fetch from database
      try {
        const { data: assignments, error } = await supabase
          .from('assignments')
          .select(`
            id,
            task_id,
            skill_id,
            skills!inner(is_locked),
            user_assignment_submissions(status)
          `)
          .eq('skills.is_locked', false)
          .not('task_id', 'is', null)
          .order('order_index', { ascending: true });

        if (error) throw error;

        // Find first incomplete assignment
        const nextAssignment = assignments?.find(a => {
          const submissions = a.user_assignment_submissions as any[];
          return !submissions || submissions.length === 0 || 
                 (submissions[0].status !== 'completed' && submissions[0].status !== 'submitted');
        });

        if (nextAssignment && nextAssignment.task_id) {
          return `/task/${nextAssignment.task_id}`;
        }
      } catch (error) {
        console.error('Error fetching next assignment:', error);
      }
    }
    
    // Fallback - go to tasks page
    return '/tasks';
  };

  return { getNextTaskPath };
};
