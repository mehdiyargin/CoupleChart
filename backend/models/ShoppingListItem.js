const mongoose = require("mongoose");

const ShoppingListItemSchema = new mongoose.Schema({
  coupleId: { type: mongoose.Schema.Types.ObjectId, ref: "Couple", required: true },
  text: { type: String, required: true }
});

module.exports = mongoose.model("ShoppingListItem", ShoppingListItemSchema);
