import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './user.css';
const UserMonthlyAttendance = () => {
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchUserAttendance = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/attendance/${selectedMonth}`,
          { withCredentials: true }
        );
        setAttendanceData(res.data);
      } catch (error) {
        console.error('Failed to fetch attendance:', error.response?.data || error.message);
      }
    };

    fetchUserAttendance();
  }, [selectedMonth]);

  const daysInMonth = new Date(
    parseInt(selectedMonth.split('-')[0]),
    parseInt(selectedMonth.split('-')[1]),
    0
  ).getDate();

  const getStatusForDate = (dateStr) => {
    return attendanceData.find((entry) => entry.date === dateStr);
  };

  return (
    <div className="us_ad_container">
      <h2 className="us_ad_heading">Your Attendance</h2>

      <div className="us_ad_month_selector">
        <label htmlFor="month">Select Month: </label>
        <input
          type="month"
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="us_ad_calendar">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
          const dateObj = new Date(selectedMonth + `-${String(day).padStart(2, '0')}`);
          if (dateObj > today) return null;

          const entry = getStatusForDate(dateStr);
          const status = entry?.status || 'No Record';
          const statusClass =
            status.toLowerCase() === 'present'
              ? 'us_ad_present'
              : status.toLowerCase() === 'late'
              ? 'us_ad_late'
              : status.toLowerCase() === 'absent'
              ? 'us_ad_absent'
              : 'us_ad_norecord';

          return (
            <div key={dateStr} className="us_ad_day">
              <div className="us_ad_date">{day}</div>
              <div className={`us_ad_status ${statusClass}`}>{status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserMonthlyAttendance;
