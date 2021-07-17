const express = require('express');
const db = require('../db/index');

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

db.testFunction()
  .then((data) => {
    console.log('got data in server:', data);
  })
  .catch((error) => {
    console.log('error getting data in server:', error);
  });
