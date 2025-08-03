import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password },
        { withCredentials: true } // Cookie için önemli
      );

      if (res.data.message === "Giriş başarılı") {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Giriş bilgileri hatalı.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Giriş</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <input
          type="text"
          placeholder="Kullanıcı Adı"
          className="w-full mb-4 p-3 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Şifre"
          className="w-full mb-6 p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
