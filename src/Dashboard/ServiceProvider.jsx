import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

function Service() {

  const [show, setShow] = useState(false);
  const [Shop_name, setShopName] = useState('');
  const [Description , setDescription] = useState('');
  const [Category, setCategory] = useState('');
  const [Location, setLocation] = useState('');
  const [username, setUsername] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    Shop_name: '',
    Description: '',
    Category: '',
    Location: '',
    username: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = () => {
      fetch(`http://10.11.0.95:8002/list_Category`)
        .then(response => response.json())
        .then(data => {
          setCategories(data);
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    };

    fetchCategories();

    const fetchLocations = () => {
      fetch(`http://10.11.0.95:8002/list_locations`)
        .then(response => response.json())
        .then(data => {
          setLocations(data);
        })
        .catch(error => {
          console.error('Error fetching locations:', error);
        });
    };

    fetchLocations();
  }, []);

  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const handleShow = () => setShow(true);

  const resetForm = () => {
    setShopName('');
    setDescription('');
    setCategory('');
    setLocation('');
    setUsername('');
    setValidationErrors({
      Shop_name: '',
      Description: '',
      Category: '',
      Location: '',
      username: ''
    });
  };

  const handleAddService = (event) => {
    event.preventDefault();
    const errors = {};
    if (!Shop_name) {
      errors.Shop_name = 'Shop name is required';
    }
    if (!Description) {
      // errors.description = 'Description is required';
    }
    if (!Category) {
      errors.Category = 'Category is required';
    }
    if (!Location) {
      errors.Location = 'Location is required';
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    console.log(Description);

    const newService = {
      Location,
      Category,
      Shop_name,
      Description
    };
    const token = localStorage.getItem('token');

    // Making POST request to the backend API
    fetch(`http://10.11.0.95:8002/CreateService/`,
     {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newService),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to add service');
        return response.json();
      })
      .then(data => {
        console.log('Service added:', data);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
        resetForm();
      })
      .catch(error => {
        console.error('Error adding service:', error);
        // Implement showing error to the user here
      });

    handleClose();
  };

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    
    navigate('/'); 
    };

  return (
    <div>
      <Navbar expand="lg" className="bg-dark">
        <Container fluid>
          <Navbar.Brand href="#" className="text-light">On Demand</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <div className="ms-auto my-2 my-lg-0" style={{ maxHeight: '100px' }}>
              <Link to={"/requestpage"}>
                <Button variant="outline-success me-3" style={{fontWeight:"bold"}}>Requests</Button>
              </Link>
            </div>
            <div className="ms-auto my-2 my-lg-0" style={{ maxHeight: '100px' }}>
              <Link to="/list">
                <Button variant="outline-success me-3" style={{fontWeight:"bold"}}>Services</Button>
              </Link>
            </div>
            <div className="-auto my-2 my-lg-0" style={{ maxHeight: '100px' }}>
              <Button variant="outline-success me-3" style={{fontWeight:"bold"}} onClick={handleShow}>Add</Button>
            </div>
            <div className="d-flex me-3">
              <Button variant="outline-danger"  onClick={handleLogout}> <i className="fa-solid fa-power-off"></i> </Button>
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
                <input type='text' className='form-control' placeholder='Description' value={Description} onChange={(e) => setDescription(e.target.value)} />
                {validationErrors.Description && <small className="text-danger">{validationErrors.Description}</small>}
              </div>
              <div className='mb-3 w-100'>
              <Form.Group as={Col} controlId="formGridState">
              <Form.Control as="select" value={Category} onChange={(e) => setCategory(e.target.value)} custom>
                <option disabled value="">Select Category</option> 
                      {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
              </Form.Control>
                {validationErrors.Category && <small className="text-danger">{validationErrors.Category}</small>}
              </Form.Group>

              </div>
              <div className='mb-3 w-100'>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Control as="select" value={Location} onChange={(e) => setLocation(e.target.value)} custom>
                    <option disabled value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>{location.location}</option>
                    ))}
                  </Form.Control>
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
  );
}

export default Service;
