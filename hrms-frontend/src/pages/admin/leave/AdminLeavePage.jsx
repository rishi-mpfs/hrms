import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminLeavePage.css';

const AdminLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/leaves', {
        withCredentials: true,
      });

      let allLeaves = res.data;

      allLeaves.sort((a, b) => {
        const statusOrder = { pending: 0, approved: 1, rejected: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });

      setLeaves(allLeaves);
    } catch (err) {
      console.error('Error fetching leaves:', err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/leave/${id}`, {
        status: newStatus,
      }, { withCredentials: true });

      fetchLeaves();
    } catch (err) {
      console.error('Failed to update leave status:', err);
    }
  };

  const filteredLeaves = leaves.filter((leave) =>
    filter === 'all' ? true : leave.status === filter
  );

  return (
    <div className="us_lv_container">
      <h2 className="us_lv_heading">Leave Management</h2>

      <div className="us_lv_filter">
        {/* <label className="us_lv_filter_label">Filter:</label> */}
        <select
          className="us_lv_filter_select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <table className="us_lv_table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.User?.id}</td>
              <td>{leave.User?.name}</td>
              <td>{leave.startDate}</td>
              <td>{leave.endDate}</td>
              <td>{leave.reason}</td>
              <td>{leave.status}</td>
              <td>
                <select
                  className="us_lv_status_select"
                  value={leave.status}
                  onChange={(e) =>
                    handleStatusChange(leave.id, e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLeavePage;
