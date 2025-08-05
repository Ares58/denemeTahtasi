require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

console.log("Sunucu başlatılıyor...");

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS ayarları
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://savteksitesi.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
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

// Static files
const staticPath = path.join(__dirname, "../Frontend/dist");
console.log("Static dosya yolu:", staticPath);
app.use(express.static(staticPath));

// MongoDB bağlantısı
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI environment variable bulunamadı!");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✓ MongoDB bağlantısı başarılı");
  })
  .catch((err) => {
    console.error("✗ MongoDB bağlantı hatası:", err);
    process.exit(1);
  });

// Catch-all handler - EN SONDA olmalı
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "../Frontend/dist", "index.html");
  console.log("Catch-all route tetiklendi:", req.path);
  console.log("Index.html yolu:", indexPath);

  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("index.html gönderilirken hata:", err);
      res.status(500).send("Sayfa yüklenemedi");
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error:", error);
  res.status(500).json({
    message: "Sunucu hatası",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal server error",
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM sinyali alındı, sunucu kapatılıyor...");
  mongoose.connection.close(() => {
    console.log("MongoDB bağlantısı kapatıldı");
    process.exit(0);
  });
});

// Sunucu başlat
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
  console.log(`🌍 Health check: http://localhost:${PORT}/health`);
});
