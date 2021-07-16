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
