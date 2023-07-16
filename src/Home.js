import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Orders from './Orders';
import Swal from 'sweetalert2';
import SendCalculations from './calc';
import axios from 'axios';
import './home.css';
import socket from './socket';
import NotificationIcon from './NotificationIcon';

const Home = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['token', 'menu']);
  const [orderMessage, setOrderMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const socketRef = useRef(null);
 
  useEffect(() => {
    socketRef.current = socket;
  
    const handleOrderReceived = (data) => {
      if (data && data.msg) {
        setOrderMessage((prevOrderMessages) => [...prevOrderMessages, data.msg]);
        setNotificationCount((prevCount) => prevCount + 1);
        setNotifications((prevNotifications) => [...prevNotifications, data.msg]);
      }
    };
  
    const handleQueuedNotifications = (queuedNotifications) => {
      console.log('Received queued notifications:', queuedNotifications);
      queuedNotifications.forEach((notification) => {
        console.log('Missed notification:', notification);
        setNotificationCount((prevCount) => prevCount + 1);
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
      });
    };
  
    const handleNotificationReceived = (notification) => {
      console.log('Received notification:', notification);
      setNotificationCount((prevCount) => prevCount + 1);
      setNotifications((prevNotifications) => [...prevNotifications, notification]);
    };
  
    const handleDisconnect = () => {
      console.log('Disconnected from the server');
    };
  
    socketRef.current.on('order', handleOrderReceived);
    socketRef.current.on('queuedNotifications', handleQueuedNotifications);
    socketRef.current.on('notification', handleNotificationReceived);
    socketRef.current.on('disconnect', handleDisconnect);
  
    return () => {
      // Clean up the event listeners when the component unmounts
      socketRef.current.off('order', handleOrderReceived);
      socketRef.current.off('queuedNotifications', handleQueuedNotifications);
      socketRef.current.off('notification', handleNotificationReceived);
      socketRef.current.off('disconnect', handleDisconnect);
    };
  }, []);

  const handleOrderSend = async (message) => {
    try {
      await axios.post('http://localhost:3001/send-order', { msg: message });
      console.log('Order sent successfully');
    } catch (error) {
      console.log('Error sending order:', error);
    }
  };

  async function getMenu() {
    await axios.get('http://localhost:3001/menu').then((result) => {
      setCookie('menu', result.data[0].name);
      // console.log(result.data[0].name);
    });
  }

  const handleSignout = () => {
    setCookie('token', '', { path: '/' });
    setCookie('user', '', { path: '/' });
    navigate('/');
  };

  const handleSetMenu = async () => {
    let name;
    if (cookies.menu === 'arab') {
      name = 'yaman';
    } else {
      name = 'arab';
    }
    await axios.put('http://localhost:3001/menu', { name }).then(() => {
      getMenu();
    });
  };

  const handleClearAllOrders = async () => {
    try {
      const response = await fetch('http://localhost:3001/orders/clear/all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Orders Cleared',
          text: 'successfully!',
        });

        navigate('/place-order');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'not Allowed bro',
        });
        navigate('/');
      }
    } catch (error) {
      console.error('An error occurred while clearing orders:', error);
    }
  };

  const handleNotificationIconClick = () => {
    // Perform actions when the notification icon is clicked
    // For example, showing a notification modal or dropdown
    setNotificationCount(0); // Clear the notification count
  };

  return (
    <div className="home-container">
      <h5 className="home-heading">ASAC Irbid Team Orders</h5>
      {cookies.user && cookies.user.email === 'mhmd.shrydh1996@gmail.com' && (
        <>
          <input
            type="text"
            value={orderMessage}
            onChange={(e) => setOrderMessage(e.target.value)}
            placeholder="Enter your message"
          />
          <button onClick={() => handleOrderSend(orderMessage)}>Send Order</button>
        </>
      )}

      <nav className="main-nav">
        <ul className="nav-links">
          {(!cookies.token || !cookies.token.email) && (
            <li>
              <button className="nav-link-button">
                <Link to="/place-order">Place Order </Link>
              </button>
            </li>
          )}

          {cookies.token && cookies.token.email && cookies.user.email !== 'mhmd.shrydh1996@gmail.com' && (
            <div id="margin-buttons">
              <li>
                <button className="nav-link-button">
                  <Link to="/place-order">Place Order </Link>
                </button>
              </li>
              <li>
                {cookies.user.email === 'mhmd.shrydh1996@gmail.com' && (
                  <>
                    <button className="nav-link-button" onClick={handleClearAllOrders}>
                      Clear All Orders
                    </button>
                    <button className="nav-link-button" onClick={handleSetMenu}>
                      Set Menu
                    </button>
                  </>
                )}
              </li>
              <SendCalculations />
            </div>
          )}
        </ul>
      </nav>

      {cookies.user && cookies.user.email !== 'mhmd.shrydh1996@gmail.com' && (
        <NotificationIcon count={notificationCount} notifications={notifications} onClick={handleNotificationIconClick} />
      )}

      <Orders />
    </div>
  );
};

export default Home;
