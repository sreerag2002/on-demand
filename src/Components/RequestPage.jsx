import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSync } from '@fortawesome/free-solid-svg-icons';
import { apiUrl } from './baseUrl';

function RequestPage() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');
  const id = localStorage.getItem("id");

  const fetchServiceRequests = () => {
    fetch(`${apiUrl}/ListRequests/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {

        setRequests(data.map(request => ({ ...request, localStatus: request.accept ? 'Accepted' : request.decline ? 'Declined' : '' })));
      })
      .catch(error => {
        console.error('Error fetching service requests:', error);
      });
  };
  

  const updateRequestStatus = (requestId, accept) => {
    const updateData = {
      pending: !accept,
      accept: accept,
      decline: !accept,
    };

    fetch(`${apiUrl}/UpdateRequest/${requestId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })
      .then(response => {
        if (response.ok) {
          setRequests(requests.map(request => {
            if (request.id === requestId) {
              return { ...request, localStatus: accept ? 'Accepted' : 'Declined' };
            }
            return request;
          }));
        } else {
          throw new Error('Failed to update request status.');
        }
      })
      .catch(error => {
        console.error('Error updating request status:', error);
      });
  };

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  return (
    <div className='container'>
      <Link to="/service" style={{ textDecoration: 'none', color: 'black' }}>
        <FontAwesomeIcon icon={faHome} size="lg" style={{ margin: '10px' }} />
      </Link>
      <FontAwesomeIcon icon={faSync} size="lg" style={{ margin: '10px', cursor: 'pointer' }} onClick={fetchServiceRequests} />
      <h1 style={{ textAlign: "center" }}>Service Requests</h1><br /><br />
      <Table striped bordered hover>
        <thead>
          <tr className='text-center'>
            <th>Username</th>
            <th>Description</th>
            <th>Shop Name</th>
            <th>Service</th>
            <th>Date and Time</th>
            <th>Location</th>
            <th>Status</th>
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
                <td><span className='mx-2'>Date: <b>{(request.datetime).slice(0, 10)}</b></span>&<span className='mx-2'>Time: <b>{(request.datetime).slice(11, 16)}</b></span></td>
                <td>{request.locationname}</td>
                <td>
                  {request.localStatus ? (
                    <span style={{ color: request.localStatus === 'Accepted' ? 'green' : 'red' , fontWeight:"bold" }}>{request.localStatus}</span>
                  ) : (
                    <>
                      <Button variant="success" onClick={() => updateRequestStatus(request.id, true)} aria-label="Accept Request">
                        Accept
                      </Button>{' '}
                      <Button variant="danger" onClick={() => updateRequestStatus(request.id, false)} aria-label="Decline Request">
                        Decline
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No requests found</td>
            </tr>
          )}     
        </tbody>
      </Table><br /><br />
    </div>
  );
}

export default RequestPage;
