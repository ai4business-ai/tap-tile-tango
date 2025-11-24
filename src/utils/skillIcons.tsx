import { MessageSquare, Brain, PenTool, Lightbulb, Search, Zap, BarChart3, Target } from 'lucide-react';

export const getSkillIcon = (slug: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'communication': <MessageSquare className="w-5 h-5 text-foreground" />,
    'knowledge-management': <Brain className="w-5 h-5 text-foreground" />,
    'content-creation': <PenTool className="w-5 h-5 text-foreground" />,
    'problem-solving': <Lightbulb className="w-5 h-5 text-foreground" />,
    'research': <Search className="w-5 h-5 text-foreground" />,
    'automation': <Zap className="w-5 h-5 text-foreground" />,
    'data-analysis': <BarChart3 className="w-5 h-5 text-foreground" />,
    'productivity': <Target className="w-5 h-5 text-foreground" />,
  };
  return iconMap[slug] || <Target className="w-5 h-5 text-foreground" />;
};

export const getSkillColor = (slug: string) => {
  const colorMap: Record<string, string> = {
    'communication': 'bg-[#3B9DFF]',
    'knowledge-management': 'bg-[#B350D6]',
    'content-creation': 'bg-[#FF7847]',
    'problem-solving': 'bg-[#FFA94D]',
    'research': 'bg-[#00BCD4]',
    'automation': 'bg-[#9C4FFF]',
    'data-analysis': 'bg-[#5B9BFF]',
    'productivity': 'bg-[#4CAF50]',
  };
  return colorMap[slug] || 'bg-[#3B9DFF]';
};
