// backend/controllers/adminController.js
const User = require('../models/userModel');

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = req.body.role;
    await user.save();
    res.json({ message: 'User role updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllUsers, deleteUser, updateUserRole };
