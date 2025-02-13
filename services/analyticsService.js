const db = require('../config/db');
const mailService = require('../services/mailService');

exports.updateTranslationCount = (userId, callback) => {
  const query = 'UPDATE users SET translations = translations + 1 WHERE id = ? AND translations < 100';
  
  db.query(query, [userId], (err) => {
    if (err) {
      console.error('Error updating translation count:', err);
      callback(err, null); 
      return;
    }

    // Fetch the updated count
    db.query('SELECT translations, email FROM users WHERE id = ?', [userId], (err, rows) => {
      if (err) {
        console.error('Error fetching translation count:', err);
        callback(err, null);
        return;
      }

      const translationsCount = rows[0].translations;
      const email = rows[0].email;

      // Send email notifications at specific thresholds (50, 90, 100)
      if ([50, 90, 100].includes(translationsCount)) {
        mailService.sendThresholdNotification(email, translationsCount)
          .then(() => {
            console.log(`Notification email sent for ${translationsCount} translations to ${email}`);
          })
          .catch((error) => {
            console.error('Error sending notification email:', error);
          });
      }

      callback(null, translationsCount); 
    });
  });
};

exports.getTranslationCount = (userId, callback) => {
    db.query('SELECT translations FROM users WHERE id = ?', [userId], (error, results) => {
      if (error) {
        return callback(error, null);
      }
      if (results.length > 0) {
        const translationsCount = results[0].translations || 0;
        callback(null, translationsCount);
      } else {
        callback(null, 0); 
      }
    });
  };