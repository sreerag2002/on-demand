import React, { useState, useEffect, useRef } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader,
  MDBCardFooter,
  MDBBtn
} from 'mdb-react-ui-kit';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import axios from 'axios';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import { MDBInput } from 'mdb-react-ui-kit';
import { Row } from 'react-bootstrap';
import { apiUrl } from './baseUrl';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ServiceCard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const locationHook = useLocation();
  const { location } = locationHook.state;
  const { category } = locationHook.state;

  const [allServices, setAllServices] = useState([]);
  const [bookedServices, setBookedServices] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [serviceDateTime, setServiceDateTime] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const errorRef = useRef();
  const [staticModal, setStaticModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const toggleOpen = () => setStaticModal(!staticModal);
  const handleClose = () => {
    setShowReportModal(false);
    setShowFeedbackModal(false);
    setReportReason(''); // Clear reason input
    setFeedback(''); // Clear feedback input
    setRating(0); // Reset rating
  };
  const handleShow = (srId) => {
    setShowReportModal(true);
    setSelectedItem(srId); // Set the selected service id
  };

  const handleSearchResults = async () => {
    try {
      const response = await axios.get(`${apiUrl}/ListServiceProviders/${category.id}/${location.id}/`);
      setAllServices(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookNow = async (srId) => {
    const bookedService = { datetime: serviceDateTime };
    try {
      await axios.post(`${apiUrl}/CreateRequest/${srId}/`, bookedService, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("Service booked successfully.");
      navigate('/user');
    } catch (error) {
      console.log(error);
      errorRef.current.innerHTML = error.response.data;
    }
  };

  const handleReportService = async (srId) => {
    try {
      await axios.post(
        `${apiUrl}/report/service/${srId}/`,
        { reason: reportReason },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert("Service reported successfully.");
      handleClose();
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  const handleFeedback = async () => {
    try {
      await axios.post(
        `${apiUrl}/Createfeedback/${selectedItem.id}/`,
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

  const handleSubReason = async(srvId) =>{
    const response = axios.post(`${apiUrl}/report/service/${srvId}/`,{ reason:reportReason },
    {
      headers:{
        'Authorization' : `Bearer ${token}`
      }
    }).then((result)=>{
      alert('Report reason sent.')
      console.log(result);
    })
  }

  useEffect(() => {
    handleSearchResults();
  }, []);

  return (
    <div>
      <h1 className='my-4' style={{ textAlign: "center" }}>Services</h1>

      <div className="row mx-5 mb-5">
        {allServices.length > 0 ?
          allServices.map(service => (
            <div className='col-3 my-3'>
              <MDBCard style={{ boxShadow: "2px 2px 10px gray" }} alignment='center' className='rounded'>
                <MDBCardHeader><h4 style={{ fontFamily: "Protest Strike" }} className='mt-2'>{category.categoryname}</h4></MDBCardHeader>
                <MDBCardBody>
                  <MDBCardTitle style={{ fontSize: "15px" }}>Shop Name<br /> <b style={{ fontSize: "25px" }}>{service.shop_name}</b></MDBCardTitle>
                  <MDBCardText className='my-3'><b>Description</b> <br /><i>"{service.description}"</i></MDBCardText>
                  <MDBCardTitle style={{ fontSize: "20px" }}>Location: {location.locationname}</MDBCardTitle>

                  <div className='my-2'>
                    <b>Average Rating:</b> {[...Array(Math.floor(service.avg_rating))].map((star, index) => {
                      return <FaStar key={index} color='#ffc107' />;
                    })}
                  </div>


                  <button onClick={() => { toggleOpen(); setSelectedItem(service.id); }} className='my-2 mx-1 btn btn-info'>Book Now</button><br />

                  <button className='my-2 mx-1 btn btn-success' onClick={() => { setShowFeedbackModal(true); setSelectedItem(service); }}>Feedback</button>


                  <button className='my-2 mx-1 btn btn-danger' onClick={() => handleShow(service.id)}>Report </button>
                </MDBCardBody>
              </MDBCard>
            </div>
          ))
          :
          (<div className='my-5 py-5 text-center'>
            <h4>No services available.</h4>
            <Link to="/user">
              <button className='btn btn-success my-3'>Back to search</button>
            </Link>
          </div>)
        }
      </div>

      <MDBModal staticBackdrop tabIndex='-1' open={staticModal} setOpen={setStaticModal}>
        <MDBModalDialog size='lg'>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle><h4 style={{ fontFamily: "Protest Strike" }} className='mt-2'>Book your Service</h4></MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className='px-5 py-3'>
              <Row>
                <div className='w-100 my-1'>
                  <label><b>Name</b></label>
                  <MDBInput type='text' value={username} disabled />
                </div>
                <div className='w-50 my-1'>
                  <label><b>Service</b></label>
                  <MDBInput type='text' value={category.categoryname} disabled />
                </div>
                <div className='w-50 my-1'>
                  <label><b>Location</b></label>
                  <MDBInput type='text' value={location.locationname} disabled />
                </div>
                <div className='w-100 my-1'>
                  <label><b>Shop name</b></label>
                  <MDBInput type='text' value={selectedItem.shop_name} disabled />
                </div>
                <div className='w-100 my-4'>
                  <label><b>Select Date & Time</b></label>
                  <MDBInput type='datetime-local' onChange={(e) => setServiceDateTime(e.target.value)} required />
                </div>
                <p className='text-danger' style={{ fontFamily: "Dosis" }} ref={errorRef}></p>
              </Row>
            </MDBModalBody>
            <MDBModalFooter>
              <button className='btn btn-secondary' color='secondary' onClick={toggleOpen}>
                Close
              </button>
              <button className='btn btn-info' onClick={() => handleBookNow(selectedItem)}>Book Now</button>

            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <Modal show={showReportModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='w-100 my-1'>
            <label><b>Reason</b></label>
            <textarea type='text' required cols={61} rows={3} value={reportReason} onChange={(e) => setReportReason(e.target.value)} />
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleReportService(selectedItem)}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showFeedbackModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='w-100 my-1'>
            <label><b>Feedback</b></label>
            <textarea type='text' required cols={61} rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          </div>
          <div className='w-100 my-1'>
            <label><b>Rating</b></label><br />
            <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(parseInt(e.target.value))} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleFeedback(selectedItem)}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ServiceCard;
