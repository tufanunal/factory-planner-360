
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";
import Machines from "./pages/Machines";
import Parts from "./pages/Parts";
import OEE from "./pages/OEE";
import Consumables from "./pages/Consumables";
import Forecast from "./pages/Forecast";
import CostBreakdown from "./pages/CostBreakdown";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/machines" element={<Machines />} />
            <Route path="/parts" element={<Parts />} />
            <Route path="/oee" element={<OEE />} />
            <Route path="/consumables" element={<Consumables />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/cost-breakdown" element={<CostBreakdown />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
