const WebSocket = require("ws");

const PORT = 5001;

const wss = new WebSocket.Server({
  port: PORT,
});

console.log(`Voice WebSocket server running on port ${PORT}`);

wss.on("connection", (ws) => {
  console.log("================================");
  console.log("Exotel WebSocket connected");
  console.log("================================");

  let streamSid = null;

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      console.log("Event:", data.event);

      // Call started
      if (data.event === "start") {
        streamSid = data.start.stream_sid;

        console.log("Stream SID:", streamSid);
        console.log("Call SID:", data.start.call_sid);
        console.log("Caller:", data.start.from);
        console.log("Called:", data.start.to);
      }

      // Audio received from caller
      if (data.event === "media") {
        console.log("Audio received");
      }

      // Call ended
      if (data.event === "stop") {
        console.log("Exotel call ended");
      }

    } catch (error) {
      console.error("WebSocket message error:", error.message);
    }
  });

  ws.on("close", () => {
    console.log("Exotel WebSocket disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error.message);
  });
});