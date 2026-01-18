import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkoutSessionProvider } from "@/contexts/WorkoutSessionContext";
import Index from "./pages/Index";
import Workouts from "./pages/Workouts";
import WorkoutDetail from "./pages/WorkoutDetail";
import NewWorkout from "./pages/NewWorkout/NewWorkout";
import AIWorkout from "./pages/AIWorkout";
import Ranking from "./pages/Ranking";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Popular from "./pages/Popular";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import Marketplace from "./pages/Marketplace";
import Professionals from "./pages/Professionals";
import Consent from "./pages/Consent";
import ParQuestionnaire from "./pages/ParQuestionnaire";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WorkoutSessionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workouts/new" element={<NewWorkout />} />
            <Route path="/workouts/:id" element={<WorkoutDetail />} />
            <Route path="/ai-workout" element={<AIWorkout />} />
            {/* <Route path="/ranking" element={<Ranking />} /> */}
            {/* <Route path="/chat" element={<Chat />} /> */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/consentimento" element={<Consent />} />
            <Route path="/questionario" element={<ParQuestionnaire />} />
            <Route path="*" element={<NotFound />} />
            {/* <Route path="/events" element={<Events />} /> */}
            {/* <Route path="/marketplace" element={<Marketplace />} /> */}
            {/* <Route path="/professionals" element={<Professionals />} /> */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WorkoutSessionProvider>
  </QueryClientProvider>
);

export default App;
