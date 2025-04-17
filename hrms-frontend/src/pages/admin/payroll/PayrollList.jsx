import React, { useEffect, useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import './PayrollList.css';
const PayrollList = () => {
  const navigate = useNavigate(); // Hook to navigate to another page
  const currentDate = dayjs();
  const [monthYear, setMonthYear] = useState(
    currentDate.subtract(1, 'month').format('YYYY-MM') // Format as "YYYY-MM" for the month input
  );
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      const [year, month] = monthYear.split('-'); // Extract year and month from the "YYYY-MM" format
      const res = await axios.get(
        `http://localhost:5000/api/admin/payroll?month=${month}&year=${year}`,
        { withCredentials: true }
      );
      setEmployees(res.data.employees);
    } catch (err) {
      console.error('Error fetching payroll status:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayrollData();
  }, [monthYear]);

  const handleStatusChange = async (payrollId, newStatus) => {
    
    try {
      await axios.put(
        `http://localhost:5000/api/admin/payroll/${payrollId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchPayrollData(); // Refresh the table
    } catch (err) {
      console.error('Error updating payroll status:', err);
    }
  };
  const handleMonthYearChange = (e) => setMonthYear(e.target.value);

  const handleGenerateClick = (empId) => {
    navigate(`/admin/generatepayroll/${empId}/${monthYear.split('-')[1]}/${monthYear.split('-')[0]}`);
  };

  return (
    <div className="ad_pl_container">
      <h2 className="ad_pl_title">Payroll List - {monthYear}</h2>

      <div className="ad_pl_filter">
        <label className="ad_pl_label">Select Month & Year: </label>
        <input
          type="month"
          value={monthYear}
          onChange={handleMonthYearChange}
          className="ad_pl_month_input"
        />
      </div>

      {loading ? (
        <p className="ad_pl_loading">Loading...</p>
      ) : (
        <table className="ad_pl_table">
          <thead>
            <tr className="ad_pl_head_row">
              <th className="ad_pl_th">ID</th>
              <th className="ad_pl_th">Name</th>
              <th className="ad_pl_th">Email</th>
              <th className="ad_pl_th">Status</th>
              <th className="ad_pl_th">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="ad_pl_row">
                <td className="ad_pl_td">{emp.id}</td>
                <td className="ad_pl_td ad_pl_name">{emp.name}</td>
                <td className="ad_pl_td">{emp.email}</td>
                <td className="ad_pl_td">
                  {emp.generated ? (
                    <select
                    className="ad_pl_status_select"
                    value={emp.status}
                    onChange={(e) => handleStatusChange(emp.payrollId, e.target.value)}
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                  ) : (
                    <span className="ad_pl_status_text">Not Generated</span>
                  )}
                </td>
                <td className="ad_pl_td">
                  {emp.generated ? (
                    <button
                      className="ad_pl_view_btn"
                      onClick={() => navigate(`/admin/payslip/${emp.payrollId}`)} // Use navigate instead of window.location.href
                    >
                      View
                    </button>
                  ) : (
                    <button
                      className="ad_pl_generate_btn"
                      onClick={() => handleGenerateClick(emp.id)} // Navigate using the new function
                    >
                      Generate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PayrollList;
