const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

let count = 0;

// load saved count
if (fs.existsSync("count.json")) {
  const data = JSON.parse(fs.readFileSync("count.json"));
  count = data.count;
}

// tap route
app.post("/tap", (req, res) => {
  count++;
  fs.writeFileSync("count.json", JSON.stringify({ count }));
  res.json({ count });
});

// get current state
app.get("/api/state", (req, res) => {
  res.json({ count });
});

// basic home route
app.get("/", (req, res) => {
  res.send(`Counter: ${count}`);
});

app.listen(PORT, () => {
  console.log("Server running");
});
