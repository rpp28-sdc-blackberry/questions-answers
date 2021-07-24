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
      console.log('Error getting reviews in server:', error);
      res.status(500).send('Error getting reviews in server');
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
      console.log('Error getting metadata in server:', error);
      res.status(500).send('Error getting metadata in server');
    });
});

app.post('/reviews', (req, res) => {
  const reviewDetails = req.body;
  db.postReview(reviewDetails)
    .then(() => res.status(201).send('Success posting new review'))
    .catch((error) => res.status(500).send(`Error posting new review: ${error}`));
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  const reviewId = req.params.review_id;
  db.updateHelpfulness(reviewId)
    .then((updatedRows) => {
      console.log(`Successfully updated ${updatedRows} row(s)`);
      res.status(204).end();
    })
    .catch((error) => {
      console.log('Error updating review helpfulness:', error);
      res.status(500).send('Error updating review helpfulness');
    });
});

app.put('/reviews/:review_id/report', (req, res) => {
  const reviewId = req.params.review_id;
  db.reportReview(reviewId)
    .then((updatedRows) => {
      console.log(`Successfully updated ${updatedRows} row(s)`);
      res.status(204).end();
    })
    .catch((error) => {
      console.log('Error reporting review:', error);
      res.status(500).send('Error reporting review');
    });
});

module.exports = app;
