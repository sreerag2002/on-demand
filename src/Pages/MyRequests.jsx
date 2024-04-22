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
import Modal from 'react-bootstrap/Modal';
import { MdOutlinePendingActions } from "react-icons/md";

function UserRequest() {
  const [allRequests, setAllRequests] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const token = localStorage.getItem('token');
  const [username, setUsername] = useState()
  const [serviceId, setServiceId] = useState()
  const [cancelId, setCancelId] = useState()
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(1);
  const [provId, setProvId] = useState()

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

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
    fetchProfileData();
  }, []);

  const handleCancelRequest = async () => {
    try {
      await axios.delete(`${apiUrl}/DeleteRequest/${cancelId}/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const updatedRequests = allRequests.filter(request => request.id !== cancelId);
      setAllRequests(updatedRequests);
    } catch (error) {
      console.error('Failed to cancel request', error);
    }
  };

  const handleMessageClick = async (userId, srId) => {
    setActiveUser(userId);
    setShowOffcanvas(true);

    try {
      const response = await axios.get(`${apiUrl}/messages/${userId}/${srId}/list/`, {
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

  const handleFeedback = async () => {
    try {
      await axios.post(
        `${apiUrl}/Createfeedback/${provId}/`,
        { feedback, rating },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert("Feedback submitted successfully.");
      handleClose();
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  function incrementRating() {
    setRating(rating + 1)
  }

  function decrementRating() {
    setRating(rating - 1)
  }

  return (
    <div className='container'>
      <div className='mb-3 mt-4 d-flex'>
        <h1 className='col-4' style={{ fontFamily: "Protest Strike" }}>My Requests</h1>
        <div className='col-8 d-flex justify-content-end mt-3'>
          <Link to="/user"><button className='btn btn-primary mx-2'>Back to Home</button></Link>
          <FontAwesomeIcon icon={faSync} size="lg" className='m-2' style={{ cursor: 'pointer' }} onClick={handleListMyReq} />
        </div>
      </div>
      <div style={{ marginBottom: "80vh" }}>
        {allRequests.map(request => (
          <Row className='border px-4 py-3 my-3 rounded shadow' key={request.id} style={{ fontFamily: "Dosis" }}>
            <div className='col-9'>
              <h4 className='mb-0'>{request.service_provider.shop_name}</h4>
              <p className='mb-3'>
                <span className='col-9 text-secondary'><b>(Ph: {request.service_phone})<br/>{request.category}</b></span>
              </p>
              <p className='mt-1' style={{ fontFamily: "Dosis" }}>
                Phone No.: <b>{request.phone}</b>
              </p>
              <p style={{ fontFamily: "Dosis", marginTop: "-10px" }}>
                Address: <b>{request.address}</b>
              </p>
              <div className='pt-2 d-flex'>
                <div className='col-2' style={{ marginRight: "70px" }}><FaLocationDot className='text-danger' /><b> {request.locationname}</b></div>
                <div className='col-2' style={{ marginRight: "70px" }}><MdDateRange className='text-primary' /><b> {request.datetime.slice(0, 10)}</b></div>
                <div className='col-2'><IoMdTime className='fs-5 text-info' /><b> {(request.datetime.slice(11, 13)) >= 12 ? (`${request.datetime.slice(11, 13) - 12 == 0 ? '12' : `${request.datetime.slice(11, 13) - 12}`}:${request.datetime.slice(14, 16)} PM`) : (`${request.datetime.slice(11, 16)} AM`)}</b></div>
              </div>
            </div>

            <div className='col-3 d-flex align-items-end'>
              <div hidden={request.complted == false} className='w-100'>
                <p className='text-center text-primary mb-5' style={{ fontFamily: "Dosis" }}><b>Work completed ✅</b></p>
                <button className='btn btn-success w-100 mb-1' onClick={() => { handleShow1(); setProvId(request.service_provider.id) }}>Send Feedback</button>
              </div>
              <div hidden={request.complted == true}>
              <p className='text-center text-warning mb-5' style={{ fontFamily: "Dosis" }}><b>Pending <MdOutlinePendingActions /></b></p>
                <button className='btn btn-danger me-1 mb-1' onClick={() => { handleShow(); setCancelId(request.id); }}>Cancel Request</button>
                <button className='btn btn-success mb-1' onClick={() => { handleMessageClick(request.service_provider.user, request.service_provider.id); setServiceId(request.service_provider.id) }}><IoIosChatboxes /> Message</button>
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
                      <span className='text-success'><b>{msg.service}</b></span><br />
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

      {/* Cancellation policy */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className='text-center py-5'>
          <h4>Cancellation and Refund Policy</h4>
          <p className='mb-4' style={{ fontFamily: "Dosis" }}>The booking charge is 100.00 INR. After the successful<br />cancellation of service request, 85.00 INR will be refunded.</p>
          <p className='fs-5' style={{ fontFamily: "Dosis" }}><b>Are you sure want to continue?</b></p>
          <button className='btn btn-danger me-1 px-4' onClick={handleClose}>No</button>
          <button className='btn btn-success px-4' onClick={() => { handleClose(); handleCancelRequest(); }}>Yes</button>
        </Modal.Body>
      </Modal>

      {/* Send feedback */}
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='w-100 my-1'>
            <label><b>Feedback</b></label>
            <textarea type='text' required cols={61} rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          </div>
          <div className='w-100 my-1 d-flex justify-content-start'>
            <button disabled={rating == 1} onClick={decrementRating} className='btn m-2 mt-4 btn-light'>-</button>
            <div>
              <label><b>Rating</b></label><br />
              <input className='text-center ps-3' disabled type="number" min="1" max="5" value={rating} onChange={(e) => setRating(parseInt(e.target.value))} />
            </div>
            <button disabled={rating == 5} onClick={incrementRating} className='btn m-2 mt-4 btn-light'>+</button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {handleFeedback(); handleClose1();}}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserRequest;
