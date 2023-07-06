import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './Orders.css';
import Swal from 'sweetalert2';
import {  FaTrash} from 'react-icons/fa'
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orders2, setOrders2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [externalOrders, setExternalOrders] = useState(0);

  const navigate = useNavigate();
  const [cookies] = useCookies(['token', 'user']);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://asac-orders-system.onrender.com/orders-last-24-hours', {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      const data = await response.json();
      setOrders(data);
      const filteredOrders = data.filter((item) => item.food !== "I am Good");
      setOrders2(filteredOrders);

      

      const response2 = await fetch('https://asac-orders-system.onrender.com/external-orders');
      const data2 = await response2.json();
      setExternalOrders(parseInt(data2.numberOfExternalOrders))
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
  //update external orders : 
  const setExternalOrdersFun = async (e) => {
    e.preventDefault()
    console.log(externalOrders);
    console.log(typeof externalOrders);
    try {
      const response = await fetch(`https://asac-orders-system.onrender.com/external-orders`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({ increment: parseInt(externalOrders) }),
      });
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: `adding ${externalOrders} external Orders`,
          text: 'successfully!',
        });
        // const responseData = await response.json();
        // console.log(responseData.numberOfExternalOrders);  
        // setExternalOrders(parseInt(responseData.numberOfExternalOrders))
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  }
  const askForTheSame = async (orderId) => {
    setLoading2(false)
    try {
      const response = await fetch(`https://asac-orders-system.onrender.com/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
  
      if (response.ok) {
        //add loader here
        const order = await response.json();
  
        console.log(order);
  
      const placedOrder=  await fetch('https://asac-orders-system.onrender.com/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookies.token}`,
          },
          body: JSON.stringify({
            food: order.food,
            quantity: 1,
            price: order.price,
          }),
        });
  if (placedOrder.ok) {
    Swal.fire({
      icon: 'success',
      title: 'Order added successfully +1',
     
    });
    setLoading2(true)
    fetchOrders()
  }else{
    Swal.fire({
      icon: 'error',
      title: `Cannot add the same order`,
      text: 'danger!',
    });
  }
        // Additional logic if needed
      } else {
        // Handle error response
      }
    } catch (error) {
      // Handle fetch or JSON parsing error
    }
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
    totalNumOrders = orders2.length + Number(externalOrders);
    // Calculate unit price for dividing among orders
    const incrementValues = [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 1.00, 2.00, 2.00, 2.00];

    let incrementIndex = (2.5 / totalNumOrders)

    for (let i = 0; i < incrementValues.length; i++) {

      if (incrementIndex >= incrementValues[i] && incrementIndex < incrementValues[i + 1]) {
        if (incrementIndex === incrementValues[i]) {

          incrementIndex = incrementValues[i]
        } else {
          incrementIndex = incrementValues[i + 1]

        }
        break;
      }


    }

    // const closestIncrement = incrementValues[incrementIndex];
    const remainingUnits = 2.5 - (incrementIndex * totalNumOrders);

    // unitPrice = remainingUnits / totalNumOrders;
    // remainingPrice = (remainingUnits * totalOrderPrice) / totalNumOrders;

    // const getOrderPriceWithUnitPrice = (order) => {
    //   const orderPrice = parseFloat(order.price);
    //   return (orderPrice + unitPrice + closestIncrement).toFixed(2);
    // };

    return (
      <div className="orders-container">
        <br />
        <br />
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
          <div className='text-center'>
      <h5>Orders</h5>
    </div>
          <table className="orders-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Food</th>
              <th>Price</th>
              { cookies.user &&
              <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className={order.approved ? 'approved' : 'unapproved'}>
                <td>{order.name}</td>
                <td id="food-name">{order.food}</td>
                {order.food === "I am Good" ? (
                  <td>{order.price}</td>
                ) : (
                  <td>{(order.price + incrementIndex).toFixed(2)}</td>
                )}
               { cookies.user && <td>
                  {cookies.user && order.userId === cookies.user._id ? (
                    <> 
                      <button onClick={() => handleDelete(order._id)}>Delete <FaTrash/></button>
                    </>
                  ):<> {loading2?<button onClick={() => askForTheSame(order._id)}>same same  </button> : <div className="loading-spinner2"></div> }  </>}
                </td>   }
                
              </tr>
            ))}
          </tbody>
        </table>
    <div className='text-center'>
      <h5>Calculations</h5>
    </div>
            <table className="totals-table" >
              <tbody>
                <tr>
                  <td colSpan="2" className="total-label">
                    Total Order Price:
                  </td>
                  <td colSpan="2" className="total-value">
                    {(totalOrderPrice+2.5).toFixed(2)} JD
                  </td>
                </tr>
                {/* <tr>
                  <td colSpan="2" className="total-label">
                    Total Unpaid Price:
                  </td>
                  <td colSpan="2" className="total-value">
                    {totalUnpaidPrice.toFixed(2)} JD
                  </td>
                </tr> */}
                {/* <tr>
                  <td colSpan="2" className="total-label">
                    Total Paid Price:
                  </td>
                  <td colSpan="2" className="total-value">
                    {totalPaidPrice.toFixed(2)} JD
                  </td>
                </tr> */}
                <tr>
                  <td colSpan="2" className="total-label">
                    Total Number of ASAC Orders:
                  </td>
                  <td colSpan="2" className="total-value">
                    {totalNumOrders - externalOrders}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="total-label">
                    Delivery Calculation:
                  </td>
                  <td colSpan="2" className="total-value">
                    {incrementIndex} JD for each order + Remaining balance:{" "}
                    {remainingUnits.toFixed(2) === "-0.05" ? (
                      <span>شلن</span>
                    ) : remainingUnits.toFixed(2) === "-0.10" ? (
                      <span>بريزه</span>
                    ) : (
                      <span>{remainingUnits.toFixed(2) * -1} JD</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="total-label">
                    Total Number of Orders:
                  </td>
                  <td colSpan="2" className="total-value">
                    {totalNumOrders}
                  </td>
                </tr>
                {cookies.user && cookies.user.email === "mhmd.shrydh1996@gmail.com" && (
                  <tr>
                    <td colSpan="2" className="total-label">
                      How many external Orders?
                    </td>
                    <td colSpan="2" className="total-label">
                      <form onSubmit={setExternalOrdersFun} style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="number"
                          
                          onChange={(e) => {
                            const value = e.target.value;
                            setExternalOrders(value ? parseInt(value) : 0); // Set to empty string if value is empty
                          }}
                          placeholder="Enter number of external orders"
                          
                        />
                        <button type="submit" >
                          SAVE
                        </button>
                      </form>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
    
    ;
  };
}
export default Orders;