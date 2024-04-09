import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSync } from '@fortawesome/free-solid-svg-icons';
import { apiUrl } from './baseUrl';
import { Col, Row, Offcanvas } from 'react-bootstrap'; // Import Offcanvas from react-bootstrap
import { LuDot } from "react-icons/lu";
import { IoIosChatboxes } from "react-icons/io";
import Dropdown from 'react-bootstrap/Dropdown';
import { IoSend } from "react-icons/io5";

import axios from 'axios';

function RequestPage() {
  const [requests, setRequests] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false); // State to manage offcanvas visibility
  const [messages, setMessages] = useState([]); // State to store messages
  const [newMessage, setNewMessage] = useState(''); // State to hold the new message
  const [activeUser, setActiveUser] = useState(null); // State to store the active user
  const token = localStorage.getItem('token');
  const id = localStorage.getItem("id");
  const [allServices, setAllServices] = useState([]);
  const [serviceName, setServiceName] = useState('Select service');

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

  const fetchMessages = (userId) => {
    axios.get(`${apiUrl}/messages/${userId}/list/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        // Sort the messages by timestamp in ascending order
        const sortedMessages = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(sortedMessages);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
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
        setAllServices(result.data);
      });
  };

  useEffect(() => {
    handleListServices();
  }, []);

  // Function to send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeUser) return;
  
    try {
      const response = await axios.post(`${apiUrl}/messages/${activeUser}/`, { message: newMessage }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      // Format timestamp properly
      const timestamp = new Date(response.data.time_stamp).toLocaleString();
  
      // Get username from localStorage
      const username = localStorage.getItem('username');
  
      // Construct the message object
      const newMessageObject = {
        sender_username: username,
        message: response.data.message,
        timestamp: timestamp
      };
  
      // Update the messages state
      const updatedMessages = [...messages, newMessageObject];
      setMessages(updatedMessages);
  
      // Clear the input field after sending
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
 
  
 

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
              {allServices.map((item) => (
                <Dropdown.Item onClick={() => { fetchServiceRequests(item.id); setServiceName(item.shop_name); }}>{item.shop_name}</Dropdown.Item>
              ))}
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
                <span className='d-flex pt-3  justify-content-center' style={{ fontFamily: "Dosis", fontSize: "15px" }}>
                  <p>Date: <b>{request.datetime.slice(0, 10)}</b></p><LuDot className='m-1' />
                  <p>Time: <b>{(request.datetime.slice(11, 13)) >= 12 ? (`${request.datetime.slice(11, 13) - 12 == 0 ? '12' : `${request.datetime.slice(11, 13) - 12}`}:${request.datetime.slice(14, 16)} PM`) : (`${request.datetime.slice(11, 16)} AM`)}</b></p>
                </span>
              </Col>
              <Col className='col-2 text-center text-success'><b>{request.categoryname}</b></Col>
              <Col className='col-3 text-center'>
                <button className='btn btn-success me-1' onClick={() => { setShowOffcanvas(true); fetchMessages(request.user); setActiveUser(request.user); }}><IoIosChatboxes /> Message</button>
              </Col>
            </Row>
          ))
        ) : (
          <Row className='w-100 border-bottom'>
            <p className='text-center text-danger my-2' style={{ fontFamily: "Dosis" }}><b>No request found!</b></p>
          </Row>
        )}

        {/* Offcanvas */}
        <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Messages</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {/* Message UI */}
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: "15px" }}>
                <strong>{msg.sender_username}</strong>: {msg.message}
                <br />
                <small>{new Date(msg.timestamp).toLocaleString()}</small>
              </div>
            ))}

            {messages.length === 0 && <p>No messages to display</p>}


            <div style={{ position: 'absolute', bottom: 10, left: 0, width: '100%', padding: '0 15px', boxSizing: 'border-box' }}>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Type a message..." 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                />
                <button className="btn btn-outline-success" type="button" onClick={sendMessage}>
                  <IoSend />
                </button>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
}

export default RequestPage;
