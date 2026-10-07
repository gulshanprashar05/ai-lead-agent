const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config();

const connectDB = require("./config/db");
const { processFollowUps } = require("./workers/followUpWorker");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Lead Agent API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  console.log("Running follow-up worker...");
  processFollowUps();
});

setInterval(() => {
  console.log("Checking follow-ups...");
  processFollowUps();
}, 60 * 1000);