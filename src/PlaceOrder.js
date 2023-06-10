import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { menu,additions,drinks } from './menu';
import './placeOrder.css';

const PlaceOrder = () => {
  const [food, setFood] = useState('');
  const [quantity, setQuantity] = useState(1); // Set default quantity to 1
  const [price, setPrice] = useState(0);
  const [error, setError] = useState('');
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
const [signedIn] =useCookies(['token'])
console.log(signedIn);
if(!signedIn.token){
  Swal.fire({
    icon: 'warning',
    title: 'Please Login into your account',
  }).then(() => {
    navigate('/signin')
  });
  
}
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders'));
    if (savedOrders && savedOrders.length) {
      setOrders(savedOrders);
    }
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (selectedFoods.length) {
      try {
     
        const totalPrice =
          selectedFoods.reduce((total, food) => total + parseFloat(food.price), 0) * quantity; // Calculate the total price based on quantity and selected food items
  
        const response = await fetch('https://asac-orders-system.onrender.com/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookies.token}`,
          },
          body: JSON.stringify({
            food: selectedFoods.map((food) => food.name).join('+'),
            quantity: selectedFoods.length, // Send the quantity based on the number of selected food items
            price: totalPrice,
          }),
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
  
        if (orders.length > 0 && cookies.user) {
          const userOrder = orders.find((order) => order.userId === cookies.user._id);
          if (userOrder) {
            const updatedFoods = [...selectedFoods, { name: food, price: totalPrice }];
            const updatedPrice = updatedFoods.reduce((total, food) => total + food.price, 0);
  
            const updateResponse = await fetch(
              `https://asac-orders-system.onrender.com/orders/${userOrder._id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${cookies.token}`,
                },
                body: JSON.stringify({
                  name: cookies.user.name,
                  food: updatedFoods.map((food) => food.name).join('+'),
                  price: updatedPrice,
                  quantity: updatedFoods.length, // Send the quantity based on the number of updated food items
                }),
              }
            );
  
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
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'You Cannot Order nothing',
        text: 'Please Select Somthing First!😊',
      });
    }
  
  };

  const handleFoodChange = (e) => {
    const selectedFood = e.target.value;
    setFood(selectedFood);
  
    const selectedFoodItem = menu.find((item) => item.name === selectedFood);
    if (selectedFoodItem) {
      setSelectedFoods((prevFoods) => [...prevFoods, selectedFoodItem]);
      setFood('');
      setPrice(0);
    }
  };
  
  const handleFoodChange1 = (e) => {
    const selectedFood = e.target.value;
    setFood(selectedFood);
  
    const selectedFoodItem = additions.find((item) => item.name === selectedFood);
    if (selectedFoodItem) {
      setSelectedFoods((prevFoods) => [...prevFoods, selectedFoodItem]);
      setFood('');
      setPrice(0);
    }
  };
  
  const handleFoodChange2 = (e) => {
    const selectedFood = e.target.value;
    setFood(selectedFood);
  
    const selectedFoodItem = drinks.find((item) => item.name === selectedFood);
    if (selectedFoodItem) {
      setSelectedFoods((prevFoods) => [...prevFoods, selectedFoodItem]);
      setFood('');
      setPrice(0);
    }
  };
  const handleRemoveFood2 = (name) => {
    setSelectedFoods((prevFoods) => prevFoods.filter((food) => food.name !== name));
  };
  return (
    <div className="place-order-container">
      <div className="signin-content">
      <form  onSubmit={handlePlaceOrder}>
      <div className="text-center">
        <h5 className="form-heading">Select & Enjoy </h5>
        </div>
        
        <div className="food-select-flex">
          <select className="food-select" value={food} onChange={handleFoodChange}>
            <option value="">Select Meal</option>
            {menu.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="food-select-flex">
          <select className="food-select" value={food} onChange={handleFoodChange1}>
            <option value="">Select additions</option>
            {additions.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="food-select-flex">
          <select className="food-select" value={food} onChange={handleFoodChange2}>
            <option value="">Select drink</option>
            {drinks.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="selected-foods">
          {selectedFoods.map((food) => (
            <div key={food.name} className="selected-food">
              <span>{food.name}</span>
              <span>{food.price}$</span>
              <button type="button" onClick={() => handleRemoveFood2(food.name)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="text-center pt-1 mb-5 pb-1">
        <button className="button" type="submit">
          Submit
        </button>
        </div>
      </form>
      <div className="signin-image" id='img-margin'>
        <img src="https://saraaltayeh.github.io/about-us-asac/assets/asac-logo.jpg" alt="ASAC Logo" className="form-image" />
        </div>
        </div>
    </div>
  );
  
};

export default PlaceOrder;
