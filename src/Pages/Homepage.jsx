import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'
import { Col } from 'react-bootstrap';

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
      <div className="container-fluid">

        {/* Welcome Section */}
        <div id='welcomeDiv' className="d-flex align-items-center justify-content-center" style={{ height: '70vh' }}>
          <div>
            <h1 style={{ fontFamily: "Lilita One", fontSize: "50px", textShadow: "0 0 25px black", color: "rgba(255, 255, 255, 1)" }}>Welcome To <br /><span style={{ fontFamily: "Protest Strike", fontSize: "80px", color: "white" }}>On</span><span style={{ fontFamily: "Pacifico", fontSize: "80px", color: "white" }}>-Demand</span><br /> Service App</h1>
            <div className="mt-3 d-flex align-items-center justify-content-center">
              <Link to="/login" className="w-50 btn btn-dark border me-3 " role="button">Login</Link>
              <Link to="/registration" className="w-50 btn btn-dark border" role="button">Sign Up</Link>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section id='about' className="row p-5 my-5" style={{ backgroundColor: '#f8f9fa' }}>
          <div className='col-6 px-3'>
            <h1 className='w-75' style={{ fontFamily: "Protest Strike", fontSize: "50px" }}>About Us</h1><br />
            <p className='w-100' style={{ fontFamily: "Dosis" }}>We are a leading provider of on-demand services, connecting consumers with service providers in a seamless and efficient manner. Our platform offers a wide range of services, ensuring that your needs are met promptly and professionally. <br /><br />If you want the best online home service providers, then book an appointment with <br /><b style={{fontWeight:"1000"}}>On-Demand</b> and get the professional help at your doorstep.</p>
            <button className='btn btn-primary w-25'>Know more</button>
          </div>

          <div className='col-6 ps-4'>
            <img className='rounded border border-4' width="400px" height="270px" src="https://hometone.com/wp-content/uploads/2019/08/home-service-providers-2-800x534.jpg" alt="About Us" />
            <img className='rounded border border-4' style={{ marginLeft: "-70px", marginTop: "-40px" }} width="400px" height="260px" src="https://www.heymarket.com/wp-content/uploads/2019/09/iStock-1080176910.jpg" alt="About Us" />
            <img className='rounded border border-4' style={{ marginLeft: "300px", marginTop: "-450px" }} width="300px" height="230px" src="https://th.bing.com/th/id/OIP.7lCBzIgJaEoOejTEN4jpNQAAAA?rs=1&pid=ImgDetMain" alt="About Us" />
            {/* <img className='rounded border border-4' style={{ marginLeft: "150px", marginTop: "-130px" }} width="400px" height="250px" src="https://www.heymarket.com/wp-content/uploads/2019/09/iStock-1080176910.jpg" alt="About Us" /> */}
          </div>
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