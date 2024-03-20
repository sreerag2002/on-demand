import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { FaCircleUser } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa";
import Dropdown from 'react-bootstrap/Dropdown';
import { apiUrl } from '../Components/baseUrl';


function Service() {

  const accname = localStorage.getItem("username")

  const [show, setShow] = useState(false);
  const [Shop_name, setShopName] = useState('');
  const [Description, setDescription] = useState('');
  const [categoryname, setCategory] = useState('');
  const [locationname, setLocation] = useState('');
  const [username, setUsername] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    Shop_name: '',
    Description: '',
    categoryname: '',
    locationname: '',
    username: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = () => {
      fetch(`${apiUrl}/list-categories/`)
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
      fetch(`${apiUrl}/list-locations/`)
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
      categoryname: '',
      locationname: '',
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
    if (!categoryname) {
      errors.categoryname = 'Category is required';
    }
    if (!locationname) {
      errors.locationname = 'Location is required';
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    console.log(Description);

    const newService = {
      locationname,
      categoryname,
      Shop_name,
      Description
    };
    const token = localStorage.getItem('token');

    // Making POST request to the backend API
    fetch(`${apiUrl}/CreateService/`,
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
    localStorage.clear()
    navigate('/');
  };

  return (
    <div className='px-5 pb-5 mb-5'>
      <div className="d-flex px-5 pb-5 w-100 justify-content-end">
        <Link to="/requestpage">
          <Button variant="outline-success me-3" style={{ fontWeight: "bold" }}>Requests</Button>
        </Link>
        <Link to="/list">
          <Button variant="outline-success me-3" style={{ fontWeight: "bold" }}>Services</Button>
        </Link>
        <Button variant="outline-success me-3" onClick={handleShow} style={{ fontWeight: "bold" }}>Add</Button>
        {/* <Button variant="outline-danger" onClick={handleLogout}> <i className="fa-solid fa-power-off"></i> </Button> */}
        <div className='text-success'>
                <Dropdown>
                    <Dropdown.Toggle variant="white" id="dropdown-basic" className='border border-0 fs-6'>
                        <b><FaCircleUser className='mb-1' /> {accname}</b>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='border border-0 ms-3 mb-5 bg-light'>
                        <Dropdown.Item onClick={handleLogout}><b><FaPowerOff className='me-1' /> Logout</b></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
      </div>
      
      <div className='d-flex justify-content-center p-5'>
        <div className='text-center'>
          <h1 className='mb-5' style={{ fontFamily: "Protest Strike", fontSize: "50px",  color: "black" }}>Welcome Service Provider</h1>
        </div>
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
                  <Form.Control as="select" value={categoryname} onChange={(e) => setCategory(e.target.value)} custom>
                    <option disabled value="">Select Category</option>
                    {categories.map(categoryname => (
                      <option key={categoryname.id} value={categoryname.id}>{categoryname.categoryname}</option>
                    ))}
                  </Form.Control>
                  {validationErrors.categoryname && <small className="text-danger">{validationErrors.categoryname}</small>}
                </Form.Group>

              </div>
              <div className='mb-3 w-100'>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Control as="select" value={locationname} onChange={(e) => setLocation(e.target.value)} custom>
                    <option disabled value="">Select Location</option>
                    {locations.map(locationname => (
                      <option key={locationname.id} value={locationname.id}>{locationname.locationname}</option>
                    ))}
                  </Form.Control>
                  {validationErrors.locationname && <small className="text-danger">{validationErrors.locationname}</small>}
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
