import communicationIcon from '@/assets/skills/communication.svg';
import knowledgeManagementIcon from '@/assets/skills/knowledge-management.svg';
import contentCreationIcon from '@/assets/skills/content-creation.svg';
import problemSolvingIcon from '@/assets/skills/problem-solving.svg';
import researchIcon from '@/assets/skills/research.svg';
import automationIcon from '@/assets/skills/automation.svg';
import dataAnalysisIcon from '@/assets/skills/data-analysis.svg';
import productivityIcon from '@/assets/skills/productivity.svg';

export const getSkillIcon = (slug: string) => {
  const iconMap: Record<string, string> = {
    'communication': communicationIcon,
    'knowledge-management': knowledgeManagementIcon,
    'content-creation': contentCreationIcon,
    'problem-solving': problemSolvingIcon,
    'research': researchIcon,
    'automation': automationIcon,
    'data-analysis': dataAnalysisIcon,
    'productivity': productivityIcon,
  };
  
  const iconSrc = iconMap[slug] || productivityIcon;
  return <img src={iconSrc} alt={slug} className="w-5 h-5 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />;
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
