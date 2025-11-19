import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LocalSkillProgress {
  skillId: string;
  targetLevel: number;
  updatedAt: string;
}

interface LocalAssignmentSubmission {
  assignmentId: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'completed';
  userAnswer: string | null;
  submittedAt: string | null;
}

export const useProgressSync = (userId: string | undefined) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const syncProgress = async () => {
    if (!userId) return;

    setIsSyncing(true);
    try {
      // Get local data
      const localSkills = localStorage.getItem('user_skills');
      const localSubmissions = localStorage.getItem('user_submissions');

      if (localSkills) {
        const skills: LocalSkillProgress[] = JSON.parse(localSkills);
        
        for (const skill of skills) {
          await supabase
            .from('user_skills')
            .upsert({
              user_id: userId,
              skill_id: skill.skillId,
              target_level: skill.targetLevel,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,skill_id'
            });
        }
      }

      if (localSubmissions) {
        const submissions: LocalAssignmentSubmission[] = JSON.parse(localSubmissions);
        
        for (const submission of submissions) {
          await supabase
            .from('user_assignment_submissions')
            .upsert({
              user_id: userId,
              assignment_id: submission.assignmentId,
              status: submission.status,
              user_answer: submission.userAnswer,
              submitted_at: submission.submittedAt,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,assignment_id'
            });
        }
      }

      // Clear local storage after sync
      localStorage.removeItem('user_skills');
      localStorage.removeItem('user_submissions');

      toast({
        title: 'Синхронизировано',
        description: 'Ваш прогресс успешно сохранен',
      });
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: 'Ошибка синхронизации',
        description: 'Не удалось синхронизировать прогресс',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (userId) {
      const hasLocalData = 
        localStorage.getItem('user_skills') || 
        localStorage.getItem('user_submissions');
      
      if (hasLocalData) {
        syncProgress();
      }
    }
  }, [userId]);

  return { syncProgress, isSyncing };
};
