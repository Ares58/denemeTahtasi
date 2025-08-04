import React from "react";
import { Plus, Search, Edit, Trash2, Eye, BookOpen } from "lucide-react";
import "./Style/Blogs.css";

const Bloglar = ({
  blogs,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  onEdit,
  onDelete,
  onCreateNew,
}) => {
  const statuses = [
    { value: "all", label: "Tümü" },
    { value: "published", label: "Yayınlanan" },
    { value: "draft", label: "Taslak" },
  ];

  return (
    <div className="bloglar">
      <div className="bloglar-header">
        <h1 className="bloglar-title">Blog Yazıları ({blogs.length})</h1>
        <button className="new-blog-btn" onClick={onCreateNew}>
          <Plus size={20} />
          Yeni Yazı
        </button>
      </div>

      {/* Search and Filter */}
      <div className="search-filter">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Blog yazılarında ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Blog List */}
      <div className="blog-list">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <div className="blog-content">
              {blog.image ? (
                <img src={blog.image} alt={blog.title} className="blog-image" />
              ) : (
                <div className="blog-image-placeholder">Görsel Yok</div>
              )}

              <div className="blog-details">
                <div className="blog-header">
                  <div className="blog-info">
                    <h3 className="blog-title">{blog.title}</h3>
                    <div className="blog-meta">
                      <span>{blog.author}</span>
                      <span>•</span>
                      <span>
                        {blog.author} -
                        {new Date(blog.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                      <span>•</span>
                      <span>{blog.category}</span>
                      <span>•</span>
                      <span>{blog.views} görüntüleme</span>
                    </div>
                  </div>

                  <div className={`blog-status ${blog.status}`}>
                    {blog.status === "published" ? "Yayınlanan" : "Taslak"}
                  </div>
                </div>

                <p className="blog-excerpt">{blog.excerpt}</p>

                <div className="blog-tags">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="blog-tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="blog-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(blog)}
                  >
                    <Edit size={16} />
                    Düzenle
                  </button>

                  <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete(blog.id)}
                  >
                    <Trash2 size={16} />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="empty-state">
          <BookOpen size={64} className="empty-icon" />
          <h3 className="empty-title">Henüz blog yazısı yok</h3>
          <p className="empty-text">
            İlk blog yazınızı oluşturmak için "Yeni Yazı" butonuna tıklayın.
          </p>
        </div>
      )}
    </div>
  );
};

export default Bloglar;
