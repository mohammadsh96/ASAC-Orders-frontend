import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './placeOrder.css';
import './signin.css'; 
import Swal from 'sweetalert2';
import { menu } from './menu';

const PlaceOrder = () => {
  const [food, setFood] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders'));
    if (savedOrders && savedOrders.length) {
      setOrders(savedOrders);
    }
  }, []);
console.log(orders);
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      const totalPrice = price * quantity; // Calculate the total price based on quantity

      const response = await fetch('https://asac-orders-system.onrender.com/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({ food, quantity, price: totalPrice }), // Pass the total price to the API
      });

      if (response.ok) {
        // Order placed successfully
        Swal.fire({
          icon: 'success',
          title: 'Order Placed',
          text: 'Your order has been placed successfully!',
        }).then(() => {
          navigate('/');
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
      
      // Check if the user already has an order
      if (orders.length > 0 && cookies.user) {
        const userOrder = orders.find((order) => order.userId === cookies.user._id);
        if (userOrder) {
          // Update the existing order by combining the food names and adding the prices
          const updatedFood = userOrder.food + ' + ' + food;
          const updatedPrice = parseFloat(userOrder.price) + totalPrice;
          
          const updateResponse = await fetch(`https://asac-orders-system.onrender.com/orders/${userOrder._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${cookies.token}`,
            },
            body: JSON.stringify({name:cookies.user.name, food: updatedFood, price: updatedPrice,quantity }),
          });

          if (updateResponse.ok) {
            // Existing order updated successfully
            Swal.fire({
              icon: 'success',
              title: 'Order Updated',
              text: 'Your existing order has been updated successfully!',
            });
          } else {
            const updateErrorData = await updateResponse.json();
            setError(updateErrorData.message);
          }
        }
      }
    } catch (error) {
      console.log(error);
      setError('An error occurred. Please try again later.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while placing the order.',
      });
    }
  };
  
  const handleFoodChange = (e) => {
    const selectedFood = e.target.value;
    setFood(selectedFood);

    // Find the selected food item from the menu array
    const selectedFoodItem = menu.find((item) => item.name === selectedFood);
    if (selectedFoodItem) {
      setPrice(selectedFoodItem.price);
    }
  };

  return (
    <div className="place-order-container">
      <form className="form" onSubmit={handlePlaceOrder}>
        <h2 className="form-heading">Place Order</h2>
        <img src="https://saraaltayeh.github.io/about-us-asac/assets/asac-logo.jpg" alt="ASAC Logo" className="form-image" />
        <p>Not powered by Shawarma Arab</p>
        <select
          className="food-select"
          value={food}
          onChange={handleFoodChange}
          required
        >
          <option value="">Select Food</option>
          {menu.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <label>
          Quantity:
          <input
            className="input"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </label>
        <label>
          Price:
          <input
            className="input"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled
          />
        </label>
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PlaceOrder;
