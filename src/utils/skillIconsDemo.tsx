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
    'communication': <img src={CommunicationIcon} alt="Communication" className="w-10 h-10 object-contain" />,
    'knowledge-management': <img src={KnowledgeManagementIcon} alt="Knowledge Management" className="w-10 h-10 object-contain" />,
    'content-creation': <img src={ContentCreationIcon} alt="Content Creation" className="w-10 h-10 object-contain" />,
    'problem-solving': <img src={ProblemSolvingIcon} alt="Problem Solving" className="w-10 h-10 object-contain" />,
    'research': <img src={ResearchIcon} alt="Research" className="w-10 h-10 object-contain" />,
    'automation': <img src={AutomationIcon} alt="Automation" className="w-10 h-10 object-contain" />,
    'data-analysis': <img src={DataAnalysisIcon} alt="Data Analysis" className="w-10 h-10 object-contain" />,
    'productivity': <img src={ProductivityIcon} alt="Productivity" className="w-10 h-10 object-contain" />,
  };
  return iconMap[slug] || <img src={ProductivityIcon} alt="Productivity" className="w-10 h-10 object-contain" />;
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
