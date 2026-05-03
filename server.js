const express = require('express');
const app = express();

let counter = 0;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="background:#0a0a0a;color:#00ff88;font-family:monospace;text-align:center;margin-top:50px;">
        <h1>CORE WORKING</h1>
        <h2 id="count">${counter}</h2>
        <button onclick="tap()">TAP</button>

        <script>
          async function tap(){
            const res = await fetch('/tap', {method:'POST'});
            const data = await res.json();
            document.getElementById('count').innerText = data.counter;
          }
        </script>
      </body>
    </html>
  `);
});

app.post('/tap', (req, res) => {
  counter++;
  res.json({ counter });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});
