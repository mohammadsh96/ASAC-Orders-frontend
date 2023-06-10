import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

const NavBar = () => {
  return (
    
    <nav>
      <img src='https://saraaltayeh.github.io/about-us-asac/assets/asac-logo.jpg' alt="ASAC Logo" className="logo" />
      <ul className="nav-links1">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        {/* <li>
          <Link to="/products">Products</Link>
        </li> */}
        {/* <li>
          <Link to="/contact">Contact</Link>
        </li> */}
        <li>
          <Link to="/signin">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
