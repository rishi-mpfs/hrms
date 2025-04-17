import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './GeneratePayroll.css';

const GeneratePayroll = () => {
  const { userId, month, year } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [payrollData, setPayrollData] = useState({
    specialAllowance: 0,
    mobileAllowance: 0,
    travelAllowance: 0,
    houseAllowance: 0,
    incentive: 0,
    deduction: 0,
    taxDeduction: 0,
    paymentMode: 'bank',
  });
  const [grossPay, setGrossPay] = useState(0);
  const [netPay, setNetPay] = useState(0);
  const [ratePerDay, setRatePerDay] = useState(0);
  const [payDays, setPayDays] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data for ID:', userId);
        const res = await axios.get(`http://localhost:5000/api/admin/payroll/userdetail/${userId}/${month}/${year}`, {
          withCredentials: true,
        });

        console.log('API Response:', res.data);
        if (res.data) {
          setUser(res.data.userDetails);
          console.log(user);
          
          // Fetch payDays from the attendance model or set to default value
          const daysWorked = res.data.userDetails.payDays || 22;  // Default 22 if not available
          setPayDays(daysWorked);
          
          // Assuming base salary is available and ratePerDay is calculated based on it
          const rate = res.data.userDetails.baseSalary / 30;  // Assuming 30 days in a month
          setRatePerDay(rate);
        } else {
          setError('User data not found');
        }
      } catch (err) {
        console.error('Error fetching user details:', err.response?.data || err.message);
        setError('Failed to fetch user details');
      }
    };

    fetchUserData();
  }, [userId, month, year]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayrollData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculatePayroll = () => {
    const {
      specialAllowance,
      mobileAllowance,
      travelAllowance,
      houseAllowance,
      incentive,
      deduction,
      taxDeduction,
    } = payrollData;

    // Calculate gross pay based on available data
    const gross =
      ratePerDay * payDays +
      parseFloat(specialAllowance) +
      parseFloat(mobileAllowance) +
      parseFloat(travelAllowance) +
      parseFloat(houseAllowance) +
      parseFloat(incentive);

    // Calculate net pay
    const net = Math.round(
        gross - parseFloat(deduction) - parseFloat(taxDeduction)
      );

    setGrossPay(gross);
    setNetPay(net);
  };

  const handleGeneratePayroll = async () => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/admin/payroll',
        {
          userId,
          month,
          year,
          accountNumber: user.accountNumber,
          baseSalary: user.baseSalary,
          ratePerDay,
          payDays,
          specialAllowance: payrollData.specialAllowance,
          mobileAllowance: payrollData.mobileAllowance,
          travelAllowance: payrollData.travelAllowance,
          houseAllowance: payrollData.houseAllowance,
          incentive: payrollData.incentive,
          deduction: payrollData.deduction,
          taxDeduction: payrollData.taxDeduction,
          grossPay,
          netPay,
          paymentMode: payrollData.paymentMode,
        },
        { withCredentials: true }
      );

      alert('Payroll generated successfully!');
      navigate(-1);
    } catch (err) {
      console.error('Error generating payroll:', err.response?.data || err.message);
      alert('Failed to generate payroll');
    }
    setLoading(false);
  };

  if (error) return <div className="ad_pg_error">❌ {error}</div>;
  if (!user) return <div className="ad_pg_loading">Loading...</div>;

  return (
    <div className="ad_pg_generate_container">
      <h2 className="ad_pg_title">Generate Payroll for {user.name}</h2>
      <p className="ad_pg_subinfo">
        <strong>Department:</strong> {user.Department?.name || 'N/A'}<br />
        <strong>Designation:</strong> {user.designation}<br />
        <strong>Account Number:</strong> {user.accountNumber}<br />
        <strong>Base Salary:</strong> ₹{user.baseSalary}<br />
        <strong>Pay Rate (per day):</strong> ₹{ratePerDay.toFixed(2)}<br />
        <strong>Working Days (Pay Days):</strong> {payDays}
      </p>

      <div className="ad_pg_form">
        {[ 
          'specialAllowance', 'mobileAllowance', 'travelAllowance', 'houseAllowance', 
          'incentive', 'deduction', 'taxDeduction'
        ].map((field) => (
          <React.Fragment key={field}>
            <label className="ad_pg_label">
              {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
            </label>
            <input
              type="number"
              name={field}
              value={payrollData[field]}
              onChange={handleInputChange}
              className="ad_pg_input"
            />
          </React.Fragment>
        ))}

        <label className="ad_pg_label">Payment Mode</label>
        <select
          name="paymentMode"
          value={payrollData.paymentMode}
          onChange={handleInputChange}
          className="ad_pg_input"
        >
          <option value="bank">Bank</option>
          <option value="cash">Cash</option>
        </select>

        <button className="ad_pg_calculate_btn" onClick={calculatePayroll}>
          Calculate Payroll
        </button>

        {grossPay > 0 && netPay > 0 && (
          <div className="ad_pg_payroll_summary">
            <p>Gross Pay: ₹{grossPay.toFixed(2)}</p>
            <p>Net Pay: ₹{netPay.toFixed(2)}</p>
          </div>
        )}

        <button
          className="ad_pg_generate_btn"
          onClick={handleGeneratePayroll}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Payroll'}
        </button>
      </div>

      <button className="ad_pg_back_btn" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default GeneratePayroll;
