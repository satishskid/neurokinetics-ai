import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProviderDashboard from './pages/ProviderDashboard';
import ScreeningPage from './pages/ScreeningPage';
import ResultsPage from './pages/ResultsPage';
import InterventionPage from './pages/InterventionPage';
import CareBuddyPage from './pages/CareBuddyPage';
import KnowledgeLibraryPage from './pages/KnowledgeLibraryPage';

const PUBLISHABLE_KEY = "pk_test_dmVyaWZpZWQtcGlnbGV0LTE0LmNsZXJrLmFjY291bnRzLmRldiQ";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppInner() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/screening/:childId" element={<ScreeningPage />} />
          <Route path="/results/:assessmentId" element={<ResultsPage />} />
          <Route path="/intervention/:childId" element={<InterventionPage />} />
          <Route path="/carebuddy" element={<CareBuddyPage />} />
          <Route path="/knowledge" element={<KnowledgeLibraryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <AppInner />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
