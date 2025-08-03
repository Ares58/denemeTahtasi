import { useEffect, useState } from "react";
import axios from "axios";

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = yükleniyor

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/verify", { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  return isAuthenticated;
}

export default useAuth;
