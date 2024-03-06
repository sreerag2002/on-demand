import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';

function Service() {
  const [show, setShow] = useState(false);
  const [Shop_name, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [Category, setCategory] = useState('Category');
  const [Location, setLocation] = useState('Location');
  const [username, setUsername] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    Shop_name: '',
    description: '',
    Category: '',
    Location: '',
    username: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [serviceList, setServiceList] = useState([]);

  const handleClose = () => {
    setShow(false);
    resetForm();
  }

  const handleShow = () => setShow(true);

  const resetForm = () => {
    setShopName('');
    setDescription('');
    setCategory('Category');
    setLocation('Location');
    setUsername('');
    setValidationErrors({
      Shop_name: '',
      description: '',
      Category: '',
      Location: '',
      username: ''
    });
  }

  const handleAddService = () => {
    const errors = {};
    if (!Shop_name) {
      errors.Shop_name = 'Shop name is required';
    }
    if (!description) {
      errors.description = 'Description is required';
    }
    if (Category === 'Category') {
      errors.Category = 'Category is required';
    }
    if (Location === 'Location') {
      errors.Location = 'Location is required';
    }
    if (!username) {
      errors.username = 'Username is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const newService = {
      Location,
      Category,
      Shop_name,
      username,
      description
    };
    setServiceList(prevList => [...prevList, newService]);
    setShowAlert(true);

    setTimeout(() => {          
      setShowAlert(false);
    }, 5000);
    

    // Making POST request to the backend API
    axios.post(`${process.env.REACT_APP_API_URL}/CreateService/`,
     {
      Shop_name,
      description,
      Category,
      Location,
      username
    })
      .then(response => {
        // Handle success response if needed
        console.log('Service added successfully:', response.data);
      })
      .catch(error => {
        // Handle error response if needed
        console.error('Error adding service:', error);
      });

    handleClose();
  }

  return (
    <div>
      <Navbar expand="lg" className="bg-dark">
        <Container fluid>
          <Navbar.Brand href="#" className="text-light">On Demand</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <div className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }}>
              <Link to={"/requestpage"}>
                <Button variant="outline-success me-3">Requests</Button>
              </Link>
            </div>
            <div className="ms-auto my-2 my-lg-0" style={{ maxHeight: '100px' }}>
              <Link to="/list">
                <Button variant="outline-success me-3">Services</Button>
              </Link>
            </div>
            <div className="-auto my-2 my-lg-0" style={{ maxHeight: '100px' }}>
              <Button variant="outline-success me-3" onClick={handleShow}>Add</Button>
            </div>
            <div className="d-flex me-3">
              <Link to={"/"}> <Button variant="outline-danger">  <i className="fa-solid fa-power-off"></i>  </Button>
              </Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <h1 className="d-flex justify-content-center align-items-center mt-5"></h1>
      <div className="d-flex justify-content-center align-items-center" style={{ height: "85vh" }}>
        <h1 className="d-flex justify-content-center align-items-center ">WELCOME  <span style={{ fontFamily: "sans-serif", color: "white" }}>  <br />SERVICE PROVIDER...</span> </h1>
      </div>

      <Alert show={showAlert} variant="success" onClose={() => setShowAlert(false)} dismissible style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', fontWeight: "bold" }}>
        Service added successfully..
      </Alert>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Services</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='lg-6 '>
              <div className='mb-3 mt-3 w-100'>
                <input type='text' className='form-control' placeholder='Shop name' value={Shop_name} onChange={(e) => setShopName(e.target.value)} />
                {validationErrors.Shop_name && <small className="text-danger">{validationErrors.Shop_name}</small>}
              </div>
              <div className='mb-3 w-100'>
                <input type='text' className='form-control' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
                {validationErrors.description && <small className="text-danger">{validationErrors.description}</small>}
              </div>
              <div className='mb-3 w-100'>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Select value={Category} onChange={(e) => setCategory(e.target.value)}>
                    <option disabled>Category</option>
                    <option>Category 1</option>
                    <option>Category 2</option>
                    <option>Category 3</option>
                    <option>Category 4</option>
                  </Form.Select>
                  {validationErrors.Category && <small className="text-danger">{validationErrors.Category}</small>}
                </Form.Group>
              </div>
              <div className='mb-3 w-100'>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Select value={Location} onChange={(e) => setLocation(e.target.value)}>
                    <option disabled>Location</option>
                    <option>Location 1</option>
                    <option>Location 2</option>
                    <option>Location 3</option>
                    <option>Location 4</option>
                  </Form.Select>
                  {validationErrors.Location && <small className="text-danger">{validationErrors.Location}</small>}
                </Form.Group>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddService}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Service;
