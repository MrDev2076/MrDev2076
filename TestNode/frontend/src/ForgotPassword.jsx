import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from './assets/logo1.png';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");  // Message to show in the UI
  const [step, setStep] = useState(1);  // Step tracker (1 for email input, 2 for OTP, 3 for new password)
  const navigate = useNavigate();

  // Handle email submission (step 1)
  const handleSubmitEmail = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    axios
      .post("http://localhost:8081/send-otp", { email })
      .then((response) => {
        if (response.data.Status === "Success") {
          setMessage("OTP sent to your email.");
          setStep(2);
        } else {
          setMessage("Error sending OTP.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("An error occurred. Please try again.");
      });
  };

  // Handle OTP verification (step 2)
  const handleSubmitOTP = (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    axios
      .post("http://localhost:8081/verify-otp", { email, otp })
      .then((response) => {
        if (response.data.Status === "OTP Verified") {
          setMessage("OTP verified. Please enter your new password.");
          setStep(3);
        } else {
          setMessage("Invalid OTP.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("An error occurred. Please try again.");
      });
  };

  // Handle new password reset (step 3)
  const handleSubmitNewPassword = (e) => {
    e.preventDefault();
    if (!newPassword) {
      setMessage("Please enter your new password.");
      return;
    }

    axios
      .post("http://localhost:8081/reset-password", { email, newPassword })
      .then((response) => {
        if (response.data.Status === "Password Reset Successful") {
          setMessage("Password reset successful. You can now login.");
          navigate("/login");
        } else {
          setMessage("Error resetting password.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("An error occurred. Please try again.");
      });
  };

  return (
    <div className="forgot-password-container container-fluid bg-white mt-5 p-5 rounded shadow-lg">
       <div className="d-flex align-items-center ">
  <img src={logo} alt="Logo" className="img-fluid" style={{ width: "70px", height: "70px" }} />
  <h2 className="fs-4 fw-bold mb-0">Forgot Password</h2>
</div>

      {/* Display message if exists */}
      {message && <div className="alert alert-info">{message}</div>}

      {/* Step 1: Email Form */}
      {step === 1 && (
        <form onSubmit={handleSubmitEmail}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
            />
          </div>
          <button type="submit" className="btn btn-primary">Send OTP</button>
        </form>
      )}

      {/* Step 2: OTP Form */}
      {step === 2 && (
        <form onSubmit={handleSubmitOTP}>
          <div className="mb-3">
            <label htmlFor="otp" className="form-label">Enter OTP</label>
            <input
              type="text"
              className="form-control"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to your email"
            />
          </div>
          <button type="submit" className="btn btn-primary">Verify OTP</button>
        </form>
      )}

      {/* Step 3: New Password Form */}
      {step === 3 && (
        <form onSubmit={handleSubmitNewPassword}>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
          </div>
          <button type="submit" className="btn btn-primary">Reset Password</button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
