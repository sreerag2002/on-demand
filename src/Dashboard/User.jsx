import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import { apiUrl } from '../Components/baseUrl';
import { FaCircleUser } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa";
import { MdRequestPage } from "react-icons/md";
import { FaUser } from "react-icons/fa";

import './User.css';

function User() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedLoc, setSelectedLoc] = useState({});
  const [selectedCat, setSelectedCat] = useState({});
  const [firstName, setFirstName] = useState('');
  const [username,setUsername] = useState()
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [balanceAmt,setBalanceAmt] = useState()

  useEffect(() => {
    // Fetch profile data from the API
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/ProfileView/`, 

        { method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(response.data);

        const { username, email, first_name, last_name, balance } = response.data;
        setUsername(username)
        setFirstName(first_name);
        setLastName(last_name);
        setEmail(email);
        setBalanceAmt(balance)
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
    handleLocations();
    handleCategories();
  }, []);

  const handleLocations = async () => {
    const { data } = await axios.get(`${apiUrl}/list-locations/`);
    setLocations(data);
  };

  const handleCategories = async () => {
    const response = await fetch(`${apiUrl}/list-categories/`)
      .then(res => res.json())
      .then(data => setCategories(data));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleProfileModalClose = () => setShowProfileModal(false);
  const handleProfileModalShow = () => setShowProfileModal(true);

  const handleExploreModalClose = () => setShowExploreModal(false);
  const handleExploreModalShow = () => setShowExploreModal(true);

  const handleSubmit = () => {
    // Handle submission of user details
    // You can send the data to backend or handle it as required
    // For now, let's just log the values
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Profile Image:', profileImage);
  };

    const handleProfileImageChange = (file) => {
    setProfileImage(file);
  };


  return (
    <div className='px-5' id='welcomeUser'>
      <div className="d-flex px-5 pb-5 pt-2 w-100 justify-content-end">
        <div className='text-success'>
          <Dropdown className='me-2'>
            <Dropdown.Toggle variant="white" id="dropdown-basic" className='border border-0 fs-6'>
              <b><FaCircleUser className='mb-1' /> {username}</b>
            </Dropdown.Toggle>
            <Dropdown.Menu className='border border-0 mb-5 bg-light'>
              <Dropdown.Item className='mb-2' onClick={() => navigate('/myrequest')}><b><MdRequestPage className='me-1' /> My Requests</b></Dropdown.Item>
              <Dropdown.Item className='mb-2' onClick={handleProfileModalShow}><b><FaUser className='me-1' /> Profile</b></Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}><b><FaPowerOff className='me-1' /> Logout</b></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Modal show={showProfileModal} onHide={handleProfileModalClose} backdrop="static" centered>
        <Modal.Header>
          <h5 className="modal-title">User Profile</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <div className='d-flex justify-content-center'>
              <h1 className='border text-center py-3 bg-primary text-white' style={{width:"90px",borderRadius:"50px"}}>{firstName.slice(0,1)}</h1>
            </div>
            <div className='text-center'>
              <h4>{firstName} {lastName}</h4>
              <p className='text-success' style={{fontFamily:"Dosis",marginTop:'-10px'}}>{email}</p>
              <p style={{fontFamily:"Dosis",marginTop:'-10px'}}>Account balance: <b>{balanceAmt}.00</b></p>
              <p className='text-danger' style={{fontFamily:"Dosis",marginTop:'-18px',fontSize:"13px"}}>{
                balanceAmt<100 ? 'Insufficient balance to book a service.' : ''
                }</p>
              <button onClick={handleProfileModalClose} className='btn btn-primary'>Go Back to Home</button>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleProfileModalClose}>
            Close
          </Button>
          
        </Modal.Footer> */}
      </Modal>
      <div className='d-flex justify-content-start p-5'>
        <div className='text-center px-5 pt-2'>
          <h1 className='mb-4' style={{ fontFamily: "Protest Strike", fontSize: "50px", color: "black" }}>Welcome {username}</h1>
          <Button onClick={handleExploreModalShow}>Explore More</Button>
        </div>
      </div>
      <Modal show={showExploreModal} onHide={handleExploreModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Dropdowns for Locations and Categories */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  Locations
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {
                    locations.map(Item => (
                      <Dropdown.Item key={Item.id} onClick={() => setSelectedLoc(Item)}>{Item.locationname}</Dropdown.Item>
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
              <p className='text-center my-3' style={{fontFamily:"Dosis"}}><b>{selectedLoc.locationname}</b></p>
            </div>
            <div>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  Categories
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {
                    categories.map(item => (
                      <Dropdown.Item key={item.id} onClick={() => setSelectedCat(item)}>{item.categoryname}</Dropdown.Item>
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
              <p className='text-center my-3' style={{fontFamily:"Dosis"}}><b>{selectedCat.categoryname}</b></p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleExploreModalClose}>
            Close
          </Button>
          <Link to="/results" state={{ "location": selectedLoc, "category": selectedCat }}>
            <Button variant="primary" onClick={handleExploreModalClose}>
              Show Results
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default User;
