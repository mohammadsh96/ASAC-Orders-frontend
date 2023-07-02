// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// import socket from './socket' // Replace with your server URL

// const NotificationComponent = () => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     // Listen for the 'notification' event from the server
//     socket.on('notification', (data) => {
//       setNotifications((prevNotifications) => [...prevNotifications, data.msg]); // Update the notifications array
//       console.log(data.msg);
//     });

//     // Clean up the event listener when the component unmounts
//     return () => {
//       socket.off('notification');
//     };
//   }, []);

//   return (
//     <div>
//       {notifications.map((msg, index) => (
//         <div key={index}>msg: {msg}</div>
//       ))}
//     </div>
//   );
// };

// export default NotificationComponent;
