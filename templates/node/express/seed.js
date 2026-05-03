console.log("🚀 Initializing Express seed...");

const expressCode = `const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

app.listen(port, () => {
  console.log(\`Example app listening at http://localhost:\${port}\`);
});`;

// In a real build, this would be written to index.js
console.log("Seed initialization complete.");
