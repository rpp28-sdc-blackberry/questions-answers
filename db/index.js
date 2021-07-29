require('dotenv').config();
const { Pool } = require('pg');

// let user;
let database;

if (process.env.NODE_ENV === 'development') {
  // user = process.env.PG_USER;
  database = process.env.PG_DATABASE;
} else if (process.env.NODE_ENV === 'test') {
  // user =
  database = 'reviews_test';
}

const pool = new Pool({
  user: process.env.PG_USER,
  database,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
});

module.exports = pool;
