import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Registration.css';
import { Col, Row } from 'react-bootstrap';
import { apiUrl } from './baseUrl'; // Ensure this is correctly imported

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role: "" // Add a new field for the role
    });
    const [error, setError] = useState('');
    console.log('form data', formData);

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
            const response = await axios.post(`${apiUrl}/register/`, formData);

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
                setError(error.response.data.detail || 'Registration failed. Please try again.');
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
        <div className='mx-5 px-5 mb-5'>
            <Row className='px-4 rounded'>
                <Col className='col-6'>
                    <img src="https://sofster.com/wp-content/uploads/2022/03/software-development-services.svg" height="500px" width="100%" alt="" />
                </Col>
                <Col className='col-6'>
                    <h2 style={{ fontFamily: "Protest Strike" }} className='text-center mt-5'>Create an account</h2>
                    <div className="registration-container">
                        <form onSubmit={handleSubmit}>
                            {/* Input fields */}
                            <label htmlFor="username">Username:</label>
                            <input className='w-100' type="text" id="username" name="username" value={formData.username} onChange={handleChange} required /><br />

                            <div className='d-flex'>
                                <div className='pe-1'>
                                    <label htmlFor="first_name">Firstname:</label>
                                    <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required /><br />
                                </div>

                                <div className='ps-1'>
                                    <label htmlFor="last_name">Lastname:</label>
                                    <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required /><br />
                                </div>
                            </div>

                            <label htmlFor="email">Email:</label>
                            <input className='reg-input w-100' type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /><br />

                            <label htmlFor="password">Password:</label>
                            <input className='w-100' type="password" id="password" name="password" value={formData.password} onChange={handleChange} required /><br />

                            {/* Dropdown for user or service provider */}
                            <label htmlFor="role">Choose a Role:</label>
                            <select className='w-100 form-control rounded-5' id="role" name="role" value={formData.role} onChange={handleChange} required>
                                <option value="" disabled>Select your role</option>
                                <option value="user">User</option>
                                <option value="service-provider">Service Provider</option>
                            </select><br /><br />

                            <button className='login-submit btn btn-success w-100 my-2' type="submit">Register</button>

                            {error && <div className="error-message text-center text-danger">{error}</div>}
                        </form>
                        <div className="register-link">
                            <p>Already have an account? <Link to="/login">Login here</Link></p>
                        </div>
                    </div>
                </Col>
            </Row>
            <p className='text-center'><Link to="/"><button className='btn btn-info'>Back to Home</button></Link></p>
        </div>
    );
};

export default RegistrationPage;
