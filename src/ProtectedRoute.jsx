import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth";
import Spinner from "./Spinner";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default ProtectedRoute;