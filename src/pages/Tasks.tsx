import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Skill {
  id: string;
  name: string;
  slug: string;
  is_locked: boolean;
  assignment_count: number;
}

const Tasks = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center py-8">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 glass-subtle rounded-2xl flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-glass" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-glass">Мои задания</h1>
            <p className="text-sm text-glass-muted">
              {skills.reduce((sum, s) => sum + s.assignment_count, 0)} заданий
            </p>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:space-y-0 pb-24 lg:pb-8">
        {skills.map((skill) => (
          <div
            key={skill.id}
            onClick={() => handleTaskClick(skill.slug, skill.is_locked)}
            className={`bg-card border border-border rounded-lg p-5 ${
              skill.is_locked
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:border-primary/50 transition-colors"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-foreground mb-1">
                  {skill.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {skill.assignment_count} заданий
                </p>
              </div>
              {skill.is_locked && (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
