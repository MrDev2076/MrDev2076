// backend/middleware/authMiddleware.js
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

module.exports = { verifyAdmin };
