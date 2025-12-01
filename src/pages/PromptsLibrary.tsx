import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { skillsPromptsData } from '@/data/promptsData';
import { getSkillIcon, getSkillColor } from '@/utils/skillIconsDemo';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SkillWithCount {
  slug: string;
  name: string;
  assignmentCount: number;
}

const PromptsLibrary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const getInitials = () => {
    if (!user) return 'G';
    if (user.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email?.[0].toUpperCase() || 'G';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-24">
      {/* Glass Header - Fixed on top of purple background */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto px-4 pt-4">
          <div className="glass-header rounded-3xl px-6">
            <div className="flex items-center justify-between py-3">
              {/* Left: hakku.ai branding */}
              <div className="flex flex-col">
                <span className="font-source-serif text-base font-semibold text-gray-900">
                  hakku.ai
                </span>
                <span className="text-[10px] text-gray-900">
                  AI training app
                </span>
              </div>

              {/* Center: Company Logo Placeholder */}
              <div className="absolute left-1/2 -translate-x-1/2 text-center max-w-[100px]">
                <p className="text-[10px] text-gray-900 font-medium leading-tight">
                  Здесь лого<br/>вашей компании
                </p>
              </div>
              
              {/* Right: User Avatar Button */}
              <button 
                className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-[#F37168] hover:bg-white/40 transition-all"
              >
                {user?.user_metadata?.avatar_url ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.user_metadata.avatar_url} alt="User" />
                    <AvatarFallback className="bg-transparent text-gray-900 text-sm font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <span className="text-gray-900 text-sm font-semibold">
                    {getInitials()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Purple Header Background - extends to top, header floats on it */}
      <div className="bg-[#8277EC] px-6 pt-36 pb-16 -mt-28">
        <div className="max-w-md mx-auto">
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
