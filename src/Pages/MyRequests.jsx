import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faHome, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function UserRequest() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [rating, setRating] = useState(0); // Rating state

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

  return (
    <div className='container' style={{ height: "100%" }}>
      <Link to="/user" style={{ textDecoration: 'none', color: 'black' }}>
        <FontAwesomeIcon icon={faHome} size="lg" style={{ margin: '10px' }} />
      </Link>
      <FontAwesomeIcon icon={faSync} size="lg" style={{ margin: '10px', cursor: 'pointer' }} onClick={() => window.location.reload()} />
      <h1 style={{ textAlign: "center" }}>My Requests</h1>
      <table className="table" style={{ marginTop: "10vh", marginBottom: "80vh" }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Service Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userRequests.map(request => (
            <tr key={request.id}>
              <td>{request.username}</td>
              <td>{request.serviceName}</td>
              <td>{request.date}</td>
              <td>{request.time}</td>
              <td>{request.description}</td>
              <td style={{ color: getStatusColor(request.status) }}>{request.status}</td>
              <td>
                {(request.status === 'Paid') && (
                  <span className="text-success">Paid</span>
                )}
                {request.status === 'Completed' && (
                  <button className="btn btn-primary" onClick={() => handlePayNow(request)}>Pay Now</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
