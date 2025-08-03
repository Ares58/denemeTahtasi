const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");

// Tüm blogları getir
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

// Yeni blog oluştur
router.post("/", async (req, res) => {
  const { title, content } = req.body;
  const newBlog = new Blog({ title, content });
  await newBlog.save();
  res.json(newBlog);
});

// Blog güncelle
router.put("/:id", async (req, res) => {
  const { title, content } = req.body;
  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true }
  );
  res.json(updated);
});

// Blog sil
router.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Blog silindi" });
});

module.exports = router;
