import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSync, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { apiUrl } from './baseUrl';

function RequestPage() {
  const [requests, setRequests] = useState([]);

    const token = localStorage.getItem('token');
    const id = localStorage.getItem("id")

  const fetchServiceRequests = () => {
    fetch(`${apiUrl}/ListRequests/${id}/`, {
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

  const handleAccept = () => {
    console.log(`Accepted request with ID:`);
  };

  const handleDecline = () => {
    console.log(`Declined request with ID:`);
  };

  const refreshData = () => {
      fetchServiceRequests();
  };

  useEffect(() => {
      fetchServiceRequests();
  }, []);

  return (
    <div className='container'>
      <Link to="/service" style={{ textDecoration: 'none', color: 'black' }}>
        <FontAwesomeIcon icon={faHome} size="lg" style={{ margin: '10px' }} />
      </Link>
      <FontAwesomeIcon icon={faSync} size="lg" style={{ margin: '10px', cursor: 'pointer' }} onClick={refreshData} />
      <h1 style={{textAlign: "center"}}>Service Requests</h1><br /><br />
      <Table striped bordered hover>
        <thead>
          <tr className='text-center'>
            <th>Username</th>
            <th>Description</th>
            <th>Shop Name</th>
            <th>Service</th>
            <th>Date and Time</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id} className='text-center'>
                <td>{request.username}</td>
                <td>{request.description}</td>
                <td>{request.shope}</td>
                <td>{request.categoryname}</td>
                <td><span className='mx-2'>Date: <b>{(request.datetime).slice(0,10)}</b></span>&<span className='mx-2'>Time: <b>{(request.datetime).slice(11,16)}</b></span></td>
                <td>{request.locationname}</td>
                <td>{request.id}</td>              
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
