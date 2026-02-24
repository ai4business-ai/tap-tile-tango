import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserCourses } from '@/hooks/useUserCourses';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, ChevronRight, GraduationCap, Sparkles } from 'lucide-react';

const MyCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userCourses, loading } = useUserCourses(user?.id);

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Мои курсы</h1>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">Войдите, чтобы видеть свои курсы</p>
            <Button className="mt-4" onClick={() => navigate('/auth')}>Войти</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Мои курсы</h1>
          <p className="text-muted-foreground mt-1">Ваши текущие программы обучения</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/catalog')} className="hidden lg:flex">
          <BookOpen className="w-4 h-4 mr-2" />
          Каталог
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : userCourses.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">У вас пока нет курсов</p>
            <p className="text-muted-foreground mt-1">Перейдите в каталог и запишитесь на курс</p>
            <Button className="mt-4" onClick={() => navigate('/catalog')}>Перейти в каталог</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {userCourses.map(uc => (
            <Card 
              key={uc.id} 
              className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => navigate(`/course/${uc.course.slug}`)}
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Cover */}
                  <div className="h-32 lg:h-auto lg:w-48 bg-gradient-to-br from-secondary via-secondary/80 to-accent flex-shrink-0 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none overflow-hidden">
                    {uc.course.cover_image_url ? (
                      <img src={uc.course.cover_image_url} alt={uc.course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <GraduationCap className="w-10 h-10 text-white/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {uc.course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {uc.course.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Прогресс</span>
                          <span>{uc.progress_percent}%</span>
                        </div>
                        <Progress value={uc.progress_percent} className="h-2" />
                      </div>
                      <Button size="sm" className="flex-shrink-0 gap-1">
                        Учиться
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
