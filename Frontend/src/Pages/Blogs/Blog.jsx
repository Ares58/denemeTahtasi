import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Search, Calendar, User, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Blogs.css";

const BlogPage = () => {
  const navigate = useNavigate();

  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  useEffect(() => {
    // Backend API'den blogları çek
    axios
      .get("http://localhost:5000/api/blogs")
      .then((res) => {
        setBlogPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Bloglar alınamadı:", err);
        setLoading(false);
      });
  }, []);

  const renderLoadingParticles = () => {
    const particles = [];
    for (let i = 0; i < 25; i++) {
      particles.push(
        <div
          key={i}
          className="loading-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${Math.random() * 2 + 3}s`,
          }}
        />
      );
    }
    return particles;
  };

  // Kategorileri backend’den gelen bloglardan oluştur
  const categories = useMemo(() => {
    return ["Tümü", ...new Set(blogPosts.map((post) => post.category))];
  }, [blogPosts]);

  // Filtreleme işlemi
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "Tümü" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchTerm, selectedCategory]);

  // Blog kartına tıklayınca slug ile yönlendir
  const handleBlogClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

  const BlogCard = ({ post }) => (
    <article className="blog-card" onClick={() => handleBlogClick(post.slug)}>
      <div className="blog-card-image-container">
        {post.image ? (
          <img src={post.image} alt={post.title} className="blog-card-image" />
        ) : (
          <div className="blog-card-image-placeholder">Görsel Yok</div>
        )}

        <div className="blog-card-category">
          <span>{post.category}</span>
        </div>
      </div>

      <div className="blog-card-content">
        <div className="blog-card-meta">
          <div className="blog-card-meta-item">
            <User size={16} />
            <span>{post.author || "Yazar Bilgisi Yok"}</span>
          </div>
          <div className="blog-card-meta-item">
            <Calendar size={16} />
            <span>
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>
        </div>

        <h3 className="blog-card-title">{post.title}</h3>

        <p className="blog-card-excerpt">{post.excerpt || ""}</p>

        <div className="blog-card-tags">
          {(post.tags || []).map((tag, index) => (
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

  if (loading) {
    return (
      <div className="blog-container">
        <Navbar />
        <div className="loading-container">
          <div className="loading-particles">{renderLoadingParticles()}</div>

          <div className="loading-content">
            <div className="loading-badge">
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
              <span>Blog Yükleniyor</span>
            </div>

            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
            </div>

            <h2 className="loading-title">SAVTEK BLOG</h2>
            <p className="loading-text">
              En güncel teknoloji yazıları yükleniyor...
            </p>

            <div className="loading-tips">
              <div className="loading-tips-title">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                İpucu
              </div>
              <p className="loading-tips-text">
                Arama özelliğini kullanarak istediğiniz konudaki yazıları
                kolayca bulabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <span className="results-count-search-term">
                "<strong>{searchTerm}</strong>" için
              </span>
            )}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <BlogCard key={post._id || post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">
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
      </div>
      {/* Newsletter Section */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-title">
              Ege'nin en büyük savunma teknolojileri topluluğu.
            </div>
            <p className="footer-description">
              Sizleri de yanımızda görmek isteriz
            </p>
            <div className="footer-links">
              <a href="#">Gizlilik</a>
              <a href="#">Kullanım Koşulları</a>
              <a href="#">Destek</a>
              <a href="#">İletişim</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;
