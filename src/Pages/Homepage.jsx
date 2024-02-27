import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Homepage() {
  // Inline styles for sections
  const sectionStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '0 10vw',
  };

  const linkStyle = {
    color: 'black',
    fontWeight: 'bold',
    textDecoration: 'none',
    marginRight: '1rem'
  };

  return (
    <>
      <style>
        {`
          .btn-outline-success {
            border-color: green;
            color: black;
            font-weight: bold;
          }

          .btn-outline-success:hover {
            color: #fff;
            background-color: green;
            border-color: green;
          }

          .about-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 50px;
          }

          .about-section p {
            max-width: 50%;
            text-align: center;
          }

          .about-section img {
            max-width: 35%;
            border-radius: 10px;
          }
        `}
      </style>
      <div className="homepage-container">
        {/* Navbar Section */}
        <div className="navbar navbar-light" style={{ backdropFilter: 'blur(1px)', backgroundColor: 'rgba(190, 188, 188, 0.8)', paddingBottom: '5vh' }}>
          <div className="container-fluid">
            <span className="navbar-brand h1" style={{ fontWeight: 'bold', marginTop: '2vh' }}>ON-DEMAND</span>
            <div className="buttons mt-3 ms-5 ps-5 ">
              <Link to="/login" className="btn btn-outline-success me-3 " role="button">Login</Link>
              <Link to="/registration" className="btn btn-outline-success" role="button">Sign Up</Link>
            </div>
            <div className="navbar-links">
              <a href="#about" style={linkStyle}>About Us</a>
              <a href="#contact" style={linkStyle}>Contact </a>

            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="blurry-box d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
          <h1 className="d-flex justify-content-center align-items-center">WELCOME TO <span style={{ fontFamily: "sans-serif", fontWeight: 'bold', color: "white" }}> <br />ON-DEMAND SERVICE APP</span> </h1>
        </div>

        {/* About Section */}
        <section id='about' className="about-section" style={{ ...sectionStyle, backgroundColor: '#f8f9fa' }}>
          <div>
            <h2>About Us</h2><br /><br />
            <p style={{fontFamily:"sans-serif"}}>We are a leading provider of on-demand services, connecting consumers with service providers in a seamless and efficient manner. Our platform offers a wide range of services, ensuring that your needs are met promptly and professionally.</p>
          </div>
          <img style={{marginLeft:"60%"}} src="https://img.freepik.com/free-photo/customer-satisfaction-service-care-problem-solving_53876-120094.jpg" alt="About Us" />
        </section>

        {/* Contact Section */}
        <section id='contact' style={{ ...sectionStyle, backgroundColor: '#e9ecef' }}>
          <h2>Contact Us</h2><br /><br />
          <p>Have questions or need to get in touch with our team? Reach out to us through the following channels:</p>
          <ul>
            <li>Email: contact@ondemandservice.com</li>
            <li>Phone: (123) 456-7890</li>
            <li>Address: 123 Service Lane, Service City, SS 12345</li>
          </ul>
        </section>
      </div>
    </>
  );
}

export default Homepage;
