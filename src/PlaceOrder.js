import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './placeOrder.css';
import './signin.css'; 
import Swal from 'sweetalert2';
const PlaceOrder = () => {
  const [food, setFood] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();
  const menu = [
    { name: 'ساندويش شاورما دجاج عادي', price: '1.00' },
    { name: 'ساندويش شاورما دجاج سوبر', price: '1.25' },
    { name: 'وجبة شاورما دجاج عادي', price: '2.25' },
    { name: 'وجبة شاورما دجاج سوبر', price: '2.75' },
    { name: 'وجبة شاورما دجاج ايطالي', price: '3.00' },
    { name: 'وجبة شاورما دجاج حلبي', price: '3.65' },
    { name: 'وجبة شاورما دجاج دبل', price: '3.40' },
    { name: 'ساندويش شاورما لحمه عادي', price: '1.00' },
    { name: 'ساندويش شاورما لحمه سوبر', price: '1.50' },
    { name: 'ساندويش شاورما فرنسي عادي', price: '1.25' },
    { name: 'ساندويش شاورما فرنسي سوبر', price: '1.75' },
    { name: 'وجبة شاورما لحمه عادي', price: '2.75' },
    { name: 'وجبة شاورما لحمه سوب', price: '3.25' },
    { name: 'وجبة شاورما لحمه ايطالي', price: '3.75' },
    { name: 'وجبة شاورما لحمه حلبي', price: '5.50' },
    { name: 'وجبة شاورما لحمه دبل', price: '4.50' },
    { name: 'وجبة شاورما دبل مكس', price: '3.75' },
    { name: 'وجبة شاورما ايطالي مكس', price: '3.50' },
    { name: 'وجبة شاورما حلبي مكس', price: '4.50' },
    { name: 'وجبة بروستد 5 قطع', price: '3.50' },
    { name: 'وجبة بروستد 10 قطع', price: '7.00' },
    { name: 'كرسبي دجاج', price: '4.00' },
    { name: 'نصق فروجه', price: '3.50' },
    { name: 'فروج كامل', price: '7.00' },
    { name: 'ساندويش زنجر حار', price: '1.95' },
    { name: 'ساندويش زنجر عادي', price: '1.95' },
    { name: 'ساندويش سكالوب', price: '1.85' },
    { name: 'ساندويش كوردن', price: '2.00' },
    { name: 'ساندويش فاهيتا', price: '2.00' },
    { name: 'وجبة زنجر', price: '3.00' },
    { name: 'وجبة فاهيتا', price: '3.00' },
    { name: 'ريزو عرب', price: '2.75' },
    { name: 'فته مكس', price: '2.75' },
    { name: 'فتة لحمه', price: '3.00' },
    { name: 'فتة دجاج', price: '2.25' },
    { name: 'سيزر', price: '1.50' },
    { name: 'تبوله', price: '1.25' },
    { name: 'فتوش', price: '1.25' },
    { name: 'علبة بطاطا', price: '0.75' }
  ];

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
    <div class="place-order-container">
  <form className="form" onSubmit={handlePlaceOrder}>
  <h2 class="form-heading">Place Order</h2>
  <img src="https://saraaltayeh.github.io/about-us-asac/assets/asac-logo.jpg" alt="ASAC Logo" class="form-image" />
      <select
        className="food-select"
        value={food}
        onChange={handleFoodChange}
      >
        <option value="">Select Food</option>
        {menu.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
      <input
        className="input"
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <input
        className="input"
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        disabled
      />
      <button className="button" type="submit">Submit</button>
    </form>
</div>

  
  );
};

export default PlaceOrder;
