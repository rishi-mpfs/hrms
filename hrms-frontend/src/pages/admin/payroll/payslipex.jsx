[12:02, 17/4/2025] Rish...sh:     try {
      setLoading(true);
      const re…
[13:43, 17/4/2025] Rish...sh: import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import './PayslipPage.css';
import logo from './../../../assets/logo.png';


const PayslipPage = () => {
  const { id } = useParams();
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        const res = await axios.get(http://localhost:5000/api/admin/payslip/${id}, {
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
    html2pdf().from(element).save(Payslip-${payslip?.employeeName}.pdf);
  };

  if (loading) return <p>Loading payslip...</p>;
  if (!payslip) return <p>Payslip not found.</p>;

  return (
    <div className="ad_ps_page">
      <div id="payslip-container" className="ad_ps_container">

      <div class="ad_ps_header">
      <img src={logo} class="ad_ps_logo" />
      <div class="ad_ps_title">MP Investment and Financial Services</div>
      <div>No 1/269, Kalamegam Salai,Mugappair West, Chennai - 600037</div>
      <div>Pay Slip for the Month of <strong>March 2025</strong></div>
    </div>
    <div class="ad_ps_detailsection ad_ps_section">
      {/* <div className="ad_ps_left_con">
        <table>
          <tr>
            <th>Emplyee code</th><td>:23</td>
          </tr>
          <tr>
            <th>Emplyee Name</th><td>:23</td>
          </tr>
          <tr>
            <th>DOB</th><td>:23</td>
          </tr>
          <tr>
            <th>DOJ</th><td>:23</td>
          </tr>
        </table>
      </div>
      <div className="ad_ps_left_con">
        <table>
          <tr>
            <th>Emplyee code</th><td>:23</td>
          </tr>
          <tr>
            <th>Emplyee Name</th><td>:23</td>
          </tr>
          <tr>
            <th>DOB</th><td>:23</td>
          </tr>
          <tr>
            <th>DOJ</th><td>:23</td>
          </tr>
        </table>
      </div>
      <div className="ad_ps_left_con">
        <table>
          <tr>
            <th>Emplyee code</th><td>:23</td>
          </tr>
          <tr>
            <th>Emplyee Name</th><td>:23</td>
          </tr>
          <tr>
            <th>DOB</th><td>:23</td>
          </tr>
          <tr>
            <th>DOJ</th><td>:23</td>
          </tr>
        </table>
      </div> */}

      <table class="ad_ps_table ap_ps_detail">
        <tr width>
          <td>Name</td><td>: {payslip.employeeName}</td>
          <td >Bank/MICR</td><td>: XXXX9999</td>
        </tr>
        <tr>
          <td >Employee ID</td><td>: {payslip.employeeId || '123456'}</td>
          <td>Bank A/c No.</td><td>: {payslip.accountNumber}</td>
        </tr>
        <tr>
          <td>Desination</td><td>: {payslip.designation}</td>
          <td>Cost Center</td><td>: 001</td>
        </tr>
        <tr>
          <td>DOB</td><td>: 01-Jan-1990</td>
          <td>PAN</td><td>: AAAAA0000A</td>
        </tr>
        <tr>
          <td>DOJ</td><td>: 01-Jan-2020</td>
          <td>PF UAN</td><td>: 100000000000</td>
        </tr>
      </table>
    </div>

    <div class="ad_ps_section">
      <table class="ad_ps_table ap_ps_ed">
        <thead>
            <tr>
                <th colspan="5">Earnings</th>
                <th colspan="2">Deductions</th>
            </tr>
        </thead>
        <thead class="ad_ps_gray">
          <tr>
            <th>Description</th><th>Rate</th><th>Monthly</th><th>Arrear</th><th>Total</th>
            <th>Description</th><th>Amount</th>
          </tr>
        </thead>
        <tr>
          <td>Basic salery</td><td className='ps_price'>11160</td><td className='ps_price'>0</td><td className='ps_price'>0</td><td className='ps_price'>0</td><td>Income Tax</td><td className='ps_price'>171233.00</td>
        </tr>
        <tr>
          <td>House allowence</td><td className='ps_price'>5600</td><td className='ps_price'>0</td><td className='ps_price'>0</td><td className='ps_price'>0</td><td></td><td></td>
        </tr>
        <tr>
          <td>Monthly threshold pay</td><td className='ps_price'>22300</td><td className='ps_price'>0</td><td className='ps_price'>0</td><td className='ps_price'>0</td><td></td><td></td>
        </tr>
        <tr>
          <td>convenience</td><td className='ps_price'>22300</td><td className='ps_price'>0</td><td className='ps_price'>0</td><td className='ps_price'>0</td><td></td><td></td>
        </tr>
        <tr>
            <td>spacial allowance</td><td className='ps_price'>22300</td><td className='ps_price'>0</td><td className='ps_price'>0</td><td className='ps_price'>0</td><td className='ps_price'></td><td className='ps_price'></td>
        </tr>
        <tr>
            <td>Traval  allowance</td><td className='ps_price'>22300</td><td className='ps_price'>0</td><td className='ps_price'>0</td><td className='ps_price'>0</td><td className='ps_price'></td><td className='ps_price'></td>
        </tr>

        <tr className="ad_ps_gray ad_ps_bold">
          <td colspan="4">Gross Earning: </td>
          <td className='ps_price'>₹ 50218.00</td>
          <td colspan="">Gross Deduction</td><td className='ps_price'>₹ 171233.00</td>
        </tr>
        
      

       
      </table>
      <table className='ad_ps_ctb'>
      <tr className="ad_ps_bold">
          <td className="ad_ps_center">Net Pay : ₹ 378985.00 (THREE LAKHS SEVENTY EIGHT THOUSAND NINE HUNDRED EIGHTY FIVE ONLY)</td>
        </tr>
        <tr className="ad_ps_bold">
          <td className="ad_ps_center">Income tax work sheet for  {payslip.month}-{payslip.year}</td>
        </tr>
      </table>
      {/* <table width="100%" className='ad_ps_nestable'>
        <tr>
          <td width="60%" valign="top">
            <table border="1" width="100%" className='ad_ps_nestable'>
              <tr className="lasttd"><th colSpan={6}>Earnings</th></tr>
              <tr className='lasttd'><th>Description</th><th>Rate</th><th>Monthly</th><th>Arrear</th><th>Total</th></tr>
              <tr className="lasttd"><td>Basic salery</td><td className="ps_price">12000</td><td className="ps_price">0</td><td className="ps_price">0</td><td className="ps_price">12000</td></tr>
              <tr className="lasttd"><td>House allowence</td><td className="ps_price">12000</td><td className="ps_price">0</td><td className="ps_price">0</td><td className="ps_price">12000</td></tr>
              <tr className="lasttd"><td>Monthly threshold pay</td><td className="ps_price">12000</td><td className="ps_price">0</td><td className="ps_price">0</td><td className="ps_price">12000</td></tr>
              <tr className="lasttd"><td>convenience</td><td className="ps_price">12000</td><td className="ps_price">0</td><td className="ps_price">0</td><td className="ps_price">12000</td></tr>
              <tr className="lasttd"><td>spacial allowance</td><td className="ps_price">12000</td><td className="ps_price">0</td><td className="ps_price">0</td><td className="ps_price">12000</td></tr>
              <tr className="lasttd"><td>Mobile allowance</td><td className="ps_price">12000</td><td className="ps_price">0</td><td className="ps_price">0</td><td className="ps_price">12000</td></tr>
              <tr className="lasttd"><td>Traval allowance</td><td className="ps_price">12000</td><td className="ps_price">0</td><td className="ps_price">0</td><td className="ps_price">12000</td></tr>
              <tr className="lasttd"><td><strong>Gross Earning:</strong></td><td className="ps_price"><strong>12000</strong></td><td className="ps_price"><strong>12000</strong></td><td className="ps_price"><strong>12000</strong></td><td className="ps_price"><strong>12000</strong></td></tr>
              
              
            </table>
          </td>
          <td width="40%" valign="top" height="100%">
            <table border="1" width="100%" className='ad_ps_nestable'>
              <tr className="lasttd"><th colSpan={2}>Deductions</th></tr>
              <tr className="lasttd"><th>Description</th><th>Amount</th></tr>
              <tr className="lasttd"><td>Tax deduction</td><td className="ps_price">2333</td></tr>
            </table>
          </td>
        </tr>
      </table> */}

      <table border="1" width="100%" className='ad_ps_nestable'>
        <tr>
          {/* <!-- Left Column --> */}
          <td width="33%" valign="top">
            <table border="1" width="100%" className='ad_ps_nestable'>
              <tr className='lasttd'><th>Description</th><th>Gross</th><th>Exempt</th><th>Taxable</th></tr>
              <tr className='lasttd'><td>Incentive</td><td className='ps_price'>3456576.00</td><td className='ps_price'>0.00</td><td className='ps_price'>3456576.00</td></tr>
              {/* <!-- More rows if needed --> */}
            </table>
            <table border="1" width="100%" className='ad_ps_nestable'>
              <tr className='lasttd'><th colSpan={4}>Deduction</th></tr>
              <tr className='lasttd'><td>Incentive</td><td className='ps_price'>3456576.00</td></tr>
              <tr className='lasttd'><td>Incentive</td><td className='ps_price'>345</td></tr>
              <tr className='lasttd'><td>Incentive</td><td className='ps_price'>345</td></tr>
              <tr className='lasttd'><td>Incentive</td><td className='ps_price'>345</td></tr>
              <tr className='lasttd'><td>Incentive</td><td className='ps_price'>345</td></tr>
              <tr className='lasttd'><td>Incentive</td><td className='ps_price'>345</td></tr>
              <tr className='lasttd'><td>Incentive</td><td className='ps_price'>345</td></tr>
              <tr className='lasttd'><td>Incentive</td><td className='ps_price'>345</td></tr>
              <tr className='lasttd'><td>Incentive</td><td className='ps_price'>345</td></tr>

              {/* <!-- More rows if needed --> */}
            </table>
          </td>
      
         
          <td width="34%" valign="top" >
            
            <table border="1" width="100%" className='ad_ps_nestable'>
              <tr  className='lasttd'><th colSpan={2}>Deduction under chapter vi-A</th></tr>
              <tr  className='lasttd'><td>Standard Deduction</td><td className='ps_price'>75000.00</td></tr>
              <tr  className='lasttd'><td>Professional Tax</td><td className='ps_price'>0.00</td></tr>
              {/* <!-- Add more deduction rows -- */}
            </table>
            <p><strong>Tax Deduction for this month:</strong> 171233.00</p>
          </td>
      
        
          <td width="33%" valign="top">
            
            <table border="1" width="100%" className='ad_ps_nestable'>
              <tr className='lasttd'><th colSpan={2}>Taxable HRA Calculation</th></tr>
              <tr className='lasttd'><td>Rent Paid</td><td className='ps_price'>0.00</td></tr>
              <tr className='lasttd'><td><strong>Taxable HRA</strong></td><td className='ps_price'>0.00</td></tr>
            </table>
            
           
            
            
            <table border="1" width="100%" className='ad_ps_nestable'>
              <tr className='lasttd'><th colSpan={2}>TDS Deducted Monthly</th></tr>
              <tr className='lasttd'><th>Month</th><th>Amount</th></tr>
              <tr className='lasttd'><td>April-2024</td><td className='ps_price'>86796.00</td></tr>
              <tr className='lasttd'><td>April-2024</td><td className='ps_price'>86796.00</td></tr>
              <tr className='lasttd'><td>April-2024</td><td className='ps_price'>86796.00</td></tr>
              <tr className='lasttd'><td>April-2024</td><td className='ps_price'>86796.00</td></tr>
              <tr className='lasttd'><td>April-2024</td><td className='ps_price'>86796.00</td></tr>
              <tr className='lasttd'><td>April-2024</td><td className='ps_price'>86796.00</td></tr>
              <tr className='lasttd'><td>April-2024</td><td className='ps_price'>86796.00</td></tr>
              <tr className='lasttd'><td><strong>Total</strong></td><td className='ps_price'>732652.00</td></tr>
            </table>
          </td>
        </tr>
      </table>


      {/* <table class="ad_ps_table">
        <thead class="ad_ps_gray">
            <tr>
            <th>Description</th>
            <th>gross</th>
            <th>Exempt</th>
            <th>texable</th>
            <th colspan="2"> Deduction under chapter vi-A</th>
            <th colspan="2">taxable HRA Calculation</th>
        </tr>
        </thead>
        <tbody>
            <tr>
                <td class="">incentive</td>
                <td>000</td>
                <td>0.00</td>
                <td>34444</td>
                <td rowspan="4">Investment
                    
                </td>
                <td rowspan="4">4566</td>
                <td rowspan="4">Taxable HRA Calculation</td>
                <td rowspan="4">4566</td>
            </tr>
            <tr>
                <td>gross</td>
                <td>4342</td>
                <td>0.4</td>
                <td>232323</td>
            </tr>
            <tr>
                <td colspan="4">deduction</td>
            </tr>
            <tr>
                <td colspan="3">jsdfjjwj w</td>
                <td></td>
             
            </tr>
            <tr>
                <td colspan="3">jsdfjjwj w</td>
                <td></td>
             
            </tr>
            <tr>
                <td colspan="3">jsdfjjwj w</td>
                <td ></td>
             
            </tr>
        </tbody>
      </table> */}
    </div>










{/* 
        <div className="ad_ps_logo">STAR LOGO</div>

        <h2 className="ad_ps_title">Payslip</h2>

        <div className="ad_ps_info">
          <p><strong>Serial:</strong> {payslip.serial || 'PS-XXXX'}</p>
          <p><strong>Pay Date:</strong> {new Date(payslip.generatedAt).toLocaleDateString()}</p>
          <p><strong>Pay Period:</strong> {payslip.month} {payslip.year}</p>
        </div>

        <div className="ad_ps_header">
          <div className="ad_ps_employee">
            <h4>{payslip.employeeName}</h4>
            <p>Employee ID: {payslip.employeeId || '123456'}</p>
            <p>Email: {payslip.email}</p>
            <p>Position: {payslip.designation}</p>
            <p>Account Number: {payslip.accountNumber}</p>
            <p>Phone: {payslip.phone}</p>
          </div>

          <div className="ad_ps_company">
            <h4>MP Investment and Financial Services</h4>
            <p>No 1/269, Kalamegam Salai</p>
            <p>Mugappair West, Chennai - 600037</p>
            <p>Tamilnadu - India</p>
            <p>info@moneyprotect.in</p>
            <p>044 - 43515522</p>
          </div>
        </div>

        <div className="ad_ps_payment_mode">
          <strong>Payment Details:</strong>
          <p>Bank Transfer</p>
        </div>

        <table className="ad_ps_table">
          <thead>
            <tr>
              <th>Earnings</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
         
        </table>

        <div className="ad_ps_summary">
          <p><strong>Current Gross Pay:</strong> ₹{payslip.salary}</p>
          <p><strong>Current Net Pay:</strong> ₹{payslip.netPay}</p>
          <p><strong>YTD Gross Total Pay:</strong> ₹{payslip.salary * 2}</p>
          <p><strong>YTD Net Total Pay:</strong> ₹{payslip.netPay * 2}</p>
        </div>*/}
      </div> 

      <div className="ad_ps_download_btn">
        <button onClick={handleDownload}>Download as PDF</button>
      </div>
    </div>
  );
};

export default PayslipPage;