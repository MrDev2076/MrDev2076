const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

exports.register = (req, res) => {
  const { name, phone, email, password, gender, location } = req.body;
  
  const hashedPassword = bcrypt.hashSync(password, 10);

  userModel.registerUser(name, phone, email, hashedPassword, gender, location, (err) => {
    if (err) {
      console.error(err);
      res.redirect('/register?error=Registration failed');
    } else {
      res.redirect('/login');
    }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  userModel.getUserByEmail(email, (err, user) => {
    if (err || !user) {
      return res.redirect('/login?error=Invalid credentials');
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.redirect('/login?error=Invalid credentials');
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      phone: user.phone,
    };
    
    req.session.userId = user.id; 

    req.session.save((err) => {
      if (err) {
        return res.redirect('/login?error=Session not saved');
      }
      res.redirect('/');
    });
  });
};

exports.getUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length > 0) {
      callback(null, results[0]); 
    } else {
      callback(null, null); 
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};