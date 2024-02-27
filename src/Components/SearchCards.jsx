import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ServiceCard() {
  const [services, setServices] = useState([]);
  const [bookedServices, setBookedServices] = useState([]);

  useEffect(() => {
    // Fetch services from API
    axios.get('https://example.com/api/services')
      .then(response => {
        // Assuming the response data is an array of services
        setServices(response.data);
      })
      .catch(error => {
        console.error('Error fetching services:', error);
      });
  }, []);

  const handleBookNow = (id) => {
    if (!bookedServices.includes(id)) {
      setBookedServices([...bookedServices, id]);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", padding: "10vh" }}>Services</h1>
      <div className="row m-3">
        {services.map((service, index) => (
          <div key={index} className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{service.category}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{service.shopName}</h6>
                <p className="card-text">{service.location}</p>
                <div className="rating">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span key={index} className={`fa fa-star ${service.averageRating > index ? 'checked' : ''}`}></span>
                  ))}
                  <span className="rating-value">{service.averageRating}</span>
                </div><br />
                {bookedServices.includes(service.id) ? (
                  <button className="btn btn-success" disabled>Booked</button>
                ) : (
                  <button className="btn btn-primary" onClick={() => handleBookNow(service.id)}>Book Now</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceCard;
