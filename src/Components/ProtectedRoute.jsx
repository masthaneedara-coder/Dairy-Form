import { Navigate }
from "react-router-dom";

export default function ProtectedRoute({
  children,
}) {

  const isLoggedIn =
    localStorage.getItem(
      "customerLogin"
    ) === "true";

  if (!isLoggedIn) {

    return (
      <Navigate
        to="/auth"
        replace
      />
    );

  }

  return children;

}