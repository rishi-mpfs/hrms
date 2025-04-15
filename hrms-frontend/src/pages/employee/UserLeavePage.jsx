import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeaveForm from './UserLeaveForm';


const UserLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    // Fetch the leaves based on filter
    const fetchLeaves = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/leave', {
          withCredentials: true,
        });
        setLeaves(res.data);
      } catch (err) {
        console.error('Error fetching leaves:', err);
      }
    };
    fetchLeaves();
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSort = () => {
    const sortedLeaves = [...leaves].sort((a, b) => {
      // Sort pending leaves first, then the latest applied leaves
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return new Date(b.createdAt) - new Date(a.createdAt); // Sort by latest applied
    });
    setLeaves(sortedLeaves);
  };

  return (
    <div className="us_leave_page">
      <h2 className="us_leave_heading">My Applied Leaves</h2>
      <div className="us_leave_filters">
        <select value={filter} onChange={handleFilterChange}>
          <option value="all">All Leaves</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button className="us_leave_btn" onClick={() => setIsFormOpen(true)}>
          Apply New Leave
        </button>
      </div>

      <button className="us_leave_sort_btn" onClick={handleSort}>Sort by Pending First</button>

      <div className="us_leave_list">
        {leaves.length === 0 ? (
          <p>No leaves applied yet.</p>
        ) : (
          leaves.map((leave) => (
            <div key={leave.id} className="us_leave_item">
              <div className="us_leave_date">
                {leave.startDate} - {leave.endDate}
              </div>
              <div className={`us_leave_status ${leave.status}`}>
                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
              </div>
              <div className="us_leave_reason">{leave.reason}</div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && <LeaveForm closeForm={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default UserLeavePage;
