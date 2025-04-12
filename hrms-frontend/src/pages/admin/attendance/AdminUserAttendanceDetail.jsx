import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './../AdminEmployee.css';

const AdminUserAttendanceDetail = () => {
  const { userId, month } = useParams();
  const [attendanceDetails, setAttendanceDetails] = useState([]);

  useEffect(() => {
    const fetchAttendanceDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/attendence/${userId}/month?month=${month}`);
        setAttendanceDetails(res.data);
      } catch (error) {
        console.error('Failed to fetch detailed attendance:', error);
      }
    };

    fetchAttendanceDetail();
  }, [userId, month]);

  return (
    <div className="attendance-detail-container">
      <h1>Attendance Detail for User {userId} - {month}</h1>
      <div className="attendance-detail-list">
        {attendanceDetails.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check-In</th>
                <th>Check-Out</th>
              </tr>
            </thead>
            <tbody>
              {attendanceDetails.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.status}</td>
                  <td>{entry.checkIn}</td>
                  <td>{entry.checkOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUserAttendanceDetail;
