import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const isAdminLoggedIn =
    localStorage.getItem("adminLogin") === "true";

  const userRole =
    localStorage.getItem("userRole");

  if (!isAdminLoggedIn || userRole !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}