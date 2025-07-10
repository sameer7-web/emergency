// backend/server.js
const express = require('express');
const app = express();
app.use(express.json());

app.post("/send-alert", (req, res) => {
  const { name, phone, latitude, longitude } = req.body;
  console.log("Received alert from:", name);
  // Save or forward as needed
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on port 5000"));
