import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SecurityProvider } from "@/components/SecurityProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import IndexPlayground from "./pages/IndexPlayground";
import Tasks from "./pages/Tasks";
import WebinarRecords from "./pages/WebinarRecords";
import MyProgress from "./pages/MyProgress";
import MyProgressDemo from "./pages/MyProgressDemo";
import SkillAssignments from "./pages/SkillAssignments";
import TaskDocumentAnalysis from "./pages/TaskDocumentAnalysis";
import TaskDeepResearch from "./pages/TaskDeepResearch";
import TaskSpecializedGPT from "./pages/TaskSpecializedGPT";
import TaskClientResponse from "./pages/TaskClientResponse";
import TaskClientResponseDemo from "./pages/TaskClientResponseDemo";
import TaskMeetingAgenda from "./pages/TaskMeetingAgenda";
import TaskFeedback from "./pages/TaskFeedback";
import PromptsLibrary from "./pages/PromptsLibrary";
import PromptsBySkill from "./pages/PromptsBySkill";
import BasicPrompts from "./pages/BasicPrompts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <AuthProvider>
      <SecurityProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-center" />
            <BrowserRouter>
              <Routes>
                {/* Experimental page without Layout */}
                <Route path="/my-progress-demo" element={<MyProgressDemo />} />
                
                {/* All other pages with Layout */}
                <Route path="/*" element={
                  <Layout>
                    <Routes>
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/" element={<Index />} />
                      <Route path="/demo" element={<Demo />} />
                      <Route path="/playground" element={<IndexPlayground />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/webinar-records" element={<WebinarRecords />} />
                      <Route path="/my-progress" element={<MyProgress />} />
                      <Route path="/skill-assignments/:skillName" element={<SkillAssignments />} />
                      <Route path="/task/document-analysis" element={<TaskDocumentAnalysis />} />
                      <Route path="/task/deep-research" element={<TaskDeepResearch />} />
                      <Route path="/task/specialized-gpt" element={<TaskSpecializedGPT />} />
                      <Route path="/task/client-response" element={<TaskClientResponse />} />
                      <Route path="/task/client-response/demo" element={<TaskClientResponseDemo />} />
                      <Route path="/task/meeting-agenda" element={<TaskMeetingAgenda />} />
                      <Route path="/task/feedback-colleagues" element={<TaskFeedback />} />
                      <Route path="/prompts" element={<PromptsLibrary />} />
                      <Route path="/prompts/basic" element={<BasicPrompts />} />
                      <Route path="/prompts/:skillSlug" element={<PromptsBySkill />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                } />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </SecurityProvider>
    </AuthProvider>
  );
};

export default App;
