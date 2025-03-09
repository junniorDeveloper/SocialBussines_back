// src/db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_mM2EATQN9Swc@ep-nameless-lab-a4xlgeir-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

module.exports = pool;
