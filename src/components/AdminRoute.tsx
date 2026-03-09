import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dang-nhap" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
