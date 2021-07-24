require('dotenv').config();
const { Client } = require('pg');
const helpers = require('./helpers');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'sdc_reviews',
  password: 'password',
  port: 5432,
});

client.connect()
  .then(() => console.log('Connected to Postgres server!'))
  .catch((error) => console.log('Could not connect to Postgres server:', error));

// NEED TO UPDATE TO EXCLUDE REPORTED REVIEWS
const getReviews = (productId, sort, offset, count) => {
  let sortValue;
  if (sort === 'newest') {
    sortValue = 'date';
  } else if (sort === 'helpful') {
    sortValue = 'helpfulness';
  } else if (sort === 'relevant') {
    sortValue = 'rating';
  } else { console.log('invalid sort value'); }

  // Need to implement an algorithm to sort by RELEVANCE somehow
  const query = {
    text: `SELECT * FROM reviews WHERE product_id = $1 ORDER BY ${sortValue} DESC OFFSET $2 LIMIT $3`,
    values: [productId, offset, count],
  };

  return client.query(query)
    .then((res) => res.rows)
    .catch((error) => error.stack);
};

const getMeta = (productId) => {
  const characteristicsQuery = `SELECT value, characteristics.id, name
  FROM reviews
  INNER JOIN characteristics_reviews
  ON reviews.id = review_id AND reviews.product_id = ${productId}
  INNER JOIN characteristics
  ON characteristics.id = characteristic_id AND
  characteristics.product_id = ${productId}`;

  const ratingsRecommendQuery = `SELECT rating, recommend FROM reviews WHERE product_id = ${productId}`;

  return Promise.all([
    client.query(ratingsRecommendQuery),
    client.query(characteristicsQuery),
  ])
    .then((res) => {
      const ratingsRecommended = helpers.createRatingsRecommendedObj(res[0].rows);
      const characteristics = helpers.createCharacteristicsObj(res[1].rows);
      return [ratingsRecommended[0], ratingsRecommended[1], characteristics];
    })
    .catch((error) => error.stack);
};

const updateReviewsTable = (reviewDetails) => {
  const updateReviewsQuery = 'INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES ($1, $2, current_timestamp, $3, $4, $5, false, $6, $7, null, 0) RETURNING id';

  const updateReviewsValues = [reviewDetails.product_id, reviewDetails.rating,
    reviewDetails.summary, reviewDetails.body, reviewDetails.recommend,
    reviewDetails.name, reviewDetails.email];

  return client.query(updateReviewsQuery, updateReviewsValues)
    .then((res) => res.rows[0].id)
    .catch((error) => error.stack);
};

const updatePhotosTable = (reviewId, photosArray) => {
  const updatePhotosQuery = helpers.createUpdatePhotosQuery(reviewId, photosArray);
  return client.query(updatePhotosQuery)
    .then((res) => console.log('Inserted rows:', res.rowCount))
    .catch((error) => error.stack);
};

const updateCharacteristicsReviewsTable = (reviewId, characteristicsObject) => {
  // eslint-disable-next-line max-len
  const updateCharacteristicsReviewsQuery = helpers.createUpdateCharacteristicsReviewsQuery(reviewId, characteristicsObject);
  return client.query(updateCharacteristicsReviewsQuery)
    .then((res) => console.log('Inserted rows:', res.rowCount))
    .catch((error) => error.stack);
};

async function postReview(reviewDetails) {
  const reviewId = await updateReviewsTable(reviewDetails);

  if (reviewDetails.photos.length) {
    await updatePhotosTable(reviewId, reviewDetails.photos);
  }

  await updateCharacteristicsReviewsTable(reviewId, reviewDetails.characteristics);
}

const updateHelpfulness = (reviewId) => {
  const getHelpfulnessQuery = `SELECT helpfulness FROM reviews WHERE id = ${reviewId}`;
  const updateHelpfulnessQuery = `UPDATE reviews SET helpfulness = $1 WHERE id = ${reviewId}`;

  return client.query(getHelpfulnessQuery)
    .then((res1) => {
      const newHelpfulness = [res1.rows[0].helpfulness + 1];

      return client.query(updateHelpfulnessQuery, newHelpfulness)
        .then((res2) => res2.rowCount)
        .catch((error) => error.stack);
    })
    .catch((error) => error.stack);
};

const reportReview = (reviewId) => {
  const reportQuery = `UPDATE reviews SET reported = true WHERE id = ${reviewId}`;

  return client.query(reportQuery)
    .then((res) => res.rowCount)
    .catch((error) => error.stack);
};

module.exports = {
  getReviews, getMeta, postReview, updateHelpfulness, reportReview,
};
