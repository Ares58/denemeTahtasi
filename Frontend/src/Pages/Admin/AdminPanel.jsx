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

// API URLs - Doğru endpoint'ler
const API_BASE_URL = "https://savteksitesi.onrender.com";
const BLOG_API_URL = `${API_BASE_URL}/api/blogs`;
const AUTH_API_URL = `${API_BASE_URL}/api/auth`;

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

  // Auth verification
  const verifyAuth = async () => {
    try {
      const response = await axios.get(`${AUTH_API_URL}/verify`, {
        withCredentials: true,
        timeout: 10000,
      });

      if (response.data.valid) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.error("Auth verification error:", error);
      setIsAuthenticated(false);
      window.location.href = "/admin/login";
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    // Login'den sonra auth verification
    const timer = setTimeout(() => {
      verifyAuth();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch blogs with React Query - DOĞRU ENDPOINT
  const {
    data: blogs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: () =>
      axios.get(BLOG_API_URL, { withCredentials: true }).then((res) => {
        // Ensure data consistency and add missing fields
        return res.data
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
      }),
    onError: () => setError("Bloglar yüklenirken hata oluştu."),
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  // Blog create/update mutation
  const mutation = useMutation({
    mutationFn: (blogData) => {
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

      if (editingBlog) {
        return axios.put(`${BLOG_API_URL}/${editingBlog.id}`, processedData, {
          withCredentials: true,
        });
      } else {
        return axios.post(BLOG_API_URL, processedData, {
          withCredentials: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      dispatchForm({ type: "RESET" });
      setEditingBlog(null);
      setCurrentPage("blogs");
      setError("");
    },
    onError: () => setError("Blog kaydedilirken hata oluştu."),
  });

  // Blog delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) =>
      axios.delete(`${BLOG_API_URL}/${id}`, {
        withCredentials: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setShowDeleteModal(null);
      setError("");
    },
    onError: () => setError("Blog silinirken hata oluştu."),
  });

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post(
        `${AUTH_API_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
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
          <button onClick={() => window.location.reload()}>Yeniden Dene</button>
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
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="loading-container">
        <p>Yönlendiriliyor...</p>
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
