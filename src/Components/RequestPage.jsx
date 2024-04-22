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
import { formatDate } from 'date-fns';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function RequestPage() {
  const [requests, setRequests] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false); // State to manage offcanvas visibility
  const [messages, setMessages] = useState([]); // State to store messages
  const [newMessage, setNewMessage] = useState(''); // State to hold the new message
  const [activeUser, setActiveUser] = useState(null); // State to store the active user
  const token = localStorage.getItem('token');
  const [allServices, setAllServices] = useState([]);
  const [serviceName, setServiceName] = useState('Select service');
  const [username, setUsername] = useState()
  const [serviceId, setServiceId] = useState()

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/ProfileView/`,

        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

      console.log(response.data);

      const { username } = response.data;
      setUsername(username)
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

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
        setRequests(data.filter(req => req.complted == false));
      })
      .catch(error => {
        console.error('Error fetching service requests:', error);
      });
  };

  const fetchMessages = (userId, srId) => {
    axios.get(`${apiUrl}/messages/${userId}/${srId}/list/`, {
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
    fetchProfileData();
  }, []);

  // Function to send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeUser) return;

    try {
      const response = await axios.post(`${apiUrl}/messages/${activeUser}/${serviceId}/`, { message: newMessage }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      // Format timestamp properly
      const timestamp = new Date(response.data.time_stamp).toLocaleString();



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

  const updateReq = async (reqId,srId) => {
    const newStatus = { complted: "true" }
    try {
      const response = await axios.put(`${apiUrl}/update/request/${reqId}/`, newStatus, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      handleShow()
      setTimeout(() => {
        handleClose()
        fetchServiceRequests(srId)
      },3000)
    }
    catch (error) {
      console.log(error);
    }


  }


  return (
    <div className='container pb-5'>
      <div className='mb-3 mt-4 d-flex'>
        <h1 className='col-4' style={{ fontFamily: "Protest Strike" }}>Service Requests</h1>
        <div className='col-8 d-flex justify-content-end mt-2'>
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
          <Col className='col-2 text-center fs-5'><b>Date & Time</b></Col>
          <Col className='col-2 fs-5 text-center'><b>Service</b></Col>
          <Col className='col-2 text-center fs-5'><b>Address & Phone</b></Col>
          <Col className='col-2 fs-5 text-center'></Col>
        </Row>

        {requests.length > 0 ? (
          requests.map((request) => (
            <Row className='w-100 py-2 border-bottom d-flex align-items-center'>
              <Col className='col-2'>{request.username}</Col>
              <Col className='col-2'>
                <h6 className='text-primary'>{request.shope}</h6>
                <p className='' style={{ fontFamily: "Dosis", fontSize: "15px" }}><b>{request.locationname}</b></p>
              </Col>
              <Col className='col-2 text-center'>
                <span className='px-3' style={{ fontFamily: "Dosis", fontSize: "15px" }}>
                  <p className='mt-1'>Date: <b>{formatDate(request.datetime.slice(0, 10), 'dd-MM-yyyy')}</b></p>
                  <p style={{ marginTop: "-10px" }}>Time: <b>{(request.datetime.slice(11, 13)) >= 12 ? (`${request.datetime.slice(11, 13) - 12 == 0 ? '12' : `${request.datetime.slice(11, 13) - 12}`}:${request.datetime.slice(14, 16)} PM`) : (`${request.datetime.slice(11, 16)} AM`)}</b></p>
                </span>
              </Col>
              <Col className='col-2 text-center text-success'><b>{request.categoryname}</b></Col>
              <Col className='col-2 text-center border'>
                <span className='px-3' style={{ fontFamily: "Dosis", fontSize: "15px" }}>
                  <p className=''>Address: <b>{request.address}</b></p>
                  <p>Phone: <b>{request.phone}</b></p>
                </span>
              </Col>
              <Col className='col-2 text-center'>
                <button className='btn btn-success w-100 mb-2' onClick={() => { setShowOffcanvas(true); fetchMessages(request.user, request.service); setActiveUser(request.user); setServiceId(request.service) }}><IoIosChatboxes /> Message</button>
                <button className='btn btn-primary w-100' onClick={() => updateReq(request.id,request.service)}>Work completed</button>
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
            <div>
              {
                messages.map((msg, index) => (

                  <Row className='ps-3'>
                    {msg.sender_username == username ?
                      <div className='d-flex justify-content-end'>
                        <p className='py-2 px-3 w-75 rounded' style={{ backgroundColor: "#E7FFDB" }}>
                          <span><b>{msg.message}</b></span><br />
                        </p>
                      </div>
                      :
                      <p className='py-2 px-3 w-75 rounded' style={{ backgroundColor: "rgb(235, 235, 235)" }}>
                        <span className='text-success'><b>{msg.sender_username}</b></span><br />
                        <span><b>{msg.message}</b></span><br />
                      </p>
                    }
                  </Row>
                ))
              }
            </div>

            <div className='py-5'>
              {messages.length === 0 && <p className='text-center' style={{ fontFamily: "Dosis" }}>No messages to display</p>}
            </div>
            <div className='p-3 bg-white' style={{ position: "fixed", zIndex: "1", top: "88%", width: "370px" }}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="btn btn-success" type="button" onClick={sendMessage}>
                  <IoSend />
                </button>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Work completion modal */}
        <Modal show={show} onHide={handleClose} backdrop="static" centered size='sm'>
          <Modal.Body>
            <div className='d-flex justify-content-center'>
              <img src="https://cdn.dribbble.com/users/2185205/screenshots/7886140/02-lottie-tick-01-instant-2.gif" width="100%" alt="" />
            </div>
            <p style={{ fontFamily: "Dosis", marginTop: "-20px" }} className='text-center '><b>Work Completed successfully.</b></p>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default RequestPage;
