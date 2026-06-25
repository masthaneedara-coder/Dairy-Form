import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("customerLogin") === "true";

  if (!isLoggedIn) {
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/auth" replace />;
  }

  return children;
}