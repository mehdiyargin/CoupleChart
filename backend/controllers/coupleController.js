const mongoose = require("mongoose");
const Couple = require("../models/Couple");
const User = require("../models/User");

// Create couple and link current user
exports.createCouple = async (req, res) => {
  try {
    const userId = req.user.id;

    // Create couple
    const couple = new Couple({ members: [userId] });
    await couple.save();

    // Update user with coupleId
    await User.findByIdAndUpdate(userId, { coupleId: couple._id });

    res.json({ coupleId: couple._id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Join couple by ID
exports.joinCouple = async (req, res) => {
  try {
    const userId = req.user.id;
    const { coupleId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(coupleId))
      return res.status(400).json({ message: "Invalid couple ID" });

    const couple = await Couple.findById(coupleId);
    if (!couple) return res.status(404).json({ message: "Couple not found" });

    // Add user to couple if not already
    if (!couple.members.includes(userId)) {
      couple.members.push(userId);
      await couple.save();
    }

    // Update user's coupleId
    await User.findByIdAndUpdate(userId, { coupleId });

    res.json({ message: "Joined couple list" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get couple's shopping list
exports.getCoupleList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("coupleId");
    if (!user.coupleId) return res.status(403).json({ message: "You must join a couple first." });

    // The shopping list will be fetched in listController
    res.json({ coupleId: user.coupleId._id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

