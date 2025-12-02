import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Copy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';

const basicPrompts = [
  {
    id: 'summarization',
    title: 'Суммаризация документа',
    prompt: '«Я — менеджер проекта, у которого нет времени читать весь документ. Твоя задача — проанализировать текст ниже и составить краткое резюме на 5 предложений, включая главный вывод и два ключевых действия, которые нужно предпринять.»',
  },
  {
    id: 'email-draft',
    title: 'Генерация черновика письма',
    prompt: '«Выступи в роли дружелюбного, но профессионального коллеги. Составь черновик электронного письма для [Имя получателя] с просьбой предоставить [Необходимый документ/Информация]. Письмо должно быть вежливым, указывать на крайний срок (завтра в 15:00) и содержать четкое обоснование, зачем это нужно (для отчета руководству).»',
  },
  {
    id: 'brainstorm',
    title: 'Мозговой штурм',
    prompt: '«Я хочу оптимизировать процесс [Название процесса, например: онбординг новых сотрудников]. Предложи 5 креативных идей. Каждая идея должна включать краткое название, описание и ожидаемый результат (метрика). Формат: маркированный список.»',
  },
  {
    id: 'data-analysis',
    title: 'Анализ данных',
    prompt: '«Ниже приведен список данных. Выступи в роли аудитора и проверь эти данные на предмет логических ошибок и несоответствий формату. Выдели все найденные ошибки жирным шрифтом и предложи корректный вариант в новом списке.»',
  },
  {
    id: 'planning',
    title: 'Планирование',
    prompt: '«Мне нужно составить презентацию для [Целевая аудитория, например: потенциальные инвесторы]. Тема презентации: [Тема]. Разработай подробную структуру из 10 слайдов, включая название каждого слайда, его ключевое сообщение и рекомендованный контент (график, цитата, кейс и т.д.).»',
  },
];

const BasicPrompts = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-24">
      {/* Header */}
      <div className="bg-[#8277EC] pt-36 pb-16 -mt-28">
        <div className="max-w-md mx-auto px-4">
          <button
            onClick={() => navigate('/prompts')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">Назад к навыкам</span>
          </button>

          <h1 className="text-3xl font-bold text-white">Базовые промпты</h1>
        </div>
      </div>

      {/* Prompts List */}
      <div className="max-w-md mx-auto px-4 -mt-8">
        <div className="space-y-3">
          <Accordion type="multiple" className="space-y-3">
            {basicPrompts.map((prompt, index) => (
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
        </div>
      </div>
    </div>
  );
};

export default BasicPrompts;
