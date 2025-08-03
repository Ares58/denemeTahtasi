import React, { useState, useMemo } from "react";
import { Search, Calendar, User, Tag, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Blogs.css";

const BlogPage = () => {
  const navigate = useNavigate();

  // Blog posts verisi - her blog için slug eklendi
  const [blogPosts] = useState([
    {
      id: 1,
      title: "React ile Modern Web Geliştirme",
      slug: "react-ile-modern-web-gelistirme", // URL için slug
      excerpt:
        "React'ın en son özelliklerini kullanarak modern web uygulamaları geliştirme rehberi. Hooks, Context API ve performans optimizasyonları hakkında detaylı bilgiler.",
      content:
        "React ile geliştirme yaparken dikkat edilmesi gereken en önemli noktalarda biri...",
      author: "Ahmet Yılmaz",
      date: "2024-08-01",
      category: "Teknoloji",
      readTime: "5 dk",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      tags: ["React", "JavaScript", "Web Development"],
    },
    {
      id: 2,
      title: "CSS Grid ve Flexbox Karşılaştırması",
      slug: "css-grid-ve-flexbox-karsilastirmasi",
      excerpt:
        "Modern CSS layout sistemleri olan Grid ve Flexbox'ın avantajları ve kullanım alanları. Hangi durumda hangisini kullanmalısınız?",
      content: "CSS Grid ve Flexbox modern web tasarımının temel taşlarıdır...",
      author: "Ayşe Demir",
      date: "2024-07-28",
      category: "Tasarım",
      readTime: "6 dk",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      tags: ["CSS", "Layout", "Design"],
    },
    {
      id: 3,
      title: "JavaScript ES2024 Yeni Özellikleri",
      slug: "javascript-es2024-yeni-ozellikleri",
      excerpt:
        "JavaScript'in 2024 versiyonunda gelen yeni özellikler ve bunların nasıl kullanılacağı hakkında kapsamlı rehber.",
      content:
        "ES2024 ile birlikte JavaScript dünyasına birçok yeni özellik geldi...",
      author: "Mehmet Kaya",
      date: "2024-07-25",
      category: "Teknoloji",
      readTime: "8 dk",
      image:
        "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop",
      tags: ["JavaScript", "ES2024", "Programming"],
    },
    {
      id: 4,
      title: "UX/UI Tasarım Trendleri 2024",
      slug: "ux-ui-tasarim-trendleri-2024",
      excerpt:
        "2024 yılında öne çıkan kullanıcı deneyimi ve arayüz tasarımı trendleri. Modern tasarım yaklaşımları ve best practice'ler.",
      content:
        "2024 yılında UX/UI tasarım dünyasında büyük değişimler yaşanıyor...",
      author: "Zeynep Özkan",
      date: "2024-07-20",
      category: "Tasarım",
      readTime: "7 dk",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
      tags: ["UX", "UI", "Design Trends"],
    },
    {
      id: 5,
      title: "Node.js ile Backend Geliştirme",
      slug: "nodejs-ile-backend-gelistirme",
      excerpt:
        "Node.js kullanarak scalable backend uygulamaları geliştirme rehberi. Express.js, MongoDB ve modern backend mimarisi.",
      content:
        "Node.js ile backend geliştirme konusunda bilmeniz gerekenler...",
      author: "Can Demirci",
      date: "2024-07-15",
      category: "Backend",
      readTime: "10 dk",
      image:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
      tags: ["Node.js", "Backend", "Express"],
    },
    {
      id: 6,
      title: "Web Performance Optimizasyonu",
      slug: "web-performance-optimizasyonu",
      excerpt:
        "Web sitelerinin performansını artırmak için uygulayabileceğiniz teknikler ve best practice'ler. Hız = Başarı!",
      content:
        "Web performance optimizasyonu modern web geliştirmede kritik önemde...",
      author: "Emre Yılmaz",
      date: "2024-07-10",
      category: "Performance",
      readTime: "9 dk",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
      tags: ["Performance", "Optimization", "Web"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  // Get categories
  const categories = [
    "Tümü",
    ...new Set(blogPosts.map((post) => post.category)),
  ];

  // Calculate filtered posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "Tümü" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchTerm, selectedCategory]);

  // Blog card click handler - artık navigate kullanıyor
  const handleBlogClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

  const BlogCard = ({ post }) => (
    <article className="blog-card" onClick={() => handleBlogClick(post.slug)}>
      <div className="blog-card-image-container">
        <img src={post.image} alt={post.title} className="blog-card-image" />
        <div className="blog-card-category">
          <span>{post.category}</span>
        </div>
      </div>

      <div className="blog-card-content">
        <div className="blog-card-meta">
          <div className="blog-card-meta-item">
            <User size={16} />
            <span>{post.author}</span>
          </div>
          <div className="blog-card-meta-item">
            <Calendar size={16} />
            <span>{new Date(post.date).toLocaleDateString("tr-TR")}</span>
          </div>
          <div className="blog-card-meta-item">
            <Clock size={16} />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h3 className="blog-card-title">{post.title}</h3>

        <p className="blog-card-excerpt">{post.excerpt}</p>

        <div className="blog-card-tags">
          {post.tags.map((tag, index) => (
            <span key={index} className="blog-card-tag">
              #{tag}
            </span>
          ))}
        </div>

        <button className="blog-card-readmore">
          Devamını Oku
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );

  return (
    <div className="blog-container">
      <Navbar />

      {/* Hero Section */}
      <section className="blog-hero">
        <div className="blog-header-content">
          <div className="blog-badge">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m8 3 4 8 5-5v11H3V6l5 5z" />
            </svg>
            <span>Blog</span>
          </div>

          <h1 className="blog-title">SAVTEK BLOG</h1>

          <p className="blog-subtitle">
            Teknoloji, tasarım ve geliştirme dünyasından en güncel yazılar ve
            rehberler
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="blog-main">
        {/* Filters Section */}
        <div className="blog-filters">
          <div className="filter-container">
            {/* Search Bar */}
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Category Filter */}
            <div className="category-container">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-button ${
                    selectedCategory === category
                      ? "category-button-active"
                      : "category-button-default"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          <p>
            <strong>{filteredPosts.length}</strong> yazı bulundu
            {searchTerm && (
              <span style={{ marginLeft: "0.5rem" }}>
                "<strong>{searchTerm}</strong>" için
              </span>
            )}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div
              style={{ color: "#a0a0a0", marginBottom: "1.5rem", opacity: 0.7 }}
            >
              <Search size={64} />
            </div>
            <h3 className="no-results-title">
              Aradığınız kriterlere uygun yazı bulunamadı
            </h3>
            <p className="no-results-text">
              Farklı anahtar kelimeler veya kategoriler deneyebilirsiniz.
            </p>
          </div>
        )}

        {/* Newsletter Section */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(15px)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            color: "white",
            padding: "6rem 0",
            marginTop: "5rem",
            position: "relative",
            borderRadius: "2rem 2rem 0 0",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          ></div>
          <footer>
            <div
              style={{
                maxWidth: "56rem",
                marginLeft: "auto",
                marginRight: "auto",
                padding: "0 1rem",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  marginBottom: "1rem",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Yeni yazılardan haberdar ol
              </h2>

              <p
                style={{
                  color: "#a0a0a0",
                  marginBottom: "2.5rem",
                  fontSize: "1.2rem",
                  lineHeight: "1.6",
                }}
              >
                E-posta adresinizi girerek yeni blog yazılarımızdan anında
                haberdar olabilirsiniz.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  maxWidth: "32rem",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  style={{
                    flex: 1,
                    padding: "1rem 1.5rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "2rem",
                    color: "white",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
                <button
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    padding: "1rem 2rem",
                    borderRadius: "2rem",
                    fontWeight: "600",
                    fontSize: "1rem",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  Abone Ol
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
