// RegistrationPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Registration.css';

const RegistrationPage = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contactNumber: '',
        location: '',
        agree: false
    });
    const [contactError, setContactError] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.contactNumber.length !== 10) {
            setContactError('Contact number must be 10 digits');
            return;
        }

        setContactError('');

        try {
            const response = await axios.post(`${apiUrl}/register`, formData);

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
    };

    return (
        <div className="registration-container">
            <h2>REGISTRATION</h2>
            <form onSubmit={handleSubmit}>
                {/* Input fields */}
                

            <label htmlFor="firstName">First Name:</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required /><br />
                <label htmlFor="lastName">Last Name:</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required /><br />
                <label htmlFor="email">Email:</label>
                <input className='reg-mail' type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /><br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required /><br />
                <label htmlFor="contactNumber">Contact Number:</label>
                <input type="text" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} /><br />
                {contactError && <div className="error-message">{contactError}</div>}
                <input type="checkbox" id="agree" name="agree" checked={formData.agree} onChange={handleChange} required />
                <label htmlFor="agree">I agree to all statements</label><br />                
                <button className='login-submit' type="submit">Register</button>
                {contactError && <div className="error-message">{contactError}</div>}
                {error && <div className="error-message">{error}</div>}
            </form>
            <div className="login-link">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
};

export default RegistrationPage;