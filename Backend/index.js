require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

console.log("🚀 Sunucu başlatılıyor...");
console.log("NODE_ENV:", process.env.NODE_ENV);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// İyileştirilmiş CORS ayarları
const corsOptions = {
  origin: function (origin, callback) {
    // Development modda origin null olabilir (localhost)
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5000",
      "https://savteksitesi.onrender.com",
    ];

    // Origin yoksa (same-origin requests) veya allowed origins'te varsa izin ver
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("CORS blocked origin:", origin);
      callback(new Error("CORS policy violation"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200, // IE11 için
  preflightContinue: false,
};

app.use(cors(corsOptions));

// Preflight requests için explicit OPTIONS handling
app.options("*", cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${
      req.path
    } - Origin: ${req.get("origin")}`
  );
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
    cors: "enabled",
  });
});

// Security headers middleware
app.use((req, res, next) => {
  // HTTPS redirect in production
  if (
    process.env.NODE_ENV === "production" &&
    req.header("x-forwarded-proto") !== "https"
  ) {
    res.redirect(`https://${req.header("host")}${req.url}`);
    return;
  }

  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  next();
});

// Route'ları güvenli şekilde yükle
try {
  console.log("Auth routes yükleniyor...");
  const authRoutes = require("./routes/authRoutes");
  app.use("/api/auth", authRoutes);
  console.log("✓ Auth routes başarıyla yüklendi");
} catch (error) {
  console.error("✗ Auth routes yüklenirken hata:", error.message);
  process.exit(1);
}

try {
  console.log("Blog routes yükleniyor...");
  const blogRoutes = require("./routes/blogRoutes");
  app.use("/api/blogs", blogRoutes);
  console.log("✓ Blog routes başarıyla yüklendi");
} catch (error) {
  console.error("✗ Blog routes yüklenirken hata:", error.message);
  process.exit(1);
}

// Static files - Production için optimize edilmiş
const staticPath = path.join(__dirname, "../Frontend/dist");
console.log("Static dosya yolu:", staticPath);

// Static files middleware'i daha güvenli şekilde ekle
if (process.env.NODE_ENV === "production") {
  try {
    app.use(
      express.static(staticPath, {
        dotfiles: "deny",
        etag: true,
        extensions: ["htm", "html"],
        index: false,
        maxAge: process.env.NODE_ENV === "production" ? "1d" : "0",
        redirect: false,
        setHeaders: function (res, path, stat) {
          res.set("x-timestamp", Date.now());

          // Cache control for different file types
          if (path.endsWith(".js") || path.endsWith(".css")) {
            res.set("Cache-Control", "public, max-age=31536000, immutable");
          } else if (path.endsWith(".html")) {
            res.set("Cache-Control", "no-cache, no-store, must-revalidate");
          }
        },
      })
    );
    console.log("✓ Static middleware eklendi");
  } catch (error) {
    console.error("✗ Static middleware hatası:", error);
  }
}

// MongoDB bağlantısı
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI environment variable bulunamadı!");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5 saniye timeout
    socketTimeoutMS: 45000, // 45 saniye socket timeout
  })
  .then(() => {
    console.log("✓ MongoDB bağlantısı başarılı");
  })
  .catch((err) => {
    console.error("✗ MongoDB bağlantı hatası:", err);
    process.exit(1);
  });

// MongoDB connection event handlers
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

// API 404 handler - API route'ları için
app.use("/api/*", (req, res) => {
  console.warn(`API 404: ${req.method} ${req.path}`);
  res.status(404).json({
    message: "API endpoint bulunamadı",
    path: req.path,
    method: req.method,
  });
});

// Catch-all handler - React SPA için
app.use("*", (req, res, next) => {
  // API route'ları zaten yukarıda handle edildi
  if (req.originalUrl.startsWith("/api/")) {
    return next();
  }

  // React uygulaması için index.html gönder
  const indexPath = path.join(__dirname, "../Frontend/dist", "index.html");

  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("index.html gönderilirken hata:", err);
      res.status(500).json({
        message: "Sayfa yüklenemedi",
        error:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Internal server error",
      });
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error:", error);

  // CORS error
  if (error.message === "CORS policy violation") {
    return res.status(403).json({
      message: "CORS policy violation",
      origin: req.get("origin"),
    });
  }

  res.status(500).json({
    message: "Sunucu hatası",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal server error",
  });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`${signal} sinyali alındı, sunucu kapatılıyor...`);

  mongoose.connection.close(() => {
    console.log("MongoDB bağlantısı kapatıldı");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Process hatalarını yakala
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Sunucu başlat
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
  console.log(`🌍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Production URL: https://savteksitesi.onrender.com/health`);
});

module.exports = app;
