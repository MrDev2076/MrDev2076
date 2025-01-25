import React from 'react';
import './Test.css';
import logo from './assets/logo.png'; 
import hero from './assets/hero.webp'; 
import c1 from './assets/c1.webp'; 
import c2 from './assets/c2.webp'; 
import c3 from './assets/c3.webp'; 

const Test = () => {
  return (
    <div className="Test">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
        <img src={logo} alt="Logo" width={320} /> 
        </div>
        <h2>Rix Studio <small><small><small><small>qwerty</small></small></small></small></h2>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
  
        </ul>
      </nav>

      {/* Landing Section */}
      <section className="landing" id="home">
        <div className="landing-image mx-5">
        <img src={hero} alt="hero" width={320} />
        </div>
        <div className="landing-content">
          <h1 className="text-primary">Welcome to Rix Studio</h1>
          <p>Curated SVGs, Vector Icons, Illustrations, 3D Graphics, and Lottie Animations.
          Over <i className='text-success '><b>10,000+</b></i> new assets added every day. Integrated plugins, tools, editors, and more.</p>
        </div>
      </section>

      {/* Cards Section */}
      <section className="cards" id="about">
        <div className="card">
          <h3>Crash Support</h3>
          <img src={c1} alt="" width={320}/>
          <p>This is a simple description of Card 1 content. You can add more here.</p>
          <button className="btn btn-danger">Contact</button>
        </div>
        <div className="card shadow-lg">
          <h3>Profile Management</h3>
          <img src={c2} alt="" width={320}/>
          <p>This is a simple description of Card 2 content. You can add more here.</p>
          <button className="btn btn-danger">Manage</button>
        </div>
        <div className="card">
          <h3>Custom Service</h3>
          <img src={c3} alt="" width={320}/>
          <p>This is a simple description of Card 3 content. You can add more here.</p>
          <button className="btn btn-danger">Enroll Service</button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 MyWebsite. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Test;
