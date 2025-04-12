
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { DataProvider, useData } from "@/contexts/DataContext";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Machines from "./pages/Machines";
import Parts from "./pages/Parts";
import OEE from "./pages/OEE";
import Consumables from "./pages/Consumables";
import Forecast from "./pages/Forecast";
import CostBreakdown from "./pages/CostBreakdown";
import RawMaterials from "./pages/RawMaterials";
import Calendar from "./pages/Calendar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

// Wrap routes with loading indicator
const AppRoutes = () => {
  const { isLoading } = useData();
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/machines" element={<Machines />} />
      <Route path="/parts" element={<Parts />} />
      <Route path="/oee" element={<OEE />} />
      <Route path="/consumables" element={<Consumables />} />
      <Route path="/raw-materials" element={<RawMaterials />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/forecast" element={<Forecast />} />
      <Route path="/cost-breakdown" element={<CostBreakdown />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
