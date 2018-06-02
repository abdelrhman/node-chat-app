const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '/..', 'public');
const PORT = 3000;
var app = express();
app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.render(publicPath + 'index.html');
});

app.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});

module.exports = { app };
