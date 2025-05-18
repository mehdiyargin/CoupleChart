const mongoose = require("mongoose");

const CoupleSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Couple", CoupleSchema);
