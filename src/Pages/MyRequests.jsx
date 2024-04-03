import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
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
import { FaRegQuestionCircle } from "react-icons/fa";
import { Col, Row } from 'react-bootstrap';
import { CiLocationOn } from "react-icons/ci";
import { MdDateRange } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSync } from '@fortawesome/free-solid-svg-icons';

function UserRequest() {

  const [centredModal, setCentredModal] = useState(false);

  const toggleOpen = () => setCentredModal(!centredModal);

  const token = localStorage.getItem('token')

  const [rating, setRating] = useState(0); // Rating state
  const [allRequests,setAllRequests] = useState([])

  const [selectedReq,setSelectedReq] = useState({})

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
     <div className='mb-3 mt-4 d-flex'>
        <h1 style={{ fontFamily: "Protest Strike" }}>My Requests</h1>
        <div className='col-9 d-flex justify-content-end'>
          <Link to="/service"><button className='btn btn-primary mx-2'>Back to Home</button></Link>
          <FontAwesomeIcon icon={faSync} size="lg" className='m-2' style={{ cursor: 'pointer' }} onClick={handleListMyReq} />
        </div>
      </div>
      <div style={{ marginBottom: "80vh" }}>
      {
        allRequests.map(request => (
        <Row className='border px-4 py-3 my-3 rounded shadow' key={request.id} style={{fontFamily:"Dosis"}}>
          <div className='w-100' >
          <h4 className='mb-0'>{request.service_provider.shop_name}</h4>
          <p className='mb-1'>
            <span className='col-9 text-secondary'><b>{request.category}</b></span>
            {/* <span className='col-3 text-center' style={{float:"right"}}>
            {
                request.pending ? <span className='text-warning'>Pending</span> : request.accept ? <span className='text-success'>Accepted</span> : <span className='text-danger'>Declined</span>
                }
              </span> */}
              </p>
          </div>
          {/* <p className='mb-0 py-1' style={{fontFamily:"Dosis"}}>Description: <b><i>"{request.description}"</i></b></p> */}
          <div className='d-flex'>
            <div className='col-9 pt-2'>
              <span style={{marginRight:"70px"}}><FaLocationDot className='text-danger' /> {request.locationname}</span>
              <span style={{marginRight:"70px"}}><MdDateRange className='text-primary' /> {(request.datetime).slice(0,10)}</span>
              <span><IoMdTime className='fs-5 text-info' /> {(request.datetime).slice(11,16)}</span>
            </div>
            <div className='col-3'>
            <button className='btn btn-danger me-1'>Cancel Request</button>
            <button className='btn btn-dark'>Send feedback</button>
              </div>
          </div>
        </Row>
        ))}
      </div>

      {/* <table className="table" style={{ marginTop: "10vh", marginBottom: "80vh" }}>
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
              <td className='bg-light'>{request.service_provider.shop_name}</td>
              <td>{request.category}</td>
              <td className='bg-light'>{request.locationname}</td>
              <td>{(request.datetime).slice(0,10)}</td>
              <td className='bg-light'>{(request.datetime).slice(11,16)}</td>
              <td>{request.description}</td>
              <td className='bg-light'>{
                request.pending ? 'Pending' : request.accept ? 'Accepted' : 'Declined'
                }</td>
              <td>
                {
                request.accept===true ? <button className='btn btn-success' onClick={toggleOpen}>Pay now</button> : ''             
                }
                
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}

      {/*Payment Form */}
      
      <MDBModal tabIndex='-1' open={centredModal} setOpen={setCentredModal}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalBody>
              <div className='p-3'>
                <h3 className='text-center my-4'>Payment Receipt</h3>
                <div className='w-100 my-1'>
                  <label><b>Name</b></label>
                  <MDBInput type='text' disabled />
                </div>
                <div className='w-100 my-1'>
                  <label><b>Shop name</b></label>
                  <MDBInput type='text' disabled />
                </div>
                <div className='d-flex'>
                <div className='w-50 my-1 me-3'>
                  <label><b>Service</b></label>
                  <MDBInput type='text' disabled />
                </div>
                <div className='w-50 my-1'>
                  <label><b>Location</b></label>
                  <MDBInput type='text' disabled />
                </div>
                </div>
               <p className='mt-4'>
                <span>Payable amount</span>
                <span style={{float:"right"}}><b>500.00</b></span>
                </p>
               <p><span>Tax <FaRegQuestionCircle className='ms-2' /></span><span style={{float:"right"}}><b>00.00</b></span></p>
               <p className='pt-3'>
                <span className='fs-4'><b>Total amount</b></span>
                <span style={{float:"right"}}><b className='fs-4'>500.00</b><br /><p style={{fontSize:"10px"}}>including all taxes</p></span>
               </p>
              </div>
              <div className='d-flex justify-content-end px-2'>
              <button className='btn btn-light me-2' onClick={toggleOpen}>Close</button>
              <button className='btn btn-info'>Pay Amount</button>
              </div>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      
    </div>
  );
}

export default UserRequest;
