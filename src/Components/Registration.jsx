// RegistrationPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Registration.css';

const RegistrationPage = () => {
    // console.log(process.env.REACT_APP_API_URL);
    const apiUrl = process.env.REACT_APP_API_URL
    // console.log(apiUrl)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",

    });
    const [error, setError] = useState('');
    console.log('form data' , formData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
                }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();





        try {
            // console.log(`${apiUrl}/register/`); // Check the value of apiUrl
            const response = await axios.post(`http://10.11.0.95:8002/register/`, formData);


            if (response.data) {
                console.log(response.data);
                alert('Registered successfully');
                window.location.href = '/login';
            } else {
                throw new Error('No data received from the server');
            }
        } catch (error) {
            if (error.response) {
                console.error('Registration error:', error.response.data);
                setError('Registration failed. Please try again.');
            } else if (error.request) {
                console.error('No response received:', error.request);
                setError('Registration failed due to network issues.');
            } else {
                console.error('Error setting up request:', error.message);
                setError('Registration failed due to an unexpected error.');
            }
        }
        console.log('form data' + formData);

    };

    return (
        <div className="registration-container">
            <h2>REGISTRATION</h2>
            <form onSubmit={handleSubmit}>
                {/* Input fields */}


                <label htmlFor="Username">First Name:</label>
                <input type="text" id="firstName" name="username" value={formData.username} onChange={handleChange} required /><br />

                <label htmlFor="email">Email:</label>
                <input className='reg-mail' type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /><br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required /><br />



                <button className='login-submit' type="submit">Register</button>

                {error && <div className="error-message">{error}</div>}
            </form>
            <div className="login-link">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
};

export default RegistrationPage;