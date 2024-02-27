import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

function Service() {
  const [show, setShow] = useState(false);
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Category');
  const [location, setLocation] = useState('Location');
  const [username, setUsername] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    shopName: '',
    description: '',
    category: '',
    location: '',
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
      shopName: '',
      description: '',
      category: '',
      location: '',
      username: ''
    });
  }

  const handleAddService = () => {
    const errors = {};
    if (!shopName) {
      errors.shopName = 'Shop name is required';
    }
    if (!description) {
      errors.description = 'Description is required';
    }
    if (category === 'Category') {
      errors.category = 'Category is required';
    }
    if (location === 'Location') {
      errors.location = 'Location is required';
    }
    if (!username) {
      errors.username = 'Username is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const newService = {
      location,
      category,
      shopName,
      username,
      description
    };
    setServiceList(prevList => [...prevList, newService]);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);

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
        <h1 className="d-flex justify-content-center align-items-center ">WELCOME  <span style={{ fontFamily: "sans-serif" ,  color: "white" }}>  <br />SERVICE PROVIDER...</span> </h1>
      </div>

    

      <Alert show={showAlert} variant="success" onClose={() => setShowAlert(false)} dismissible style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', fontWeight:"bold" }}>
        Service added successfully..
      </Alert>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Services</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-lg-6'>
              <label>
                <input type='file' style={{ display: 'none' }} />
                <img className='img-fluid' src="https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-vector-ilustration-png-image_6111064.png" alt="no-img" />
              </label>
            </div>
            <div className='col-lg-6 d-flex justify-content-center align-items-center flex-column'>
              <div className='mb- w-100'>
                <input type='text' className='form-control' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                {validationErrors.username && <small className="text-danger">{validationErrors.username}</small>}
              </div>
              <div className='mb-3 mt-3 w-100'>
                <input type='text' className='form-control' placeholder='Shop name' value={shopName} onChange={(e) => setShopName(e.target.value)} />
                {validationErrors.shopName && <small className="text-danger">{validationErrors.shopName}</small>}
              </div>
              <div className='mb-3 w-100'>
                <input type='text' className='form-control' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
                {validationErrors.description && <small className="text-danger">{validationErrors.description}</small>}
              </div>
              <div className='mb-3 w-100'>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option disabled>Category</option>
                    <option>Category 1</option>
                    <option>Category 2</option>
                    <option>Category 3</option>
                    <option>Category 4</option>
                  </Form.Select>
                  {validationErrors.category && <small className="text-danger">{validationErrors.category}</small>}
                </Form.Group>
              </div>
              <div className='mb-3 w-100'>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Select value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option disabled>Location</option>
                    <option>Location 1</option>
                    <option>Location 2</option>
                    <option>Location 3</option>
                    <option>Location 4</option>
                  </Form.Select>
                  {validationErrors.location && <small className="text-danger">{validationErrors.location}</small>}
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
