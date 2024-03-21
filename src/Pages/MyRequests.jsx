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
import { Row } from 'react-bootstrap';
import { CiLocationOn } from "react-icons/ci";
import { MdDateRange } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";

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
      </table>

      {/* <div>
        <Row className='border px-4 pt-3 rounded'>
          <div className='w-100'>
          <h4>ABC Electricals</h4>
          <p><span>Electrician</span><span style={{float:"right"}}>Accepted</span></p>
          </div>
          <p><b><i>"Voltage issue."</i></b></p>
          <div className='w-100'>
            <p>
              <span className='me-5'><FaLocationDot /><b> Kakkanad</b></span>
              <span className='me-5'><MdDateRange /><b> 2024-06-17</b></span>
              <span><IoMdTime className='fs-5' /><b> 12:30</b></span>
            </p>
          </div>
        </Row>
      </div> */}

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
