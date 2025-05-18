const express = require("express");
const { createCouple, joinCouple, getCoupleList } = require("../controllers/coupleController");
const { verifyToken } = require("../utils/authMiddleware");

const router = express.Router();

router.post("/create", verifyToken, createCouple);
router.post("/join", verifyToken, joinCouple);
router.get("/list", verifyToken, getCoupleList);

module.exports = router;
