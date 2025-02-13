const db = require('../config/db');

exports.registerUser = (name, phone, email, password, gender, location, callback) => {
  const role = 'user'; 
  const query = 'INSERT INTO users (name, phone, email, password, role, gender, location) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, phone, email, password, role, gender, location], callback);
};

exports.findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], callback);
};

exports.findUserById = (id, callback) => {
  const query = 'SELECT id, name, email, phone, role, gender, location FROM users WHERE id = ?';
  db.query(query, [id], callback);
};

exports.getAllUsers = (callback) => {
  const query = 'SELECT * FROM users';
  db.query(query, callback);
};

exports.getUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length > 0) {
      callback(null, results[0]); 
    } else {
      callback(null, null); 
    }
  });
};

exports.getUsersWithTranslationCount = (callback) => {
  const query = `
    SELECT id, name, email, phone, role, gender, location, IFNULL(translations, 0) AS translationsCount
    FROM users
  `;
  db.query(query, callback);
};

exports.updateLanguages = (id, languages, callback) => {
  const query = 'UPDATE users SET languages = ? WHERE id = ?';
  db.query(query, [languages, id], callback);
};