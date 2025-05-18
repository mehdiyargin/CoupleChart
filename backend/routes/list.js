const express = require("express");
const { getList, addItem, removeItem } = require("../controllers/listController");
const { verifyToken } = require("../utils/authMiddleware");
const listController = require("../controllers/listController");

const router = express.Router();

router.get("/", verifyToken, getList);
router.post("/", verifyToken, addItem);
router.delete("/", verifyToken, listController.clearList);
router.delete("/:item", verifyToken, removeItem);

module.exports = router;
