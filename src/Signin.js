import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './signin.css';

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cookies, setCookie] = useCookies(['token']);

  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://asac-orders-system.onrender.com/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Signin successful
        const data = await response.json();
        const { token } = data;
        const { user } = data;

        // Store the token in a cookie
        setCookie('token', token);
        setCookie('user', user);

        // Navigate to the dashboard page
        navigate('/');
      } else {
        // Signin failed
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.log(error);
      // Handle any network or server errors
      setError('An error occurred. Please try again later.');
    }
  };

  const handleSignout = () => {
    // Clear the token from the cookie
    setCookie('token', '', { path: '/' });
    setCookie('user', '', { path: '/' });

    // Navigate to the home page or signin page
    navigate('/');
  };

  return (
    <div className="signin-container">
      {error && <p className="error-message">{error}</p>}
      <form className="gradient-form signin-form" onSubmit={handleSignin}>
        <div className="d-flex flex-column ms-5">
          <div className="text-center">
            <h4 className="mt-1 mb-5 pb-1">Welcome to ASAC Irbid Team</h4>
          </div>
          <p>login to your account</p>
          <div className="mb-4">
            <input
              className="input-field"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div className="mb-4">
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          <div className="text-center pt-1 mb-5 pb-1">
            <button className="mb-4 w-100 gradient-custom-2 signin-button" type="submit">Sign in</button>
          </div>
          <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
            <p className="mb-0">Don't have an account?</p>
            <button className="mx-2 nav-link-button" onClick={() => navigate('/signup')} type="button">
              Sign Up
            </button>
          </div>
          <img src="https://saraaltayeh.github.io/about-us-asac/assets/asac-logo.jpg" style={{ width: '185px' }} alt="logo" />
        </div>
      </form>
    </div>
  );
};

export default Signin;
