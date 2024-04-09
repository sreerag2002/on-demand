import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../Components/baseUrl';
import { Row, Offcanvas, Button } from 'react-bootstrap';
import { FaLocationDot } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { IoIosChatboxes } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

function UserRequest() {
  const [allRequests, setAllRequests] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleListMyReq = async () => {
    try {
      const response = await axios.get(`${apiUrl}/ListmyRequests/`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setAllRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  useEffect(() => {
    handleListMyReq();
  }, []);

  const handleCancelRequest = async (requestId) => {
    try {
      await axios.delete(`${apiUrl}/DeleteRequest/${requestId}/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const updatedRequests = allRequests.filter(request => request.id !== requestId);
      setAllRequests(updatedRequests);
    } catch (error) {
      console.error('Failed to cancel request', error);
    }
  };

  const handleMessageClick = async (userId) => {
    setActiveUser(userId);
    setShowOffcanvas(true);

    try {
      const response = await axios.get(`${apiUrl}/messages/${userId}/list/`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const sortedMessages = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
  
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
    <div className='container'>
      <div className='mb-3 mt-4 d-flex'>
        <h1 style={{ fontFamily: "Protest Strike" }}>My Requests</h1>
        <div className='col-9 d-flex justify-content-end'>
          <Link to="/user"><button className='btn btn-primary mx-2'>Back to Home</button></Link>
          <FontAwesomeIcon icon={faSync} size="lg" className='m-2' style={{ cursor: 'pointer' }} onClick={handleListMyReq} />
        </div>
      </div>
      <div style={{ marginBottom: "80vh" }}>
        {allRequests.map(request => (
          <Row className='border px-4 py-3 my-3 rounded shadow' key={request.id} style={{ fontFamily: "Dosis" }}>
            <div className='w-100'>
              <h4 className='mb-0'>{request.service_provider.shop_name}</h4>
              <p className='mb-1'>
                <span className='col-9 text-secondary'><b>{request.category}</b></span>
              </p>
            </div>
            <div className='d-flex'>
              <div className='col-9 pt-2'>
                <span style={{ marginRight: "70px" }}><FaLocationDot className='text-danger' /> {request.locationname}</span>
                <span style={{ marginRight: "70px" }}><MdDateRange className='text-primary' /> {request.datetime.slice(0, 10)}</span>
                <span><IoMdTime className='fs-5 text-info' /> {request.datetime.slice(11, 16)}</span>
              </div>
              <div className='col-3'>
                <button className='btn btn-danger me-1' onClick={() => handleCancelRequest(request.id)}>Cancel Request</button>
                <button className='btn btn-success ms-1' onClick={() => handleMessageClick(request.service_provider.user)}><IoIosChatboxes /> Message</button>
              </div>
            </div>
          </Row>
        ))}
      </div>

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
  );
}

export default UserRequest;
