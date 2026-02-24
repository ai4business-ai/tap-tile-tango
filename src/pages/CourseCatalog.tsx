import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { useUserCourses } from '@/hooks/useUserCourses';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Code, Video, HelpCircle, Sparkles } from 'lucide-react';

const courseTypeLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  trainer: { label: 'Тренажер', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-primary/10 text-primary border-primary/20' },
  theory_practice: { label: 'Теория + Практика', icon: <BookOpen className="w-3.5 h-3.5" />, color: 'bg-accent/10 text-accent border-accent/20' },
  video: { label: 'Видео-курс', icon: <Video className="w-3.5 h-3.5" />, color: 'bg-secondary/10 text-secondary border-secondary/20' },
  quiz: { label: 'Тесты', icon: <HelpCircle className="w-3.5 h-3.5" />, color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const CourseCatalog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, loading } = useCourses();
  const { userCourses, enroll, enrolling, isEnrolled } = useUserCourses(user?.id);

  const handleAction = async (course: any) => {
    if (isEnrolled(course.id)) {
      navigate(`/course/${course.slug}`);
    } else if (user) {
      await enroll(course.id);
      navigate(`/course/${course.slug}`);
    } else {
      navigate('/auth');
    }
  };

  const getProgress = (courseId: string) => {
    const uc = userCourses.find(c => c.course_id === courseId);
    return uc?.progress_percent ?? 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Каталог курсов</h1>
        <p className="text-muted-foreground mt-1">Выберите курс и начните обучение</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">Курсы скоро появятся</p>
            <p className="text-muted-foreground mt-1">Мы готовим для вас новые программы обучения</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {courses.map(course => {
            const typeInfo = courseTypeLabels[course.course_type] || courseTypeLabels.theory_practice;
            const enrolled = isEnrolled(course.id);
            const progress = getProgress(course.id);

            return (
              <Card 
                key={course.id} 
                className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
                onClick={() => handleAction(course)}
              >
                {/* Cover */}
                <div className="h-36 bg-gradient-to-br from-secondary via-secondary/80 to-accent relative overflow-hidden">
                  {course.cover_image_url ? (
                    <img src={course.cover_image_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Code className="w-16 h-16 text-white/20" />
                    </div>
                  )}
                  <Badge className={`absolute top-3 left-3 ${typeInfo.color} border gap-1`}>
                    {typeInfo.icon}
                    {typeInfo.label}
                  </Badge>
                </div>

                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>

                  {enrolled && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Прогресс</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  )}

                  <Button 
                    className="w-full mt-4" 
                    variant={enrolled ? 'default' : 'outline'}
                    disabled={enrolling}
                    onClick={(e) => { e.stopPropagation(); handleAction(course); }}
                  >
                    {enrolled ? 'Продолжить' : 'Записаться'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
