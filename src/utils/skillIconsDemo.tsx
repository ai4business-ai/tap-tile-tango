import CommunicationIcon from '@/assets/icons/communication.svg';
import KnowledgeManagementIcon from '@/assets/icons/knowledge-management.svg';
import ContentCreationIcon from '@/assets/icons/content-creation.svg';
import ProblemSolvingIcon from '@/assets/icons/problem-solving.svg';
import ResearchIcon from '@/assets/icons/research.svg';
import AutomationIcon from '@/assets/icons/automation.svg';
import DataAnalysisIcon from '@/assets/icons/data-analysis.svg';
import ProductivityIcon from '@/assets/icons/productivity.svg';

export const getSkillIcon = (slug: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'communication': <img src={CommunicationIcon} alt="Communication" className="w-full h-full object-contain object-center p-2 brightness-0 invert" />,
    'knowledge-management': <img src={KnowledgeManagementIcon} alt="Knowledge Management" className="w-full h-full object-contain object-center p-2 brightness-0 invert" />,
    'content-creation': <img src={ContentCreationIcon} alt="Content Creation" className="w-full h-full object-contain object-center p-2 brightness-0 invert" />,
    'problem-solving': <img src={ProblemSolvingIcon} alt="Problem Solving" className="w-full h-full object-contain object-center p-2 brightness-0 invert" />,
    'research': <img src={ResearchIcon} alt="Research" className="w-full h-full object-contain object-center p-2 brightness-0 invert" />,
    'automation': <img src={AutomationIcon} alt="Automation" className="w-full h-full object-contain object-center p-2 brightness-0 invert" />,
    'data-analysis': <img src={DataAnalysisIcon} alt="Data Analysis" className="w-full h-full object-contain object-center p-2 brightness-0 invert" />,
    'productivity': <img src={ProductivityIcon} alt="Productivity" className="w-full h-full object-contain object-center p-2 brightness-0 invert" />,
  };
  return iconMap[slug] || <img src={ProductivityIcon} alt="Productivity" className="w-full h-full object-contain object-center p-2 brightness-0 invert" />;
};

export const getSkillColor = (slug: string) => {
  // Все навыки используют единый primary цвет
  return 'bg-[#1956FF]';
};
