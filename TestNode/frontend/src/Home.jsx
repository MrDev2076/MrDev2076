import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate  } from "react-router-dom";
import './Test.css';
import logo from './assets/logo.png';
import hero from './assets/hero.webp';
import c1 from './assets/c1.webp';
import c2 from './assets/c2.webp';
import c3 from './assets/c3.webp';
import logout from './assets/logout.webp';
import login from './assets/logingif.gif';
import unAuth from './assets/401.avif';
import cv from './assets/CVGen.gif';



function Home() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  // Fetch user data from the backend

  const handleViewProfile = () => {
    // Redirect to profile page
    navigate("/profile"); 
  };
  const getUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/', {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      if (response.data.Status === 'Success') {
        setAuth(true);
        setName(response.data.name); // Set the name from response
        setRole(response.data.role); // Set the role from response
      } else {
        setAuth(false);
        setMessage(response.data.Error);
      }
    } catch (err) {
      console.log(err);
    }
  };



  //navigateto Admin
  const navigateToAdminPanel = () => {
    navigate('/admin-dashboard');
  };


  //Admin Dashboard -- start
  const [users, setUsers] = useState([]);

const getAllUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8081/api/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Use token for authentication
      },
      withCredentials: true,
    });

    if (response.data.Status === 'Success') {
      setUsers(response.data.users); // Set the retrieved users
    } else {
      console.error('Failed to fetch users:', response.data.message);
    }
  } catch (err) {
    console.error('Error fetching users:', err);
  }
};

// Fetch users if the role is admin
useEffect(() => {
  if (role === 'admin') {
    getAllUsers();
  }
}, [role]);


  // Call the getUserData function when the component is mounted
  useEffect(() => {
    getUserData();
  }, []);

  //delete user
