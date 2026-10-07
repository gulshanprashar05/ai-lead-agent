const { VapiClient } = require("@vapi-ai/server-sdk");

const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY,
});

const initiateCall = async (lead, purpose) => {
  try {
    console.log("================================");
    console.log("STARTING AI CALL");
    console.log("Lead:", lead.name);
    console.log("Phone:", lead.phone);
    console.log("Purpose:", purpose);
    console.log("================================");

    const call = await vapi.calls.create({
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,

      customer: {
        number: lead.phone,
        name: lead.name,
      },

      assistantId: process.env.VAPI_ASSISTANT_ID,
    });

    console.log("Vapi Call ID:", call.id);

    return {
      success: true,
      callStatus: "initiated",
      callId: call.id,
      leadId: lead._id,
    };

  } catch (error) {
    console.error("Vapi Call Error:", error.message);

    return {
      success: false,
      message: "Failed to initiate AI call",
      error: error.message,
    };
  }
};

module.exports = {
  initiateCall,
};