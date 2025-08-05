require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://savteksitesi.onrender.com", // Render'a deploy ettiysen burayı production domain ile değiştir
    credentials: true,
  })
);

// API route'ları - ÖNCELİKLE bunlar gelir
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);

// React'ın build edilmiş dosyalarını sun
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));

// Tüm diğer route'ları index.html'e yönlendir (React Router için) - EN SONDA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
