import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSync, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

function RequestPage({ id }) {
  const [requests, setRequests] = useState([]);

    const token = localStorage.getItem('token');


  useEffect(() => {
    if (id) {
      fetchServiceRequests(id);
    }
  }, [id]);

  const fetchServiceRequests = (id) => {
    fetch(`http://10.11.0.95:8002/ListRequests/${id}/`, {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        setRequests(data);
      })
      .catch(error => {
        console.error('Error fetching service requests:', error);
      });
  };

  const handleAccept = (id) => {
    console.log(`Accepted request with ID: ${id}`);
  };

  const handleDecline = (id) => {
    console.log(`Declined request with ID: ${id}`);
  };

  const refreshData = () => {
    if (id) {
      fetchServiceRequests(id);
    }
  };

  return (
    <div className='container'>
      <Link to="/service" style={{ textDecoration: 'none', color: 'black' }}>
        <FontAwesomeIcon icon={faHome} size="lg" style={{ margin: '10px' }} />
      </Link>
      <FontAwesomeIcon icon={faSync} size="lg" style={{ margin: '10px', cursor: 'pointer' }} onClick={refreshData} />
      <h1 style={{textAlign: "center"}}>Service Requests</h1><br /><br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Description</th>
            <th>Date and Time</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id}>
                <td>{request.user_name}</td>
                <td>{request.description}</td>
                <td>{request.datetime}</td>
                <td>{request.location}</td>
                <td>
                  <Button variant="success" onClick={() => handleAccept(request.id)} aria-label="Accept Request">
                    <FontAwesomeIcon icon={faCheck} />
                  </Button>{' '}
                  <Button variant="danger" onClick={() => handleDecline(request.id)} aria-label="Decline Request">
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No requests found</td>
            </tr>
          )}
        </tbody>
      </Table><br /><br />
    </div>
  );
}

export default RequestPage;
