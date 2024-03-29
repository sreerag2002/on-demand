import React from 'react'
import '../Admin/Admin.css'
import { Button } from 'react-bootstrap'
import { FaCircleUser } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa";
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useNavigate } from 'react-router-dom';

function Admin() {

    const username = localStorage.getItem('username')

    const navigate = useNavigate()

    const handleLogout = ()=>{
        localStorage.clear()
        navigate('/')
    }

    return (
        <div id='adminDiv'>
            <div className='d-flex justify-content-end px-5'>
                <Dropdown>
                    <Dropdown.Toggle variant="white" id="dropdown-basic" className='border border-0 fs-5'>
                        <b><FaCircleUser className='mb-1' /> {username}</b>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='border border-0'>
                        <Dropdown.Item onClick={handleLogout}><b><FaPowerOff className='me-1' /> Logout</b></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className='container d-flex justify-content-start p-5 my-5' id='welcome'>
                <div className='text-center px-5'>
                    <h1 className='mb-4'>Welcome Admin</h1>
                    <Link to='/serviceApprove'>
                    <Button className='btn btn-success'>Service Approvals</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Admin