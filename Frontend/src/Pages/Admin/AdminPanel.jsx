import React, { useState, useReducer, useEffect } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Dashboard from "./components/Dashboard";
import Bloglar from "./components/Blogs";
import BlogEkle from "./components/AddBlog";
import Ayarlar from "./components/Settings";
import Sidebar from "./components/Sidebar";
import DeleteModal from "./components/DeleteModal";
import "./components/Style/AdminPanel.css";

// Environment-based API configuration
const getApiBaseUrl = () => {
  // Önce environment variable'ı kontrol et
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Production'da window.location.origin kullan
  if (window.location.hostname === "savteksitesi.onrender.com") {
    return "https://savteksitesi.onrender.com";
  }

  // Local development
  return "http://localhost:5000";
};

const API_BASE_URL = getApiBaseUrl();
const BLOG_API_URL = `${API_BASE_URL}/api/blogs`;
const AUTH_API_URL = `${API_BASE_URL}/api/auth`;

console.log("API Base URL:", API_BASE_URL); // Debug için

// Axios default configuration
axios.defaults.withCredentials = true;
axios.defaults.timeout = 15000; // 15 saniye timeout

// Form reducer for better state management
const initialFormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "",
  category: "",
  tags: "",
  image: "",
  status: "draft",
};

function formReducer(state, action) {
  switch (action.type) {
    case "CHANGE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "SET_FORM":
      return {
        ...action.payload,
        tags: Array.isArray(action.payload.tags)
          ? action.payload.tags.join(", ")
          : action.payload.tags || "",
      };
    case "RESET":
      return initialFormState;
    default:
      return state;
  }
}

