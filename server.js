const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: true
}));

// DATABASE
const db = new sqlite3.Database("./data.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY,
      count INTEGER
    )
  `);
});

// LOGIN PAGE
app.get("/", (req, res) => {
  if (!req.session.user) {
    return res.send(`
      <h2>Login</h2>
      <form method="POST" action="/login">
        <input name="username" placeholder="Enter name" required />
        <button type="submit">Login</button>
      </form>
    `);
  }
  res.redirect("/app");
});

// LOGIN
app.post("/login", (req, res) => {
  const username = req.body.username;
  req.session.user = username;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (!row) {
      db.run("INSERT INTO users (username, count) VALUES (?, ?)", [username, 0]);
    }
    res.redirect("/app");
  });
});

// APP
app.get("/app", (req, res) => {
  if (!req.session.user) return res.redirect("/");

  db.get("SELECT count FROM users WHERE username = ?", [req.session.user], (err, row) => {
    const count = row ? row.count : 0;

    res.send(`
      <h1>${req.session.user}'s Counter</h1>
      <h2 id="count">${count}</h2>
      <button onclick="tap()">Tap</button>
      <br><br>
      <a href="/logout">Logout</a>

      <script>
        function tap() {
          fetch('/tap', { method: 'POST' })
            .then(res => res.json())
            .then(data => {
              document.getElementById('count').innerText = data.count;
            });
        }
      </script>
    `);
  });
});

// TAP
app.post("/tap", (req, res) => {
  if (!req.session.user) return res.json({ count: 0 });

  db.run(
    "UPDATE users SET count = count + 1 WHERE username = ?",
    [req.session.user],
    function () {
      db.get("SELECT count FROM users WHERE username = ?", [req.session.user], (err, row) => {
        res.json({ count: row.count });
      });
    }
  );
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Server running");
});
