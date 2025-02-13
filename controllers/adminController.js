const userModel = require('../models/userModel');

exports.adminPage = (req, res) => {
  const currentUser = req.session.user;   

  if (currentUser.role === 'user') {
    return res.redirect('/');
  }

  userModel.getUsersWithTranslationCount((err, results) => {
    if (err) {
      console.error(err);
      return res.redirect('/');
    }

    res.render('admin', { users: results, currentUser });
  });
};
