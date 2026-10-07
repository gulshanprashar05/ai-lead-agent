const express = require("express");
const { analyzeLead } = require("../controllers/aiController");

const router = express.Router();

router.post("/analyze", analyzeLead);

module.exports = router;