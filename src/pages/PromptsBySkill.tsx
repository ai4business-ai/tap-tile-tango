import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, CheckCircle, Copy, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { skillsPromptsData } from '@/data/promptsData';
import { getSkillIcon, getSkillColor } from '@/utils/skillIconsDemo';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const PromptsBySkill = () => {
  const navigate = useNavigate();
  const { skillSlug } = useParams<{ skillSlug: string }>();
  const [skillName, setSkillName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const promptsData = skillsPromptsData.find((s) => s.slug === skillSlug);

  useEffect(() => {
    const fetchSkillName = async () => {
      if (!skillSlug) return;

      try {
        const { data, error } = await supabase
          .from('skills')
          .select('name')
          .eq('slug', skillSlug)
          .single();

        if (error) throw error;
        
        if (data) {
          setSkillName(data.name);
        }
      } catch (error) {
        console.error('Error fetching skill:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillName();
  }, [skillSlug]);

  const handleCopyPrompt = async (promptText: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      toast.success('Скопировано!', {
        description: 'Промпт скопирован в буфер обмена',
      });
    } catch (err) {
      toast.error('Ошибка', {
        description: 'Не удалось скопировать промпт',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (!promptsData || !skillName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Навык не найден</p>
      </div>
    );
  }

  const isLastPrompt = (index: number) => index === promptsData.prompts.length - 1;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#8277EC] pt-36 pb-16 -mt-28">
        <div className="max-w-md mx-auto px-4">
          <button
            onClick={() => navigate('/prompts')}
            className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl ${getSkillColor(skillSlug || '')} flex items-center justify-center shadow-lg flex-shrink-0`}>
              {getSkillIcon(skillSlug || '')}
            </div>
            <h1 className="text-3xl font-bold text-white">{skillName}</h1>
          </div>
        </div>
      </div>

      {/* Prompts List */}
      <div className="max-w-md mx-auto px-4 -mt-8">
        <div className="space-y-3">
          <Accordion type="multiple" className="space-y-3">
            {promptsData.prompts.filter((_, index) => !isLastPrompt(index)).map((prompt, index) => (
              <AccordionItem
                key={prompt.id}
                value={`prompt-${index}`}
                className="border-0"
              >
                <Card className="border-0 shadow-lg bg-white overflow-hidden">
                  <CardContent className="p-0">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/30 transition-colors [&>svg]:text-[#F37168]">
                      <div className="flex items-center gap-3 text-left">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="font-semibold text-[#111827]">
                          {prompt.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="bg-[#8277EC]/5 rounded-2xl p-4 mt-2">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-[#111827]">
                            Идеальный промпт:
                          </h4>
                          <button
                            onClick={() => handleCopyPrompt(prompt.prompt)}
                            className="p-2 rounded-lg border border-[#F37168]/30 bg-transparent hover:bg-[#F37168]/10 transition-colors"
                            aria-label="Копировать промпт"
                          >
                            <Copy className="w-4 h-4 text-[#F37168]" />
                          </button>
                        </div>
                        <p className="text-sm text-[#111827] leading-relaxed">
                          {prompt.prompt}
                        </p>
                      </div>
                    </AccordionContent>
                  </CardContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
          
          {/* Locked last prompt - not expandable */}
          {promptsData.prompts.length > 0 && (
            <Card className="border-0 shadow-lg bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="px-4 py-4 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-[#111827] flex-shrink-0" />
                  <span className="font-semibold text-[#111827]">
                    {promptsData.prompts[promptsData.prompts.length - 1].title}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptsBySkill;
