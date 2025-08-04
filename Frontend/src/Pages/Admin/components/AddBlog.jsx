import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import "./Style/AddBlog.css";

const BlogEkle = ({
  editingBlog,
  onSave,
  onCancel,
  categories,
  generateSlug,
}) => {
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    image: "",
    status: "draft",
  });

  // Initialize form when editing
  useEffect(() => {
    if (editingBlog) {
      setBlogForm({
        title: editingBlog.title,
        slug: editingBlog.slug,
        excerpt: editingBlog.excerpt,
        content: editingBlog.content,
        author: editingBlog.author,
        category: editingBlog.category,
        tags: Array.isArray(editingBlog.tags)
          ? editingBlog.tags.join(", ")
          : editingBlog.tags,
        image: editingBlog.image,
        status: editingBlog.status,
      });
    }
  }, [editingBlog]);

  // Handle form input changes
  const handleFormChange = (field, value) => {
    setBlogForm((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug when title changes
      if (field === "title") {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  // Handle form submission
  const handleSave = () => {
    if (!blogForm.title || !blogForm.content || !blogForm.author) {
      alert("Başlık, içerik ve yazar alanları zorunludur!");
      return;
    }

    onSave(blogForm);
  };

  return (
    <div className="blog-ekle">
      <div className="blog-ekle-header">
        <h1 className="blog-ekle-title">
          {editingBlog ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı"}
        </h1>

        <div className="header-actions">
          <button className="cancel-btn" onClick={onCancel}>
            <X size={20} />
            İptal
          </button>

          <button className="save-btn" onClick={handleSave}>
            <Save size={20} />
            {editingBlog ? "Güncelle" : "Kaydet"}
          </button>
        </div>
      </div>

      <div className="blog-form-container">
        {/* Main Form */}
        <div className="main-form">
          <div className="form-group">
            <label className="form-label">Başlık *</label>
            <input
              type="text"
              value={blogForm.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              placeholder="Blog yazısının başlığını girin..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL Slug</label>
            <input
              type="text"
              value={blogForm.slug}
              onChange={(e) => handleFormChange("slug", e.target.value)}
              placeholder="blog-yazisi-url-slug"
              className="form-input"
            />
            <p className="form-help">
              URL: /blog/{blogForm.slug || "blog-yazisi-url-slug"}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Özet *</label>
            <textarea
              value={blogForm.excerpt}
              onChange={(e) => handleFormChange("excerpt", e.target.value)}
              placeholder="Blog yazısının kısa özetini girin..."
              rows={3}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">İçerik *</label>
            <textarea
              value={blogForm.content}
              onChange={(e) => handleFormChange("content", e.target.value)}
              placeholder="Blog yazısının HTML içeriğini girin..."
              rows={20}
              className="form-textarea content-textarea"
            />
            <p className="form-help">
              HTML etiketlerini kullanabilirsiniz: &lt;h2&gt;, &lt;h3&gt;,
              &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt; vb.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="form-sidebar">
          {/* Publish Settings */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Yayın Ayarları</h3>

            <div className="form-group">
              <label className="form-label">Durum</label>
              <select
                value={blogForm.status}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="form-select"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayınla</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Yazar *</label>
              <input
                type="text"
                value={blogForm.author}
                onChange={(e) => handleFormChange("author", e.target.value)}
                placeholder="Yazar adı"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                value={blogForm.category}
                onChange={(e) => handleFormChange("category", e.target.value)}
                className="form-select"
              >
                <option value="">Kategori seçin</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Media */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Kapak Görseli</h3>

            <div className="form-group">
              <input
                type="url"
                value={blogForm.image}
                onChange={(e) => handleFormChange("image", e.target.value)}
                placeholder="Görsel URL'si girin..."
                className="form-input"
              />
            </div>

            {blogForm.image && (
              <div className="image-preview">
                <img
                  src={blogForm.image}
                  alt="Preview"
                  className="preview-image"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Etiketler</h3>

            <textarea
              value={blogForm.tags}
              onChange={(e) => handleFormChange("tags", e.target.value)}
              placeholder="Etiketleri virgülle ayırın... (örn: React, JavaScript, Web)"
              rows={3}
              className="form-textarea"
            />

            {blogForm.tags && (
              <div className="tags-preview">
                {blogForm.tags.split(",").map((tag, index) => {
                  const trimmedTag = tag.trim();
                  if (!trimmedTag) return null;
                  return (
                    <span key={index} className="tag-preview">
                      #{trimmedTag}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEkle;
