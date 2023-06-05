import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
const SendCalculations = () => {
  const [isCalculationsSent, setCalculationsSent] = useState(false);
  const [cookies] = useCookies(['token', 'user'] || null);

  const handleSendCalculations = async () => {
    try {
      const response = await fetch('https://asac-orders-system.onrender.com/send-calculations');
      const data = await response.json();
      console.log(data);
      setCalculationsSent(true);
    } catch (error) {
      console.error(error);
    }
  };

  const userEmail = 'mhmd.shrydh1996@gmail.com';
  let userLoggedIn;
  if(cookies){

      userLoggedIn =   cookies.user && cookies.user.email && cookies.user.email === userEmail;
  }

  if (!userLoggedIn) {
    return null;
  }

  return (
    <div>
     <button
    onClick={handleSendCalculations}
    // disabled={isCalculationsSent}
    style={{
      padding: '10px 20px',
      backgroundColor: '#ee7724',
      backgroundImage: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }}
  >
    Send Calculations
  </button>
    </div>
  );
};

export default SendCalculations;
