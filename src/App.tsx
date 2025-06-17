import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// import { ModeToggle } from "./components/moon-toggle";
const App = () => {
  return (
    <>
      <Toaster />
      {/* <ModeToggle /> */}
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
