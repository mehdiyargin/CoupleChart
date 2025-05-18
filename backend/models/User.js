const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  coupleId: { type: mongoose.Schema.Types.ObjectId, ref: "Couple", default: null }
});

module.exports = mongoose.model("User", UserSchema);
