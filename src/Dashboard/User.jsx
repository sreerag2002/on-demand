import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';

function User() {
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
  const navigate = useNavigate();


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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/createProfile/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' :`Bearer ${token}`
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
      
      setUserProfileExists(true); // Set userProfileExists to true after creating/updating profile
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

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    
    navigate('/'); 
    };

  return (
    <div>
      <Navbar expand="lg" className="bg-dark">
        <Container fluid>
          <Navbar.Brand href="#" className='text-light'>On Demand</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            </Nav>
            <div className="d-flex">
              <Link to="/myrequest">
                <Button variant="outline-success me-3">My Requests</Button>
              </Link>
              <Button variant="outline-success me-3" onClick={handleShow}><i className="fa-solid fa-user"></i></Button>
              <Link to={"/"}>
                <Button onClick={handleLogout} variant="outline-danger"> <i className="fa-solid fa-power-off"></i> </Button>
              </Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* User Profile Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{userProfileExists ? "User Profile" : "Create Profile"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Profile form elements */}
          <div className='row'>
            <div className='col-lg-6'>
              <label>
                <input type='file' style={{display:'none'}}/>
                <img className='img-fluid' src="https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-vector-ilustration-png-image_6111064.png" alt="profile-img"/>
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


      <div className="d-flex justify-content-center align-items-center" style={{ marginTop: "35vh" }}>
        <h1 className="d-flex justify-content-center align-items-center ">WELCOME  <span style={{ fontFamily: "sans-serif", color: "white" }}>  <br />USER...</span> </h1>
      </div>
      <br />
      <div className="d-flex justify-content-center align-items-center" style={{ marginBottom: "35vh" }}>
        <Button onClick={handleShow1}>Explore More</Button>
      </div>



      {/* Explore More Modal */}
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Dropdowns for Locations and Categories */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Locations
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Location 1</Dropdown.Item>
                <Dropdown.Item>Location 2</Dropdown.Item>
                <Dropdown.Item>Location 3</Dropdown.Item>
                <Dropdown.Item>Location 4</Dropdown.Item>
                <Dropdown.Item>Location 5</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Categories
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Category 1</Dropdown.Item>
                <Dropdown.Item>Category 2</Dropdown.Item>
                <Dropdown.Item>Category 3</Dropdown.Item>
                <Dropdown.Item>Category 4</Dropdown.Item>
                <Dropdown.Item>Category 5</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
          <Link to="/results">
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
