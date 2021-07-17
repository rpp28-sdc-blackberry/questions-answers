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

const testFunction = function () {
  return new Promise((resolve, reject) => {
    client.query('SELECT * FROM reviews')
      .then((data) => {
        console.log('got data in DB file:', data);
        resolve(data);
      })
      .catch((error) => {
        console.log('error retrieving data:', error);
        reject(error);
      });
  });
};

module.exports = { testFunction };
