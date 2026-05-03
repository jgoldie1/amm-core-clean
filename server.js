const express = require("express");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: true
}));

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

// HANDLE LOGIN
app.post("/login", (req, res) => {
  const username = req.body.username;
  req.session.user = username;
  req.session.count = 0;
  res.redirect("/app");
});

// APP (COUNTER PER USER SESSION)
app.get("/app", (req, res) => {
  if (!req.session.user) return res.redirect("/");

  res.send(`
    <h1>${req.session.user}'s Counter</h1>
    <h2 id="count">${req.session.count}</h2>
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

// TAP API
app.post("/tap", (req, res) => {
  if (!req.session.user) return res.json({ count: 0 });

  req.session.count++;
  res.json({ count: req.session.count });
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Server running");
});
