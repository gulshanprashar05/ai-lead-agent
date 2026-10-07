const Lead = require("../models/Lead");
const { initiateCall } = require("../services/callingService");

const processFollowUps = async () => {
  try {
    const now = new Date();

    const leads = await Lead.find({
      nextFollowUpAt: {
        $ne: null,
        $lte: now,
      },
      status: {
        $in: [
          "contact_pending",
          "callback_requested",
          "no_response",
          "interested",
          "qualified",
        ],
      },
    });

    if (leads.length === 0) {
      return;
    }

    console.log(`Found ${leads.length} follow-up(s)`);

    for (const lead of leads) {
      console.log("--------------------------------");
      console.log("Follow-up due");
      console.log("Lead:", lead.name);
      console.log("Phone:", lead.phone);
      console.log("Status:", lead.status);
      console.log("Priority:", lead.priority);

      // Initiate call
      const callResult = await initiateCall(
        lead,
        "AI lead follow-up"
      );

      if (!callResult.success) {
        console.log("Call failed:", callResult.message);
        continue;
      }

      // Update lead after successful action
      lead.lastContactedAt = new Date();
      lead.nextFollowUpAt = null;

      if (lead.status === "contact_pending") {
        lead.status = "contacted";
      }

      await lead.save();

      console.log(`Follow-up completed for ${lead.name}`);
    }
  } catch (error) {
    console.error(
      "Follow-up Worker Error:",
      error.message
    );
  }
};

module.exports = {
  processFollowUps,
};