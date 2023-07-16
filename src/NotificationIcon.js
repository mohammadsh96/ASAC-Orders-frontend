import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
const NotificationIcon = ({ notifications, onClick }) => {
    const [showNotifications, setShowNotifications] = useState(false);
  
    const handleClick = () => {
      setShowNotifications(!showNotifications);
      onClick(); // Call the onClick function passed as props
    };
  
    // Filter out null values from the notifications array
    const filteredNotifications = notifications.filter((notification) => notification !== null);
  
    return (
      <div className="notification-icon" onClick={handleClick}>
        <span className="notification-icon-badge">{filteredNotifications.length}</span>
        <FontAwesomeIcon icon={faBell} />
        {showNotifications && (
          <div className="notification-dropdown">
            {filteredNotifications.map((notification, index) => (
              <div key={index} className="notification-item">
                {notification.msg}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default NotificationIcon;




  
