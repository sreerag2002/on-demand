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
import Offcanvas from 'react-bootstrap/Offcanvas';
import FDresponseCard from './FDresponseCard';
import { MDBAccordion, MDBAccordionItem } from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

function ServiceCard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const locationHook = useLocation();
  const { location } = locationHook.state;
  const { category } = locationHook.state;
  const { balanceAmt } = locationHook.state;

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
  const msgRef = useRef()
  const [allFeedbacks, setAllFeedbacks] = useState([])
  const responseRef = useRef()
  const [response, setResponse] = useState([])
  const [insuffMsg,setInsuffMsg] = useState()
  const [ratingMsg,setRatingMsg] = useState('')

  const [show, setShow] = useState(false);
  const handleClose1 = () => setShow(false);
  const handleShow1 = () => setShow(true);

  const toggleOpen = () => setStaticModal(!staticModal);
  const handleClose = () => {
    setShowReportModal(false);
    setShowFeedbackModal(false);
    setReportReason(''); // Clear reason input
    setFeedback(''); // Clear feedback input
    setRating(0); // Reset rating
  };
  const handleShow = (item) => {
    setShowReportModal(true);
    setSelectedItem(item); // Set the selected service id
  };

  const handleSearchResults = async () => {
    try {
      const response = await axios.get(`${apiUrl}/ListServiceProviders/${category.id}/${location.id}/`);
      setAllServices(response.data);
      insuffBalance();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookNow = async (srId) => {
    if (serviceDateTime == '') {
      errorRef.current.innerHTML = 'Enter date and time';
    } else {
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

  function insuffBalance() {
    if (balanceAmt < 100) {
      setInsuffMsg('Insufficient balance to book service.')
    } else {
      setInsuffMsg('');
    }
  }

  const listFeedbacks = async (srId) => {
    try {
      const response = await axios.get(`${apiUrl}/ListFeedback/${srId}/`);
      setAllFeedbacks(response.data)
    }
    catch (error) {
      console.log(error);
    }
  }

  function incrementRating(){
      setRating(rating+1)
  }

  function decrementRating(){
      setRating(rating-1)
  }

  // console.log(response);

  useEffect(() => {
    handleSearchResults();
  }, []);

  return (
    <div className='container'>
      <div className='mb-3 mt-4 d-flex'>
        <h1 className='col-3' style={{ fontFamily: "Protest Strike" }}>Search results</h1>
        <div className='col-9 d-flex justify-content-end pt-2'>
          <Link to="/user"><button className='btn btn-primary mx-2'>Back to Home</button></Link>
          <FontAwesomeIcon icon={faSync} size="lg" className='m-2' style={{ cursor: 'pointer' }} onClick={handleSearchResults} />
        </div>
      </div>

      <div className="row mx-5 my-5">
        {allServices.length > 0 ?
          allServices.map(service => (
            <div className='col-4 my-3' key={service.id}>
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


                  <button disabled={balanceAmt < 100} onClick={() => { toggleOpen(); setSelectedItem(service); }} className='w-100 my-2 mx-1 btn btn-info'>Book Now</button><br />

                  <button className='w-100 my-1 mx-1 btn btn-success' onClick={() => { handleShow1(); setSelectedItem(service); listFeedbacks(service.id); }}>Feedbacks</button>


                  <button className='w-50 my-2 btn btn-danger' onClick={() => handleShow(service.id)}>Report </button>
                  <p ref={msgRef} className='text-center text-danger' style={{ fontFamily: "Dosis" }}>{insuffMsg}</p>
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

      {/* Booking modal */}
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
                <div className='border-top pt-3'>
                  <span className='fs-5'><b>Booking charge</b></span>
                  <span className='mt-1' style={{ float: "right" }}>
                    <p className='fs-5' style={{ fontFamily: "Dosis" }}><b>100.00</b></p>
                    <p className='p-0' style={{ fontSize: "10px", fontFamily: "Dosis", marginTop: "-20px" }}>including all taxes</p>
                  </span>
                </div>
                <p className='text-danger' style={{ fontFamily: "Dosis" }} ref={errorRef}></p>
              </Row>
            </MDBModalBody>
            <MDBModalFooter>
              <button className='btn btn-secondary' color='secondary' onClick={toggleOpen}>
                Close
              </button>
              <button className='btn btn-info' onClick={() => handleBookNow(selectedItem.id)}>Book Now</button>

            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Report service modal */}
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

      {/* Send feedback modal */}
      <Modal show={showFeedbackModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='w-100 my-1'>
            <label><b>Feedback</b></label>
            <textarea type='text' required cols={61} rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          </div>
          <div className='w-100 my-1 d-flex justify-content-start'>
          <button disabled={rating==1} onClick={decrementRating} className='btn m-2 mt-4 btn-light'>-</button>
          <div>
          <label><b>Rating</b></label><br />
            <input disabled type="number" min="1" max="5" value={rating} onChange={(e) => setRating(parseInt(e.target.value))} />
          </div>
            <button disabled={rating==5} onClick={incrementRating} className='btn m-2 mt-4 btn-light'>+</button>
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

      {/* Feedbacks and send feedback  */}
      <Offcanvas show={show} onHide={handleClose1} backdrop="static" placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Feedbacks</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            {
              allFeedbacks.map((fdback) => (
                <Row className='my-1 p-2 border-bottom border-top rounded'>
                  <span className='w-100 p-3 border rounded mb-2' style={{ height: "auto" }}>
                    <p className='fs-6 ms-1' style={{ fontFamily: "Dosis" }}><b>{fdback.username}</b></p>
                    <p className='text-warning' style={{ marginTop: "-25px" }}>{[...Array(Math.floor(fdback.rating))].map((star, index) => {
                      return <FaStar key={index} color='#ffc107' />;
                    })}</p>
                    <p className='text-black' style={{ fontFamily: "Dosis", textAlign: "justify", marginTop: "-10px" }}>{fdback.feedback}</p>
                    <MDBAccordion className='border-0'>
                      <MDBAccordionItem className='border-0' collapseId={1} headerTitle='View response'>
                        <FDresponseCard responseData={fdback.responses} />
                      </MDBAccordionItem>
                    </MDBAccordion>
                  </span>
                </Row>
              ))
            }
          </div>
          <div style={{ position: "fixed", zIndex: "1", top: "88%" }}>
            <button className='btn btn-success' style={{ width: "365px" }} onClick={() => setShowFeedbackModal(true)}>Send Feedback</button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default ServiceCard;
