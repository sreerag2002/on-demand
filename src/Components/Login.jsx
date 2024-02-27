// LoginPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; // Import the external CSS file

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle form submission, like sending data to the server
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember me:", rememberMe);
  };

  return (

    <div className="login-container" style={{backgroundImage:"linear-gradient(to right, , #2948ff)"}}>
      <h2 className='text-dark'>LOGIN</h2>
      <form  onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
        <input type="checkbox" id="remember" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
        <label htmlFor="remember">Remember me</label><br />
        <div className="forgot-password">
        </div>
        <div className='login-form'><button className='login-submit' type="submit">Login</button></div>
      </form>
      <div className="register-link">
        <p>New user? <Link to="/registration">Register here</Link> <p><Link to="/">Back to Home</Link></p>
</p>
      </div>
            
    </div>
  );
};

export default LoginPage;
