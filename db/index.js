require('dotenv').config();
const { Pool } = require('pg');

// let user;
let database;

if (process.env.NODE_ENV === 'development') {
  // user = process.env.PG_USER;
  database = process.env.POSTGRES_DB;
} else if (process.env.NODE_ENV === 'test') {
  // user =
  database = 'reviews_test';
}

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  database,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
});

module.exports = pool;
