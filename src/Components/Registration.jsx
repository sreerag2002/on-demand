import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Registration.css'; // Import the external CSS file

const RegistrationPage = () => {
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if the contact number has exactly 10 digits
        if (formData.contactNumber.length !== 10) {
            setContactError('Contact number must be 10 digits');
            return; // Stop form submission
        }

        // Clear contact error message if it was previously set
        setContactError('');

        // Here you can handle form submission, like sending data to the server
        console.log(formData);

        // Show alert for successful registration
        alert('Registered successfully');

        // Redirect to the login page
        window.location.href = '/login';
    };

    return (
        <div className="registration-container">
            <h2>REGISTRATION</h2>
            <form onSubmit={handleSubmit}>
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
            </form>
            <div className="login-link">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
};

export default RegistrationPage;
