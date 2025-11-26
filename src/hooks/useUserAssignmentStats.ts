import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentEnvironment } from '@/lib/environment';

interface AssignmentStats {
  totalAssignments: number;
  completedAssignments: number;
  completionPercentage: number;
}

export const useUserAssignmentStats = (userId: string | undefined) => {
  const [stats, setStats] = useState<AssignmentStats>({
    totalAssignments: 0,
    completedAssignments: 0,
    completionPercentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total assignments count
        const { count: totalCount, error: totalError } = await supabase
          .from('assignments')
          .select('*', { count: 'exact', head: true });

        if (totalError) throw totalError;

        let completedCount = 0;

        // Get completed assignments count only if user is authenticated
        if (userId) {
          const environment = getCurrentEnvironment();
          const { count, error: completedError } = await supabase
            .from('user_assignment_submissions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('status', 'completed')
            .eq('environment', environment);

          if (completedError) throw completedError;
          completedCount = count || 0;
        }

        const total = totalCount || 0;
        const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

        setStats({
          totalAssignments: total,
          completedAssignments: completedCount,
          completionPercentage: percentage,
        });
      } catch (error) {
        console.error('Error fetching assignment stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, loading };
};
