import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  Image,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";

// Mock data - gerçek uygulamada bu API'den gelecek
const INITIAL_BLOGS = [
  {
    id: 1,
    title: "React ile Modern Web Geliştirme",
    slug: "react-ile-modern-web-gelistirme",
    excerpt:
      "React'ın en son özelliklerini kullanarak modern web uygulamaları geliştirme rehberi.",
    content: `<h2>React ile Modern Web Geliştirme</h2>
    
    <p>React, günümüzde web geliştirme dünyasının en popüler JavaScript kütüphanelerinden biridir. Facebook tarafından geliştirilen bu güçlü araç, kullanıcı arayüzleri oluşturmak için component-based bir yaklaşım sunar.</p>
    
    <h3>React'ın Avantajları</h3>
    
    <p>React'ın sunduğu başlıca avantajlar şunlardır:</p>
    
    <ul>
      <li><strong>Virtual DOM:</strong> Performans optimizasyonu için sanal DOM kullanır</li>
      <li><strong>Component-Based:</strong> Yeniden kullanılabilir bileşenler oluşturmanızı sağlar</li>
      <li><strong>JSX:</strong> HTML benzeri syntax ile JavaScript yazmayı kolaylaştırır</li>
      <li><strong>Hooks:</strong> Fonksiyonel componentlerde state yönetimi imkanı sunar</li>
    </ul>`,
    author: "Ahmet Yılmaz",
    date: "2024-08-01",
    category: "Teknoloji",
    readTime: "8 dk",
    views: 1250,
    likes: 45,
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop",
    tags: ["React", "JavaScript", "Web Development", "Frontend"],
    status: "published",
  },
  {
    id: 2,
    title: "CSS Grid ve Flexbox Karşılaştırması",
    slug: "css-grid-ve-flexbox-karsilastirmasi",
    excerpt:
      "Modern CSS layout sistemleri olan Grid ve Flexbox'ın avantajları ve kullanım alanları.",
    content: `<h2>CSS Grid ve Flexbox Karşılaştırması</h2>
    
    <p>Modern web tasarımında layout oluşturmak için iki güçlü araç vardır: CSS Grid ve Flexbox. Her ikisi de farklı senaryolar için optimize edilmiştir.</p>`,
    author: "Ayşe Demir",
    date: "2024-07-28",
    category: "Tasarım",
    readTime: "6 dk",
    views: 890,
    likes: 32,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
    tags: ["CSS", "Layout", "Design", "Frontend"],
    status: "published",
  },
];

