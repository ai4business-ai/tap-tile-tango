import { useAuth } from './useAuth';
import { useGuestMode } from './useGuestMode';
import { demoSkills } from '@/data/demoSkills';

export const useNextAssignment = () => {
  const { user } = useAuth();
  const { getAssignments } = useGuestMode();

  const getNextTaskPath = (): string => {
    if (!user) {
      // Guest mode - find first incomplete assignment that is not locked
      for (const skill of demoSkills) {
        const assignments = getAssignments(skill.slug);
        const nextAssignment = assignments.find(
          a => a.task_id !== null && 
               a.submission.status !== 'completed' && 
               a.submission.status !== 'submitted'
        );
        
        if (nextAssignment && nextAssignment.task_id) {
          return `/task-detail?taskId=${nextAssignment.task_id}`;
        }
      }
    }
    
    // Fallback - go to tasks page
    return '/tasks';
  };

  return { getNextTaskPath };
};
