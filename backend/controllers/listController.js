const ShoppingListItem = require("../models/ShoppingListItem");
const User = require("../models/User");

// Get shopping list items for user's couple
exports.getList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.coupleId) return res.status(403).json({ message: "You must join a couple first." });

    const items = await ShoppingListItem.find({ coupleId: user.coupleId });
    res.json(items.map(item => item.text));
  } catch (err) {
    console.error("Error fetching list:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add item to couple's shopping list
exports.addItem = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.coupleId) return res.status(403).json({ message: "You must join a couple first." });

    const { item } = req.body;
    if (!item) return res.status(400).json({ message: "Item is required" });

    const newItem = new ShoppingListItem({ coupleId: user.coupleId, text: item });
    await newItem.save();

    res.status(201).json({ message: "Item added to couple list" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.clearList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.coupleId) return res.status(403).json({ message: "You must join a couple first." });

    await ShoppingListItem.deleteMany({ coupleId: user.coupleId });
    res.json({ message: "List cleared successfully." });
  } catch (err) {
    console.error("Error clearing list:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove item from couple's shopping list
exports.removeItem = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.coupleId) return res.status(403).json({ message: "You must join a couple first." });

    const itemText = req.params.item;
    await ShoppingListItem.deleteOne({ coupleId: user.coupleId, text: itemText });

    res.json({ message: "Item removed from couple list" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
