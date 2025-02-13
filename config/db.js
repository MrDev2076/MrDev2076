const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
    console.log(process.env.DB_USER);  // This should print your DB username

  } else {
    console.log('✅ Connected to MySQL Database');
  }
});

module.exports = db;