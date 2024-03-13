import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import { faHome, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

function RequestPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch service requests when the component mounts
    fetchServiceRequests();
  }, []); // Empty dependency array to run effect only once when component mounts

  // Function to fetch service requests from the API
  const fetchServiceRequests = () => {
    // Replace 'API_ENDPOINT' with your actual API endpoint URL
    fetch('API_ENDPOINT')
      .then(response => response.json())
      .then(data => {
        setRequests(data); // Update state with fetched data
      })
      .catch(error => {
        console.error('Error fetching service requests:', error);
      });
  };

  // Function to handle accepting a request
  const handleAccept = (id) => {
    // Handle accepting the request (e.g., send a request to the server)
    console.log(`Accepted request with ID: ${id}`);
  };

  // Function to handle declining a request
  const handleDecline = (id) => {
    // Handle declining the request (e.g., send a request to the server)
    console.log(`Declined request with ID: ${id}`);
  };

  return (
    <div className='container'>
         <Link to="/service" style={{ textDecoration: 'none', color: 'black' }}>
        <FontAwesomeIcon icon={faHome} size="lg" style={{ margin: '10px' }} />
      </Link>
      {/* Refresh button */}
      <FontAwesomeIcon icon={faSync} size="lg" style={{ margin: '10px', cursor: 'pointer' }} onClick={() => window.location.reload()} />
      <h1 style={{textAlign:"center"}}>Service Requests</h1><br /><br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Service</th>
            <th>Location</th>
            <th>Shop name</th>
            <th>Description</th>
            <th>Date and Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.username}</td>
              <td>{request.description}</td>
              <td>{request.dateTime}</td>
              <td>{request.location}</td>
              <td>
                <Button variant="success" onClick={() => handleAccept(request.id)}>
                  <FontAwesomeIcon icon={faCheck} />
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDecline(request.id)}>
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table><br /><br />
    </div>
  );
}

export default RequestPage;
