import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { apiUrl } from './baseUrl';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { formatDate } from 'date-fns'
import { Col, Row } from 'react-bootstrap';

function CalendarSchedules() {

    const [thisDate, setThistDate] = useState(formatDate(new Date(), 'yyyy-MM-dd'))
    const [requests, setRequests] = useState([]);
    const token = localStorage.getItem('token');
    const [allServices, setAllServices] = useState([]);
    const [serviceName, setServiceName] = useState('Select service');
    const [category, setCategory] = useState('')

    const filteredReqs = requests.filter(req => req.datetime.slice(0, 10) == thisDate)

    const handleListServices = async () => {
        const response = axios.get(`${apiUrl}/service-providers/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((result) => {
                setAllServices(result.data);
            });
    };

    const fetchServiceRequests = (serviceId) => {
        fetch(`${apiUrl}/ListRequests/${serviceId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setRequests(data.map(request => ({ ...request, localStatus: request.accept ? 'Accepted' : request.decline ? 'Declined' : '' })));
            })
            .catch(error => {
                console.error('Error fetching service requests:', error);
            });
    };

    const selectDate = (newDate) => {
        setThistDate(formatDate(newDate, 'yyyy-MM-dd'))
    }

    console.log(thisDate);

    useEffect(() => {
        handleListServices();
    }, []);

    return (
        <div className='container pb-5'>
            <div className='mb-3 mt-4 d-flex'>
                <h1 style={{ fontFamily: "Protest Strike" }}>Service Schedules</h1>
                <div className='col-8 d-flex justify-content-end mt-2'>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {serviceName}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {allServices.map((item) => (
                                <Dropdown.Item onClick={() => { fetchServiceRequests(item.id); setServiceName(item.shop_name); setCategory(item.categoryname); }}>{item.shop_name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Link to="/service"><button className='btn btn-primary mx-2'>Back to Home</button></Link>
                    <FontAwesomeIcon icon={faSync} size="lg" className='m-2' style={{ cursor: 'pointer' }} onClick={fetchServiceRequests} />
                </div>
            </div>
            <Row className='py-4'>
                <Col className='col-5'>
                    <Calendar onChange={selectDate} value={thisDate} />
                </Col>
                <Col className='col-7'>
                    <Row>
                        <p style={{ fontFamily: "Dosis" }}><span>Date: <b>{formatDate(thisDate, 'dd-MM-yyyy')}</b></span><span style={{ float: "right" }}>Category: {category == '' ? <b className='text-danger'>--</b> : <b className='text-info'>{category}</b>}</span></p>
                    </Row>
                    <Row className='my-4 bg-light py-3 fs-5'>
                        <Col className='col-2'><b>Name</b></Col>
                        <Col className='col-4 text-center'><b>Address</b></Col>
                        <Col className='col-3 text-center'><b>Phone No.</b></Col>
                        <Col className='col-2 text-center'><b>Time</b></Col>
                    </Row>
                    {
                        filteredReqs.length > 0 ?
                            filteredReqs.map((request) => (
                                <Row className='my-2 py-2 d-flex align-items-center'>
                                    <Col className='col-2'><b>{request.username}</b></Col>
                                    <Col className='col-4 text-center border py-2'>{request.address}</Col>
                                    <Col className='col-3 text-center'><b>{request.phone}</b></Col>
                                    <Col className='col-2 text-center text-success'><b>{(request.datetime.slice(11, 13)) >= 12 ? (`${request.datetime.slice(11, 13) - 12 == 0 ? '12' : `${request.datetime.slice(11, 13) - 12}`}:${request.datetime.slice(14, 16)} PM`) : (`${request.datetime.slice(11, 16)} AM`)}</b></Col>
                                </Row>
                            )) :
                            <Row>
                                <p className='text-danger text-center'><b>No bookings found.</b></p>
                            </Row>
                    }
                </Col>
            </Row>
        </div>
    )
}

export default CalendarSchedules