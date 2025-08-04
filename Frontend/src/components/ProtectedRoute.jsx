import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth();

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg text-gray-600">Yükleniyor...</span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
}

export default ProtectedRoute;
