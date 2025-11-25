import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useGuestMode } from './useGuestMode';
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

export const useUserSkills = (userId: string | undefined) => {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const guestMode = useGuestMode();

  const fetchUserSkills = async () => {
    // For guests - show demo data
    if (!userId) {
      const guestSkills = guestMode.getSkills();
      const mappedSkills = guestSkills.map(skill => ({
        id: skill.id,
        user_id: 'guest',
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
      setSkills(mappedSkills);
      setLoading(false);
      return;
    }

    // For authenticated users: show demo data immediately, then load real data in background
    const guestSkills = guestMode.getSkills();
    const demoMappedSkills = guestSkills.map(skill => ({
      id: skill.id,
      user_id: userId,
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
    
    setSkills(demoMappedSkills);
    setLoading(false);

    // Now try to load real data in background
    try {
      const currentEnvironment = getCurrentEnvironment();
      
      // Simple query without JOIN
      const { data: userSkillsData, error: userSkillsError } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', userId)
        .eq('environment', currentEnvironment);

      if (userSkillsError) throw userSkillsError;

      // If no user skills found, initialize them
      if (!userSkillsData || userSkillsData.length === 0) {
        await supabase.rpc('initialize_user_skills', {
          p_user_id: userId,
          p_environment: currentEnvironment
        });

        // Fetch again after initialization
        const { data: newData, error: newError } = await supabase
          .from('user_skills')
          .select('*')
          .eq('user_id', userId)
          .eq('environment', currentEnvironment);

        if (newError || !newData) {
          return; // Keep demo data
        }

        // Load skills separately
        const { data: skillsData } = await supabase
          .from('skills')
          .select('*');

        if (!skillsData) return;

        // Combine on client
        const combined = newData.map(us => ({
          ...us,
          skill: skillsData.find(s => s.id === us.skill_id)
        })).filter(us => us.skill)
          .sort((a, b) => (a.skill?.order_index || 0) - (b.skill?.order_index || 0));

        if (combined.length > 0) {
          setSkills(combined);
        }
        return;
      }

      // Load skills separately
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*');

      if (!skillsData) return;

      // Combine on client
      const combined = userSkillsData.map(us => ({
        ...us,
        skill: skillsData.find(s => s.id === us.skill_id)
      })).filter(us => us.skill)
        .sort((a, b) => (a.skill?.order_index || 0) - (b.skill?.order_index || 0));

      if (combined.length > 0) {
        setSkills(combined);
      }
    } catch (error: any) {
      console.warn('Failed to load user skills from DB, using demo data:', error);
      // Demo data already shown, nothing to do
    }
  };

  useEffect(() => {
    // Reset state when userId changes to prevent mixing demo/real data
    setSkills([]);
    setLoading(true);
    fetchUserSkills();
  }, [userId]);

  const updateTargetLevel = async (skillId: string, targetLevel: number) => {
    if (!userId) {
      // Гости не могут изменять целевой уровень
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
      console.warn('Invalid skill ID format, skipping update and reloading real data:', skillId);
      await fetchUserSkills();
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
