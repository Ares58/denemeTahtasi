import React, { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";

function AdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <AdminPanel />
      ) : (
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}

export default AdminRoute;
