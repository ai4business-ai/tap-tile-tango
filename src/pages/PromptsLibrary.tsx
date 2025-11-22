import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { skillsPromptsData } from '@/data/promptsData';
import { getSkillIcon, getSkillColor } from '@/utils/skillIcons';

const PromptsLibrary = () => {
  const navigate = useNavigate();

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
          {skillsPromptsData.map((skill) => (
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
                      {skill.totalAssignments} заданий
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
