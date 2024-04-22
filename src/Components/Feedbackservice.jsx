import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Row, Dropdown, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faStar } from '@fortawesome/free-solid-svg-icons';
import { FaReply } from "react-icons/fa";
import axios from 'axios';
import { apiUrl } from './baseUrl';

const StarRating = ({ rating }) => {
  return (
    <div>
      {[...Array(5)].map((star, index) => (
        <FontAwesomeIcon
          key={index}
          icon={faStar}
          color={index < rating ? "gold" : "lightgrey"}
        />
      ))}
    </div>
  );
};

function Feedback() {
  const token = localStorage.getItem('token');
  const [allServices, setAllServices] = useState([]);
  const [serviceName, setServiceName] = useState('Select service');
  const [feedbacks, setFeedbacks] = useState([]);
  const [responseId, setResponseId] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleListServices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/service-providers/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAllServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services', error);
    }
  };

  const fetchServiceRequests = async (serviceId) => {
    try {
      const response = await axios.get(`${apiUrl}/ListFeedback/${serviceId}/`, );
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Failed to fetch feedback', error);
    }
  };

  const handleRespondToFeedback = async (feedbackId, username) => {
    try {
      const response = await axios.post(`${apiUrl}/respond/to/feedback/${feedbackId}/`, { respond: responseText }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      setResponseId(null);
      setResponseText('');
      // Show toast message
      setToastMessage(`Responded to ${username}`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000); // Hide the toast after 3 seconds
    } catch (error) {
      console.error('Failed to respond to feedback', error);
    }
  };

  useEffect(() => {
    handleListServices();
  }, []);

  const cancelResponse = () => {
    setResponseId(null);
    setResponseText('');
  };

  return (
    <div className='container pb-5'>
      {showToast && (
        <div style={{ position: 'fixed', top: 20, right: 20, backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px', zIndex: 1000 }}>
          {toastMessage}
        </div>
      )}

      <div className='mb-3 mt-4 d-flex'>
        <h1 className='col-4' style={{ fontFamily: "Protest Strike" }}>Feedbacks</h1>
        <div className='col-8 d-flex justify-content-end'>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {serviceName}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {allServices.map((item) => (
                <Dropdown.Item key={item.id} onClick={() => {fetchServiceRequests(item.id); setServiceName(item.shop_name);}}>
                  {item.shop_name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Link to="/service"><Button variant='primary' className='mx-2'>Back to Home</Button></Link>
          <FontAwesomeIcon icon={faSync} size="lg" className='m-2' style={{ cursor: 'pointer' }} onClick={() => fetchServiceRequests()} />
        </div>
      </div>

      <div>
      <Row className='w-100 py-4 border-bottom border-top bg-light'>
          <Col className='col-2 fs-5 fw-6'><b>Username</b></Col>
          <Col className='col-2 fs-5  '><b>Rating</b></Col>
          <Col className='col-3 text-center fs-5'><b>Feedback</b></Col>
          
        </Row>
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <Row key={feedback.id} className='w-100 py-2 border-bottom d-flex align-items-center'>
              <Col className='col-2'>{` ${feedback.username}`}</Col>
              <Col className='col-2 '><StarRating rating={feedback.rating} /></Col>
              <Col className='col-3 text-center'>{feedback.feedback}</Col>
              <Col className='col-3 text-center'>
                {responseId === feedback.id ? (
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Type response..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    />
                    <Button variant='primary' className='ms-2' onClick={() => handleRespondToFeedback(feedback.id, feedback.username)}>Send</Button>
                    <Button variant='secondary' onClick={cancelResponse} style={{ marginLeft: "5px" }}>Cancel</Button>
                  </div>
                ) : (
                  <Button variant='success' className='me-1' onClick={() => { setResponseId(feedback.id); setResponseText(''); }}>Respond</Button>
                )}
              </Col>
            </Row>
          ))
        ) : (
          <Row className='w-100 border-bottom'>
            <p className='text-center text-danger my-2'><b>No feedback found!</b></p>
          </Row>
        )}
      </div>
    </div>
  );
}

export default Feedback;
 