const { Pool } = require('pg');

const pool = new Pool({
  host: '192.168.0.55',
  port: '5432',
  database: 'clips',
  user: 'postgres',
  password: 'password',
});

module.exports = pool;
