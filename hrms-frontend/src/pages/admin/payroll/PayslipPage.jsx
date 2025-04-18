import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import inWords from "./../../../utils/numberToWords";
import html2pdf from "html2pdf.js";
import logo from "./../../../assets/logo.png";
import "./PayslipPage.css";

const PayslipPage = () => {
  const { id } = useParams();
  const [payslipData, setPayslipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/payslip/${id}`, {
          withCredentials: true,
        });
        setPayslipData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching payslip:", err);
        setLoading(false);
      }
    };

    fetchPayslip();
  }, [id]);

  const handleDownload = () => {
    const element = document.getElementById("payslip-container");
    html2pdf().from(element).save(`Payslip-${payslipData?.user?.name}.pdf`);
  };
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <p>Loading payslip...</p>;
  if (!payslipData) return <p>Payslip not found.</p>;

  const { user, payroll } = payslipData;

  const generateTDSMonths = () => {
    const currentDate = new Date(payroll.year, payroll.month - 1); // use payroll month
    const months = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      months.push(`${monthName} - ${year}`);
    }

    return months.reverse(); // optional: to show from Jan to Dec
  };

  return (
    <div className="ad_ps_page">
      <div id="payslip-container" className="ad_ps_container">
        <div className="ad_ps_header">
          <img src={logo} alt="Company Logo" className="ad_ps_logo" />
          <div className="ad_ps_title">
            MP Investment and Financial Services
          </div>
          <div>No 1/269, Kalamegam Salai, Mugappair West, Chennai - 600037</div>
          <div>
            Pay Slip for the Month of{" "}
            <strong>
              {new Date(payroll.year, payroll.month - 1).toLocaleString(
                "default",
                { month: "long" }
              )}{" "}
              {payroll.year}
            </strong>
          </div>
        </div>

        <div className="ad_ps_detailsection ad_ps_section">
          <table className="ad_ps_table ap_ps_detail">
            <tbody>
              <tr>
                <td>Name</td>
                <td>: {user.name}</td>
                <td>Department</td>
                <td>: {user.department}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>: {user.email}</td>
                <td>Designation</td>
                <td>: {user.designation}</td>
              </tr>
              <tr>
                <td>Account Number</td>
                <td>: {user.accountNumber}</td>
                <td>Payment Mode</td>
                <td>: {payroll.paymentMode}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>: {payroll.status}</td>
                <td>Pay Days</td>
                <td>: {payroll.payDays}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="ad_ps_section">
          <table className="ad_ps_table ap_ps_ed">
            <thead>
              <tr>
                <th colSpan="5">Earnings</th>
                <th colSpan="2">Deductions</th>
              </tr>
              <tr className="ad_ps_gray">
                <th>Description</th>
                <th>Rate</th>
                <th>Monthly</th>
                <th>Arrear</th>
                <th>Total</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Base Salary</td>
                <td className="ps_price">{payroll.ratePerDay}</td>
                <td className="ps_price">{payroll.baseSalary}</td>
                <td className="ps_price">-</td>
                <td className="ps_price">
                  {payroll.ratePerDay * payroll.payDays}
                </td>
                <td>Deduction</td>
                <td className="ps_price">{payroll.deduction}</td>
              </tr>
              <tr>
                <td>Special Allowance</td>
                <td className="ps_price">-</td>
                <td className="ps_price">{payroll.specialAllowance}</td>
                <td className="ps_price">-</td>
                <td className="ps_price">{payroll.specialAllowance}</td>
                <td>Tax Deduction</td>
                <td className="ps_price">{payroll.taxDeduction}</td>
              </tr>
              <tr>
                <td>Mobile Allowance</td>
                <td className="ps_price">-</td>
                <td className="ps_price">{payroll.mobileAllowance}</td>
                <td className="ps_price">-</td>
                <td className="ps_price">{payroll.mobileAllowance}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Travel Allowance</td>
                <td className="ps_price">-</td>
                <td className="ps_price">{payroll.travelAllowance}</td>
                <td className="ps_price">-</td>
                <td className="ps_price">{payroll.travelAllowance}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>House Allowance</td>
                <td className="ps_price">-</td>
                <td className="ps_price">{payroll.houseAllowance}</td>
                <td className="ps_price">-</td>
                <td className="ps_price">{payroll.houseAllowance}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Incentive</td>
                <td className="ps_price">-</td>
                <td className="ps_price">{payroll.incentive}</td>
                <td className="ps_price">-</td>
                <td className="ps_price">{payroll.incentive}</td>
                <td></td>
                <td></td>
              </tr>

              <tr className="ad_ps_gray ad_ps_bold">
                <td colSpan="4">Gross Earnings:</td>
                <td className="ps_price">₹ {payroll.grossPay}</td>
                <td>Gross Deductions</td>
                <td className="ps_price">
                  ₹ {payroll.deduction + payroll.taxDeduction}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="ad_ps_ctb">
            <tbody>
              <tr className="ad_ps_bold">
                <td className="ad_ps_center">
                  Net Pay : ₹ {payroll.netPay}
                  <br />
                  <span>(In words: {inWords(payroll.netPay)} Rupees Only)</span>
                </td>
              </tr>
              <tr className="ad_ps_bold">
                <td className="ad_ps_center">
                  Income tax worksheet for{" "}
                  {new Date(payroll.year, payroll.month - 1).toLocaleString(
                    "default",
                    { month: "long" }
                  )}{" "}
                  - {payroll.year}
                  <br />* You have opted for new income tax regime
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <table border="1" width="100%" className="ad_ps_nestable">
          <tr>
            <td width="40%" valign="top">
              <table border="1" width="100%" className="ad_ps_nestable">
              <tbody>
                <tr className="lasttd">
                  <th>Description</th>
                  <th>Gross</th>
                  <th>Exempt</th>
                  <th>Taxable</th>
                </tr>
                <tr className="lasttd">
                  <td>Incentive</td>
                  <td className="ps_price">0.00</td>
                  <td className="ps_price">0.00</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <th colSpan={4}>Deduction</th>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Standard Deduction</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Previous Employer Taxable Income</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Previous Employer Professional Tax</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Professional Tax</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Under Chapter VI-A</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Any Other Income</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Taxable Income</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Total Tax</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Tax Rebate u/s 87A</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Surcharge</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Tax Due</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Health and Education Cess</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>
                    <strong>Net Tax</strong>
                  </td>
                  <td className="ps_price">
                    <strong>0.00</strong>
                  </td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Tax Deducted (Previous Employer)</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Tax Deducted on Perq.</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Tax Deducted on Any Other Income</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>
                    <strong>Tax Deducted Till Date</strong>
                  </td>
                  <td className="ps_price">
                    <strong>0.00</strong>
                  </td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Tax to be Deducted</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Tax/Month</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>Tax on Non-Recurring Earnings</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td colSpan={3}>
                    <strong>Tax Deduction for this month</strong>
                  </td>
                  <td className="ps_price">
                    <strong>0.00</strong>
                  </td>
                </tr>
                </tbody>
              </table>
            </td>

            <td width="28%" valign="top" className="vi4con">
              <table border="1" width="100%" className="ad_ps_nestable">
                <tr className="lasttd">
                  <th colSpan={2}>Deduction under chapter vi-A</th>
                </tr>
                <tr className="lasttd">
                  <td>Standard Deduction</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td>Professional Tax</td>
                  <td className="ps_price">0.00</td>
                </tr>
              </table>
              <p className="vi4p">
                <strong>Tax Deduction for this month:</strong> 0.00
              </p>
            </td>

            <td width="32%" valign="top">
              <table border="1" width="100%" className="ad_ps_nestable">
                <tr className="lasttd">
                  <th colSpan={2}>Taxable HRA Calculation</th>
                </tr>
                <tr className="lasttd">
                  <td>Rent Paid</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td>From </td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td>To</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td>1. Actual HRA</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td>2. 40% or 50% of Basic</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td>3. Rent - 10% Basic</td>
                  <td className="ps_price">0.00</td>
                </tr>
                <tr className="lasttd">
                  <td>Least of above is exempt</td>
                  <td className="ps_price">0.00</td>
                </tr>

                <tr className="lasttd">
                  <td>
                    <strong>Taxable HRA</strong>
                  </td>
                  <td className="ps_price">0.00</td>
                </tr>
              </table>

              <table border="1" width="100%" className="ad_ps_nestable">
                <tr className="lasttd">
                  <th colSpan={2}>TDS Deducted Monthly</th>
                </tr>
                <tr className="lasttd">
                  <th>Month</th>
                  <th>Amount</th>
                </tr>
                {generateTDSMonths().map((month, index) => (
                  <tr key={index} className="lasttd">
                    <td>{month}</td>
                    <td className="ps_price">0.00</td>
                  </tr>
                ))}
                <tr className="lasttd">
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td className="ps_price">0.00</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div className="ad_ps_foottext">
          Personal Note: This is a system generated payslip, does not require
          any signature.
        </div>
      </div>
      <div className="ad_ps_download_btncon">
        <button className="ad_ps_download_btn" onClick={handleDownload}>
          Download PDF
        </button>
        <button className="ad_ps_download_btn" onClick={handleBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default PayslipPage;
