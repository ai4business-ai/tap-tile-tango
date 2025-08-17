import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen p-4 max-w-sm mx-auto flex flex-col items-center justify-center">
      <div className="glass-card rounded-2xl p-8 text-center shadow-xl">
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">Страница не найдена</h2>
        <p className="text-muted-foreground mb-6">
          К сожалению, запрашиваемая страница не существует.
        </p>
        <a 
          href="/" 
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться на главную
        </a>
      </div>
    </div>
  );
};

export default NotFound;
