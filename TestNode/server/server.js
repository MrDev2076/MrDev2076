import express from 'express';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import crypto from "crypto";
import cors from 'cors';

const salt = 10;

const htmlMailBody = "<html><body><nav><centre><mark><h3>Title</h3></mark></centre></nav><div><button>Reset</button></body></html>";

const app = express();
const port = 8081;

let otpStore = {};

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());

//db credentials
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
});


// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173', // Allow only requests from this origin
    methods: ['GET', 'POST', 'DELETE', 'PUT'], // Allow DELETE method
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
  }));
  
// jwt token
// Middleware to check authentication and role
const checkAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Error with token", Details: err });
            } else {
                req.name = decoded.name;
                req.role = decoded.role;  // Store the role in the request object
                next();
            }
        });
    }
};

// Route to get user data (name and role)
app.get('/', checkAuth, (req, res) => {
    return res.json({ Status: "Success", name: req.name, role: req.role });
});

// Register Route
app.post('/register', (req, res) => {
    const sql = "INSERT INTO LOGIN (`name`,`email`,`password`, `role`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) {
            console.error("Hashing Error:", err);
            return res.json({ Error: "Error for hashing password", Details: err });
        }
        const values = [
            req.body.name,
            req.body.email,
            hash,
            "user"  // New users will be assigned the role "user"
        ];
        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.json({ Error: "Inserting data Error in server" });
            }
            return res.json({ Status: "Success" });
        })
    })
});

// Login Route
app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM login WHERE email=?';
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: "Error in Login", Details: err });
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (response) {
                    const name = data[0].name;
                    const role = data[0].role;  // Get the role of the user
                    const token = jwt.sign({ name, role }, "jwt-secret-key", { expiresIn: '30m' });
                    res.cookie('token', token);
                    return res.json({ Status: "Success Login" });
                } else {
                    return res.json({ Error: "Password Not matched" });
                }
            })
        } else {
            return res.json({ Error: "No email Existed", Details: err });
        }
    })
});

// Send OTP to the registered email
app.post("/send-otp", (req, res) => {
    const { email } = req.body;

    // Generate OTP (a 6-digit random number)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in memory with a 10-minute expiration
    otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };

    // Send OTP to the user's email using nodemailer
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "nadipallisudharshan@gmail.com",
            pass: "kane gxif jcaw ztnd",
        },
    });

    const mailOptions = {
        from: "nadipallisudharshan@gmail.com",
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for resetting your password is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ Status: "Error", message: error.message });
        }
        res.json({ Status: "Success", message: "OTP sent to your email" });
    });
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (otpStore[email] && otpStore[email].otp === otp) {
        if (otpStore[email].expires > Date.now()) {
            res.json({ Status: "OTP Verified" });
        } else {
            res.json({ Status: "OTP Expired" });
        }
    } else {
        res.json({ Status: "Invalid OTP" });
    }
});

// Reset password after OTP verification
app.post("/reset-password", (req, res) => {
    const { email, newPassword } = req.body;

    bcrypt.hash(newPassword, salt, (err, hash) => {
        if (err) {
            return res.json({ Error: "Error in hashing new password", Details: err });
        }

        // Update the password in the database
        const sql = "UPDATE login SET password = ? WHERE email = ?";
        db.query(sql, [hash, email], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.json({ Error: "Error resetting password in database" });
            }
            res.json({ Status: "Password Reset Successful" });
        });
    });
});


// Fetch all users
app.get('/api/users', checkAuth, (req, res) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ Status: "Error", message: "Unauthorized access" });
    }

    const sql = "SELECT id, name, email, role FROM login"; // Fetch user details
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({ Status: "Error", message: "Error fetching users", Details: err });
        }
        res.json({ Status: "Success", users: data });
    });
});

// Delete a user
app.delete('/api/users/:id', checkAuth, (req, res) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ Status: "Error", message: "Unauthorized access" });
    }

    const userId = req.params.id;
    const sql = "DELETE FROM login WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ Status: "Error", message: "Error deleting user", Details: err });
        }
        res.json({ Status: "Success", message: "User deleted successfully" });
    });
});

app.delete('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    
    // Logic to delete the user from the database
    const result = await User.deleteOne({ _id: userId });
  
    if (result.deletedCount > 0) {
      res.json({ Status: 'Success', message: 'User deleted successfully.' });
    } else {
      res.json({ Status: 'Error', message: 'User not found.' });
    }
  });

  // Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ Error: "Unauthorized Access" });
    }
    next();
};


// Example delete request with Axios
const deleteUser = async (userId) => {
    try {
        const token = localStorage.getItem('authToken'); // Or wherever you store the token

        const response = await axios.delete(`http://localhost:8081/api/delete-user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('User deleted:', response.data);
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};
  // Delete user route
app.delete('/api/delete-user/:id', checkAuth, checkAdmin, (req, res) => {
    const userId = req.params.id;

    // SQL query to delete user by ID
    const sql = 'DELETE FROM login WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ Error: "Error deleting user", Details: err });
        }

        if (result.affectedRows > 0) {
            return res.json({ Status: "Success", Message: `User with ID ${userId} deleted successfully.` });
        } else {
            return res.status(404).json({ Status: "Failed", Message: "User not found" });
        }
    });
});
  
// Update user role
app.patch('/api/users/:id', checkAuth, (req, res) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ Status: "Error", message: "Unauthorized access" });
    }

    const userId = req.params.id;
    const { role } = req.body;

    if (!role || !["admin", "user"].includes(role)) {
        return res.status(400).json({ Status: "Error", message: "Invalid role specified" });
    }

    const sql = "UPDATE login SET role = ? WHERE id = ?";
    db.query(sql, [role, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ Status: "Error", message: "Error updating user role", Details: err });
        }
        res.json({ Status: "Success", message: "User role updated successfully" });
    });
});


// Logout Route 
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
});

// Port running
app.listen(8081, () => {
    console.log(`Server running at http://localhost:${port}`);
});
