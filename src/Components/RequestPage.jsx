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
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';

function RequestPage() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');
  const id = localStorage.getItem("id");
  const [allServices, setAllServices] = useState([])
  const [serviceName,setServiceName] = useState('Select service')

  const fetchServiceRequests = (serviceId) => {
    fetch(`${apiUrl}/ListRequests/${serviceId}/`, {
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

  const handleListServices = async () => {
    const response = axios.get(`${apiUrl}/service-providers/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((result) => {
        // console.log(result.data);
        setAllServices(result.data)
      })
  }

  useEffect(() => {
    handleListServices()
  }, []);

  return (
    <div className='container pb-5'>
      <div className='mb-3 mt-4 d-flex'>
        <h1 style={{ fontFamily: "Protest Strike" }}>Service Requests</h1>
        <div className='col-8 d-flex justify-content-end'>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {serviceName}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {
                allServices.map((item) => (
                  <Dropdown.Item onClick={() =>{fetchServiceRequests(item.id);setServiceName(item.shop_name);}}>{item.shop_name}</Dropdown.Item>
                ))
              }
            </Dropdown.Menu>
          </Dropdown>
          <Link to="/service"><button className='btn btn-primary mx-2'>Back to Home</button></Link>
          <FontAwesomeIcon icon={faSync} size="lg" className='m-2' style={{ cursor: 'pointer' }} onClick={fetchServiceRequests} />
        </div>
      </div>

      {/* Service requests */}
      <div>
        <Row className='w-100 py-4 border-bottom border-top bg-light'>
          <Col className='col-2 fs-5 fw-6'><b>Username</b></Col>
          <Col className='col-2 fs-5'><b>Shop & Location</b></Col>
          <Col className='col-3 text-center fs-5'><b>Date & Time</b></Col>
          <Col className='col-2 fs-5 text-center'><b>Service</b></Col>
          <Col className='col-3 fs-5 text-center'><b>Status</b></Col>
        </Row>

        {requests.length > 0 ? (
          requests.map((request) => (
            <Row className='w-100 py-2 border-bottom d-flex align-items-center'>
              <Col className='col-2'>{request.username}</Col>
              <Col className='col-2'>
                <h6 className='text-primary'>{request.shope}</h6>
                <p className='' style={{ fontFamily: "Dosis", fontSize: "15px" }}><b>{request.locationname}</b></p>
              </Col>
              <Col className='col-3 text-center border'>
                {/* <p className='mb-0 pb-1 text-success' style={{ fontFamily: "Dosis" }}><b>{request.categoryname}</b></p> */}
                <span className='d-flex pt-3  justify-content-center' style={{ fontFamily: "Dosis", fontSize: "15px" }}>
                  <p>Date: <b>{request.datetime.slice(0, 10)}</b></p><LuDot className='m-1' />
                  <p>Time: <b>{(request.datetime.slice(11, 13))>=12? (`${request.datetime.slice(11, 13)-12==0? '12' : `${request.datetime.slice(11, 13)-12}`}:${request.datetime.slice(14, 16)} PM`) : (`${request.datetime.slice(11, 16)} AM`)}</b></p>
                </span>
              </Col>
              <Col className='col-2 text-center text-success'><b>{request.categoryname}</b></Col>
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
