import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';
import {  FaHome, FaPersonBooth, FaDoorOpen} from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

const [cookies, setCookie] = useCookies(['token' ,'menu']);
const handleSignout = () => {
  setCookie('token', '', { path: '/' });
  setCookie('user', '', { path: '/' });
  navigate('/');
};
  return (
   

    <nav>
      <img src='https://saraaltayeh.github.io/about-us-asac/assets/asac-logo.jpg' alt="ASAC Logo" className="logo" />
      <ul className="nav-links1">
        <li>
          <Link to="/"> Home <FaHome/> </Link>
        </li>
        <li>
          <Link to="/about"> About <FaPersonBooth/> </Link>
        </li>
        {/* <li>
          <Link to="/products">Products</Link>
        </li> */}
        {/* <li>
          <Link to="/contact">Contact</Link>
        </li> */}
        {cookies.token ? <> {cookies.token !== '' && cookies.token !== undefined &&(
          <button className="signout-button" onClick={handleSignout}>
            Log Out 
          </button>
        )}</> : <li>
          <Link to="/signin"> Login <FaDoorOpen /></Link>
        </li>}
        
      </ul>
    </nav>
  );
};

export default NavBar;
