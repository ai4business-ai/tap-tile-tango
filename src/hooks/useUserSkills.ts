import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
}

interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  current_level: number;
  target_level: number;
  progress_percent: number;
  is_goal_achieved: boolean;
  created_at: string;
  updated_at: string;
  skill: Skill;
}

export const useUserSkills = (userId: string | undefined) => {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [localSkills, setLocalSkills] = useLocalStorage<any[]>('user_skills', []);

  const fetchUserSkills = async () => {
    if (!userId) {
      // Load from localStorage for unauthenticated users
      try {
        const { data: allSkills } = await supabase
          .from('skills')
          .select('*')
          .order('order_index', { ascending: true });

        if (allSkills) {
          const localData = localSkills.find(ls => ls.skillId) ? localSkills : [];
          const skillsWithProgress = allSkills.map(skill => {
            const localProgress = localData.find(ls => ls.skillId === skill.id);
            return {
              id: `local-${skill.id}`,
              user_id: 'local',
              skill_id: skill.id,
              current_level: 1,
              target_level: localProgress?.targetLevel || 1,
              progress_percent: 0,
              is_goal_achieved: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              skill: skill
            };
          });
          setSkills(skillsWithProgress);
        }
      } catch (error) {
        console.error('Error loading skills:', error);
      }
      setLoading(false);
      return;
    }

    try {
      // First, try to get user skills
      const { data: userSkillsData, error: userSkillsError } = await supabase
        .from('user_skills')
        .select(`
          *,
          skill:skills(*)
        `)
        .eq('user_id', userId)
        .order('skill.order_index', { ascending: true });

      if (userSkillsError) throw userSkillsError;

      // If no user skills found, initialize them
      if (!userSkillsData || userSkillsData.length === 0) {
        const { error: initError } = await supabase.rpc('initialize_user_skills', {
          p_user_id: userId
        });

        if (initError) throw initError;

        // Fetch again after initialization
        const { data: newData, error: newError } = await supabase
          .from('user_skills')
          .select(`
            *,
            skill:skills(*)
          `)
          .eq('user_id', userId)
          .order('skill.order_index', { ascending: true });

        if (newError) throw newError;
        setSkills(newData || []);
      } else {
        setSkills(userSkillsData);
      }
    } catch (error: any) {
      console.error('Error fetching user skills:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить навыки',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSkills();
  }, [userId]);

  const updateTargetLevel = async (skillId: string, targetLevel: number) => {
    if (!userId) {
      // Save to localStorage for unauthenticated users
      const existing = localSkills.find(ls => ls.skillId === skillId);
      if (existing) {
        setLocalSkills(
          localSkills.map(ls => 
            ls.skillId === skillId 
              ? { ...ls, targetLevel, updatedAt: new Date().toISOString() }
              : ls
          )
        );
      } else {
        setLocalSkills([
          ...localSkills,
          { skillId, targetLevel, updatedAt: new Date().toISOString() }
        ]);
      }
      
      // Update local state
      setSkills(skills.map(s => 
        s.skill_id === skillId 
          ? { ...s, target_level: targetLevel }
          : s
      ));
      
      toast({
        title: 'Сохранено локально',
        description: 'Войдите, чтобы сохранить прогресс в облаке',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_skills')
        .update({ 
          target_level: targetLevel,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('skill_id', skillId);

      if (error) throw error;

      await fetchUserSkills();
      
      toast({
        title: 'Успешно',
        description: 'Цель обновлена',
      });
    } catch (error: any) {
      console.error('Error updating target level:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить цель',
        variant: 'destructive',
      });
    }
  };

  return { 
    skills, 
    loading, 
    updateTargetLevel, 
    refetch: fetchUserSkills 
  };
};
