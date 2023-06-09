import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    const { name, email, password } = event.target.elements;

    try {
      const response = await fetch('https://asac-orders-system.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value,
        }),
      });

      if (response.ok) {
        navigate('/signin'); // Navigate to the signin page
      } else {
        const responseData = await response.json();
        alert(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-form">
          <h5 className="text-center">Create account</h5>
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" name="name" id="name" placeholder="Enter your name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id="password" placeholder="Enter your password" />
            </div>
            <div className="text-center" >
            <button type="submit" className="signup-button">Sign Up</button>
            </div>
          </form>
          <div className='haveAcc'>
          <a className="Already" href="/signin">
            Already have an account?
          </a>
          </div>
        </div>
        <div className="signup-image">
          <img
            src="https://saraaltayeh.github.io/about-us-asac/assets/asac-logo.jpg"
            className="signup-logo"
            alt="logo"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
