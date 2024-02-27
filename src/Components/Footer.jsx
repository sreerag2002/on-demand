import React from 'react';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        
        <div className="footer-contact">
          <div>
            <h5>CONTACT US</h5>
            <p>Phone: +1 123-456-7890</p>
            <p>Email: On-demand@email.com</p>                      

          </div>
        </div>

        <div className="footer-navigation">
          <h5>RESOURCES</h5>
          <a href="/">Home</a>
          <a href="http://localhost:3000/gallery">About Us</a>
          <a href="http://localhost:3000/pricing">Contact</a>
        </div>

        <div className="footer-social">
          <h5>FOLLOW US</h5> 
          <a href="#" target="_blank">Facebook</a>
          <a href="#" target="_blank">Twitter</a>
          <a href="#" target="_blank">Instagram</a>
        </div>
      </div>

     


      <div className="footer-bottom">
        <p>&copy; 2024 Service Provider App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;


