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
  const [username, setUsername] = useState()
  const locationHook = useLocation();
  const { location } = locationHook.state;
  const { category } = locationHook.state;

  const [allServices, setAllServices] = useState([]);
  const [bookedServices, setBookedServices] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [serviceDateTime, setServiceDateTime] = useState('');
  const [serviceAddress, setServiceAddress] = useState('')
  const [servicePhone, setServicePhone] = useState('')
  const [reportReason, setReportReason] = useState('');
  const errorRef = useRef();
  const [staticModal, setStaticModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const msgRef = useRef()
  const [allFeedbacks, setAllFeedbacks] = useState([])
  const [insuffMsg, setInsuffMsg] = useState()
  const [balanceAmt, setBalanceAmt] = useState()

  const [show, setShow] = useState(false);
  const handleClose1 = () => setShow(false);
  const handleShow1 = () => setShow(true);

  const toggleOpen = () => setStaticModal(!staticModal);
  const handleClose = () => {
    setShowReportModal(false);
    setReportReason(''); // Clear reason input
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
      const bookedService = { datetime: serviceDateTime, address: serviceAddress, phone: servicePhone };
      try {
        await axios.post(`${apiUrl}/CreateRequest/${srId}/`, bookedService, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("Service booked successfully.");
        navigate('/user');
      } catch (error) {
        if (servicePhone.length < 9 || servicePhone.length > 15) {
          errorRef.current.innerHTML = error.response.data.phone;
        } else {
          errorRef.current.innerHTML = '';
          alert(error.response.data)
        }
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

      const { balance, username } = response.data;
      setBalanceAmt(balance)
      setUsername(username)
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // console.log(response);

  useEffect(() => {
    handleSearchResults();
    fetchProfileData();
  }, []);

  return (
    <div className='container'>
      <div>
        <p className='me-3' style={{ fontFamily: "Dosis", float: "right" }}>Account balance: <b>{balanceAmt}.00</b></p>
      </div><br /><br />
      <div className='mb-1 d-flex' style={{ marginTop: "-10px" }}>
        <h1 className='col-4' style={{ fontFamily: "Protest Strike" }}>Search results</h1>
        <div className='col-8 d-flex justify-content-end pt-2'>
          <Link to="/user"><button className='btn btn-primary mx-2'>Back to Home</button></Link>
          <FontAwesomeIcon icon={faSync} size="lg" className='m-2' style={{ cursor: 'pointer' }} onClick={handleSearchResults} />
        </div>
      </div>

      <div className="row border-top">
        {allServices.length > 0 ?
          allServices.map(service => (
            <div className='col-4 my-5' key={service.id}>
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


                  <button disabled={balanceAmt < 100} onClick={() => { toggleOpen(); setSelectedItem(service); }} className='w-100 my-1 mx-1 btn btn-info'>Book Now</button><br />

                  <button className='w-100 my-1 mx-1 btn btn-success' onClick={() => { handleShow1(); setSelectedItem(service); listFeedbacks(service.id); }}>Feedbacks</button>


                  <button className='w-100 my-1 mx-1 btn btn-danger' onClick={() => handleShow(service.id)}>Report Service</button>
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
                <div className='w-100 my-3'>
                  <label><b>Select Date & Time</b></label>
                  <MDBInput type='datetime-local' onChange={(e) => setServiceDateTime(e.target.value)} required />
                </div>
                <div className='w-100 my-2'>
                  <label><b>Address</b></label>
                  <textarea type='text' required cols={94} rows={3} onChange={(e) => setServiceAddress(e.target.value)} className='border border-secondary' />
                </div>
                <div className='w-100 mt-2 mb-3'>
                  <label><b>Phone number</b></label>
                  <MDBInput type='text' onChange={(e) => setServicePhone(e.target.value)} required />
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
          <Button variant="primary" onClick={() => { handleReportService(selectedItem); handleClose(); }}>
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
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default ServiceCard;
