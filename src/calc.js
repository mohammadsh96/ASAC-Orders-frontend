import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
const SendCalculations = () => {
  const [isCalculationsSent, setCalculationsSent] = useState(false);
  const [cookies] = useCookies(['token', 'user'] || null);

  const handleSendCalculations = async () => {
    try {
      const response = await fetch('http://localhost:3001/send-calculations');
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
    <div id='minmise'>
     <button className='nav-link-button'  
    onClick={handleSendCalculations}
  
  >
    Calculate
  </button>
  </div>
  );
};

export default SendCalculations;
