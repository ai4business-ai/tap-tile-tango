import communicationIcon from '@/assets/skills/communication.jpg';
import knowledgeManagementIcon from '@/assets/skills/knowledge-management.jpg';
import contentCreationIcon from '@/assets/skills/content-creation.jpg';
import problemSolvingIcon from '@/assets/skills/problem-solving.jpg';
import researchIcon from '@/assets/skills/research.jpg';
import automationIcon from '@/assets/skills/automation.jpg';
import dataAnalysisIcon from '@/assets/skills/data-analysis.jpg';
import productivityIcon from '@/assets/skills/productivity.jpg';

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
  return <img src={iconSrc} alt={slug} className="w-5 h-5 object-contain" />;
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
