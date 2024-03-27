import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSync } from '@fortawesome/free-solid-svg-icons';
import { apiUrl } from './baseUrl';
import { Col, Row } from 'react-bootstrap';
import { LuDot } from "react-icons/lu";
import { IoIosChatboxes } from "react-icons/io";

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
    <div className='container pb-5'>
      <div className='mb-3 mt-4 d-flex'>
        <h1 style={{ fontFamily: "Protest Strike" }}>Service Requests</h1>
        <div className='col-8 d-flex justify-content-end'>
          <Link to="/service"><button className='btn btn-primary me-2'>Back to Home</button></Link>
          <FontAwesomeIcon icon={faSync} size="lg" className='m-2' style={{ cursor: 'pointer' }} onClick={fetchServiceRequests} />
        </div>
      </div>
      {/* 
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
               */}

{/* Service requests */}
      <div>
        <Row className='w-100 py-4 border-bottom border-top bg-light'>
          <Col className='col-2 fs-5 fw-6'><b>Username</b></Col>
          <Col className='col-2 fs-5'><b>Shop & Location</b></Col>
          <Col className='col-3 text-center fs-5'><b>Service & DateTime</b></Col>
          <Col className='col-2 fs-5 text-center'><b>Description</b></Col>
          <Col className='col-3 fs-5 text-center'><b>Status</b></Col>
        </Row>

        {requests.length > 0 ? (
          requests.map((request) => (
            <Row className='w-100 py-2 border-bottom d-flex align-items-center'>
              <Col className='col-2'>Arun</Col>
              <Col className='col-2'>
                <h6 className='text-primary'>The Piping Pro</h6>
                <p className='' style={{ fontFamily: "Dosis", fontSize: "15px" }}><b>Kakkanad</b></p>
              </Col>
              <Col className='col-3 text-center border'>
                <p className='mb-0 pb-1 text-success' style={{ fontFamily: "Dosis" }}><b>Plumber</b></p>
                <span className='d-flex mt-0 pt-0 justify-content-center' style={{ fontFamily: "Dosis", fontSize: "15px" }}><p>Date: <b>2024-10-11</b></p><LuDot className='m-1' /><p>Time: <b>12:30 PM</b></p></span>
              </Col>
              <Col className='col-2 text-center'>"Leak issues."</Col>
              <Col className='col-3 text-center'>
                <button className='btn btn-success me-1'><IoIosChatboxes /> Message</button>
                <button className='btn btn-danger ms-1'>Decline</button>
              </Col>
            </Row>
          ))
        ) : (
          <Row className='w-100 border-bottom'>
            <p className='text-center text-danger my-2' style={{ fontFamily: "Dosis" }}><b>No request found!</b></p>
          </Row>
        )}
      </div>
    </div>
  );
}

export default RequestPage;
