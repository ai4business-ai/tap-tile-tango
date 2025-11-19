import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SecurityProvider } from "@/components/SecurityProvider";
import { AuthGuard } from "@/components/AuthGuard";
import Auth from "./pages/Auth";
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
import TaskClientResponse from "./pages/TaskClientResponse";
import TaskMeetingAgenda from "./pages/TaskMeetingAgenda";
import TaskFeedback from "./pages/TaskFeedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <SecurityProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
              <Route path="/tasks" element={<AuthGuard><Tasks /></AuthGuard>} />
              <Route path="/tasks/:category" element={<AuthGuard><TaskCategory /></AuthGuard>} />
              <Route path="/task-detail" element={<AuthGuard><TaskDetail /></AuthGuard>} />
              <Route path="/webinar-records" element={<AuthGuard><WebinarRecords /></AuthGuard>} />
              <Route path="/my-progress" element={<AuthGuard><MyProgress /></AuthGuard>} />
              <Route path="/skill-assignments/:skillName" element={<AuthGuard><SkillAssignments /></AuthGuard>} />
              <Route path="/task/document-analysis" element={<AuthGuard><TaskDocumentAnalysis /></AuthGuard>} />
              <Route path="/task/deep-research" element={<AuthGuard><TaskDeepResearch /></AuthGuard>} />
              <Route path="/task/specialized-gpt" element={<AuthGuard><TaskSpecializedGPT /></AuthGuard>} />
              <Route path="/task/client-response" element={<AuthGuard><TaskClientResponse /></AuthGuard>} />
              <Route path="/task/meeting-agenda" element={<AuthGuard><TaskMeetingAgenda /></AuthGuard>} />
              <Route path="/task/feedback-colleagues" element={<AuthGuard><TaskFeedback /></AuthGuard>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SecurityProvider>
  );
};

export default App;
