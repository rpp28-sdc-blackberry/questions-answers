require('dotenv').config();
const { Client } = require('pg');

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

  // Need to implement an algorithm to sort by relevance somehow
  const query = {
    text: `SELECT * FROM reviews WHERE product_id = $1 ORDER BY ${sortValue} DESC OFFSET $2 LIMIT $3`,
    values: [productId, offset, count],
  };

  return client.query(query)
    .then((res) => res.rows)
    .catch((error) => error.stack);
};

// const getMeta =

module.exports = { getReviews };
