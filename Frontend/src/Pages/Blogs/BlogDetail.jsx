import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
    const getBlogBySlug = (slug) => {
      // Burada normalde API'den veri çekersiniz
      // Şimdilik örnek veri döndürüyoruz
      const blogs = [
        {
          id: 1,
          title: "React ile Modern Web Geliştirme",
          slug: "react-ile-modern-web-gelistirme",

          excerpt:
            "React'ın en son özelliklerini kullanarak modern web uygulamaları geliştirme rehberi.",
          content: `
            <h2>React ile Modern Web Geliştirme</h2>
            
            <p>React, günümüzde web geliştirme dünyasının en popüler JavaScript kütüphanelerinden biridir. Facebook tarafından geliştirilen bu güçlü araç, kullanıcı arayüzleri oluşturmak için component-based bir yaklaşım sunar.</p>
            
            <h3>React'ın Avantajları</h3>
            
            <p>React'ın sunduğu başlıca avantajlar şunlardır:</p>
            
            <ul>
              <li><strong>Virtual DOM:</strong> Performans optimizasyonu için sanal DOM kullanır</li>
              <li><strong>Component-Based:</strong> Yeniden kullanılabilir bileşenler oluşturmanızı sağlar</li>
              <li><strong>JSX:</strong> HTML benzeri syntax ile JavaScript yazmayı kolaylaştırır</li>
              <li><strong>Hooks:</strong> Fonksiyonel componentlerde state yönetimi imkanı sunar</li>
            </ul>
            
            <h3>Modern React Özellikleri</h3>
            
            <p>React'ın son sürümlerinde gelen önemli özellikler:</p>
            
            <h4>1. React Hooks</h4>
            <p>Hooks, fonksiyonel componentlerde state ve lifecycle metodlarını kullanmanıza olanak tanır. En yaygın kullanılan hooks:</p>
            
            <pre><code>import React, { useState, useEffect } from 'react';

function ExampleComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
        Increment
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
            
            <h4>2. Context API</h4>
            <p>Context API, prop drilling problemini çözmek için kullanılan güçlü bir araçtır. Global state yönetimi için Redux'a alternatif olarak kullanılabilir.</p>
            
            <h4>3. Suspense ve Lazy Loading</h4>
            <p>React Suspense, asenkron işlemler için loading state'lerini yönetmeyi kolaylaştırır:</p>
            
            <pre><code>import React, { Suspense, lazy } from 'react';

const LazyComponent = lazy(() =&gt; import('./LazyComponent'));

function App() {
  return (
    &lt;Suspense fallback={&lt;div&gt;Loading...&lt;/div&gt;}&gt;
      &lt;LazyComponent /&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>
            
            <h3>Best Practices</h3>
            
            <p>React projelerinde dikkat edilmesi gereken en iyi uygulamalar:</p>
            
            <ol>
              <li><strong>Component Yapısı:</strong> Küçük, tek sorumluluğa sahip componentler oluşturun</li>
              <li><strong>State Yönetimi:</strong> Local state mı global state mi karar verin</li>
              <li><strong>Performance:</strong> React.memo, useMemo, useCallback kullanarak performans optimize edin</li>
              <li><strong>Error Boundaries:</strong> Hata yakalama için Error Boundary componentleri kullanın</li>
            </ol>
            
            <h3>Sonuç</h3>
            
            <p>React, modern web geliştirme için güçlü araçlar sunan, sürekli gelişen bir kütüphanedir. Doğru kullanıldığında, hızlı, ölçeklenebilir ve bakımı kolay web uygulamaları geliştirebilirsiniz.</p>
            
            <p>Bu yazıda React'ın temel özelliklerini ve modern geliştirme tekniklerini ele aldık. Daha detaylı bilgi için React'ın resmi dokümantasyonunu incelemenizi öneririm.</p>
          `,
          author: "Ahmet Yılmaz",
          date: "2024-08-01",
          category: "Teknoloji",
          readTime: "8 dk",
          views: 1250,
          likes: 45,
          image:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop",
          tags: ["React", "JavaScript", "Web Development", "Frontend"],
        },
        {
          id: 2,
          slug: "css-grid-ve-flexbox-karsilastirmasi",
          title: "CSS Grid ve Flexbox Karşılaştırması",
          excerpt:
            "Modern CSS layout sistemleri olan Grid ve Flexbox'ın avantajları ve kullanım alanları.",
          content: `
            <h2>CSS Grid ve Flexbox Karşılaştırması</h2>
            
            <p>Modern web tasarımında layout oluşturmak için iki güçlü araç vardır: CSS Grid ve Flexbox. Her ikisi de farklı senaryolar için optimize edilmiştir.</p>
            
            <h3>Flexbox - Tek Boyutlu Layout</h3>
            <p>Flexbox, tek boyutlu (row veya column) layout'lar için idealdir.</p>
            
            <h3>CSS Grid - İki Boyutlu Layout</h3>
            <p>CSS Grid, karmaşık iki boyutlu layout'lar için mükemmeldir.</p>
            
            <h4>Flexbox Kullanım Alanları:</h4>
            <ul>
              <li>Navigation bar'lar</li>
              <li>Card layout'ları</li>
              <li>Centered content</li>
              <li>Equal height columns</li>
            </ul>
            
            <h4>CSS Grid Kullanım Alanları:</h4>
            <ul>
              <li>Page layout'ları</li>
              <li>Complex grid systems</li>
              <li>Magazine-style layouts</li>
              <li>Dashboard designs</li>
            </ul>
          `,
          author: "Ayşe Demir",
          date: "2024-07-28",
          category: "Tasarım",
          readTime: "6 dk",
          views: 890,
          likes: 32,
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
          tags: ["CSS", "Layout", "Design", "Frontend"],
        },
      ];

      return blogs.find((blog) => blog.slug === slug);
    };

    const foundBlog = getBlogBySlug(slug);
    setBlog(foundBlog);
    setLoading(false);
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

  const handleLike = () => {
    setLiked(!liked);
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
              <span>{new Date(blog.date).toLocaleDateString("tr-TR")}</span>
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
              <span>{blog.likes + (liked ? 1 : 0)}</span>
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

        {/* Article Content */}
        <article
          className="blog-detail-article"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "1.5rem",
            padding: "2.5rem",
            marginBottom: "3rem",
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

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
