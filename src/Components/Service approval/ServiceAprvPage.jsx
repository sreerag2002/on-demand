import React from 'react'
import { IoArrowUndo } from "react-icons/io5";
import { MDBBadge, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

function ServiceAprvPage() {
    return (
        <div>
            <div className='px-5'>
                <Link to='/admin'>
                <button className='btn fs-3'><IoArrowUndo /></button>
                </Link>
            </div>
            <div className='px-5 pb-5 pt-3'>
                <MDBListGroup style={{ minWidth: '22rem' }} light>

                    {/* Heading */}
                    <MDBListGroupItem className='d-flex justify-content-center align-items-center'>
                        <div className='col-3 d-flex align-items-center'>
                            <p className='fw-bold mb-1 fs-4 w-100' style={{fontFamily:'Dosis'}}>Provider & Company</p>
                        </div>
                        <div className='col-3 d-flex align-items-center'>
                            <p className='fw-bold mb-1 fs-4 text-center w-100' style={{fontFamily:'Dosis'}}>Service</p>
                        </div>
                        <div className='col-3 d-flex align-items-center'>
                            <p className='fw-bold mb-1 fs-4 text-center w-100' style={{fontFamily:'Dosis'}}>Location</p>
                        </div>
                        <div className='col-3 d-flex align-items-center'>
                            <p className='fw-bold mb-1 fs-4 text-center w-100' style={{fontFamily:'Dosis'}}>Actions</p>
                        </div>
                    </MDBListGroupItem>

                    {/* Details */}
                    <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                        <div className='col-3 d-flex align-items-center'>
                            <div>
                                <p className='fw-bold mb-1' style={{fontFamily:'Dosis'}}>Amal</p>
                                <p className='text-muted mb-0' style={{fontFamily:'Dosis'}}>EcoFlow Plumbing</p>
                            </div>
                        </div>
                        <div className='col-3 d-flex align-items-center'>
                                <p className='fw-bold mb-1 text-center w-100' style={{fontFamily:'Dosis'}}>Plumbing</p>
                        </div>
                        <div className='col-3 d-flex align-items-center'>
                                <p className='fw-bold mb-1 text-center w-100' style={{fontFamily:'Dosis'}}>Kakkanad</p>
                        </div>
                        <div className='col-3 d-flex align-items-center justify-content-center'>
                            <div className='ms-3'>
                                <button className='btn btn-success me-2'>Approve</button>
                                <button className='btn btn-danger'>Decline</button>
                            </div>
                        </div>
                    </MDBListGroupItem>
                </MDBListGroup>
            </div>
        </div>
    )
}

export default ServiceAprvPage