const BlogAdminPanel = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [formData, dispatchForm] = useReducer(formReducer, initialFormState);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const queryClient = useQueryClient();

  const categories = [
    "Teknoloji",
    "Tasarım",
    "Backend",
    "Frontend",
    "Performance",
  ];

  // Improved auth verification with better error handling
  const verifyAuth = async () => {
    try {
      console.log("Auth verification başlıyor...", AUTH_API_URL);

      const response = await axios.get(`${AUTH_API_URL}/verify`, {
        withCredentials: true,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Auth verification response:", response.data);

      if (response.data.valid) {
        setIsAuthenticated(true);
        console.log("Authentication başarılı");
      } else {
        console.log("Authentication başarısız - login'e yönlendiriliyor");
        setIsAuthenticated(false);
        // Relative path kullan
        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.error("Auth verification error:", error);

      // Network error vs server error ayrımı
      if (error.code === "ECONNABORTED") {
        console.error("Timeout error");
        setError("Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.");
      } else if (error.response) {
        console.error(
          "Server error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("Network error:", error.request);
        setError(
          "Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin."
        );
      }

      setIsAuthenticated(false);
      // Production'da farklı davranış
      if (window.location.hostname === "savteksitesi.onrender.com") {
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 2000);
      } else {
        window.location.href = "/admin/login";
      }
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    // Immediate auth verification - no delay needed
    verifyAuth();
  }, []);

  // Fetch blogs with improved error handling
  const {
    data: blogs = [],
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      console.log("Blogs fetch başlıyor...", BLOG_API_URL);

      const response = await axios.get(BLOG_API_URL, {
        withCredentials: true,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Blogs fetch response:", response.data);

      // Ensure data consistency and add missing fields
      return response.data
        .map((blog) => ({
          ...blog,
          id: blog._id || blog.id,
          views: blog.views || 0,
          likes: blog.likes || 0,
          status: blog.status || "draft",
          tags: Array.isArray(blog.tags) ? blog.tags : [],
          readTime: blog.readTime || calculateReadTime(blog.content || ""),
        }))
        .reverse();
    },
    onError: (error) => {
      console.error("Blogs fetch error:", error);
      setError(
        "Bloglar yüklenirken hata oluştu: " +
          (error.message || "Bilinmeyen hata")
      );
    },
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: 3,
    retryDelay: 1000,
  });

  // Blog create/update mutation with improved error handling
  const mutation = useMutation({
    mutationFn: async (blogData) => {
      const processedData = {
        ...blogData,
        tags:
          typeof blogData.tags === "string"
            ? blogData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : blogData.tags,
        readTime: calculateReadTime(blogData.content),
        date: editingBlog
          ? editingBlog.date
          : new Date().toISOString().split("T")[0],
        views: editingBlog ? editingBlog.views : 0,
        likes: editingBlog ? editingBlog.likes : 0,
      };

      console.log(
        "Blog mutation başlıyor...",
        editingBlog ? "UPDATE" : "CREATE"
      );

      if (editingBlog) {
        return axios.put(`${BLOG_API_URL}/${editingBlog.id}`, processedData, {
          withCredentials: true,
          timeout: 10000,
        });
      } else {
        return axios.post(BLOG_API_URL, processedData, {
          withCredentials: true,
          timeout: 10000,
        });
      }
    },
    onSuccess: () => {
      console.log("Blog mutation başarılı");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      dispatchForm({ type: "RESET" });
      setEditingBlog(null);
      setCurrentPage("blogs");
      setError("");
    },
    onError: (error) => {
      console.error("Blog mutation error:", error);
      setError(
        "Blog kaydedilirken hata oluştu: " +
          (error.response?.data?.message || error.message || "Bilinmeyen hata")
      );
    },
  });

  // Blog delete mutation with improved error handling
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      console.log("Blog delete başlıyor...", id);
      return axios.delete(`${BLOG_API_URL}/${id}`, {
        withCredentials: true,
        timeout: 10000,
      });
    },
    onSuccess: () => {
      console.log("Blog delete başarılı");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setShowDeleteModal(null);
      setError("");
    },
    onError: (error) => {
      console.error("Blog delete error:", error);
      setError(
        "Blog silinirken hata oluştu: " +
          (error.response?.data?.message || error.message || "Bilinmeyen hata")
      );
    },
  });

  // Improved logout function
  const handleLogout = async () => {
    try {
      console.log("Logout başlıyor...");

      await axios.post(
        `${AUTH_API_URL}/logout`,
        {},
        {
          withCredentials: true,
          timeout: 5000,
        }
      );

      console.log("Logout başarılı");
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if logout fails
      window.location.href = "/admin/login";
    }
  };

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

  // Save blog (create or update)
  const saveBlog = (blogData) => {
    mutation.mutate(blogData);
  };

  // Edit blog
  const editBlog = (blog) => {
    setEditingBlog(blog);
    dispatchForm({ type: "SET_FORM", payload: blog });
    setCurrentPage("create");
  };

  // Delete blog
  const deleteBlog = (id) => {
    deleteMutation.mutate(id);
  };

  // Handle form input changes
  const handleFormChange = (field, value) => {
    dispatchForm({ type: "CHANGE_FIELD", field, value });

    // Auto-generate slug when title changes
    if (field === "title") {
      dispatchForm({
        type: "CHANGE_FIELD",
        field: "slug",
        value: generateSlug(value),
      });
    }
  };

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || blog.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Dashboard stats
  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === "published").length,
    drafts: blogs.filter((b) => b.status === "draft").length,
    totalViews: blogs.reduce((sum, b) => sum + (b.views || 0), 0),
  };

  const renderCurrentPage = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <p>Yükleniyor...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="error-container">
          <p>Bloglar yüklenirken hata oluştu.</p>
          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
            {queryError?.message || "Bilinmeyen hata"}
          </p>
          <button
            onClick={() => {
              setError("");
              queryClient.invalidateQueries({ queryKey: ["blogs"] });
            }}
          >
            Yeniden Dene
          </button>
        </div>
      );
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard stats={stats} blogs={blogs} />;
      case "blogs":
        return (
          <Bloglar
            blogs={filteredBlogs}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onEdit={editBlog}
            onDelete={(id) => setShowDeleteModal(id)}
            onCreateNew={() => {
              setEditingBlog(null);
              dispatchForm({ type: "RESET" });
              setCurrentPage("create");
            }}
          />
        );
      case "create":
        return (
          <BlogEkle
            editingBlog={editingBlog}
            formData={formData}
            onFormChange={handleFormChange}
            onSave={saveBlog}
            onCancel={() => {
              setEditingBlog(null);
              dispatchForm({ type: "RESET" });
              setCurrentPage("blogs");
            }}
            categories={categories}
            generateSlug={generateSlug}
            isLoading={mutation.isPending}
            error={error}
          />
        );
      case "settings":
        return <Ayarlar />;
      default:
        return <Dashboard stats={stats} blogs={blogs} />;
    }
  };

  // Auth loading screen
  if (authLoading) {
    return (
      <div className="loading-container">
        <p>Yetkilendirme kontrol ediliyor...</p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
          API: {API_BASE_URL}
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="loading-container">
        <p>Yönlendiriliyor...</p>
        {error && (
          <p
            style={{
              fontSize: "0.9rem",
              color: "#ef4444",
              marginTop: "0.5rem",
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="admin-panel">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        <div className="admin-container">
          <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          <main className="main-content">
            <div className="admin-header">
              <h1>Admin Panel</h1>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#666",
                  marginRight: "auto",
                  marginLeft: "1rem",
                }}
              >
                API: {API_BASE_URL}
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={16} />
                Çıkış Yap
              </button>
            </div>
            {renderCurrentPage()}
          </main>
        </div>

        {showDeleteModal && (
          <DeleteModal
            blog={blogs.find((b) => b.id === showDeleteModal)}
            onClose={() => setShowDeleteModal(null)}
            onConfirm={deleteBlog}
            isLoading={deleteMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};

export default BlogAdminPanel;
