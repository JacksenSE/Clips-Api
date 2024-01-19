const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',
  port: '5432',
  database: 'clips',
  user: 'postgres',
  password: 'password',
  dialect: 'postgres'
});

module.exports = pool;