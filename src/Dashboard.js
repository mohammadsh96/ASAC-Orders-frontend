import React from 'react';
import { Link } from 'react-router-dom';
import PlaceOrder from './PlaceOrder';

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      {/* Your dashboard content here */}
      <Link to="/place-order">Place Order</Link>
    </div>
  );
};

export default Dashboard;
