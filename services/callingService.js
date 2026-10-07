const axios = require("axios");

const initiateCall = async (lead, purpose) => {
  try {
    console.log("================================");
    console.log("STARTING EXOTEL AI CALL");
    console.log("Lead:", lead.name);
    console.log("Phone:", lead.phone);
    console.log("Purpose:", purpose);
    console.log("================================");

    const accountSid = process.env.EXOTEL_ACCOUNT_SID;
    const apiKey = process.env.EXOTEL_API_KEY;
    const apiToken = process.env.EXOTEL_API_TOKEN;
    const exoPhone = process.env.EXOTEL_EXOPHONE;
    const streamUrl = process.env.EXOTEL_STREAM_URL;

    const url =
      `https://api.exotel.com/v1/Accounts/` +
      `${accountSid}/Calls/connect`;

    const params = new URLSearchParams();

    params.append("From", lead.phone);
    params.append("CallerId", exoPhone);
    params.append("StreamUrl", streamUrl);
    params.append("StreamType", "bidirectional");

    const response = await axios.post(url, params.toString(), {
      auth: {
        username: apiKey,
        password: apiToken,
      },

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    });

    console.log("Exotel Call Response:");
    console.log(response.data);

    return {
      success: true,
      callStatus: "initiated",
      callId: response.data?.Call?.Sid || null,
      leadId: lead._id,
    };
  } catch (error) {
    console.error(
      "Exotel Call Error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message: "Failed to initiate Exotel AI call",
      error:
        error.response?.data || error.message,
    };
  }
};

module.exports = {
  initiateCall,
};