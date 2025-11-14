const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// GET feedback pentru un produs
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { productId: parseInt(productId) },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST adăugare feedback
router.post("/", async (req, res) => {
  const { userId, productId, rating, comment } = req.body;
  try {
    const newFeedback = await prisma.feedback.create({
      data: { userId, productId, rating, comment },
    });
    res.status(201).json({ success: true, data: newFeedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
