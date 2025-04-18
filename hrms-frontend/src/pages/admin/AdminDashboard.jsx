import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [attendanceStats, setAttendanceStats] = useState({
    presentCount: 0,
    absentCount: 0,
    absentList: [],
    date: '',
  });

  useEffect(() => {
    fetchEmployeeCount();
    fetchPendingLeaves();
    fetchAttendanceStats();
  }, []);

  const fetchEmployeeCount = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/employeecount',
        { withCredentials: true });
      setEmployeeCount(res.data.employeeCount || 0);
    } catch (error) {
      console.error('Error fetching employee count:', error);
    }
  };

  const fetchPendingLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/leave-pendingcount',
        { withCredentials: true });
      setPendingLeaves(res.data.pendingCount || 0);
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
    }
  };

  const fetchAttendanceStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/attendancestates',
        { withCredentials: true });
      setAttendanceStats(res.data);
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
    }
  };

  return (
    <div className="ad_db_dashboard">
      <h2 className="ad_db_title">Admin Dashboard</h2>

      <div className="ad_db_cards">
        <div className="ad_db_card">
          <h3 className="ad_db_card_title">Total Employees</h3>
          <p className="ad_db_card_value">{employeeCount}</p>
        </div>

       

        <div className="ad_db_card">
          <h3 className="ad_db_card_title">Attendance ({attendanceStats.date})</h3>
          <p className="ad_db_card_subvalue">Present: {attendanceStats.presentCount}</p>
          <p className="ad_db_card_subvalue">Absent: {attendanceStats.absentCount}</p>
        </div>

        <div className="ad_db_card">
          <h3 className="ad_db_card_title">Pending Leaves</h3>
          <p className="ad_db_card_value">{pendingLeaves}</p>
        </div>
      </div>

      <div className="ad_db_absent_list">
        <h3 className="ad_db_section_title">Absent Employees Today</h3>
        {attendanceStats.absentList.length === 0 ? (
          <p className="ad_db_nodata">No absentees today 🎉</p>
        ) : (
          <ul className="ad_db_list">
            {attendanceStats.absentList.map((user) => (
              <li key={user.id} className="ad_db_list_item">
                {user.name} ({user.email})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
