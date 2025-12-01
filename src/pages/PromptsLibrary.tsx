import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-24">
      {/* Purple Header Background - extends under the TopHeader */}
      <div className="bg-[#8277EC] pt-36 pb-16 -mt-28">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Готовые промпты</h1>
          <p className="text-white/90 text-base">Идеальные решения для каждого задания</p>
        </div>
      </div>

      {/* Skills List */}
      <div className="max-w-md mx-auto px-4 -mt-8">
        <div className="space-y-3">
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
    </div>
  );
};

export default PromptsLibrary;
