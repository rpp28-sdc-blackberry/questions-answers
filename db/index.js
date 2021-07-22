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

const getMeta = (productId) => {
  const characteristicsQuery = `SELECT characteristics_reviews_temp.id, review_id, value, characteristics_temp.id, characteristics_temp.product_id, name
  FROM reviews_temp
  INNER JOIN characteristics_reviews_temp
  ON reviews_temp.id = review_id AND reviews_temp.product_id = ${productId}
  INNER JOIN characteristics_temp
  ON characteristics_temp.id = characteristic_id AND characteristics_temp.product_id = ${productId}`;

  // Potentially need more queries to get ratings and recommended

  return client.query(characteristicsQuery)
    .then((res) => {
      const characteristics = {};
      const counts = {};

      res.rows.forEach((row) => {
        const name = row.name;
        if (!characteristics[name]) {
          characteristics[name] = {
            id: row.id,
            value: row.value,
          };

          counts[name] = {
            count: 1,
          };
        } else {
          characteristics[name].value += row.value;
          counts[name].count += 1;
        }
      });

      const charNames = Object.keys(characteristics);
      charNames.forEach((name) => {
        characteristics[name].value /= counts[name].count;
        characteristics[name].value = Math.round(characteristics[name].value).toFixed(4);
      });

      console.log(characteristics);
    })
    .catch((error) => console.log(error.stack));
};

module.exports = { getReviews, getMeta };
