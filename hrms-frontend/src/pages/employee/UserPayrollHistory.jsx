import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './user.css';
const UserPayrollHistory = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [payrolls, setPayrolls] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchPayrollHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/payroll`,
            { withCredentials: true }
        );
        setPayrolls(res.data.payrollHistory);
        setUser(res.data.user);
      } catch (err) {
        console.error('Error fetching payroll history', err);
      }
    };

    fetchPayrollHistory();
  }, [userId]);

  const handleDownload = (payrollId) => {
    navigate(`/employee/payslip/${payrollId}`);
  };

  return (
    <div className="us_pl_container">
      <h2 className="us_pl_heading">Payroll History for {user.name}</h2>
      <table className="us_pl_table">
        <thead>
          <tr className="us_pl_table_header">
            <th className="us_pl_th">Month</th>
            <th className="us_pl_th">Year</th>
            <th className="us_pl_th">Payroll ID</th>
            <th className="us_pl_th">Status</th>
            <th className="us_pl_th">Payslip</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.length === 0 ? (
            <tr className="us_pl_row">
              <td className="us_pl_td" colSpan="5">No payrolls found.</td>
            </tr>
          ) : (
            payrolls.map(({ payrollId, month, year, status }) => (
              <tr key={payrollId} className="us_pl_row">
                <td className="us_pl_td">{month}</td>
                <td className="us_pl_td">{year}</td>
                <td className="us_pl_td">{payrollId}</td>
                <td className="us_pl_td">{status}</td>
                <td className="us_pl_td">
                  <button
                    className="us_pl_btn"
                    onClick={() => handleDownload(payrollId)}
                  >
                    Download Payslip
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserPayrollHistory;
