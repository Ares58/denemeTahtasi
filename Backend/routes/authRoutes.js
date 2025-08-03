const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "gizligizli";

// Sabit admin kullanıcı (şifre "1234")
const adminUser = {
  username: "admin",
  passwordHash: "$2b$10$ezx8JU1QLJW68KWnHiS/N.IVFs3gmJqp0RmhnSvLvKtZaEsW3b/ta",
};
// Login endpointi - tokenı cookie olarak gönderir
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== adminUser.username) {
    return res.status(401).json({ message: "Kullanıcı adı hatalı" });
  }

  try {
    const isMatch = await bcrypt.compare(password, adminUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Şifre hatalı" });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "2h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000, // 2 saat
    });

    res.json({ message: "Giriş başarılı" });
  } catch (error) {
    console.error("Giriş hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Token geçerlilik kontrolü endpointi
router.get("/verify", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ valid: false });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(403).json({ valid: false });
  }
});

// Logout endpointi (cookie temizler)
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Çıkış yapıldı" });
});

module.exports = router;
