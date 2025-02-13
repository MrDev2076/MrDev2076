const express = require('express');
const { ensureAuthenticated } = require('../middlewares/authMiddleware'); 
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController'); 
const adminController = require('../controllers/adminController'); 
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', authController.register);

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/profile', ensureAuthenticated, profileController.getProfile);
router.get('/admin', ensureAuthenticated, adminController.adminPage);

module.exports = router;