import React, { useState, useEffect } from 'react';
import './AppAvailability.css';
import closed from './close.jpg';

const AppAvailability = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState('');
  const [appOpensAt, setAppOpensAt] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update current time every second

    const calculateTimeRemaining = () => {
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();

      // Check if the current time is within the allowed hours (10:00am to 12:30pm)
      if (
        (currentHour === 10 && currentMinute >= 0) ||
        (currentHour > 10 && currentHour < 12) ||
        (currentHour === 12 && currentMinute <= 30)
      ) {
        setIsAppOpen(true);
      } else {
        setIsAppOpen(false);

        // Calculate the time remaining until the app opens
        const opensAt = new Date();
        opensAt.setHours(10, 0, 0); // Set the opening time to 10:00am
        if (currentTime > opensAt) {
          opensAt.setDate(opensAt.getDate() + 1); // If current time is after opening time, set the opening time to the next day
        }
        const timeDiff = opensAt.getTime() - currentTime.getTime();
        const hoursRemaining = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeDiff / (1000 * 60)) % 60);
        setTimeRemaining(`${hoursRemaining} hours and ${minutesRemaining} minutes`);
        setAppOpensAt(opensAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
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
          <h1 className="closed-heading">Oops, the app is closed!</h1>
          <p className="closed-text">But don't worry, we'll be back at {appOpensAt} with more fun and excitement!</p>
          <p className="current-time">Current Time: <span> {currentTime.toLocaleTimeString()}</span></p>
          <p className="time-remaining">Time Remaining until App Opens:<span> {timeRemaining}</span></p>
          {/* <img src={closed} alt="closed" className="closed-image" /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default AppAvailability;
