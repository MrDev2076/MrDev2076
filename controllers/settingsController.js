const db = require('../config/db'); 
const { getLanguagesFromAPI } = require('../services/languageService');

exports.getSettingsPage = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const availableLanguages = await getLanguagesFromAPI();

    const userId = req.session.user.id;

    db.query('SELECT languages FROM users WHERE id = ?', [userId], (error, results) => {
      if (error) {
        console.error('Error fetching user languages:', error);
        return res.redirect('/login');
      }

      let userLanguages = results[0].languages ? results[0].languages.split(',') : [];

      res.render('settings', { availableLanguages, userLanguages, user: req.session.user });
    });
  } catch (error) {
    console.error('Error fetching languages from API:', error);
    res.redirect('/login');
  }
};

exports.updateUserLanguages = (req, res) => {
  const userId = req.session.user.id;
  const selectedLanguages = req.body.languages;
  const languagesString = Array.isArray(selectedLanguages) ? selectedLanguages.join(',') : '';

  db.query('UPDATE users SET languages = ? WHERE id = ?', [languagesString, userId], (error) => {
    if (error) {
      console.error('Error updating user languages:', error);
      return res.redirect('/settings');
    }

    res.redirect('/'); 
  });
};
