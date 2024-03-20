import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TfiReload } from "react-icons/tfi";
import { TiArrowBack } from "react-icons/ti";
import { FaSyncAlt } from "react-icons/fa";
import axios from 'axios';
import { apiUrl } from '../Components/baseUrl';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput
} from 'mdb-react-ui-kit';

function UserRequest() {

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const [showForm, setShowForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [rating, setRating] = useState(0); // Rating state
  const [allRequests,setAllRequests] = useState([])

  const [basicModal, setBasicModal] = useState(false);
  const toggleOpen = () => setBasicModal(!basicModal);

  const [editingReq,setEditingReq] = useState({})

  const userRequests = [
    { id: 1, username: 'John', serviceName: 'Plumbing', date: '2024-02-21', time: '10:00 AM', description: 'Leaky faucet', status: 'Pending', rate: 50 },
    { id: 2, username: 'Alice', serviceName: 'Electrician', date: '2024-02-22', time: '2:00 PM', description: 'Power outage', status: 'Completed', rate: 80 },
    { id: 3, username: 'Bob', serviceName: 'Cleaning', date: '2024-02-23', time: '11:30 AM', description: 'House cleaning', status: 'Accepted', rate: 60 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Accepted':
        return 'green';
      case 'Completed':
        return 'blue';
      case 'Paid':
        return 'green';
      default:
        return 'black';
    }
  };

  const handlePayNow = (request) => {
    setSelectedRequest(request);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedRequest(null);
    setRating(0); // Reset rating
  };

  const handlePayment = () => {
    // Here you would typically update the state of your requests or send the updatedRequest to your backend
    console.log(`Payment for ${selectedRequest.username} with rating ${rating} processed`);
    // Example: Updating the request status to 'Paid' and setting the rating
    setSelectedRequest({ ...selectedRequest, status: 'Paid', rating: rating });
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      handleCloseForm();
    }, 2000);
  };

  // Assuming sortedUserRequests is derived from a state or comes from props, otherwise, you need to sort them as shown previously.
  // const sortedUserRequests = ...; // Your sorting logic here

  const handleStarClick = (value) => {
    setRating(value);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} onClick={() => handleStarClick(i)} style={{ cursor: 'pointer', fontSize: '25px', color: i <= rating ? 'gold' : 'gray' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleListMyReq = async()=>{
    const response = await axios.get(`${apiUrl}/ListmyRequests/`,
    {
      headers:{
        "Authorization" : `Bearer ${token}`
      }
    })
    .then((result)=>{
      console.log(result.data);
      setAllRequests(result.data);
    })
  }

  useEffect(()=>{
    handleListMyReq()
  },[])

  return (
    <div className='container'>
      <div>
      <Link to="/user" style={{ textDecoration: 'none', color: 'black' }}>
        <button className='btn btn-white border-0' style={{fontSize:"40px"}}><TiArrowBack/></button>
      </Link>
      <button className='btn btn-white text-dark border-0 mt-3' style={{fontSize:"30px",float:"right"}} onClick={() => window.location.reload()}><FaSyncAlt /></button>
      </div>
      <h1 style={{ textAlign: "center" }}>My Requests</h1>
      <table className="table" style={{ marginTop: "10vh", marginBottom: "80vh" }}>
        <thead>
          <tr className='text-center'>
            <th>Shop Name</th>
            <th>Service Name</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allRequests.map(request => (
            <tr className='text-center' key={request.id}>
              <td>{request.service_provider.shop_name}</td>
              <td className='bg-light'>{request.category}</td>
              <td className='bg-light'>{request.locationname}</td>
              <td>{(request.datetime).slice(0,10)}</td>
              <td className='bg-light'>{(request.datetime).slice(11,16)}</td>
              <td>{request.description}</td>
              <td className='bg-light'>{
                request.pending ? 'Pending' : request.accept ? 'Accepted' : 'Declined'
                }</td>
              <td>
                {
                request.accept===true ? <button className='btn btn-success'>Pay now</button> : 
                request.pending===true ? <button className='btn btn-dark' onClick={()=>{toggleOpen();setEditingReq(request);}}>Edit Request</button> : ''             
                }
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit request form */}
      <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle><h4 style={{ fontFamily: "Protest Strike" }} className='mt-2'>Edit Request</h4></MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className='px-5 py-3'>
            <Row>
                <div className='w-100 my-1'>
                  <label><b>Name</b></label>
                  <MDBInput type='datetime-local' value={editingReq.datetime} />
                </div>
                <div className='w-100 my-1'>
                  <label><b>Service</b></label>
                  <MDBInput type='text' value={editingReq.description} />
                </div>
                </Row>
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn>Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Form */}
      {showForm && (
        <div className="container" style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
          <Form style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
            <h2>Payment Form</h2>
            <p><strong>Username:</strong> {selectedRequest && selectedRequest.username}</p>
            <p><strong>Service Name:</strong> {selectedRequest && selectedRequest.serviceName}</p>
            <p><strong>Rate:</strong> ${selectedRequest && selectedRequest.rate}</p>
            {/* Star Rating */}
            <div>
              <label htmlFor="rating" className="form-label"><strong>Rating:</strong></label>
              <div>
                {renderStars()}
              </div>
            </div>
            <Button variant="secondary" onClick={handleCloseForm}>Close</Button>
            <Button variant="primary" className="ms-2" onClick={handlePayment}>Pay Now</Button>
          </Form>
        </div>
      )}

      {/* Alert for payment processing */}
      {showAlert && (
        <div className="alert alert-success" style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
          Payment Processed Successfully!
        </div>
      )}
    </div>
  );
}

export default UserRequest;
