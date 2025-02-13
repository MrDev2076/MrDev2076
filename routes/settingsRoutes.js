const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const settingsController = require('../controllers/settingsController');

router.get('/', ensureAuthenticated, settingsController.getSettingsPage);
router.post('/', ensureAuthenticated, settingsController.updateUserLanguages);

module.exports = router;