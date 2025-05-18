const connectDB = require("./utils/db");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const listRoutes = require("./routes/list");
app.use("/api/list", listRoutes);

const coupleRoutes = require("./routes/couple");
app.use("/api/couple", coupleRoutes);
