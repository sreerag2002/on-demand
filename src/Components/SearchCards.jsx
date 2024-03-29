import React, { useState, useEffect } from 'react';
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

function ServiceCard() {

  const navigate = useNavigate()

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  // const email = localStorage.getItem('email');
  // console.log(token);

  const locationHook = useLocation()
  const { location } = locationHook.state
  const { category } = locationHook.state
  console.log(location);
  console.log(category);

  const [allServices, setAllServices] = useState([]);
  const [bookedServices, setBookedServices] = useState([]);
  const [selectedItem,setSelectedItem] = useState({})
  const [serviceDateTime,setServiceDateTime] = useState()
  const [serviceTime,setServiceTime] = useState()
  const [description,setDescription] = useState()

  const [staticModal, setStaticModal] = useState(false);
  const toggleOpen = () => setStaticModal(!staticModal);

  const handleSearchResults = async () => {
    const response = await axios.get(`${apiUrl}/ListServiceProviders/${category.id}/${location.id}/`)
      .then((result) => {
        // console.log(result.data);
        setAllServices(result.data)
      }
      )
      .catch((error)=>{
        console.log(error);
      })
  }

  const handleBookNow = async(srId) => {
    const bookedService = { datetime:serviceDateTime, description:description }
    console.log(bookedService);
    const response = await axios.post(`${apiUrl}/CreateRequest/${srId}/`,bookedService,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((result) => {
      // console.log(result);
      alert("Service booked successfully.");
      navigate('/user')
    }
    )
    .catch((error)=>{
      console.log(error);
    })
  };

  useEffect(() => {
    handleSearchResults()
  }, [])

  return (
    <div>
      <h1 className='my-4' style={{ textAlign: "center" }}>Services</h1>

      {/* Search result services list */}
      <div className="row mx-5 mb-5">
        {
          allServices.length > 0 ?
            allServices.map(service => (
              <div className='col-3 my-3'>
                <MDBCard style={{ boxShadow: "2px 2px 10px gray" }} alignment='center' className='rounded'>
                  <MDBCardHeader><h4 style={{ fontFamily: "Protest Strike" }} className='mt-2'>{category.categoryname}</h4></MDBCardHeader>
                  <MDBCardBody>
                    <MDBCardTitle style={{ fontSize: "15px" }}>Shop Name<br /> <b style={{ fontSize: "25px" }}>{service.shop_name}</b></MDBCardTitle>
                    <MDBCardText className='my-3'><b>Description</b> <br /><i>"{service.description}"</i></MDBCardText>
                    <MDBCardTitle style={{ fontSize: "20px" }}>Location: {location.locationname}</MDBCardTitle>
                    <MDBBtn onClick={()=>{toggleOpen();setSelectedItem(service);}} className='mt-2'>Book Now</MDBBtn>
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


      {/* Book now Modal */}
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
                {/* <div className='w-50 my-1'>
                  <label><b>Email ID</b></label>
                  <MDBInput type='text' value={email} disabled />
                </div> */}
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
                <div className='w-100 my-1'>
                  <label><b>Date & Time</b></label>
                  <MDBInput type='datetime-local' onChange={(e)=> setServiceDateTime(e.target.value)} required />
                </div>
                {/* <div className='w-50 my-1'>
                  <label><b>Time</b></label>
                  <MDBInput type='time' onChange={(e)=> setServiceTime(e.target.value)} required />
                </div> */}
                <div className='w-100 my-1'>
                  <label><b>Description</b></label>
                  <textarea type='text' onChange={(e)=> setDescription(e.target.value)} required cols={84} rows={3} />
                </div>
              </Row> 
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn onClick={()=>handleBookNow(selectedItem.user)}>Book Now</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}

export default ServiceCard;
