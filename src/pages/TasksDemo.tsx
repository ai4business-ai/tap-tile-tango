import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { getSkillIcon, getSkillColor } from "@/utils/skillIconsDemo";

interface Skill {
  id: string;
  name: string;
  slug: string;
  is_locked: boolean;
  assignment_count: number;
}

const TasksDemo = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Fetch skills with assignment counts
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('id, name, slug, is_locked, order_index')
          .order('order_index', { ascending: true });

        if (skillsError) throw skillsError;

        // Fetch assignment counts for each skill
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('assignments')
          .select('skill_id');

        if (assignmentsError) throw assignmentsError;

        // Count assignments per skill
        const assignmentCounts = assignmentsData.reduce((acc, curr) => {
          acc[curr.skill_id] = (acc[curr.skill_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Combine data
        const skillsWithCounts = skillsData.map(skill => ({
          ...skill,
          assignment_count: assignmentCounts[skill.id] || 0,
        }));

        setSkills(skillsWithCounts);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleTaskClick = (slug: string, isLocked: boolean) => {
    if (isLocked) {
      return;
    }
    navigate(`/skill-assignments/${slug}`);
  };

  const totalAssignments = skills.reduce((sum, s) => sum + s.assignment_count, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center py-8">Загрузка...</div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-semibold text-[#111827]">Мои задания</h1>
          <p className="text-sm text-[#F37168] font-medium">
            {totalAssignments} заданий
          </p>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        {skills.map((skill) => (
          <Card
            key={skill.id}
            onClick={() => handleTaskClick(skill.slug, skill.is_locked)}
            className={`border-0 shadow-lg bg-white transition-all ${
              skill.is_locked
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:shadow-xl hover:-translate-y-1"
            }`}
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
                    {skill.assignment_count} заданий
                  </p>
                </div>
                {skill.is_locked ? (
                  <Lock className="w-5 h-5 text-[#111827] flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#F37168] flex-shrink-0" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TasksDemo;
