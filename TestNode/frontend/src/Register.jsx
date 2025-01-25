import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import zxcvbn from "zxcvbn"; // Import zxcvbn
import logo from './assets/logo1.png';

function Register() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [strength, setStrength] = useState(0); // To store password strength score
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setValues({ ...values, password });

    // Check password strength using zxcvbn
    const result = zxcvbn(password);
    setStrength(result.score); // Get score (0-4)
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case 0:
        return <h6 className="text-danger">"Very Weak"</h6>;
      case 1:
        return <h6 className="text-warning">"Weak"</h6>;
      case 2:
        return <h6 className="text-info">"Fair"</h6>;
      case 3:
        return <h6 className="text-primary">"Strong"</h6>;
      case 4:
        return <h6 className="text-success">"Very Strong"</h6>;
      default:
        return "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure all fields are filled
    const { name, email, password } = values;
    if (!name || !email || !password) {
      setMessage("Please fill out all fields.");
      return;
    }

    // Send form data to the server
    axios
      .post("http://localhost:8081/register", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/login");
        } else {
          alert("Error..");
        }
        setMessage("Registration successful!");
        // Reset form values after successful registration
        setValues({ name: "", email: "", password: "" });
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error occurred while registering. Please try again.");
      });
  };

  return (
    <div className="register-container">
      <div className="register-card">
         <div className="d-flex align-items-center ">
          <img src={logo} alt="Logo" className="img-fluid" style={{ width: "70px", height: "70px" }} />
          <h2 className="fs-4 fw-bold mb-0">Create Your Account</h2>
        </div>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={values.name}
              onChange={(e) =>
                setValues({ ...values, name: e.target.value })
              }
              placeholder="Enter your full name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={values.email}
              onChange={(e) =>
                setValues({ ...values, email: e.target.value })
              }
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3">
  <label htmlFor="password" className="form-label">
    Password
  </label>
  <input
    type="password"
    className="form-control"
    id="password"
    name="password"
    value={values.password}
    onChange={handlePasswordChange}
    placeholder="Enter your password"
  />
  {values.password && (
    <div className="password-strength mt-2">
      <label>Password Strength: </label>
      <span>{getStrengthLabel()}</span>
    </div>
  )}
</div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
          <p className="text-center text-secondary mt-2">Already Registered?</p>
          <Link to="/login" className="btn btn-success w-100">
            Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
