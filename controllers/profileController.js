const userModel = require('../models/userModel');
const analyticsService = require('../services/analyticsService'); 

exports.getProfile = (req, res) => {
  const userId = req.session.userId;

  userModel.findUserById(userId, (err, results) => {
    if (err || results.length === 0) {
      return res.redirect('/login');
    }

    const user = results[0];

    analyticsService.getTranslationCount(userId, (err, translationsCount) => {
      if (err) {
        translationsCount = 0; 
      }

      res.render('profile', { user, translationsCount });
    });
  });
};
