import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSync } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

function Card({ data, onDuplicate, onEdit, onDelete }) {
  const { location, category, shopName, username, description, image } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ shopName, username, description });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    onEdit(editedData);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="container card m-4" style={{ width: '350px', margin: '10px' }}>
        <div className="card-body">
          <h5 className="card-title">{location}</h5>
          {image && <img src={image} className="card-img-top" alt="Card image" style={{ maxWidth: '150px', maxHeight: '150px' }} />}
          <p className="card-text"><strong>Category:</strong> {category}</p>
          {isEditing ? (
            <div>
              <input type="text" className='form-control' name="shopName" value={editedData.shopName} onChange={handleInputChange} /><br />
              <input type="text" className='form-control' name="username" value={editedData.username} onChange={handleInputChange} /><br />
              <textarea name="description" className='form-control' value={editedData.description} onChange={handleInputChange} /><br />
            </div>
          ) : (
            <div>
              <p className="form-control card-text"><strong>Shop Name:</strong> {shopName}</p>
              <p className=" form-control card-text"><strong>Username:</strong> {username}</p>
              <p className="form-control card-text"><strong>Description:</strong> {description}</p><br />
            </div>
          )}
          {isEditing ? (
            <button className="btn btn-primary mr-2" onClick={handleSaveChanges}>Save Changes</button>
          ) : (
            <button className="btn btn-success mr-2" onClick={handleEdit}>Edit</button>
          )}
          <button className="btn btn-danger" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function CardList() {
  const [cards, setCards] = useState([]);
  const [showEditModal, setShowEditModal] = useState([]);

  // Simulated data fetch from a local mock server
  useEffect(() => {
    const mockData = [
      {
        location: 'Location 1',
        category: 'Category 1',
        shopName: 'Shop 1',
        username: 'User 1',
        description: 'Description 1',
        image: 'https://via.placeholder.com/150' // Example image URL
      },

      {
        location: 'Location 2',
        category: 'Category 2',
        shopName: 'Shop 2',
        username: 'User 2',
        description: 'Description 2',
        image: 'https://via.placeholder.com/150' // Example image URL
      },
      {
        location: 'Location 3',
        category: 'Category 3',
        shopName: 'Shop 3',
        username: 'User 3',
        description: 'Description 3',
        image: 'https://via.placeholder.com/150' // Example image URL
      },


      {
        location: 'Location 4',
        category: 'Category 4',
        shopName: 'Shop 4',
        username: 'User 4',
        description: 'Description 4',
        image: 'https://via.placeholder.com/150' // Example image URL
      },
      // Add more mock data as needed
    ];
    setCards(mockData);
    setShowEditModal(Array(mockData.length).fill(false));
  }, []);

  // Duplicate card
  function duplicateCard(cardToDuplicate) {
    setCards(prevCards => [...prevCards, cardToDuplicate]);
    setShowEditModal(prevState => [...prevState, false]);
  }

  // Edit card
  function editCard(index, newData) {
    setCards(prevCards => {
      const updatedCards = [...prevCards];
      updatedCards[index] = { ...updatedCards[index], ...newData };
      return updatedCards;
    });
  }

  // Delete card
  function deleteCard(index) {
    setCards(prevCards => prevCards.filter((_, i) => i !== index));
    setShowEditModal(prevState => prevState.filter((_, i) => i !== index));
  }

  return (
    <div>
      <Link to="/service" style={{ textDecoration: 'none', color: 'black' }}>
        <FontAwesomeIcon icon={faHome} size="lg" style={{ margin: '10px' }} />
      </Link>
      {/* Refresh button */}
      <FontAwesomeIcon icon={faSync} size="lg" style={{ margin: '10px', cursor: 'pointer' }} onClick={() => window.location.reload()} />

      <h1 style={{ textAlign: 'center' }}>
        {cards.length === 0 ? "No services to display" : "Services"}
      </h1>
      {cards.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {cards.map((card, index) => (
            <Card
              key={index}
              data={card}
              onDuplicate={duplicateCard}
              onEdit={(newData) => editCard(index, newData)}
              onDelete={() => deleteCard(index)}
            />
          ))}
        </div>
      )}
      <br />
    </div>
  );
}

export default CardList;