import React,{useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Orders from './Orders';
import Swal from 'sweetalert2';
import SendCalculations from './calc';
import axios from 'axios';
import './home.css';
import NotificationComponent from './noty.js';
import socket from './socket';

// const socket = io('https://asac-orders-system.onrender.com/')

const Home = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['token' ,'menu']);
  useEffect(() => {
    getMenu() 
    },[])

    const handleOrderSend = async () => {
      let data = {
        msg: 'hhiii',
        id: 1
      };
    
      try {
        await axios.post('https://asac-orders-system.onrender.com/send-order', data);
        console.log('Order sent successfully');
      } catch (error) {
        console.log('Error sending order:', error);
      }
    };

// Listen for the 'queuedNotifications' event
// socket.on('queuedNotifications', (notifications) => {
//   console.log('Received queued notifications:', notifications);
//   // Display the missed messages to the user
//   notifications.forEach((notification) => {
//     console.log('Missed notification:', notification.msg);
//     // Add your logic here to display the missed messages to the user
//   });
// });

// // Optional: Listen for other events from the server
// socket.on('notification', (notification) => {
//   console.log('Received notification:', notification);
// });

// // Optional: Handle disconnection
// socket.on('disconnect', () => {
//   console.log('Disconnected from the server');
// });

 
    async function getMenu(){
     await axios.get('https://asac-orders-system.onrender.com/menu').then((result)=>{
      setCookie('menu',result.data[0].name)
      // console.log(result.data[0].name);
     })
    }
  const handleSignout = () => {
    setCookie('token', '', { path: '/' });
    setCookie('user', '', { path: '/' });
    navigate('/');
  };
  const handleSetMenu = async ()=>{
    let name;
    if(cookies.menu==='arab'){
      name ='yaman'
    }else{
      name='arab'
    }
    await axios.put('https://asac-orders-system.onrender.com/menu',{name})
    .then(()=>{
      getMenu()

    })
  }
  const handleClearAllOrders = async () => {
    try {
      const response = await fetch('https://asac-orders-system.onrender.com/orders/clear/all', {
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

  return (
    <div className="home-container">
      <h5 className="home-heading">ASAC Irbid Team Orders</h5>
 {/* <button onClick={handleOrderSend}>Send Order</button> */}
      <nav className='main-nav'>
        <ul className="nav-links">
          {(cookies.token === '' || cookies.token === undefined )&& (
            <li>
              <button className="nav-link-button">
                <Link to="/place-order">Place Order </Link>
              </button>
            </li>
          )}

          {cookies.token !== '' && cookies.token !== undefined &&(
            <div id='margin-buttons'>
              <li>
              <button className="nav-link-button">
                  <Link to="/place-order">Place Order </Link>
                </button>
             {/* {cookies.user.email === 'mhmd.shrydh1996@gmail.com' ? <button className="nav-link-button">
                  <Link to="/place-order">Place Order </Link>
                </button> : <><h3 style={{'color':'white'}}>Sorry We don't Accept new Orders for Today 🛎️👋</h3></>}   */}
              </li>
              <li>
              {cookies.user.email === 'mhmd.shrydh1996@gmail.com' &&(<><button className="nav-link-button" onClick={handleClearAllOrders}>
                  Clear All Orders
                </button>
                <button className="nav-link-button" onClick={handleSetMenu}>
                  Set Menu
                </button></>)}

                
              </li>
<SendCalculations/>

            </div>
          )}
        </ul>
       
      </nav>
      <Orders />
    </div>
  );
};

export default Home;
