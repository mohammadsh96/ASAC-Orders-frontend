import React, { useState, useEffect } from 'react';
import './AppAvailability.css';
import closed from './close.jpg';

const AppAvailability = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAppOpen, setIsAppOpen] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update current time every second

    const calculateTimeRemaining = () => {
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();

      // Check if the current time is within the allowed hours (10:00am to 12:20pm)
      if (
        (currentHour === 10 && currentMinute >= 0) ||
        (currentHour > 10 && currentHour < 12) ||
        (currentHour === 12 && currentMinute < 50)
      ) {
        setIsAppOpen(true);
      } else {
        setIsAppOpen(false);
      }
    };

    calculateTimeRemaining();

    return () => {
      clearInterval(timer);
    };
  }, [currentTime]);

  return (
    <>
      {isAppOpen ? (
        children
      ) : (
        <div className="closed-container">
          <div className="closed-container-inner">
            <h1 className="closed-heading">Sorry, the app is closed!</h1>
            <p>تم الطلب و الارودر عالطريق </p>
            <p className="current-time">Current Time: <span>{currentTime.toLocaleTimeString()}</span></p>
            <img src={closed} alt="closed" className="closed-image" />
          </div>
        </div>
      )}
    </>
  );
};

export default AppAvailability;
