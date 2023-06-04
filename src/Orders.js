import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './Orders.css';
import Swal from 'sweetalert2';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orders2, setOrders2] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [cookies] = useCookies(['token', 'user']);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://asac-orders-system.onrender.com/orders', {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      const data = await response.json();
      setOrders(data);
      const filteredOrders = data.filter((item) => item.food !== "I am Good");
      setOrders2(filteredOrders);
      
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (orderId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://asac-orders-system.onrender.com/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (response.ok) {
        const updatedOrders = orders.filter((order) => order._id !== orderId);
        setOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        Swal.fire({
          icon: 'success',
          title: 'Order Deleted',
          text: 'The order has been deleted successfully!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete the order. Please try again.',
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while deleting the order.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (orderId) => {
    navigate(`/orders/${orderId}/edit`);
  };

  const handleApprove = async (orderId) => {
    try {
      const response = await fetch(`https://asac-orders-system.onrender.com/orders/${orderId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Order payment Approved',
          text: 'successfully!',
        });
        fetchOrders();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'not Allowed bro',
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = (order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
    fetchOrders();
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await fetch(`https://asac-orders-system.onrender.com/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent',
          text: 'The message has been sent successfully!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to send the message. Please try again.',
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while sending the message.',
      });
    }
  };

 // Calculate total price for all orders
let totalOrderPrice, totalUnpaidPrice, totalPaidPrice, totalNumOrders, unitPrice, remainingPrice = 0;
if (orders.length) {
  totalOrderPrice = orders.reduce((total, order) => total + parseFloat(order.price), 0);

  // Calculate total unpaid price
  totalUnpaidPrice = orders
    .filter((order) => order.paymentStatus !== 'Paid')
    .reduce((total, order) => total + parseFloat(order.price), 0);

  // Calculate total paid price
  totalPaidPrice = orders
    .filter((order) => order.paymentStatus === 'Paid')
    .reduce((total, order) => total + parseFloat(order.price), 0);

  // Calculate total number of orders
  totalNumOrders = orders2.length;
  // Calculate unit price for dividing among orders
  const incrementValues = [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 1.00, 2.00,2.00,2.00];
  
  let incrementIndex = (2 / totalNumOrders) 

  for (let i = 0; i < incrementValues.length; i++) {

      if(incrementIndex >= incrementValues[i] && incrementIndex < incrementValues[i+1] ){
if(incrementIndex === incrementValues[i] ){

  incrementIndex =incrementValues[i]
}else{
  incrementIndex =incrementValues[i+1]

}
        break;
      }
    
    
  }

  // const closestIncrement = incrementValues[incrementIndex];
  const remainingUnits = 2 - (incrementIndex * totalNumOrders);

  // unitPrice = remainingUnits / totalNumOrders;
  // remainingPrice = (remainingUnits * totalOrderPrice) / totalNumOrders;

  // const getOrderPriceWithUnitPrice = (order) => {
  //   const orderPrice = parseFloat(order.price);
  //   return (orderPrice + unitPrice + closestIncrement).toFixed(2);
  // };

  return (
    <div className="orders-container">
      <br></br>
      <br></br>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Food</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Payment Status</th>
              <th>Payment Received</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className={order.approved ? 'approved' : 'unapproved'}>
                <td>{order.name}</td>
                <td id='food-name'>{order.food}</td>
                <td>{order.quantity}</td>
                {order.food==="I am Good" ? <td>{order.price}</td> : <td>{order.price + incrementIndex}</td>}
                
                <td className={order.paymentStatus === 'Paid' ? 'paid' : 'unpaid'}>
                  {order.paymentStatus}
                </td>
                <td>
                  {order.paymentStatus === 'Paid' && order.approved ? (
                    'Yes'
                  ) : (
                    <button onClick={() => handleApprove(order._id)}>Approve</button>
                  )}
                </td>
                <td>
                  {cookies.user && order.userId === cookies.user._id && (
                    <>
                      {cookies.user.email === 'mhmd.shrydh1996@gmail.com' && (
                        <button onClick={() => handleViewOrder(order._id)}>View</button>
                      )}
                      <button onClick={() => handleEdit(order._id)}>Edit/Pay</button>
                      <button onClick={() => handleDelete(order._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="4" className="total-label">
                Total Order Price:
              </td>
              <td colSpan="3" className="total-value">
                {totalOrderPrice.toFixed(2)} JD
              </td>
            </tr>
            <tr>
              <td colSpan="4" className="total-label">
                Total Unpaid Price:
              </td>
              <td colSpan="3" className="total-value">
                {totalUnpaidPrice.toFixed(2)} JD
              </td>
            </tr>
            <tr>
              <td colSpan="4" className="total-label">
                Total Paid Price:
              </td>
              <td colSpan="3" className="total-value">
                {totalPaidPrice.toFixed(2)} JD
              </td>
            </tr>
            <tr>
              <td colSpan="4" className="total-label">
                Total Number of Orders:
              </td>
              <td colSpan="3" className="total-value">
                {totalNumOrders}
              </td>
            </tr>
            <tr>
  <td colSpan="4" className="total-label">
    Delivery Calculation:
  </td>
  <td colSpan="3" className="total-value">
    {incrementIndex} JD for each order + Remaining balance :{remainingUnits.toFixed(2) === '-0.05' ? <span> شلن </span> :
    <>
    {remainingUnits.toFixed(2) === '-0.10' ? <span> بريزه </span>: <span>{remainingUnits.toFixed(2)*-1} JD</span>} 
    
    </>} 
  </td>
</tr>

          </tbody>
        </table>
      )}
    </div>
  );
};
}
export default Orders;
