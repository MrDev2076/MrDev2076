const fetch = require('node-fetch');
const FormData = require('form-data');
const analyticsService = require('../services/analyticsService');
const db = require('../config/db');
const { getLanguagesFromAPI } = require('../services/languageService');

exports.renderIndex = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const availableLanguages = await getLanguagesFromAPI();
  const userId = req.session.user.id;

  // Fetch user's translations count
  analyticsService.getTranslationCount(userId, (err, translationsCount) => {
    if (err) {
      translationsCount = req.session.user.translations || 0;
    }

    db.query('SELECT languages FROM users WHERE id = ?', [userId], (error, results) => {
      if (error) {
        return res.redirect('/login');
      }

      let userLanguages = results[0].languages;

      if (!userLanguages) {
        userLanguages = availableLanguages.map(lang => lang.code);
      } else {
        userLanguages = userLanguages.split(',');
      }

      res.render('index', {
        translatedText: null,
        user: req.session.user,
        userLanguages, 
        availableLanguages, 
        translationsCount, // Correct translations count
        sourceLanguage: req.query.source_language || '', 
        targetLanguage: req.query.target_language || '', 
        textInput: req.query.text || ''                 
      });
    });
  });
};


exports.translateText = async (req, res) => {
  const { text, source_language, target_language } = req.body;
  const userId = req.session.user.id;

  if (!text || !source_language || !target_language) {
    return res.render('index', {
      translatedText: 'Error: Missing required fields for translation',
      translationsCount: req.session.user.translations || 0,
      user: req.session.user,
      userLanguages: req.session.user.languages ? req.session.user.languages.split(',') : [],
      availableLanguages: await getLanguagesFromAPI(),
      sourceLanguage: source_language || '',
      targetLanguage: target_language || '',
      textInput: text || ''
    });
  }

  const url = 'https://text-translator2.p.rapidapi.com/translate';
  const data = new FormData();
  data.append('source_language', source_language);
  data.append('target_language', target_language);
  data.append('text', text);

  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': 'ea86ec0756msh17e532df1e1c9c9p170c20jsnebad0933d91c',
      'x-rapidapi-host': 'text-translator2.p.rapidapi.com'
    },
    body: data
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const availableLanguages = await getLanguagesFromAPI(); // Fetch available languages from API
    let userLanguages;

    db.query('SELECT languages FROM users WHERE id = ?', [userId], (error, results) => {
      if (error) {
        return res.render('index', {
          translatedText: 'Error fetching user languages',
          translationsCount: req.session.user.translations || 0,
          user: req.session.user,
          userLanguages: availableLanguages.map(lang => lang.code), // Show all languages if error
          availableLanguages,
          sourceLanguage: source_language || '',
          targetLanguage: target_language || '',
          textInput: text || ''
        });
      }

      userLanguages = results[0].languages ? results[0].languages.split(',') : availableLanguages.map(lang => lang.code);

      if (result && result.data && result.data.translatedText) {
        analyticsService.updateTranslationCount(userId, (err, translationsCount) => {
          if (err) {
            return res.render('index', {
              translatedText: result.data.translatedText,
              translationsCount: req.session.user.translations || 0,
              user: req.session.user,
              userLanguages,
              availableLanguages,
              sourceLanguage: source_language || '',
              targetLanguage: target_language || '',
              textInput: text || ''
            });
          }

          res.render('index', {
            translatedText: result.data.translatedText,
            translationsCount,
            user: req.session.user,
            userLanguages, // Keep user-selected languages
            availableLanguages, // Pass available languages for the dropdowns
            sourceLanguage: source_language || '',
            targetLanguage: target_language || '',
            textInput: text || ''
          });
        });
      } else {
        throw new Error('Translation API did not return translated text');
      }
    });
  } catch (error) {
    const availableLanguages = await getLanguagesFromAPI();
    res.render('index', {
      translatedText: 'Error occurred during translation',
      translationsCount: req.session.user.translations || 0,
      user: req.session.user,
      userLanguages: req.session.user.languages ? req.session.user.languages.split(',') : availableLanguages.map(lang => lang.code),
      availableLanguages,
      sourceLanguage: source_language || '',
      targetLanguage: target_language || '',
      textInput: text || ''
    });
  }
};