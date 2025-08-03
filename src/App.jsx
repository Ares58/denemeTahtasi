import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Sayfaları import edin
import AnaSayfa from "./Pages/AnaSayfa/AnaSayfa";
import BlogPage from "./Pages/Blogs/Blog";
import BlogDetailPage from "./Pages/Blogs/BlogDetail";
import Admin from "./Pages/Admin/AdminPanel";

// CSS değişkenlerini global olarak tanımlayın
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<AnaSayfa />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="*" element={<div>Sayfa bulunamadı</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
