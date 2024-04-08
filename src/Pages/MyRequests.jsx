import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { apiUrl } from '../Components/baseUrl';
import { Row } from 'react-bootstrap';
import { FaLocationDot } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { IoIosChatboxes } from "react-icons/io";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

function UserRequest() {
  const [allRequests, setAllRequests] = useState([]);
  const token = localStorage.getItem('token');

  const handleListMyReq = async () => {
    try {
      const response = await axios.get(`${apiUrl}/ListmyRequests/`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setAllRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  useEffect(() => {
    handleListMyReq();
  }, []);

  const handleCancelRequest = async (requestId) => {
    try {
      await axios.delete(`${apiUrl}/DeleteRequest/${requestId}/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const updatedRequests = allRequests.filter(request => request.id !== requestId);
      setAllRequests(updatedRequests);

      console.log('Request cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel request', error);
    }
  };

  return (
    <div className='container'>
      <div className='mb-3 mt-4 d-flex'>
        <h1 style={{ fontFamily: "Protest Strike" }}>My Requests</h1>
        <div className='col-9 d-flex justify-content-end'>
          <Link to="/user"><button className='btn btn-primary mx-2'>Back to Home</button></Link>
          <FontAwesomeIcon icon={faSync} size="lg" className='m-2' style={{ cursor: 'pointer' }} onClick={handleListMyReq} />
        </div>
      </div>
      <div style={{ marginBottom: "80vh" }}>
        {allRequests.map(request => (
          <Row className='border px-4 py-3 my-3 rounded shadow' key={request.id} style={{ fontFamily: "Dosis" }}>
            <div className='w-100'>
              <h4 className='mb-0'>{request.service_provider.shop_name}</h4>
              <p className='mb-1'>
                <span className='col-9 text-secondary'><b>{request.category}</b></span>
              </p>
            </div>
            <div className='d-flex'>
              <div className='col-9 pt-2'>
                <span style={{ marginRight: "70px" }}><FaLocationDot className='text-danger' /> {request.locationname}</span>
                <span style={{ marginRight: "70px" }}><MdDateRange className='text-primary' /> {request.datetime.slice(0, 10)}</span>
                <span><IoMdTime className='fs-5 text-info' /> {request.datetime.slice(11, 16)}</span>
              </div>
              <div className='col-3'>
                <button className='btn btn-danger me-1' onClick={() => handleCancelRequest(request.id)}>Cancel Request</button>
                <button className='btn btn-success ms-1'><IoIosChatboxes /> Message</button>

              </div>
            </div>
          </Row>
        ))}
      </div>
    </div>
  );
}

export default UserRequest;
