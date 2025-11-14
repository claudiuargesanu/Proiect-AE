const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// GET wishlist pentru user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: wishlistItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST adăugare în wishlist
router.post("/", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const existing = await prisma.wishlist.findFirst({ where: { userId, productId } });
    if (existing) return res.status(400).json({ success: false, message: "Already in wishlist" });

    const newItem = await prisma.wishlist.create({
      data: { userId, productId },
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE wishlist
router.delete("/", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await prisma.wishlist.deleteMany({ where: { userId, productId } });
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
