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

// UI (THIS is what makes the button work)
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="text-align:center; font-family:sans-serif;">
        <h1 id="count">Loading...</h1>
        <button onclick="tap()" style="font-size:20px;">Tap</button>

        <script>
          async function load() {
            const res = await fetch('/api/state');
            const data = await res.json();
            document.getElementById('count').innerText = data.count;
          }

          async function tap() {
            const res = await fetch('/tap', { method: 'POST' });
            const data = await res.json();
            document.getElementById('count').innerText = data.count;
          }

          load();
        </script>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log("Server running");
});
