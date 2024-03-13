import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';



const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [data,setData] = useState([]);

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    

    try {
      const response = await axios.post(`http://10.11.0.95:8002/Login/`, { username, password });
      console.log("Login successful:", response.data);
      localStorage.setItem('token',response.data.access)
      
      navigate('/user'); 
      // Handle successful login, e.g., redirect to dashboard
    } catch (error) {
      console.error("Login failed:", error);

      // Handle login error
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Server responded with status code:", error.response.status);
        console.error("Response data:", error.response.data);

        if (error.response.status === 401) {
          // Unauthorized: Incorrect credentials
          setError("Incorrect email or password. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        setError("No response received. Please try again later.");
      } else {
        // Something else happened while setting up the request
        console.error("Error setting up request:", error.message);
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>LOGIN</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="" name='username' value={username} onChange={(e) => setUsername(e.target.value)} required /><br />
        <label htmlFor="password">Password:</label>
        <input type="password" name='password' id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
        <button className='login-submit' type="submit">Login</button>
        {error && <div className="error-message">{error}</div>}
      </form>
      <div className="register-link">
        <p>New user? <Link to="/registration">Register here</Link></p>
        <p><Link to="/">Back to Home</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
