import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import { ThemeProvider } from "./context/theme-provider";
// import { ModeToggle } from "./components/moon-toggle";
const App = () => {
  return (
    <ThemeProvider>
      <Toaster />
      {/* <ModeToggle /> */}
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
