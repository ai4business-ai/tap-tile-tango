import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, GraduationCap } from 'lucide-react';
import type { UserCourse } from '@/hooks/useUserCourses';

interface MyCoursesWidgetProps {
  userCourses: UserCourse[];
  loading: boolean;
}

const courseGradients = [
  'from-[#8B5CF6] to-[#6D28D9]',
  'from-[#EC4899] to-[#DB2777]',
  'from-[#F97316] to-[#EA580C]',
  'from-[#06B6D4] to-[#0891B2]',
];

const MyCoursesWidget = ({ userCourses, loading }: MyCoursesWidgetProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-foreground">Мои курсы</h2>
        <button
          onClick={() => navigate('/catalog')}
          className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
        >
          Все курсы <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <Card className="border-0 shadow-xl bg-white/85">
          <CardContent className="p-6">
            <div className="animate-pulse h-16 bg-muted rounded-xl" />
          </CardContent>
        </Card>
      ) : userCourses.length === 0 ? (
        <Card
          className="border-0 shadow-xl bg-white/85 cursor-pointer"
          onClick={() => navigate('/catalog')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-[#6D28D9] flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Запишитесь на первый курс</p>
              <p className="text-sm text-muted-foreground">Откройте каталог и начните обучение</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {userCourses.map((uc, i) => (
            <Card
              key={uc.id}
              className="border-0 shadow-xl bg-white/85 cursor-pointer"
              onClick={() => navigate(`/course/${uc.course.slug}`)}
            >
              <CardContent className="p-4">
                <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${courseGradients[i % courseGradients.length]} mb-3`} />
                <p className="font-semibold text-sm text-foreground mb-1 line-clamp-2">
                  {uc.course.title}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Прогресс</span>
                  <span className="font-bold text-primary">{uc.progress_percent}%</span>
                </div>
                <Progress value={uc.progress_percent} className="h-1.5" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesWidget;
