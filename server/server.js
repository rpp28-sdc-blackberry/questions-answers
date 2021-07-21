const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ strict: false }));

app.get('/reviews', (req, res) => {
  const productId = req.query.product_id;
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const sort = req.query.sort || 'newest';

  res.status(200).send(`Success hitting reviews endpoint with product ID: ${productId}, page: ${page}, count: ${count}, sort: ${sort}`);
});

app.get('/reviews/meta', (req, res) => {
  const productId = req.query.product_id;
  res.status(200).send(`Success hitting meta endpoint with product ID: ${productId}`);
});

app.post('/reviews', (req, res) => {
  console.log(req.body);
  res.status(201).send('Success creating new review');
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  const reviewId = req.params.review_id;
  console.log(reviewId);
  res.status(204).end();
});

app.put('/reviews/:review_id/report', (req, res) => {
  const reviewId = req.params.review_id;
  console.log(reviewId);
  res.status(204).end();
});

module.exports = app;
