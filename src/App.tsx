import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SecurityProvider } from "@/components/SecurityProvider";
import { Layout } from "@/components/Layout";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import IndexPlayground from "./pages/IndexPlayground";
import Tasks from "./pages/Tasks";
import WebinarRecords from "./pages/WebinarRecords";
import MyProgress from "./pages/MyProgress";
import SkillAssignments from "./pages/SkillAssignments";
import TaskDocumentAnalysis from "./pages/TaskDocumentAnalysis";
import TaskDeepResearch from "./pages/TaskDeepResearch";
import TaskSpecializedGPT from "./pages/TaskSpecializedGPT";
import TaskClientResponse from "./pages/TaskClientResponse";
import TaskMeetingAgenda from "./pages/TaskMeetingAgenda";
import TaskFeedback from "./pages/TaskFeedback";
import PromptsLibrary from "./pages/PromptsLibrary";
import PromptsBySkill from "./pages/PromptsBySkill";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <SecurityProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Index />} />
                <Route path="/playground" element={<IndexPlayground />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/webinar-records" element={<WebinarRecords />} />
                <Route path="/my-progress" element={<MyProgress />} />
                <Route path="/skill-assignments/:skillName" element={<SkillAssignments />} />
                <Route path="/task/document-analysis" element={<TaskDocumentAnalysis />} />
                <Route path="/task/deep-research" element={<TaskDeepResearch />} />
                <Route path="/task/specialized-gpt" element={<TaskSpecializedGPT />} />
                <Route path="/task/client-response" element={<TaskClientResponse />} />
                <Route path="/task/meeting-agenda" element={<TaskMeetingAgenda />} />
                <Route path="/task/feedback-colleagues" element={<TaskFeedback />} />
                <Route path="/prompts" element={<PromptsLibrary />} />
                <Route path="/prompts/:skillSlug" element={<PromptsBySkill />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SecurityProvider>
  );
};

export default App;
