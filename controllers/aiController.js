const Lead = require("../models/Lead");
const { generateAIResponse } = require("../services/aiService");

const analyzeLead = async (req, res) => {
  try {
    const { leadId, task } = req.body;

    // Check leadId
    if (!leadId) {
      return res.status(400).json({
        success: false,
        message: "leadId is required",
      });
    }

    // Find lead
    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Send lead to AI
    const result = await generateAIResponse(
      lead,
      task || "Analyze this lead and recommend the best next action."
    );

    // Check AI response
    if (!result.success) {
      return res.status(500).json(result);
    }

    // --------------------------------
    // 1. UPDATE PRIORITY
    // --------------------------------

    if (result.analysis.priority) {
      lead.priority = result.analysis.priority;
    }

    // --------------------------------
    // 2. GET AI RECOMMENDED ACTION
    // --------------------------------

    const action = result.analysis.recommendedAction;

    // --------------------------------
    // 3. UPDATE LEAD STATUS
    // --------------------------------

    if (action === "human_handoff") {
      lead.status = "human_handoff";
    } 
    
    else if (action === "nurture") {
      lead.status = "nurture";
    } 
    
    else if (action === "call") {
      lead.status = "contact_pending";
    } 
    
    else if (action === "follow_up") {
      lead.status = "contact_pending";
    }

    // --------------------------------
    // 4. SET LAST CONTACT TIME
    // --------------------------------

    lead.lastContactedAt = new Date();

    // --------------------------------
    // 5. SET NEXT FOLLOW-UP TIME
    // --------------------------------

    const now = new Date();

    if (action === "call") {
      // Follow up in 5 minutes
      lead.nextFollowUpAt = new Date(
        now.getTime() + 5 * 60 * 1000
      );
    }

    else if (action === "follow_up") {
      // Follow up after 24 hours
      lead.nextFollowUpAt = new Date(
        now.getTime() + 24 * 60 * 60 * 1000
      );
    }

    else if (action === "human_handoff") {
      // Human should handle within 30 minutes
      lead.nextFollowUpAt = new Date(
        now.getTime() + 30 * 60 * 1000
      );
    }

    else if (action === "nurture") {
      // Nurture after 7 days
      lead.nextFollowUpAt = new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000
      );
    }

    else if (action === "no_action") {
      // No follow-up required
      lead.nextFollowUpAt = null;
    }

    // --------------------------------
    // 6. SAVE LEAD
    // --------------------------------

    await lead.save();

    // --------------------------------
    // 7. SEND RESPONSE
    // --------------------------------

    res.status(200).json({
      success: true,
      message: "Lead analyzed and updated successfully",

      lead: {
        id: lead._id,
        name: lead.name,
        status: lead.status,
        priority: lead.priority,
        lastContactedAt: lead.lastContactedAt,
        nextFollowUpAt: lead.nextFollowUpAt,
      },

      analysis: result.analysis,
    });

  } catch (error) {
    console.error("AI Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: "AI analysis failed",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeLead,
};