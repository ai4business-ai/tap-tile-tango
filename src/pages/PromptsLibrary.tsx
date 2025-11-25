import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { skillsPromptsData } from '@/data/promptsData';
import { getSkillIcon, getSkillColor } from '@/utils/skillIcons';
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
        // Fetch skills from database
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('id, name, slug')
          .order('order_index');

        if (skillsError) throw skillsError;

        // For each skill, count assignments
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
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] px-6 pt-12 pb-16">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Готовые промпты</h1>
          </div>
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
                    <div className={`w-16 h-16 rounded-2xl ${getSkillColor(skill.slug)} flex items-center justify-center shadow-md flex-shrink-0`}>
                      {getSkillIcon(skill.slug)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base mb-1">
                        {skill.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {skill.assignmentCount} заданий
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
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
