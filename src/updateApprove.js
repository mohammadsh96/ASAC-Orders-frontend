import React, { useState } from 'react';
import axios from 'axios';

const UpdateApprovalStatus = ({ orderId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpdateApprovalStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await axios.put(`/orders/${orderId}/approve`);
      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {success && <p>Approval status updated successfully</p>}
      <button onClick={handleUpdateApprovalStatus}>Update Approval Status</button>
    </div>
  );
};

export default UpdateApprovalStatus;
