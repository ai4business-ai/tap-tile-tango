import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { demoSkills } from '@/data/demoSkills';
import { getCurrentEnvironment } from '@/lib/environment';

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

// Helper to map demo skills to UserSkill format
const mapDemoToUserSkills = (userId: string | undefined): UserSkill[] => {
  return demoSkills.map(skill => ({
    id: skill.id,
    user_id: userId || 'guest',
    skill_id: skill.id,
    current_level: skill.current_level,
    target_level: skill.target_level,
    progress_percent: skill.progress_percent,
    is_goal_achieved: skill.is_goal_achieved,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    skill: {
      id: skill.id,
      name: skill.name,
      slug: skill.slug,
      description: skill.description,
      order_index: skill.order_index,
    },
  }));
};

export const useUserSkills = (userId: string | undefined) => {
  // IMMEDIATELY show demo data - no loading state!
  const [skills, setSkills] = useState<UserSkill[]>(() => mapDemoToUserSkills(userId));
  const [isRealData, setIsRealData] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Always show demo data first
    setSkills(mapDemoToUserSkills(userId));
    setIsRealData(false);

    // If no user, just use demo data
    if (!userId) return;

    // Background load of real data
    const loadRealData = async () => {
      try {
        const currentEnvironment = getCurrentEnvironment();

        // Two simple parallel queries without JOINs
        const [userSkillsRes, skillsRes] = await Promise.all([
          supabase
            .from('user_skills')
            .select('*')
            .eq('user_id', userId)
            .eq('environment', currentEnvironment),
          supabase
            .from('skills')
            .select('*')
        ]);

        // If no user skills, initialize them
        if (!userSkillsRes.data || userSkillsRes.data.length === 0) {
          await supabase.rpc('initialize_user_skills', {
            p_user_id: userId,
            p_environment: currentEnvironment
          });

          // Fetch again after initialization
          const [newUserSkillsRes, newSkillsRes] = await Promise.all([
            supabase
              .from('user_skills')
              .select('*')
              .eq('user_id', userId)
              .eq('environment', currentEnvironment),
            supabase
              .from('skills')
              .select('*')
          ]);

          if (!newUserSkillsRes.data?.length || !newSkillsRes.data?.length) return;

          // Combine on client side
          const combined = newUserSkillsRes.data
            .map(us => ({
              ...us,
              skill: newSkillsRes.data.find((s: Skill) => s.id === us.skill_id)
            }))
            .filter(us => us.skill)
            .sort((a, b) => (a.skill?.order_index || 0) - (b.skill?.order_index || 0));

          if (combined.length > 0) {
            setSkills(combined as UserSkill[]);
            setIsRealData(true);
          }
          return;
        }

        if (!skillsRes.data?.length) return;

        // Combine on client side
        const combined = userSkillsRes.data
          .map(us => ({
            ...us,
            skill: skillsRes.data.find((s: Skill) => s.id === us.skill_id)
          }))
          .filter(us => us.skill)
          .sort((a, b) => (a.skill?.order_index || 0) - (b.skill?.order_index || 0));

        if (combined.length > 0) {
          setSkills(combined as UserSkill[]);
          setIsRealData(true);
        }
      } catch (error: any) {
        // Silently use demo data - error is not critical
        console.warn('Using demo data:', error);
      }
    };

    loadRealData();
  }, [userId]);

  const updateTargetLevel = async (skillId: string, targetLevel: number) => {
    if (!userId) {
      toast({
        title: 'Доступно только для зарегистрированных',
        description: 'Зарегистрируйтесь, чтобы изменять целевой уровень навыков',
        variant: 'destructive',
      });
      return;
    }

    // Validate UUID format to prevent using demo skill IDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(skillId)) {
      console.warn('Invalid skill ID format, using demo data:', skillId);
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

      // Update local state
      setSkills(prevSkills => 
        prevSkills.map(skill => 
          skill.skill_id === skillId 
            ? { ...skill, target_level: targetLevel }
            : skill
        )
      );
      
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
    loading: false, // ALWAYS false - data is always available!
    isRealData,
    updateTargetLevel
  };
};
