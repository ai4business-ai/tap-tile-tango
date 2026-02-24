import { useNavigate } from 'react-router-dom';
import { TapCard } from '@/components/ui/tap-card';
import { GraduationCap, ChevronRight } from 'lucide-react';

interface CourseCatalogWidgetProps {
  coursesCount: number;
}

const CourseCatalogWidget = ({ coursesCount }: CourseCatalogWidgetProps) => {
  const navigate = useNavigate();

  return (
    <TapCard onClick={() => navigate('/catalog')}>
      <div className="glass-card rounded-3xl p-6 relative overflow-hidden h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-[#6D28D9] flex items-center justify-center shadow-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">Каталог курсов</h3>
            <p className="text-sm text-muted-foreground">{coursesCount} курсов доступно</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </TapCard>
  );
};

export default CourseCatalogWidget;
