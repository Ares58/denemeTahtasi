import React from "react";
import "./Style/Dashboard.css";

const Dashboard = ({ stats, blogs }) => {
  const statCards = [
    { label: "Toplam Yazı", value: stats.total, color: "#667eea" },
    { label: "Yayınlanan", value: stats.published, color: "#10b981" },
    { label: "Taslak", value: stats.drafts, color: "#f59e0b" },
    { label: "Toplam Görüntüleme", value: stats.totalViews, color: "#ef4444" },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="recent-blogs">
        <h2 className="recent-title">Son Blog Yazıları</h2>
        <div className="blog-list">
          {blogs.slice(0, 5).map((blog) => (
            <div key={blog.id} className="blog-item">
              <div className="blog-info">
                <h4 className="blog-title">{blog.title}</h4>
                <p className="blog-meta">
                  {blog.author} •{" "}
                  {new Date(blog.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <div className={`blog-status ${blog.status}`}>
                {blog.status === "published" ? "Yayınlanan" : "Taslak"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
