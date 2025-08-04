const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const slugify = require("slugify"); // slugify paketini ekledik

// Yeni blog oluştur (add olmadan)
router.post("/", async (req, res) => {
  try {
    let {
      title,
      slug,
      content,
      excerpt,
      author,
      category,
      image,
      tags,
      status,
    } = req.body;

    // Slug otomatik oluşturulsun
    if (!slug && title) {
      slug = slugify(title, { lower: true, strict: true });
    }

    // Tags virgülle gelirse array'e çevir
    if (typeof tags === "string") {
      tags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      author,
      category,
      image,
      tags,
      status,
    });

    await blog.save();
    res.status(201).json({ message: "Blog eklendi", blog });
  } catch (error) {
    console.error("Blog ekleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Tüm blogları al
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Bloglar alınamadı" });
  }
});

// Slug ile blog detayını al
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog bulunamadı" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Hata oluştu" });
  }
});

// Blog sil
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog silindi" });
  } catch (error) {
    res.status(500).json({ message: "Silme hatası" });
  }
});

router.post("/increment-views/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog bulunamadı" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Hata oluştu" });
  }
});

router.post("/increment-likes/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog bulunamadı" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Beğeni artırılırken hata oluştu" });
  }
});

module.exports = router;
