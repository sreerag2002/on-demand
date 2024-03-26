import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios'
import { apiUrl } from '../Components/baseUrl';
import { FaCircleUser } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa";
import './User.css'
function User() {

  const navigate = useNavigate()
  const username = localStorage.getItem('username');
  // const email = localStorage.getItem('email');

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [userProfileExists, setUserProfileExists] = useState(false);
  const [userDetails, setUserDetails] = useState({
    first_name: '',
    last_name: '',
    Ph_no: ''

  });
  const [editing, setEditing] = useState(!userProfileExists);
  const [errors, setErrors] = useState({
    first_name: false,
    last_name: false,
    Ph_no: false

  });
  const [showAlert, setShowAlert] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [locations, setLoctions] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedLoc, setSelectedLoc] = useState({})
  const [selectedCat, setSelectedCat] = useState({})

  const handleUpdateOrCreate = () => {
    setEditing(true);
    if (!userProfileExists) {
      handleShow(); // Show the modal for creating profile
    } else {
      // If profile exists, switch to editing mode (update profile)
      handleShow();
      // Reset the user details to empty strings to allow editing
      setUserDetails({
        first_name: '',
        last_name: '',
        Ph_no: ''

      });
    }
  };

  const handleSaveChanges = async () => {
    console.log("jbscbcjbck")
    const { first_name, last_name, Ph_no } = userDetails;

    const token = localStorage.getItem('token');
    const errorsCopy = { ...errors };
    let hasError = false;

    if (!first_name) {
      errorsCopy.first_name = true;
      hasError = true;
    } else {
      errorsCopy.first_name = false;
    }

    if (!last_name) {
      errorsCopy.last_name = true;
      hasError = true;
    } else {
      errorsCopy.last_name = false;
    }

    if (!Ph_no) {
      errorsCopy.Ph_no = true;
      hasError = true;
    } else {
      const phoneNumberRegex = /^\d{10}$/;
      if (!phoneNumberRegex.test(Ph_no)) {
        errorsCopy.Ph_no = true;
        hasError = true;
      } else {
        errorsCopy.Ph_no = false;
      }
    }

    // If there are errors, do not proceed with the API call
    // if (hasError) {
    //   return;
    // }

    try {
      const response = await fetch(`${apiUrl}/ProfileView/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name,
          last_name,
          Ph_no
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Profile creation successful:', data);

      setUserProfileExists(true); 
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      handleClose(); // Close modal after saving changes
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevState => ({
      ...prevState,
      [name]: value
    }));

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: false
    }));
  };

  const handleLocations = async () => {
    const { data } = await axios.get(`${apiUrl}/list-locations/`)
    setLoctions(data)
  }

  const handleCategories = async () => {
    const response = await fetch(`${apiUrl}/list-categories/`)
      .then(res => res.json())
      .then(data => setCategories(data))
  }

  const handleLogout = ()=>{
    localStorage.clear()
    navigate('/')
  }

  useEffect(() => {
    // handleLocations()
    // handleCategories()
  }, [])

  return (
    <div className='px-5' id='welcomeUser'>
      {/* User Profile Modal */}
      <div className="d-flex px-5 pb-5 pt-2 w-100 justify-content-end">
        <Button variant="outline-success me-3" onClick={handleShow}><i className="fa-solid fa-user"></i></Button>
        {/* <Button variant="outline-danger" onClick={handleLogout}> <i className="fa-solid fa-power-off"></i> </Button> */}
        <div className='text-success'>
                <Dropdown>
                    <Dropdown.Toggle variant="white" id="dropdown-basic" className='border border-0 fs-6'>
                        <b><FaCircleUser className='mb-1' /> {username}</b>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='border border-0 mb-5 bg-light'>
                        <Dropdown.Item className='mb-1' onClick={()=>navigate('/myrequest')}><b>My Requests</b></Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}><b><FaPowerOff className='me-1' /> Logout</b></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{userProfileExists ? "User Profile" : "Create Profile"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Profile form elements */}
          <div className='row'>
            <div className='col-lg-6'>
              <label>
                <input type='file' style={{ display: 'none' }} />
                <img className='img-fluid' src="https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-vector-ilustration-png-image_6111064.png" alt="profile-img" />
              </label>
            </div>
            <div className='col-lg-6 d-flex justify-content-center align-items-center flex-column'>
              <div className='mb-3 mt-3 w-100'>
                <input type='text' className={`form-control ${errors.first_name && 'is-invalid'}`} placeholder='First name' name='first_name' value={userDetails.first_name} onChange={handleChange} disabled={!editing} />
                {errors.first_name && <div className="invalid-feedback">First name is required.</div>}
              </div>
              <div className='mb-3 w-100'>
                <input type='text' className={`form-control ${errors.last_name && 'is-invalid'}`} placeholder='Last name' name='last_name' value={userDetails.last_name} onChange={handleChange} disabled={!editing} />
                {errors.last_name && <div className="invalid-feedback">Last name is required.</div>}
              </div>
              <div className='mb-3 w-100'>
                <input type='text' className={`form-control ${errors.Ph_no && 'is-invalid'}`} placeholder='Phone Number' name='Ph_no' value={userDetails.Ph_no} onChange={handleChange} disabled={!editing} />
                {errors.Ph_no && <div className="invalid-feedback">Valid phone number is required.</div>}
              </div>

            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {editing && (
            <Button variant="primary" onClick={handleSaveChanges}>
              {userProfileExists ? "Update Profile" : "Create Profile"}
            </Button>
          )}
        </Modal.Footer>

      </Modal>

      {/* Alert for Profile Update */}
      {showAlert && (
        <div className="alert alert-success" role="alert">
          Profile updated successfully!
        </div>
      )}

      <div className='d-flex justify-content-start p-5'>
        <div className='text-center px-5 pt-2'>
          <h1 className='mb-4' style={{ fontFamily: "Protest Strike", fontSize: "50px",  color: "black" }}>Welcome {username}</h1>
          <Button onClick={handleShow1}>Explore More</Button>
        </div>
      </div>


      {/* Explore More Modal */}
      <Modal show={show1} onHide={handleClose1}>
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
              <p className='text-center my-2'>{selectedLoc.locationname}</p>
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
              <p className='text-center my-2'>{selectedCat.categoryname}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
          <Link to="/results" state={{ "location": selectedLoc, "category": selectedCat }}>
            <Button variant="primary" onClick={handleClose1}>
              Show Results
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default User;
