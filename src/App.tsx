import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AiResultsProvider } from "@/contexts/AiResultsContext";
import Home from "./pages/Home";
import Canvas from "./pages/Canvas";
import Export from "./pages/Export";
import Booking from "./pages/Booking";
import AiResults from "./pages/AiResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AiResultsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/canvas" element={<Canvas />} />
            <Route path="/export" element={<Export />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/ai-results" element={<AiResults />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AiResultsProvider>
  </QueryClientProvider>
);

export default App;
