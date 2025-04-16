import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PayrollInitiatePage.css'; // Include your CSS

const PayrollInitiatePage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [monthYear, setMonthYear] = useState('');
  const [bonus, setBonus] = useState({});
  const [deductions, setDeductions] = useState({});
  const [userSalaries, setUserSalaries] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!monthYear) {
      alert("Please select a month");
      return;
    }

    const [year, month] = monthYear.split('-');

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/admin/payroll/initiate?month=${month}&year=${year}`, {
        withCredentials: true,
      });

      const data = res.data.employees;

      const salaryMap = {};
      data.forEach(emp => {
        if (!emp.generated) {
          salaryMap[emp.userId] = emp.baseSalary || 30000;
        }
      });

      setUserSalaries(salaryMap);
      setEmployees(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching payroll data:', err.message);
      setEmployees([]);
      setLoading(false);
    }
  };

  const handleBulkGenerate = async () => {
    const [year, month] = monthYear.split('-');

    try {
      const ungenerated = employees.filter(emp => !emp.generated);
      if (ungenerated.length === 0) {
        alert('All payrolls already generated!');
        return;
      }

      const bonusesMap = {};
      const deductionsMap = {};
      ungenerated.forEach(emp => {
        bonusesMap[emp.userId] = bonus[emp.userId] || 0;
        deductionsMap[emp.userId] = deductions[emp.userId] || 0;
      });

      await axios.post('http://localhost:5000/api/admin/payroll/bulkgenerate', {
        month,
        year,
        bonuses: bonusesMap,
        deductions: deductionsMap,
      }, {
        withCredentials: true
      });

      alert('Bulk payroll generated!');
      handleFetch();
    } catch (err) {
      console.error('Bulk generate error:', err.message);
      alert('Bulk generation failed');
    }
  };

  const handleGenerate = async (userId) => {
    const [year, month] = monthYear.split('-');

    try {
      await axios.post(`http://localhost:5000/api/admin/payroll/generate`, {
        userId,
        month,
        year,
        bonus: bonus[userId] || 0,
        deductions: deductions[userId] || 0
      }, {
        withCredentials: true
      });

      alert('Payroll generated successfully');
      handleFetch();
    } catch (err) {
      console.error('Generate error:', err.response?.data || err.message);
      alert(`Failed to generate payroll: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleStatusChange = async (payrollId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/payroll/status/${payrollId}`, {
        status: newStatus
      }, {
        withCredentials: true
      });

      alert(`Payroll marked as ${newStatus}`);
      handleFetch();
    } catch (err) {
      console.error('Status update failed:', err.message);
      alert('Failed to update status');
    }
  };

  const downloadPayslip = (id) => {
    navigate(`/admin/payslip/${id}`);
  };

  const calculateNet = (base, bonusVal = 0, deductionVal = 0) => {
    return (parseFloat(base || 0) + parseFloat(bonusVal || 0) - parseFloat(deductionVal || 0)).toFixed(2);
  };

  const ungeneratedCount = employees.filter(emp => !emp.generated).length;

  return (
    <div className="ad_pr_container">
      <h2 className="ad_pr_heading">Payroll Initiate</h2>

      <div className="ad_pr_filter">
        <label className="ad_pr_label">Select Month & Year: </label>
        <input
          type="month"
          value={monthYear}
          onChange={(e) => setMonthYear(e.target.value)}
          className="ad_pr_month_input"
        />
        <button onClick={handleFetch} className="ad_pr_btn_fetch">Load Employees</button>
      </div>

      {loading ? (
        <p className="ad_pr_loading">Loading...</p>
      ) : employees.length === 0 ? (
        <p className="ad_pr_empty">No records found for selected month/year.</p>
      ) : (
        <>
          <table className="ad_pr_table" border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Base Salary</th>
                <th>Bonus</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.userId}>
                  <td>{emp.name}</td>
                  <td>{emp.designation || '-'}</td>
                  <td>{emp.generated ? emp.baseSalary : userSalaries[emp.userId]}</td>
                  <td>
                    {emp.generated ? emp.bonus : (
                      <input
                        className="ad_pr_input"
                        type="number"
                        value={bonus[emp.userId] || 0}
                        onChange={(e) =>
                          setBonus({ ...bonus, [emp.userId]: parseInt(e.target.value) || 0 })
                        }
                      />
                    )}
                  </td>
                  <td>
                    {emp.generated ? emp.deductions : (
                      <input
                        className="ad_pr_input"
                        type="number"
                        value={deductions[emp.userId] || 0}
                        onChange={(e) =>
                          setDeductions({ ...deductions, [emp.userId]: parseInt(e.target.value) || 0 })
                        }
                      />
                    )}
                  </td>
                  <td>
                    {emp.generated
                      ? emp.netSalary
                      : calculateNet(userSalaries[emp.userId], bonus[emp.userId], deductions[emp.userId])
                    }
                  </td>
                  <td>
                    {emp.generated ? (
                      <select
                        className="ad_pr_select"
                        value={emp.status}
                        onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                      </select>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {emp.generated ? (
                      <button className="ad_pr_button" onClick={() => downloadPayslip(emp.id)}>Download Payslip</button>
                    ) : (
                      <button className="ad_pr_button" onClick={() => handleGenerate(emp.userId)}>Generate</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {ungeneratedCount > 1 && (
            <button className="ad_pr_button ad_pr_bulk_generate" onClick={handleBulkGenerate}>
              Generate All
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PayrollInitiatePage;
