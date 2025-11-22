import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { skillsPromptsData } from '@/data/promptsData';
import { getSkillIcon, getSkillColor } from '@/utils/skillIcons';

const PromptsBySkill = () => {
  const navigate = useNavigate();
  const { skillSlug } = useParams<{ skillSlug: string }>();

  const skill = skillsPromptsData.find((s) => s.slug === skillSlug);

  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Навык не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] px-6 pt-12 pb-16">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => navigate('/prompts')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">Назад к навыкам</span>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl ${getSkillColor(skill.slug)} flex items-center justify-center shadow-lg flex-shrink-0`}>
              {getSkillIcon(skill.slug)}
            </div>
            <h1 className="text-3xl font-bold text-white">{skill.name}</h1>
          </div>
          <p className="text-white/90 text-base">Задания по уровням</p>
        </div>
      </div>

      {/* Prompts List */}
      <div className="max-w-md mx-auto px-4 -mt-8">
        <Accordion type="single" collapsible className="space-y-3">
          {skill.prompts.map((prompt, index) => (
            <AccordionItem
              key={prompt.id}
              value={`prompt-${index}`}
              className="border-0"
            >
              <Card className="border-0 shadow-lg bg-white overflow-hidden">
                <CardContent className="p-0">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 text-left">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="font-semibold text-foreground">
                        {prompt.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="bg-[#8B5CF6]/5 rounded-2xl p-4 mt-2">
                      <h4 className="text-sm font-semibold text-[#8B5CF6] mb-3">
                        Идеальный промпт:
                      </h4>
                      <p className="text-sm text-foreground leading-relaxed">
                        {prompt.prompt}
                      </p>
                    </div>
                  </AccordionContent>
                </CardContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default PromptsBySkill;
