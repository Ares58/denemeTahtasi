import React from "react";
import { BarChart3, BookOpen, Plus, Settings, LogOut } from "lucide-react";
import "./Style/Sidebar.css";
const Sidebar = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "blogs", label: "Blog Yazıları", icon: BookOpen },
    { id: "create", label: "Yeni Yazı", icon: Plus },
    { id: "settings", label: "Ayarlar", icon: Settings },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">SAVTEK</h2>
        <p className="sidebar-subtitle">Blog Admin Panel</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`nav-button ${
                currentPage === item.id ? "active" : ""
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button">
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
