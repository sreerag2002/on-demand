import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TiArrowBack } from "react-icons/ti";
import { FaSyncAlt, FaStar } from "react-icons/fa";
import { Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { apiUrl } from '../Components/baseUrl';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn
} from 'mdb-react-ui-kit';


function Card({ data, categories, onEdit, onDelete }) {
  const { locationname, categoryname, shop_name, description, id, avg_rating } = data;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ shop_name, description, category: data.category });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    onEdit(id, editedData);
    setIsEditing(false);
  };

  // Function to generate star icons based on average rating
  const renderStarRating = () => {
    const stars = [];
    const roundedRating = Math.round(avg_rating);
    for (let i = 0; i < 5; i++) {
      if (i < roundedRating) {
        stars.push(<FaStar key={i} color="gold" />);
      } else {
        stars.push(<FaStar key={i} color="lightgray" />);
      }
    }
    return stars;
  };

  return (
    <div className="container card col-4 p-3 border border-0" style={{ height: "400px" }}>
      <div className="card-body border shadow rounded p-4">
        <h4 className='text-center m-3' style={{ fontFamily: "Protest Strike" }}>{locationname}</h4>
        {isEditing ? (
          <div>
            <select name="category" className='form-control' value={editedData.category} onChange={handleInputChange}>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.categoryname}</option>
              ))}
            </select><br />
            <input type="text" className='form-control' name="shop_name" value={editedData.shop_name} onChange={handleInputChange} /><br />
            <textarea name="description" className='form-control' value={editedData.description} onChange={handleInputChange} /><br />
          </div>
        ) : (
          <div>
            <p className="card-text text-center my-3" style={{ fontSize: "15px" }}>Shop Name:<br /><b style={{ fontSize: "25px" }}>{shop_name}</b></p>
            <p className="card-text text-center" style={{ fontSize: "20px" }}><strong>Category:</strong> {categoryname}</p>
            <p className="card-text text-center"><strong>Description:</strong> {description}</p>
            <p className="card-text text-center"><strong>Average Rating:</strong> {renderStarRating()}</p><br />
          </div>
        )}
        <div className='d-flex justify-content-center'>
          {isEditing ? (
            <button className="btn btn-primary me-2 w-50" onClick={handleSaveChanges}>Save Changes</button>
          ) : (
            <button className="btn btn-success me-2 w-50" onClick={handleEdit}>Edit</button>
          )}
          <button className="btn btn-danger w-50" onClick={() => onDelete(id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function CardList() {
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem('token');

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/service-providers/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedCards = response.data.map(card => ({ ...card, avg_rating: card.avg_rating.toFixed(1) }));
      setCards(updatedCards);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/list-categories/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
   

    fetchServices();
    fetchCategories();
  }, []);

  function editCard(id, editedData) {
    axios.put(`${apiUrl}/UpdateService/${id}/`, editedData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      .then(() => {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.id === id) {
              return { ...card, ...editedData };
            } else {
              return card;
            }
          });
        });
        fetchCategories();
      })
      .catch(error => console.error("Failed to update service:", error));
  }

  function deleteCard(id) {
    console.log('Deleting card with id:', id); 
    axios.delete(`${apiUrl}/DeleteService/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        setCards(prevCards => prevCards.filter(card => card.id !== id));
      })
      .catch(error => console.error("Failed to delete service:", error));
  }

  return (
    <div className='container'>
      <div className='mb-3 mt-4 d-flex'>
        <h1 style={{ fontFamily: "Protest Strike" }}>All Services</h1>
        <div className='col-9 d-flex justify-content-end mt-3'>
          <Link to="/service"><button className='btn btn-primary mx-2'>Back to Home</button></Link>
          <FontAwesomeIcon icon={faSync} size="lg" className='m-2' style={{ cursor: 'pointer' }} />
        </div>
      </div>
      <div>
        {cards.length > 0 && (
          <Row>
            {cards.map((card, index) => (
              <Card
                className='col-3 my-2'
                key={card.id}
                data={card}
                categories={categories}
                onEdit={(id, newData) => editCard(id, newData)}
                onDelete={(id) => deleteCard(id)}
              />
            ))}
          </Row>
        )}
        <Row className='py-5 my-5'>
          <p className='text-center text-danger fs-5' style={{fontFamily:"Dosis"}}>
          <b>{cards.length === 0 ? "No services to display." : ""}</b>
          </p>
        </Row>
      </div>
    </div>
  );
}

export default CardList;
