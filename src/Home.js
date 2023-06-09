import React from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Orders from './Orders';
import Swal from 'sweetalert2';
import SendCalculations from './calc';
import './home.css';

const Home = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['token']);

  const handleSignout = () => {
    setCookie('token', '', { path: '/' });
    setCookie('user', '', { path: '/' });
    navigate('/');
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
        // Orders cleared successfully, perform any additional actions if needed
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
      <h2 className="home-heading">ASAC Irbid Team Orders</h2>
      <nav>
        <ul className="nav-links">
          {(cookies.token === '' || cookies.token === undefined )&& (
            <li>
              <button className="nav-link-button">
                <Link to="/place-order">Place Order ➕</Link>
              </button>
            </li>
          )}

          {cookies.token !== '' && cookies.token !== undefined &&(
            <>
              <li>
                <button className="nav-link-button">
                  <Link to="/place-order">Place Order ➕</Link>
                </button>
              </li>
              <li>
              {cookies.user.email === 'mhmd.shrydh1996@gmail.com' &&(<button className="nav-link-button" onClick={handleClearAllOrders}>
                  Clear All Orders
                </button>)}
                
              </li>
<SendCalculations/>

            </>
          )}
        </ul>
        {cookies.token !== '' && cookies.token !== undefined &&(
          <button className="signout-button" onClick={handleSignout}>
            Sign Out
          </button>
        )}
      </nav>
      <Orders />
    </div>
  );
};

export default Home;