const BlogAdminPanel = () => {
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // Form state for blog creation/editing
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

  const categories = [
    "Teknoloji",
    "Tasarım",
    "Backend",
    "Performance",
    "Frontend",
  ];
  const statuses = [
    { value: "all", label: "Tümü" },
    { value: "published", label: "Yayınlanan" },
    { value: "draft", label: "Taslak" },
  ];

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  };

  // Calculate read time based on content
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} dk`;
  };

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

  // Reset form
  const resetForm = () => {
    setBlogForm({
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
    setEditingBlog(null);
  };

  // Save blog (create or update)
  const saveBlog = () => {
    if (!blogForm.title || !blogForm.content || !blogForm.author) {
      alert("Başlık, içerik ve yazar alanları zorunludur!");
      return;
    }

    const blogData = {
      ...blogForm,
      tags: blogForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      readTime: calculateReadTime(blogForm.content),
      date: editingBlog
        ? editingBlog.date
        : new Date().toISOString().split("T")[0],
      views: editingBlog ? editingBlog.views : 0,
      likes: editingBlog ? editingBlog.likes : 0,
    };

    if (editingBlog) {
      // Update existing blog
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === editingBlog.id ? { ...blog, ...blogData } : blog
        )
      );
    } else {
      // Create new blog
      const newBlog = {
        ...blogData,
        id: Date.now(),
      };
      setBlogs((prev) => [newBlog, ...prev]);
    }

    resetForm();
    setCurrentPage("blogs");
  };

  // Edit blog
  const editBlog = (blog) => {
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      tags: blog.tags.join(", "),
      image: blog.image,
      status: blog.status,
    });
    setEditingBlog(blog);
    setCurrentPage("create");
  };

  // Delete blog
  const deleteBlog = (id) => {
    setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    setShowDeleteModal(null);
  };

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || blog.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Dashboard stats
  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === "published").length,
    drafts: blogs.filter((b) => b.status === "draft").length,
    totalViews: blogs.reduce((sum, b) => sum + b.views, 0),
  };

  // Sidebar component
  const Sidebar = () => (
    <div
      style={{
        width: "280px",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "1.5rem",
        padding: "2rem",
        height: "fit-content",
        position: "sticky",
        top: "2rem",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.5rem",
          }}
        >
          SAVTEK
        </h2>
        <p style={{ color: "#a0a0a0", fontSize: "0.9rem" }}>Blog Admin Panel</p>
      </div>

      <nav>
        {[
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
          { id: "blogs", label: "Blog Yazıları", icon: BookOpen },
          { id: "create", label: "Yeni Yazı", icon: Plus },
          { id: "settings", label: "Ayarlar", icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1rem",
                background:
                  currentPage === item.id
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "transparent",
                color: currentPage === item.id ? "white" : "#a0a0a0",
                border: "none",
                borderRadius: "1rem",
                cursor: "pointer",
                marginBottom: "0.5rem",
                transition: "all 0.3s ease",
                fontSize: "0.95rem",
                fontWeight: "500",
              }}
              onMouseOver={(e) => {
                if (currentPage !== item.id) {
                  e.target.style.background = "rgba(255, 255, 255, 0.05)";
                  e.target.style.color = "white";
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== item.id) {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#a0a0a0";
                }
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: "2rem",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <button
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem",
            background: "transparent",
            color: "#ff6b6b",
            border: "none",
            borderRadius: "1rem",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
        >
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </div>
    </div>
  );

  // Dashboard page
  const DashboardPage = () => (
    <div>
      <h1
        style={{
          color: "white",
          fontSize: "2rem",
          fontWeight: "800",
          marginBottom: "2rem",
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {[
          { label: "Toplam Yazı", value: stats.total, color: "#667eea" },
          { label: "Yayınlanan", value: stats.published, color: "#10b981" },
          { label: "Taslak", value: stats.drafts, color: "#f59e0b" },
          {
            label: "Toplam Görüntüleme",
            value: stats.totalViews,
            color: "#ef4444",
          },
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "1.5rem",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: stat.color,
                marginBottom: "0.5rem",
              }}
            >
              {stat.value}
            </div>
            <div style={{ color: "#a0a0a0", fontSize: "1rem" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "1.5rem",
          padding: "2rem",
        }}
      >
        <h2
          style={{ color: "white", fontSize: "1.5rem", marginBottom: "1.5rem" }}
        >
          Son Blog Yazıları
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {blogs.slice(0, 5).map((blog) => (
            <div
              key={blog.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "1rem",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div>
                <h4 style={{ color: "white", margin: "0 0 0.5rem 0" }}>
                  {blog.title}
                </h4>
                <p style={{ color: "#a0a0a0", margin: 0, fontSize: "0.9rem" }}>
                  {blog.author} •{" "}
                  {new Date(blog.date).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <div
                style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "1rem",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  background:
                    blog.status === "published"
                      ? "rgba(16, 185, 129, 0.2)"
                      : "rgba(245, 158, 11, 0.2)",
                  color: blog.status === "published" ? "#10b981" : "#f59e0b",
                }}
              >
                {blog.status === "published" ? "Yayınlanan" : "Taslak"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Blog list page
  const BlogsPage = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "2rem",
            fontWeight: "800",
          }}
        >
          Blog Yazıları ({filteredBlogs.length})
        </h1>
        <button
          onClick={() => {
            resetForm();
            setCurrentPage("create");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "1rem 2rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "2rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
            transition: "transform 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
          onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
        >
          <Plus size={20} />
          Yeni Yazı
        </button>
      </div>

      {/* Search and Filter */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "300px", position: "relative" }}>
          <Search
            size={20}
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#a0a0a0",
            }}
          />
          <input
            type="text"
            placeholder="Blog yazılarında ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem 1rem 1rem 3rem",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "1rem",
              color: "white",
              fontSize: "1rem",
              outline: "none",
            }}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "1rem",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "1rem",
            color: "white",
            fontSize: "1rem",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {statuses.map((status) => (
            <option
              key={status.value}
              value={status.value}
              style={{ background: "#1a1a2e" }}
            >
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Blog List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filteredBlogs.map((blog) => (
          <div
            key={blog.id}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "1.5rem",
              padding: "2rem",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}
            >
              <img
                src={blog.image}
                alt={blog.title}
                style={{
                  width: "150px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "1rem",
                  flexShrink: 0,
                }}
              />

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        color: "white",
                        fontSize: "1.3rem",
                        fontWeight: "700",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {blog.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        color: "#a0a0a0",
                        fontSize: "0.9rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span>{blog.author}</span>
                      <span>•</span>
                      <span>
                        {new Date(blog.date).toLocaleDateString("tr-TR")}
                      </span>
                      <span>•</span>
                      <span>{blog.category}</span>
                      <span>•</span>
                      <span>{blog.views} görüntüleme</span>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "2rem",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      background:
                        blog.status === "published"
                          ? "rgba(16, 185, 129, 0.2)"
                          : "rgba(245, 158, 11, 0.2)",
                      color:
                        blog.status === "published" ? "#10b981" : "#f59e0b",
                    }}
                  >
                    {blog.status === "published" ? "Yayınlanan" : "Taslak"}
                  </div>
                </div>

                <p
                  style={{
                    color: "#d0d0d0",
                    lineHeight: "1.6",
                    marginBottom: "1rem",
                  }}
                >
                  {blog.excerpt}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        background: "rgba(102, 126, 234, 0.1)",
                        color: "rgba(102, 126, 234, 0.9)",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "1rem",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => editBlog(blog)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                      background: "rgba(102, 126, 234, 0.2)",
                      color: "#667eea",
                      border: "1px solid rgba(102, 126, 234, 0.3)",
                      borderRadius: "1rem",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    <Edit size={16} />
                    Düzenle
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(blog.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                      background: "rgba(239, 68, 68, 0.2)",
                      color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      borderRadius: "1rem",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    <Trash2 size={16} />
                    Sil
                  </button>

                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "#a0a0a0",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "1rem",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    <Eye size={16} />
                    Önizle
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "2rem",
          }}
        >
          <BookOpen
            size={64}
            style={{ color: "#a0a0a0", marginBottom: "1rem", opacity: 0.5 }}
          />
          <h3 style={{ color: "white", marginBottom: "0.5rem" }}>
            Henüz blog yazısı yok
          </h3>
          <p style={{ color: "#a0a0a0" }}>
            İlk blog yazınızı oluşturmak için "Yeni Yazı" butonuna tıklayın.
          </p>
        </div>
      )}
    </div>
  );

  // Create/Edit page
  const CreatePage = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "2rem",
            fontWeight: "800",
          }}
        >
          {editingBlog ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı"}
        </h1>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={resetForm}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 2rem",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#a0a0a0",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "2rem",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            <X size={20} />
            İptal
          </button>

          <button
            onClick={saveBlog}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 2rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "2rem",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Save size={20} />
            {editingBlog ? "Güncelle" : "Kaydet"}
          </button>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}
      >
        {/* Main Form */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "1.5rem",
            padding: "2rem",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                color: "white",
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Başlık *
            </label>
            <input
              type="text"
              value={blogForm.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              placeholder="Blog yazısının başlığını girin..."
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "1rem",
                color: "white",
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                color: "white",
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              URL Slug
            </label>
            <input
              type="text"
              value={blogForm.slug}
              onChange={(e) => handleFormChange("slug", e.target.value)}
              placeholder="blog-yazisi-url-slug"
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "1rem",
                color: "white",
                fontSize: "1rem",
                outline: "none",
              }}
            />
            <p
              style={{
                color: "#a0a0a0",
                fontSize: "0.85rem",
                marginTop: "0.5rem",
              }}
            >
              URL: /blog/{blogForm.slug || "blog-yazisi-url-slug"}
            </p>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                color: "white",
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Özet *
            </label>
            <textarea
              value={blogForm.excerpt}
              onChange={(e) => handleFormChange("excerpt", e.target.value)}
              placeholder="Blog yazısının kısa özetini girin..."
              rows={3}
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "1rem",
                color: "white",
                fontSize: "1rem",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                color: "white",
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              İçerik *
            </label>
            <textarea
              value={blogForm.content}
              onChange={(e) => handleFormChange("content", e.target.value)}
              placeholder="Blog yazısının HTML içeriğini girin..."
              rows={20}
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "1rem",
                color: "white",
                fontSize: "1rem",
                outline: "none",
                resize: "vertical",
                fontFamily: "monospace",
                lineHeight: "1.5",
              }}
            />
            <p
              style={{
                color: "#a0a0a0",
                fontSize: "0.85rem",
                marginTop: "0.5rem",
              }}
            >
              HTML etiketlerini kullanabilirsiniz: &lt;h2&gt;, &lt;h3&gt;,
              &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt; vb.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Publish Settings */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "1.5rem",
              padding: "2rem",
            }}
          >
            <h3
              style={{
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "700",
                marginBottom: "1.5rem",
              }}
            >
              Yayın Ayarları
            </h3>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  color: "white",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                Durum
              </label>
              <select
                value={blogForm.status}
                onChange={(e) => handleFormChange("status", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "1rem",
                  color: "white",
                  fontSize: "0.95rem",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="draft" style={{ background: "#1a1a2e" }}>
                  Taslak
                </option>
                <option value="published" style={{ background: "#1a1a2e" }}>
                  Yayınla
                </option>
              </select>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  color: "white",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                Yazar *
              </label>
              <input
                type="text"
                value={blogForm.author}
                onChange={(e) => handleFormChange("author", e.target.value)}
                placeholder="Yazar adı"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "1rem",
                  color: "white",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  color: "white",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                Kategori
              </label>
              <select
                value={blogForm.category}
                onChange={(e) => handleFormChange("category", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "1rem",
                  color: "white",
                  fontSize: "0.95rem",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#1a1a2e" }}>
                  Kategori seçin
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    style={{ background: "#1a1a2e" }}
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Media */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "1.5rem",
              padding: "2rem",
            }}
          >
            <h3
              style={{
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "700",
                marginBottom: "1.5rem",
              }}
            >
              Kapak Görseli
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <input
                type="url"
                value={blogForm.image}
                onChange={(e) => handleFormChange("image", e.target.value)}
                placeholder="Görsel URL'si girin..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "1rem",
                  color: "white",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            {blogForm.image && (
              <div
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "1rem",
                  overflow: "hidden",
                }}
              >
                <img
                  src={blogForm.image}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "1.5rem",
              padding: "2rem",
            }}
          >
            <h3
              style={{
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "700",
                marginBottom: "1.5rem",
              }}
            >
              Etiketler
            </h3>

            <textarea
              value={blogForm.tags}
              onChange={(e) => handleFormChange("tags", e.target.value)}
              placeholder="Etiketleri virgülle ayırın... (örn: React, JavaScript, Web)"
              rows={3}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "1rem",
                color: "white",
                fontSize: "0.95rem",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />

            {blogForm.tags && (
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                {blogForm.tags.split(",").map((tag, index) => {
                  const trimmedTag = tag.trim();
                  if (!trimmedTag) return null;
                  return (
                    <span
                      key={index}
                      style={{
                        background: "rgba(102, 126, 234, 0.1)",
                        color: "rgba(102, 126, 234, 0.9)",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "1rem",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                      }}
                    >
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

  // Settings page
  const SettingsPage = () => (
    <div>
      <h1
        style={{
          color: "white",
          fontSize: "2rem",
          fontWeight: "800",
          marginBottom: "2rem",
        }}
      >
        Ayarlar
      </h1>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "1.5rem",
          padding: "2rem",
        }}
      >
        <h2
          style={{ color: "white", fontSize: "1.5rem", marginBottom: "1rem" }}
        >
          Genel Ayarlar
        </h2>
        <p style={{ color: "#a0a0a0" }}>
          Site ayarları ve konfigürasyonlar burada yer alacak.
        </p>
      </div>
    </div>
  );

  // Delete confirmation modal
  const DeleteModal = ({ blogId, onClose, onConfirm }) => {
    const blog = blogs.find((b) => b.id === blogId);
    if (!blog) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: "rgba(26, 26, 46, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "1.5rem",
            padding: "2rem",
            maxWidth: "500px",
            width: "90%",
          }}
        >
          <h3
            style={{
              color: "white",
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1rem",
            }}
          >
            Blog Yazısını Sil
          </h3>

          <p
            style={{
              color: "#a0a0a0",
              lineHeight: "1.6",
              marginBottom: "1.5rem",
            }}
          >
            "<strong style={{ color: "white" }}>{blog.title}</strong>" adlı blog
            yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>

          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "0.75rem 1.5rem",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#a0a0a0",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "1rem",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: "600",
              }}
            >
              İptal
            </button>

            <button
              onClick={() => onConfirm(blogId)}
              style={{
                padding: "0.75rem 1.5rem",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "white",
                border: "none",
                borderRadius: "1rem",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: "600",
              }}
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "2rem",
          alignItems: "flex-start",
        }}
      >
        <Sidebar />

        <main style={{ minHeight: "80vh" }}>
          {currentPage === "dashboard" && <DashboardPage />}
          {currentPage === "blogs" && <BlogsPage />}
          {currentPage === "create" && <CreatePage />}
          {currentPage === "settings" && <SettingsPage />}
        </main>
      </div>

      {showDeleteModal && (
        <DeleteModal
          blogId={showDeleteModal}
          onClose={() => setShowDeleteModal(null)}
          onConfirm={deleteBlog}
        />
      )}
    </div>
  );
};

export default BlogAdminPanel;
