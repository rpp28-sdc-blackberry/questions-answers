const express = require('express');
const db = require('../db/index');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ strict: false }));

app.get('/reviews', (req, res) => {
  const productId = Number(req.query.product_id);
  const page = Number(req.query.page) || 1;
  const count = Number(req.query.count) || 5;
  const sort = req.query.sort || 'newest';
  const offset = (page - 1) * count;

  if (page < 0 || count < 0) {
    res.status(400).send('Invalid syntax, make sure page and count parameters are not less than 0');
    return;
  }

  db.getReviews(productId, sort, offset, count)
    .then((reviews) => {
      const resObject = {
        product: productId,
        page,
        count,
        results: reviews,
      };

      res.status(200).send(resObject);
    })
    .catch((error) => {
      console.log('error getting reviews in server:', error);
      res.status(500).send('error getting reviews in server');
    });
});

app.get('/reviews/meta', (req, res) => {
  const productId = req.query.product_id;

  db.getMeta(productId)
    .then((objectsArray) => {
      const metaObject = {
        ratings: objectsArray[0],
        recommended: objectsArray[1],
        characteristics: objectsArray[2],
      };

      res.status(200).send(metaObject);
    })
    .catch((error) => {
      console.log('error getting metadata in server:', error);
      res.status(500).send('error getting metadata in server');
    });
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
