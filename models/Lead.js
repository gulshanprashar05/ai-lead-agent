const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    source: {
      type: String,
      enum: ["manual", "meta"],
      default: "manual",
    },

    sourceDetails: {
      platform: String,
      campaignId: String,
      campaignName: String,
      formId: String,
      formName: String,
    },

    leadType: {
      type: String,
      enum: ["webinar", "demo", "general", "sales"],
      default: "general",
    },

    status: {
      type: String,
      enum: [
        "new",
        "contact_pending",
        "contacted",
        "interested",
        "qualified",
        "appointment_booked",
        "converted",
        "not_interested",
        "no_response",
        "callback_requested",
        "human_handoff",
        "nurture",
      ],
      default: "new",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    notes: {
      type: String,
      trim: true,
    },

    lastContactedAt: {
      type: Date,
      default: null,
    },

    nextFollowUpAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);