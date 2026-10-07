const express = require("express");

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

const router = express.Router();

// Create lead
router.post("/", createLead);

// Get all leads
router.get("/", getLeads);

// Get single lead
router.get("/:id", getLeadById);

// Update lead
router.put("/:id", updateLead);

// Delete lead
router.delete("/:id", deleteLead);

module.exports = router;