import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import './editForm.css';

const EditForm = () => {
  const [cookies] = useCookies(['token']);
  const { id: orderId } = useParams();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`https://asac-orders-system.onrender.com/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`https://asac-orders-system.onrender.com/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle success
        setShow(false); // Hide the form after successful update
        navigate('/'); // Navigate to the home page
      } else {
        // Handle error
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="edit-form-container">
      {show && (
        <div className="edit-form-content">
          <h2>Edit {formData.name} Order</h2>
          <form onSubmit={handleSubmit}>
        <div className="form-group">
              {/* <label htmlFor="name">{formData.name}</label> */}
              {/* <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
              /> */}
            </div>
            <div className="form-group">
              <label htmlFor="food">Food:</label>
              <input
                type="text"
                id="food"
                name="food"
                value={formData.food || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity || ''}
                onChange={handleInputChange}
              />
            </div>
            {/* <div className="form-group">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
              />
            </div> */}
            <div className="form-group1">
  <label htmlFor="paymentStatus">Payment Status:</label>
  <select
    id="paymentStatus"
    name="paymentStatus"
    value={formData.paymentStatus || ''}
    onChange={handleInputChange}
  >
    <option value="">Select Payment Status</option>
    <option value="Paid">Paid</option>
    <option value="Unpaid">Unpaid</option>
  </select>
</div>

            <div className="form-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShow(false)}>
                Cancel
              </button>
            </div>
        </form>
        </div>
      )}
    </div>
  );
};

export default EditForm;
