import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute({ user }) {
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />; // renders the nested child routes
}