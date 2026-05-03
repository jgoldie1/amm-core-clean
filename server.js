const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// UI with per-user counter (safe + simple)
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="text-align:center; font-family:sans-serif;">
        <h1 id="count">Loading...</h1>
        <button onclick="tap()" style="font-size:20px;">Tap</button>

        <script>
          let count = 0;

          function load() {
            const saved = localStorage.getItem("count");
            count = saved ? parseInt(saved) : 0;
            document.getElementById('count').innerText = count;
          }

          function tap() {
            count++;
            localStorage.setItem("count", count);
            document.getElementById('count').innerText = count;
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
