import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Booking from "./pages/Booking";
import Success from "./pages/Success";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Ketoan from "./pages/Ketoan";
import AdminBranches from "./pages/AdminBranches";
import AdminPosts from "./pages/AdminPosts";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import NotFound from "./pages/NotFound";
import AdminBookingNotifier from "@/components/AdminBookingNotifier";
import AdminRoute from "@/components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AdminBookingNotifier />
          <div className="grain">
            <Navbar />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/catalog/:id" element={<ProductDetail />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/success" element={<Success />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/account" element={<Account />} />
                <Route path="/ketoan" element={<AdminRoute><Ketoan /></AdminRoute>} />
                <Route path="/admin/branches" element={<AdminRoute><AdminBranches /></AdminRoute>} />
                <Route path="/admin/posts" element={<AdminRoute><AdminPosts /></AdminRoute>} />
                <Route path="/tin-tuc" element={<News />} />
                <Route path="/tin-tuc/:slug" element={<NewsDetail />} />
                <Route path="/r/:code" element={<ReferralRedirect />} />
                <Route path="/inv/:code" element={<ReferralRedirect />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const ReferralRedirect = () => {
  const path = window.location.pathname;
  const code = path.includes("/inv/") ? path.split("/inv/")[1] : path.split("/r/")[1];
  if (code) {
    localStorage.setItem("ref_code", code);
  }
  return <Navigate to="/" replace />;
};

export default App;