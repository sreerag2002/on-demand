import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function User() {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  
  const [userDetails, setUserDetails] = useState({
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
    email: 'johndoe@example.com'
  });
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    email: false
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const handleUpdate = () => {
    setEditing(!editing);
  };

  const handleSaveChanges = () => {
    const { firstName, lastName, phoneNumber, email } = userDetails;
    const errorsCopy = { ...errors };
    let hasError = false;

    if (!firstName) {
      errorsCopy.firstName = true;
      hasError = true;
    } else {
      errorsCopy.firstName = false;
    }

    if (!lastName) {
      errorsCopy.lastName = true;
      hasError = true;
    } else {
      errorsCopy.lastName = false;
    }

    if (!phoneNumber) {
      errorsCopy.phoneNumber = true;
      hasError = true;
    } else {
      // Check if phoneNumber contains 10 digits
      const phoneNumberRegex = /^\d{10}$/;
      if (!phoneNumberRegex.test(phoneNumber)) {
        errorsCopy.phoneNumber = true;
        hasError = true;
      } else {
        errorsCopy.phoneNumber = false;
      }
    }

    if (!email) {
      errorsCopy.email = true;
      hasError = true;
    } else {
      errorsCopy.email = false;
    }

    if (hasError) {
      setErrors(errorsCopy);
      return;
    }

    console.log('Updated user details:', userDetails);

    setEditing(!editing);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
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

  return (
    <div>
      <Navbar expand="lg" className="bg-dark">
        <Container fluid>
          <Navbar.Brand href="#" className='text-light'>On Demand</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            </Nav>
            
            
            <div className="auto my-2 my-lg-0" style={{ maxHeight: '100px' }}>
              <Link to="/myrequest">
                <Button variant="outline-success me-3">My Requests</Button>
              </Link>
            </div>
            <div className="d-flex me-3">
              <Button variant="outline-success me-3" onClick={handleShow}><i className="fa-solid fa-user"></i></Button>
              <Link to={"/"}>
              <Button variant="outline-danger"> <i className="fa-solid fa-power-off"></i> </Button>
              </Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-lg-6'>
              <label>
                <input type='file' style={{display:'none'}}/>
                <img className='img-fluid' src="https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-vector-ilustration-png-image_6111064.png" alt="no-img"/>
              </label>
            </div>

            <div className='col-lg-6 d-flex justify-content-center align-items-center flex-column'>
              <div className='mb-3 mt-3 w-100'>
                <input type='text' className={`form-control ${errors.firstName && 'is-invalid'}`} placeholder='First name' name='firstName' value={userDetails.firstName} onChange={handleChange} disabled={!editing} />
                {errors.firstName && <div className="invalid-feedback">First name is required.</div>}
              </div>
              <div className='mb-3 w-100'>
                <input type='text' className={`form-control ${errors.lastName && 'is-invalid'}`} placeholder='Last name' name='lastName' value={userDetails.lastName} onChange={handleChange} disabled={!editing} />
                {errors.lastName && <div className="invalid-feedback">Last name is required.</div>}
              </div>
              <div className='mb-3 w-100'>
                <input type='text' className={`form-control ${errors.phoneNumber && 'is-invalid'}`} placeholder='Phone number' name='phoneNumber' value={userDetails.phoneNumber} onChange={handleChange} disabled={!editing} />
                {errors.phoneNumber && <div className="invalid-feedback">Phone number is required and must contain 10 digits.</div>}
              </div>
              <div className='mb-3 w-100'>
                <input type='email' className={`form-control ${errors.email && 'is-invalid'}`} placeholder='Email' name='email' value={userDetails.email} onChange={handleChange} disabled={!editing} />
                {errors.email && <div className="invalid-feedback">Email is required.</div>}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {editing ? (
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          ) : (
            <Button variant="primary" onClick={handleUpdate}>
              Update
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {showAlert && (
        <div className="alert alert-success" role="alert" style={{ position: 'fixed', top: 10, right: 10 }}>
          Changes saved successfully..
        </div>
      )}

      <div className="d-flex justify-content-center align-items-center" style={{ marginTop: "35vh" }}>
        <h1 className="d-flex justify-content-center align-items-center ">WELCOME  <span style={{ fontFamily: "sans-serif" ,  color: "white" }}>  <br />USER...</span> </h1>
      </div>
      <br />
      <div className="d-flex justify-content-center align-items-center" style={{marginBottom:"35vh"}}>
        <Button onClick={handleShow1}>Explore More</Button>
      </div>
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                <Dropdown.Item>Location 4</Dropdown.Item>

              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Categories
              </Dropdown.Toggle>
              <Dropdown.Menu>
              <Dropdown.Item>Category 1 </Dropdown.Item>
              <Dropdown.Item>Category 2</Dropdown.Item>
              <Dropdown.Item>Category 3</Dropdown.Item>
              <Dropdown.Item>Category 4 </Dropdown.Item>
              <Dropdown.Item>Category 5 </Dropdown.Item>

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
