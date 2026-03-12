import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import AdminBookingNotifier from "@/components/AdminBookingNotifier";
import AdminRoute from "@/components/AdminRoute";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy-loaded routes for code splitting
const Catalog = lazy(() => import("./pages/Catalog"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Booking = lazy(() => import("./pages/Booking"));
const Success = lazy(() => import("./pages/Success"));
const Auth = lazy(() => import("./pages/Auth"));
const Account = lazy(() => import("./pages/Account"));
const Ketoan = lazy(() => import("./pages/Ketoan"));
const AdminBranches = lazy(() => import("./pages/AdminBranches"));
const AdminPosts = lazy(() => import("./pages/AdminPosts"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
              <ErrorBoundary>
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/mau-xam" element={<Catalog />} />
                  <Route path="/mau-xam/:slug" element={<ProductDetail />} />
                  {/* Redirects from old URLs */}
                  <Route path="/trang-chu" element={<Navigate to="/" replace />} />
                  <Route path="/catalog" element={<Navigate to="/mau-xam" replace />} />
                  <Route path="/catalog/:slug" element={<OldCatalogRedirect />} />
                  <Route path="/dat-lich" element={<Booking />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/dang-nhap" element={<Auth />} />
                  <Route path="/tai-khoan" element={<Account />} />
                  {/* Redirects from old URLs */}
                  <Route path="/booking" element={<Navigate to="/dat-lich" replace />} />
                  <Route path="/auth" element={<Navigate to="/dang-nhap" replace />} />
                  <Route path="/account" element={<Navigate to="/tai-khoan" replace />} />
                  <Route path="/ketoan" element={<AdminRoute><Ketoan /></AdminRoute>} />
                  <Route path="/admin/branches" element={<AdminRoute><AdminBranches /></AdminRoute>} />
                  <Route path="/admin/posts" element={<AdminRoute><AdminPosts /></AdminRoute>} />
                  <Route path="/tin-tuc" element={<News />} />
                  <Route path="/tin-tuc/:slug" element={<NewsDetail />} />
                  <Route path="/r/:code" element={<ReferralRedirect />} />
                  <Route path="/inv/:code" element={<ReferralRedirect />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
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

const OldCatalogRedirect = () => {
  const slug = window.location.pathname.split("/catalog/")[1];
  return <Navigate to={`/mau-xam/${slug}`} replace />;
};

export default App;