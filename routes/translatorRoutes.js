const express = require('express');
const router = express.Router();
const translatorController = require('../controllers/translatorController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const uploadController = require('../controllers/uploadController');

router.get('/', ensureAuthenticated, translatorController.renderIndex);
router.post('/', ensureAuthenticated, translatorController.translateText);
router.post('/upload', ensureAuthenticated, uploadController.processImage);

module.exports = router;