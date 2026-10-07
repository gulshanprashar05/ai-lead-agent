const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const generateAIResponse = async (lead, task) => {
  try {
    const prompt = `
You are an AI Lead Management Agent.

Analyze the following business lead and recommend the next best action.

Lead Information:
Name: ${lead.name}
Phone: ${lead.phone}
Email: ${lead.email || "Not provided"}
Source: ${lead.source}
Lead Type: ${lead.leadType}
Current Status: ${lead.status}
Priority: ${lead.priority}
Notes: ${lead.notes || "No notes"}

Task:
${task}

Return ONLY valid JSON in this format:

{
  "intent": "string",
  "interestLevel": "low | medium | high",
  "recommendedAction": "call | follow_up | human_handoff | nurture | no_action",
  "priority": "low | medium | high",
  "reason": "string",
  "nextStep": "string"
}
`;

    const response = await client.chat.completions.create({
      model: "gemini-3.6-flash",
      messages: [
        {
          role: "system",
          content:
            "You are a professional AI lead management agent. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const result = JSON.parse(
      response.choices[0].message.content
    );

    return {
      success: true,
      leadId: lead._id,
      analysis: result,
    };
  } catch (error) {
    console.error("AI Service Error:", error.message);

    return {
      success: false,
      message: "AI service failed",
      error: error.message,
    };
  }
};

module.exports = {
  generateAIResponse,
};