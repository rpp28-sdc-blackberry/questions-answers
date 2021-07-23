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
  const characteristicsQuery = `SELECT value, characteristics_temp.id, name
  FROM reviews_temp
  INNER JOIN characteristics_reviews_temp
  ON reviews_temp.id = review_id AND reviews_temp.product_id = ${productId}
  INNER JOIN characteristics_temp
  ON characteristics_temp.id = characteristic_id AND
  characteristics_temp.product_id = ${productId}`;

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
  getReviews, getMeta, updateHelpfulness, reportReview,
};
