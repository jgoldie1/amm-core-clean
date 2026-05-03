const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let counter = 0;

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head><title>CORE WORKING</title></head>
<body>
  <h1>CORE WORKING</h1>
  <p>Count: <strong>${counter}</strong></p>
  <form method="POST" action="/tap">
    <button type="submit">TAP</button>
  </form>
</body>
</html>`);
});

app.post('/tap', (req, res) => {
  counter++;
  res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
