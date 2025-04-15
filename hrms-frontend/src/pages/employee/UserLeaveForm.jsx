import React, { useState } from 'react';
import axios from 'axios';
import './user.css';
const LeaveForm = ({ closeForm }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/user/leave',
        { startDate, endDate, reason },
        { withCredentials: true }
      );
      alert('Leave applied successfully');
      closeForm();
    } catch (err) {
      console.error('Error applying leave:', err);
      alert('Failed to apply leave');
    }
  };

  return (
    <div className="us_leave_form">
      <h3>Apply for Leave</h3>
      <form onSubmit={handleSubmit}>
        <div className="us_leave_form_group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="us_leave_form_group">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="us_leave_form_group">
          <label>Reason:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <div className="us_leave_form_buttons">
          <button type="submit" className="us_leave_btn">Apply Leave</button>
          <button type="button" className="us_leave_btn" onClick={closeForm}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
