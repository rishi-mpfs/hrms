import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const PayslipPage = () => {
  const { id } = useParams(); // payroll ID
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/payslip/${id}`, {
          withCredentials: true,
        });
        setPayslip(res.data.payslip);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch payslip:', err);
        setLoading(false);
      }
    };

    fetchPayslip();
  }, [id]);

  const handleDownload = () => {
    const element = document.getElementById('payslip-container');
    html2pdf().from(element).save(`Payslip-${payslip?.employeeName}.pdf`);
  };

  if (loading) return <p>Loading payslip...</p>;
  if (!payslip) return <p>Payslip not found.</p>;

  return (
    <div>
      <div id="payslip-container" style={{ padding: '20px', border: '1px solid #ccc', width: '600px', margin: 'auto' }}>
        <h2>Payslip</h2>
        <p><strong>Name:</strong> {payslip.employeeName}</p>
        <p><strong>Email:</strong> {payslip.email}</p>
        <p><strong>Phone:</strong> {payslip.phone}</p>
        <p><strong>Account Number:</strong> {payslip.accountNumber}</p>
        <p><strong>Designation:</strong> {payslip.designation}</p>
        <p><strong>Month:</strong> {payslip.month}</p>
        <p><strong>Year:</strong> {payslip.year}</p>
        <p><strong>Base Salary:</strong> ₹{payslip.salary}</p>
        <p><strong>Bonus:</strong> ₹{payslip.bonus}</p>
        <p><strong>Deductions:</strong> ₹{payslip.deductions}</p>
        <p><strong>Net Pay:</strong> ₹{payslip.netPay}</p>
        <p><strong>Status:</strong> {payslip.status}</p>
        <p><strong>Generated At:</strong> {new Date(payslip.generatedAt).toLocaleString()}</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={handleDownload}>Download as PDF</button>
      </div>
    </div>
  );
};

export default PayslipPage;
