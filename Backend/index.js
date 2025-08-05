require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

console.log("🚀 Sunucu başlatılıyor...");

// Basic middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "/", // Geçici olarak tüm origin'lere izin ver
    credentials: true,
  })
);

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    message: "API çalışıyor!",
    timestamp: new Date(),
    env: process.env.NODE_ENV,
  });
});

// Static files
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB bağlandı"))
  .catch((err) => console.error("❌ MongoDB hatası:", err));

// Catch all
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Sunucu ${PORT} portunda çalışıyor`);
  console.log(`🔗 Test URL: http://localhost:${PORT}/api/test`);
});
