import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";

import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Tag,
  Share2,
  Heart,
  Bookmark,
  Eye,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { slug } = useParams(); // URL'den slug parametresini al
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Blog verilerini id'ye göre getir
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${slug}`);
        if (!res.ok) throw new Error("Blog bulunamadı");
        const data = await res.json();
        setBlog(data);

        // Görüntülenme sayısını artır
        await fetch(`http://localhost:5000/api/blogs/increment-views/${slug}`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Blog yükleme hatası:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleBack = () => {
    navigate("/blog"); // Blog listesine geri dön
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link kopyalandı!");
    }
  };

  const handleLike = async () => {
    if (liked) return; // İkinci kez beğenilmesin
    try {
      const res = await fetch(
        `http://localhost:5000/api/blogs/increment-likes/${slug}`,
        {
          method: "POST",
        }
      );
      const updatedBlog = await res.json();
      setBlog(updatedBlog);
      setLiked(true);
    } catch (error) {
      console.error("Beğeni hatası:", error);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <div
          style={{
            textAlign: "center",
            color: "white",
            marginTop: "6rem",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid rgba(102, 126, 234, 0.3)",
              borderTop: "3px solid #667eea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "1rem",
            }}
          ></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)",
          color: "white",
        }}
      >
        <Navbar />
        <div
          style={{
            textAlign: "center",
            padding: "6rem 2rem",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Blog yazısı bulunamadı
          </h1>
          <p style={{ color: "#a0a0a0", marginBottom: "2rem" }}>
            Aradığınız blog yazısı mevcut değil veya kaldırılmış olabilir.
          </p>
          <button
            onClick={handleBack}
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
              margin: "0 auto",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
          >
            <ArrowLeft size={20} />
            Blog sayfasına dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop: 50,
        background:
          "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)",
        color: "white",
      }}
    >
      <Navbar />

      {/* Back Button */}
      <div
        style={{ padding: "2rem 1rem 0", maxWidth: "1200px", margin: "0 auto" }}
      >
        <button
          onClick={handleBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "2rem",
            color: "white",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.08)";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.05)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <ArrowLeft size={18} />
          Bloglara Dön
        </button>
      </div>

      {/* Hero Section */}
      <div
        style={{
          position: "relative",
          height: "60vh",
          minHeight: "400px",
          overflow: "hidden",
          margin: "2rem 1rem",
        }}
      >
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "1.5rem",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#2d2d2d",
              color: "#aaa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "1.5rem",
              fontSize: "1.2rem",
              fontStyle: "italic",
            }}
          ></div>
        )}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
            borderRadius: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              maxWidth: "800px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "0.5rem 1.5rem",
                borderRadius: "2rem",
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "1.5rem",
              }}
            >
              {blog.category}
            </div>
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "900",
                marginBottom: "1rem",
                lineHeight: "1.2",
                background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {blog.title}
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#d0d0d0",
                lineHeight: "1.6",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {blog.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "0 1rem 4rem",
        }}
      >
        {/* Meta Information */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
            padding: "1.5rem",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "1.5rem",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#a0a0a0",
              }}
            >
              <User size={18} />
              <span>{blog.author}</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#a0a0a0",
              }}
            >
              <Calendar size={18} />
              <span>
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#a0a0a0",
              }}
            >
              <Clock size={18} />
              <span>{blog.readTime}</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#a0a0a0",
              }}
            >
              <Eye size={18} />
              <span>{blog.views} görüntüleme</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleLike}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                background: liked
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "rgba(255, 255, 255, 0.05)",
                color: liked ? "white" : "#a0a0a0",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "2rem",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
              }}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
              <span>{blog.likes}</span>
            </button>
            <button
              onClick={handleBookmark}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem",
                background: bookmarked
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "rgba(255, 255, 255, 0.05)",
                color: bookmarked ? "white" : "#a0a0a0",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "2rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#a0a0a0",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "2rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          {blog.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(102, 126, 234, 0.1)",
                color: "rgba(102, 126, 234, 0.9)",
                padding: "0.5rem 1rem",
                borderRadius: "2rem",
                fontSize: "0.85rem",
                fontWeight: "500",
                border: "1px solid rgba(102, 126, 234, 0.2)",
              }}
            >
              <Tag size={14} />
              {tag}
            </span>
          ))}
        </div>

        <div
          className="blog-detail-article"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "1.5rem",
            padding: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          <MDEditor.Markdown
            source={blog.content}
            style={{ backgroundColor: "transparent" }}
          />
        </div>

        {/* Author Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            padding: "2rem",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "1.5rem",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={32} color="white" />
          </div>
          <div>
            <h4
              style={{
                fontSize: "1.3rem",
                fontWeight: "700",
                color: "white",
                marginBottom: "0.5rem",
              }}
            >
              {blog.author}
            </h4>
            <p
              style={{
                color: "#a0a0a0",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              Web geliştirici ve teknoloji yazarı. Modern web teknolojileri
              üzerine içerik üretiyor ve açık kaynak projelere katkı sağlıyor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
