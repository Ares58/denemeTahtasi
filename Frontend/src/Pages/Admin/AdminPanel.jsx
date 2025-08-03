import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

const API_URL = "http://localhost:3001/blogs"; // Backend API adresin

function AdminPanel() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    date: "",
    category: "",
    readTime: "",
    image: "",
    tags: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await axios.get(API_URL);
    setBlogs(res.data.reverse());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingBlog) {
      await axios.put(`${API_URL}/${editingBlog.id}`, {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      });
    } else {
      await axios.post(API_URL, {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      });
    }
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      date: "",
      category: "",
      readTime: "",
      image: "",
      tags: "",
    });
    setEditingBlog(null);
    fetchBlogs();
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      ...blog,
      tags: blog.tags.join(", "),
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchBlogs();
  };

  return (
    <div className="admin-panel">
      <h1>Admin Paneli</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editingBlog ? "Blog Güncelle" : "Yeni Blog Ekle"}</h2>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Başlık"
          required
        />
        <input
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          placeholder="Kısa açıklama"
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="İçerik"
        />
        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Yazar"
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Kategori"
        />
        <input
          name="readTime"
          value={formData.readTime}
          onChange={handleChange}
          placeholder="Okuma Süresi"
        />
        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Görsel URL"
        />
        <input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Etiketler (virgülle ayır)"
        />
        <button type="submit">{editingBlog ? "Güncelle" : "Ekle"}</button>
      </form>

      <div className="admin-blog-list">
        <h2>Mevcut Bloglar</h2>
        {blogs.map((blog) => (
          <div key={blog.id} className="admin-blog-card">
            <div className="admin-blog-info">
              <h3>{blog.title}</h3>
              <p>
                {blog.author} -{" "}
                {new Date(blog.date).toLocaleDateString("tr-TR")}
              </p>
            </div>
            <div className="admin-blog-actions">
              <button onClick={() => handleEdit(blog)}>Düzenle</button>
              <button onClick={() => handleDelete(blog.id)}>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
