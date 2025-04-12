import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './../AdminEmployee.css';

const AdminAttendanceSummary = () => {
  const history = useHistory();
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // format: YYYY-MM
  };

  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/attendance/${month}`, {
          withCredentials: true,
        });
        setAttendanceData(res.data);
      } catch (error) {
        console.error('Failed to fetch attendance summary:', error);
      }
    };

    fetchAttendance();
  }, [month]);

  const filteredUsers = attendanceData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (userId) => {
    // Navigate to the detailed attendance page
    history.push(`/attendance-detail/${userId}/${month}`);
  };

  return (
    <div className="ad_ul_container">
      <h1 className="ad_ul_title">Attendance Summary</h1>

      <div className="ad_ul_controls">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="ad_ul_listcon">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.userId} onClick={() => handleRowClick(user.userId)}>
                <td>{user.userId}</td>
                <td>{user.name}</td>
                <td>{user.present}</td>
                <td>{user.absent}</td>
                <td>{user.late}</td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="ad_ul_empty">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAttendanceSummary;
