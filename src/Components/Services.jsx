import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSync } from '@fortawesome/free-solid-svg-icons';
import { TiArrowBack } from "react-icons/ti";
import { FaSyncAlt } from "react-icons/fa";
import { Col, Row } from 'react-bootstrap';

function Card({ data, categories, onEdit, onDelete }) {
  const { place, Category, Shop_name, Description, id } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ Shop_name, Description, Category });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  // const hn=andleCategoryChange = (e) => {
  //   const { name, value } = e.target;
  //   setEditedData({ ...editedData, [name]: value });
  // };

  console.log(data);
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    onEdit(id, editedData);
    setIsEditing(false);

  };

  return (
    <div className="container card col-4 p-3 border border-0" style={{height:"400px"}}>
      <div className="card-body border shadow rounded p-4">
        <h4 className='text-center m-3' style={{ fontFamily: "Protest Strike" }}>{place}</h4>
        {isEditing ? (
          <div>
            <select name="Category" className='form-control' selected={editedData.Category} onChange={handleInputChange}>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select><br />
            <input type="text" className='form-control' name="Shop_name" value={editedData.Shop_name} onChange={handleInputChange} /><br />
            <textarea name="Description" className='form-control' value={editedData.Description} onChange={handleInputChange} /><br />
          </div>
        ) : (
          <div>
            <p className="card-text text-center my-3" style={{ fontSize: "15px" }}>Shop Name:<br /><b style={{ fontSize: "25px" }}>{Shop_name}</b></p>
            <p className="card-text text-center" style={{ fontSize: "20px" }}><strong>Category:</strong> {catogory_name}</p>
            <p className="card-text"><strong>Description:</strong> {Description}</p><br />
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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`http://10.11.0.95:8002/ListService/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setCards(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://10.11.0.95:8002/list_Category/`, {
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

    fetchServices();
    fetchCategories();
  }, []);

  function editCard(id, editedData) {

    axios.put(`http://10.11.0.95:8002/UpdateService/${id}/`, editedData,
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
      })

      .catch(error => console.error("Failed to update service:", error));
  }


  function deleteCard(id) {
    // DELETE request to backend to delete the service by ID
    axios.delete(`http://10.11.0.95:8002/DeleteService/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        // Remove the deleted card from state
        setCards(prevCards => prevCards.filter(card => card.id !== id));
      })
      .catch(error => console.error("Failed to delete service:", error));
  }

  return (
    <div className='container'>
      <div>
        <Link to="/service" style={{ textDecoration: 'none', color: 'black' }}>
          <button className='btn btn-white border-0' style={{ fontSize: "40px" }}><TiArrowBack /></button>
        </Link>
        <button className='btn btn-white text-dark border-0 mt-3' style={{ fontSize: "30px", float: "right" }} onClick={() => window.location.reload()}><FaSyncAlt /></button>
      </div>

      <h1 className='m-4' style={{ textAlign: 'center' }}>
        {cards.length === 0 ? "No services to display" : "Services"}
      </h1>
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

    </div>
  );
}

export default CardList;  
