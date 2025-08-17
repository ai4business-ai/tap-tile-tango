import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TelegramAPI from "@/lib/telegram";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import TaskCategory from "./pages/TaskCategory";
import TaskDetail from "./pages/TaskDetail";
import WebinarRecords from "./pages/WebinarRecords";
import MyProgress from "./pages/MyProgress";
import SkillAssignments from "./pages/SkillAssignments";
import TaskDocumentAnalysis from "./pages/TaskDocumentAnalysis";
import TaskDeepResearch from "./pages/TaskDeepResearch";
import TaskSpecializedGPT from "./pages/TaskSpecializedGPT";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Инициализация Telegram WebApp
    const tg = TelegramAPI.getInstance();
    const webApp = tg.getWebApp();

    // Настройка темы приложения
    if (webApp.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Уведомление Telegram что приложение готово
    webApp.ready();
    webApp.expand();

    // Настройка цветов приложения
    webApp.headerColor = webApp.themeParams.bg_color || '#ffffff';
    webApp.backgroundColor = webApp.themeParams.bg_color || '#ffffff';

    // Отслеживание изменений темы
    const handleThemeChanged = () => {
      if (webApp.colorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // В реальном приложении здесь была бы подписка на события темы
    // webApp.onEvent('themeChanged', handleThemeChanged);

    return () => {
      // Очистка при размонтировании
      // webApp.offEvent('themeChanged', handleThemeChanged);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:category" element={<TaskCategory />} />
            <Route path="/task-detail" element={<TaskDetail />} />
            <Route path="/webinar-records" element={<WebinarRecords />} />
            <Route path="/my-progress" element={<MyProgress />} />
            <Route path="/skill-assignments/:skillName" element={<SkillAssignments />} />
            <Route path="/task/document-analysis" element={<TaskDocumentAnalysis />} />
            <Route path="/task/deep-research" element={<TaskDeepResearch />} />
            <Route path="/task/specialized-gpt" element={<TaskSpecializedGPT />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
