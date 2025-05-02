
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Inbox from "./pages/Inbox";
import Sent from "./pages/Sent";
import Drafts from "./pages/Drafts";
import Trash from "./pages/Trash";
import AdminUsers from "./pages/AdminUsers";
import AdminGroups from "./pages/AdminGroups";
import MainLayout from "./layouts/MainLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/sent" element={<Sent />} />
            <Route path="/drafts" element={<Drafts />} />
            <Route path="/important" element={<Inbox />} /> {/* Using Inbox as placeholder */}
            <Route path="/all" element={<Inbox />} /> {/* Using Inbox as placeholder */}
            <Route path="/trash" element={<Trash />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/groups" element={<AdminGroups />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
