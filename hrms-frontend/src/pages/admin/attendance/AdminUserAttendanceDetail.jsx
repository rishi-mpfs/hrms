import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import './AdminAttendance.css';
const AdminUserAttendanceDetail = () => {
  const { userId, month } = useParams();
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [editData, setEditData] = useState({ checkIn: '', checkOut: '', status: '' });

  useEffect(() => {
    const fetchAttendanceDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admin/attendence/${userId}/month?month=${month}`,
          { withCredentials: true }
        );
        setAttendanceDetails(res.data);
      } catch (error) {
        console.error('Failed to fetch detailed attendance:', error);
      }
    };

    fetchAttendanceDetail();
  }, [userId, month]);

  const daysInMonth = new Date(month.split('-')[0], month.split('-')[1], 0).getDate();

  const getStatusForDate = (dateStr) => {
    return attendanceDetails.find((entry) => entry.date === dateStr);
  };

  const handleDayClick = (date) => {
    const entry = getStatusForDate(date);
    setSelectedDay(date);
    setEditData({
      checkIn: entry?.checkIn || '',
      checkOut: entry?.checkOut || '',
      status: entry?.status || 'Absent',
    });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/attendance/${userId}`,
        {
          date: selectedDay,
          ...editData,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      // Refresh data after update
      const res = await axios.get(
        `http://localhost:5000/api/admin/attendence/${userId}/month?month=${month}`,
        { withCredentials: true }
      );
      console.log(res.data);
      
      setAttendanceDetails(res.data);
      setSelectedDay(null);
    } catch (error) {
      console.error('Failed to update attendance:', error);
    }
  };

  return (
    <div className="ad_aud_container">
      <h1 className="ad_aud_title">Attendance for User {userId} - {month}</h1>
      <div className="ad_aud_calendar">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const dateStr = `${month}-${String(i + 1).padStart(2, '0')}`;
          const statusEntry = getStatusForDate(dateStr);
          const status = statusEntry?.status || 'Absent';
          const statusClass = status === 'Present'
            ? 'ad_aud_present'
            : status === 'Late'
            ? 'ad_aud_late'
            : 'ad_aud_absent';

          return (
            <div
              key={dateStr}
              className="ad_aud_day"
              onClick={() => handleDayClick(dateStr)}
            >
              <div className="ad_aud_date">{i + 1}</div>
              <div className={`ad_aud_status ${statusClass}`}>{status}</div>
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="ad_aud_modal">
          <div className="ad_aud_modal_content">
            <h2>Edit Attendance - {selectedDay}</h2>
            <input
              type="time"
              value={editData.checkIn}
              onChange={(e) => setEditData({ ...editData, checkIn: e.target.value })}
              placeholder="Check-In"
            />
            <input
              type="time"
              value={editData.checkOut}
              onChange={(e) => setEditData({ ...editData, checkOut: e.target.value })}
              placeholder="Check-Out"
            />
            <select
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
            <div style={{ marginTop: '15px' }}>
              <button className="ad_aud_btn" onClick={handleEditSubmit}>Save</button>
              <button
                className="ad_aud_btn ad_aud_btn_cancel"
                onClick={() => setSelectedDay(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserAttendanceDetail;
