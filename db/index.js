require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

client.connect()
  .then(() => console.log('Connected to Postgres server!'))
  .catch((error) => console.log('Could not connect to Postgres server:', error));

module.exports = client;
