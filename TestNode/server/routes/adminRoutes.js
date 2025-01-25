// backend/routes/adminRoutes.js
const express = require('express');
const { verifyAdmin } = require('../middleware/authMiddleware');
const { getAllUsers, deleteUser, updateUserRole } = require('../controllers/adminController');

const router = express.Router();

// Fetch all users (Admin only)
router.get('/users', verifyAdmin, getAllUsers);

// Delete a user (Admin only)
router.delete('/users/:id', verifyAdmin, deleteUser);

// Update user role (Admin only)
router.patch('/users/:id', verifyAdmin, updateUserRole);

module.exports = router;
