import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSync } from '@fortawesome/free-solid-svg-icons';

function Card({ data, categories, onEdit, onDelete }) {
  const { place, catogory_name, Shop_name, Description, id } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ Shop_name, Description, catogory_name });

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
    <div className="container card m-4" style={{ width: '350px' }}>
      <div className="card-body">
        <h5 className="card-title">{place}</h5>
     {isEditing ? (
      <div>
        <select name="Category" className='form-control' selected={editedData.Category} onChange=      {handleInputChange}>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select><br />
        <input type="text" className='form-control' name="Shop_name" value={editedData.Shop_name} onChange={handleInputChange} /><br />
        <textarea name="Description" className='form-control' value={editedData.Description} onChange={handleInputChange} /><br />
           </div>
         ) : (
          <div>
            <p className="card-text"><strong>Category:</strong> {catogory_name}</p>
            <p className="card-text"><strong>Shop Name:</strong> {Shop_name}</p>
            <p className="card-text"><strong>Description:</strong> {Description}</p><br />
          </div>
        )}

        {isEditing ? (
          <button className="btn btn-primary mr-2" onClick={handleSaveChanges}>Save Changes</button>
        ) : (
          <button className="btn btn-success mr-2" onClick={handleEdit}>Edit</button>
        )}
        <button className="btn btn-danger" onClick={() => onDelete(id)}>Delete</button>
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
            'Authorization' :`Bearer ${token}`
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
            'Authorization' :`Bearer ${token}`
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
    <div>
      <Link to="/service" style={{ textDecoration: 'none', color: 'black' }}>
        <FontAwesomeIcon icon={faHome} size="lg" style={{ margin: '10px' }} />
      </Link>
      <FontAwesomeIcon icon={faSync} size="lg" style={{ margin: '10px', cursor: 'pointer' }} onClick={() => window.location.reload()} />

      <h1 style={{ textAlign: 'center' }}>
        {cards.length === 0 ? "No services to display" : "Services"}
      </h1>
      {cards.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {cards.map((card, index) => (
            <Card
              key={card.id}
              data={card}
              categories={categories}
              onEdit={(id, newData) => editCard(id, newData)}
              onDelete={(id) => deleteCard(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CardList;  