// Function to delete a user
const handleDeleteUser = async (userId) => {
  try {
      const response = await axios.delete(`http://localhost:8081/api/delete-user/${userId}`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token for authentication
          },
          withCredentials: true, // Send credentials with request
      });

      if (response.data.Status === 'Success') {
          // Update the users list after deletion
          setUsers(users.filter((user) => user.id !== userId));
          alert('User deleted successfully!');
      } else {
          alert('Failed to delete user');
      }
  } catch (err) {
      console.error("Error deleting user:", err);
      alert('Error deleting user');
  }
};

  
  const handleDelete = () => {
    axios
      .get("http://localhost:8081/logout")
      .then(() => {
        location.reload(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="Test">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" width={320} />
        </div>
        <ul className="nav-links">
          {auth ? (
            <div className="auth-section">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#services">Services</a></li>
              
              {/* Only show the Admin Panel button if the role is 'admin' */}
              {role === "admin" && (
                <li>
                  <button onClick={navigateToAdminPanel} className="btn btn-primary">
                    <span className="text-light">{name}'s</span> Admin Panel
                  </button>
                </li>
              )}

              <li>
                <button className="btn btn-outline-danger" onClick={handleDelete}>
                  Logout
                </button>
              </li>
            </div>
          ) : (
            <div>
              <ul className="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <h2 className="navbar-title">Resume <small>Generator</small></h2>
              </ul>
            </div>
          )}
        </ul>
      </nav>

      {/* Main Content */}
      {auth ? (
        <div>
          <main>
            {/* Landing Section */}
            <section className="landing" id="home">
              <div className="landing-content">
                <h3 className="text-primary display-6">Welcome to Resume Generator, <br /><span className="text-success">{name} ({role})</span></h3>
                <p>
                  Empowering you to create <b>professional, stand-out resumes</b> effortlessly.  
                  Choose from <b>modern templates</b>, tailor your resume to perfection with <b>intuitive tools</b>, and make your profile shine in just a few clicks.
                </p>
                <p>
                  Over <b>10,000+ customizable elements</b>, including <b>icons, graphics, and animations</b>, to give your resume a unique edge.  
                  Integrated <b>AI-driven tools</b>, seamless formatting, and personalized suggestions to help you land your dream job.
                </p>
                <button className="btn btn-outline-primary shadow-lg">Go to Generators</button>
              </div>
              <div className="landing-image">
                <img src={cv} alt="hero" width={320} />
              </div>
            </section>

{/* Admin Dashboard */}
<section>
  {role === 'admin' && (
    <section id="admin-dashboard">
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-4">
        <div className="table-responsive w-75">
          <h2 className="text-center mb-4">Admin Dashboard</h2>
          {users.length > 0 ? (
            <table className="table table-bordered table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No users found.</p>
          )}
        </div>
      </div>
    </section>
  )}
</section>


            {/* Cards Section */}
            <section className="cards" id="about">
              <div className="card">
                <h3>Crash Support</h3>
                <img src={c1} alt="Crash Support" width={320} />
                <p>This is a simple description of Card 1 content. You can add more here.</p>
                <button className="btn btn-danger">
                  <Link to="/Dashboard" className="text-white">Contact</Link>
                </button>
              </div>
              <div className="card shadow-lg">
                <h3>Profile Management</h3>
                <img src={c2} alt="Profile Management" width={320} />
                <p>This is a simple description of Card 2 content. You can add more here.</p>
                <button className="btn btn-danger" onClick={handleViewProfile}>View My Profile</button>
 
              </div>
              <div className="card">
                <h3>Custom Service</h3>
                <img src={c3} alt="Custom Service" width={320} />
                <p>This is a simple description of Card 3 content. You can add more here.</p>
                <button className="btn btn-danger">Enroll Service</button>
              </div>
            </section>


            <footer>
  <div class="footer-container">
    <div class="footer-left">
      <div class="logo">
      <img src={logo} alt="Logo" width={320} />
      </div>
      <div class="social-media">
        <a href="https://twitter.com" target="_blank"><img src="https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg"  alt="Twitter" /></a>
        <a href="https://facebook.com" target="_blank"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYfRZOfRyyDskFIvBevwSIXv7vDjxMRl7_Jg&s" alt="Facebook" /></a>
        <a href="https://linkedin.com" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/2048px-LinkedIn_icon.svg.png" alt="LinkedIn" /></a>
        <a href="https://instagram.com" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png" alt="Instagram" /></a>
      </div>
    </div>

 
    <div class="footer-right">
      <div class="footer-links">
        <div class="footer-column">
          <h4>Our Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Updates</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Enterprise</a></li>
            <li><a href="#">Work For Us</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4>Career Guides</h4>
          <ul>
            <li><a href="#">How to make a resume</a></li>
            <li><a href="#">How to write a cover letter</a></li>
            <li><a href="#">How to get hired</a></li>
            <li><a href="#">Negotiating salaries</a></li>
            <li><a href="#">Following up a job offer</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4>Career Advice</h4>
          <ul>
            <li><a href="#">Resumes & CVs</a></li>
            <li><a href="#">Cover letters</a></li>
            <li><a href="#">Interviewing</a></li>
            <li><a href="#">Finding a Job</a></li>
            <li><a href="#">Career Development</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4>Support</h4>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</footer>

        



          </main>
        </div>
      ) : (
        <div>
          {/* Unauthorized Section */}
          <section className="landing" id="home">
            <div className="landing-image">
              <img src={unAuth} alt="Unauthorized" width={320} />
            </div>
            <div className="landing-content">
              <img src={login} alt="Login Prompt" width={740} height={240} />
              <p>
                “The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.” <br />
                - <b>Albert Einstein</b>
              </p>
              <h3 className="text-danger">{message}</h3>
              <h3 className="text-primary">Kindly Login to continue</h3>
              <Link to="/login" className="btn btn-primary">Login</Link>
            </div>
          </section>


        </div>




      )}
    </div>
  );
}

export default Home;
