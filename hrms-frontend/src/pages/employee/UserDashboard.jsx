import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ checkedIn: false, checkedOut: false });

  const fetchStatus = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/attendance/status', {
        withCredentials: true,
      });
      setStatus(res.data);
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCheckIn = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/checkin', {}, {
        withCredentials: true,
      });
      setMessage(res.data.message);
      fetchStatus();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/checkout', {}, {
        withCredentials: true,
      });
      setMessage(res.data.message);
      fetchStatus();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Check-out failed');
    }
  };

  return (
    <div className="us_db_container">
      <h2 className="us_db_heading">User Dashboard</h2>
      <div className="us_db_buttons">
        <button className="us_db_btn" onClick={handleCheckIn} disabled={status.checkedIn}>
          {status.checkedIn ? 'Checked In' : 'Check-In'}
        </button>
        <button
          className="us_db_btn"
          onClick={handleCheckOut}
          disabled={!status.checkedIn || status.checkedOut}
        >
          {status.checkedOut ? 'Checked Out' : 'Check-Out'}
        </button>
      </div>
      {message && <p className="us_db_message">{message}</p>}
    </div>
  );
};

export default UserDashboard;
