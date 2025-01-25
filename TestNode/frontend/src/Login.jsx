import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Register.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from './assets/logo1.png';

function Login() {
    const [values, setValues] = useState({
        email: "",
        password: "",
      });
    
      const [message, setMessage] = useState("");
    
      const navigate = useNavigate()
      axios.defaults.withCredentials = true;
      const handleSubmit = (e) => {
        e.preventDefault();
        
        // Ensure all fields are filled
        const { email, password } = values;
        if ( !email || !password) {
          setMessage("Please fill out all fields.");
          return navigate("/login")
        }
    
        // Send form data to the server
        axios.post('http://localhost:8081/login', values)
          .then((res) => {
            console.log(res.data); // Log the response from the backend

                if(res.data.Status === "Success Login"){
                    setMessage("Login successful!");
                        navigate('/')

                }else{
                    console.log(res.data); // Log the response from the backend
                    setMessage(res.data.Error || "Invalid login credentials.");
                    alert(res.data.Error || "Invalid login credentials.");
                }
            
           
            // Reset form values after successful registration
            setValues({ name: "", email: "", password: "" });
          })
          .catch((err) => {
            console.error(err);
            setMessage("Error occurred while registering. Please try again.");
            alert("An error occurred while trying to log in. Please try again.");
          });
      };
    

  return (
    <div className="register-container">
      <div className="register-card">
      <div className="d-flex align-items-center ">
  <img src={logo} alt="Logo" className="img-fluid" style={{ width: "70px", height: "70px" }} />
  <h2 className="fs-4 fw-bold mb-0">Login to Your Account</h2>
</div>





        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
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
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          <p className="text-centre text-secondary mt-2">Not Registred Yet?</p>
          <Link to="/register" type="submit" className="btn btn-success w-100">
            Register
          </Link>
        </form>

        <div className="text-center mt-3">
                    <Link to="/forgot-password" className="text-primary w-100">Forgot Password?</Link>
         </div>
      </div>
    </div>
  );
}

export default Login;
