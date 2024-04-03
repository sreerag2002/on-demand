import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl } from './baseUrl';
import { Col } from 'react-bootstrap';

const ServiceProviderForm = ({ username, onClose }) => {
    const [formData, setFormData] = useState({
        username: username,
        document: null,
        ph: '',
    });
    const [error, setError] = useState('');
    console.log(FormData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            document: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const Rtoken = localStorage.getItem('Rtoken'); 
            if (!Rtoken) {
                setError('Authorization token is missing. Please log in again.');
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('document', formData.document);
            formDataToSend.append('phoneNumber', formData.ph);

            const response = await axios.post(`${apiUrl}/create/Serviceprovider/Profile/`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${Rtoken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                console.log(response.data);
                alert('Registered as service provider successfully');
                onClose();
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
        <Col className='col-6'>
            <h2 style={{ fontFamily: "Protest Strike" }} className='text-center mt-5'>Service Provider Details</h2>
            <div className="registration-container">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input className='w-100' type="text" id="username" name="username" value={formData.username} readOnly /><br /><br />

                    <label htmlFor="document">Upload Document:</label>
                    <input type="file" id="document" name="document" onChange={handleFileChange} required /><br /><br />

                    <label htmlFor="ph">Phone Number:</label>
                    <input className='w-100' type="text" id="ph" name="ph" value={formData.ph} onChange={handleChange} required /><br /><br />

                    <button className='login-submit btn btn-success w-100 my-2' type="submit">Register as Service Provider</button>

                    {error && <div className="error-message text-center text-danger">{error}</div>}
                </form>
            </div>
        </Col>
    );
};

export default ServiceProviderForm;
