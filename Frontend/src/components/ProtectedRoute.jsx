import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth();

  if (isAuthenticated === null) {
    return <div>Yükleniyor...</div>; // veya bir spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default ProtectedRoute;
