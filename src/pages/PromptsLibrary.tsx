import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { skillsPromptsData } from '@/data/promptsData';
import { getSkillIcon, getSkillColor } from '@/utils/skillIconsDemo';
import { supabase } from '@/integrations/supabase/client';

interface SkillWithCount {
  slug: string;
  name: string;
  assignmentCount: number;
}

const PromptsLibrary = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<SkillWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('id, name, slug')
          .order('order_index');

        if (skillsError) throw skillsError;

        const skillsWithCounts = await Promise.all(
          (skillsData || []).map(async (skill) => {
            const { count } = await supabase
              .from('assignments')
              .select('*', { count: 'exact', head: true })
              .eq('skill_id', skill.id);

            return {
              slug: skill.slug,
              name: skill.name,
              assignmentCount: count || 0,
            };
          })
        );

        setSkills(skillsWithCounts);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  const totalPrompts = skills.reduce((sum, s) => sum + s.assignmentCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 px-4 pb-24 md:max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 py-6">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 glass-subtle rounded-2xl flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6 text-[#111827]" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-[#111827]">Готовые промпты</h1>
          <p className="text-sm text-[#4b5563]">
            Идеальные решения для каждого задания
          </p>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        {/* Basic Prompts Card */}
        <Card
          className="border border-[#F37168]/30 shadow-lg bg-white cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
          onClick={() => navigate('/prompts/basic')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#111827] text-base">
                Базовые промпты
              </h3>
              <ChevronRight className="w-5 h-5 text-[#F37168] flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        {skills
          .filter((skill) => skillsPromptsData.some((s) => s.slug === skill.slug))
          .map((skill) => (
            <Card
              key={skill.slug}
              className="border-0 shadow-lg bg-white cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
              onClick={() => navigate(`/prompts/${skill.slug}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div 
                    className={`w-16 h-16 rounded-2xl ${getSkillColor(skill.slug)} flex items-center justify-center shadow-lg flex-shrink-0`}
                    style={{ boxShadow: '0 8px 16px rgba(25, 86, 255, 0.4)' }}
                  >
                    {getSkillIcon(skill.slug)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#111827] text-base mb-1">
                      {skill.name}
                    </h3>
                    <p className="text-sm text-[#F37168] font-medium">
                      {skill.assignmentCount} заданий
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#F37168] flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default PromptsLibrary;
