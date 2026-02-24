import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import type { ContentBlock } from '@/hooks/useCourseContent';

interface TheoryBlockProps {
  blocks: ContentBlock[];
}

const calloutStyles: Record<string, { bg: string; border: string; icon: React.ReactNode }> = {
  info: {
    bg: 'bg-sky-blue/5',
    border: 'border-sky-blue/30',
    icon: <Info className="w-4 h-4 text-sky-blue flex-shrink-0 mt-0.5" />,
  },
  warning: {
    bg: 'bg-primary-orange/5',
    border: 'border-primary-orange/30',
    icon: <AlertTriangle className="w-4 h-4 text-primary-orange flex-shrink-0 mt-0.5" />,
  },
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    icon: <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />,
  },
};

export default function TheoryBlock({ blocks }: TheoryBlockProps) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <h3 key={i} className="text-base font-semibold text-foreground mt-6 first:mt-0">
                {block.content}
              </h3>
            );
          case 'text':
            return (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                {block.content}
              </p>
            );
          case 'list':
            return (
              <ul key={i} className="space-y-2 ml-1">
                {block.items?.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-orange mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          case 'callout': {
            const style = calloutStyles[block.variant || 'info'] || calloutStyles.info;
            return (
              <div key={i} className={`flex gap-3 p-4 rounded-xl border ${style.bg} ${style.border}`}>
                {style.icon}
                <p className="text-sm text-foreground/80">{block.content}</p>
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
