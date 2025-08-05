import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // API Base URL - environment'a göre değişir
  const API_BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://savteksitesi.onrender.com"
      : "http://localhost:5000";

  // Particles effect
  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push(
        <div
          key={i}
          className="login-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${Math.random() * 2 + 3}s`,
          }}
        />
      );
    }
    return particles;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Login attempt to:", `${API_BASE_URL}/api/auth/login`);

      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { username, password },
        {
          withCredentials: true, // Cookie için önemli
          timeout: 10000, // 10 saniye timeout
        }
      );

      console.log("Login response:", res.data);

      if (res.data.message === "Giriş başarılı") {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        // Server response hatası
        setError(err.response.data.message || "Giriş bilgileri hatalı.");
      } else if (err.request) {
        // Network hatası
        setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      } else {
        // Diğer hatalar
        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-particles">{renderParticles()}</div>

      <form onSubmit={handleLogin} className="admin-login-form">
        <div className="admin-login-header">
          <h2 className="admin-login-title">Admin Panel</h2>
          <p className="admin-login-subtitle">
            Yönetim paneline erişim için giriş yapın
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            className="admin-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
          <svg
            className="input-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Şifre"
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <svg
            className="input-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <circle cx="12" cy="16" r="1" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading && <div className="loading-spinner"></div>}
          {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>

        <div className="security-badge">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
            <path d="M3 12c1 0-3-1-3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
          </svg>
          <span>SSL ile güvenli bağlantı</span>
        </div>

        {/* Debug bilgisi - production'da kaldırılabilir */}
        {process.env.NODE_ENV === "development" && (
          <div
            style={{
              marginTop: "10px",
              fontSize: "12px",
              color: "#666",
              textAlign: "center",
            }}
          >
            API URL: {API_BASE_URL}
          </div>
        )}
      </form>
    </div>
  );
}

export default AdminLogin;
