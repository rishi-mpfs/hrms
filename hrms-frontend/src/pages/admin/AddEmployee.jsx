import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminEmployeedetails.css';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    designation: '',
    joinDate: '',
    salary: '',
    profileImage: '',
    status: 'active',
    role: 'employee',
    accountNumber: '',
    departmentId: ''
  });

  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/department', {
          withCredentials: true
        });
        setDepartments(res.data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/user', formData, {
        withCredentials: true
      });
      alert('User created successfully!');
      navigate('/admin/employees');
    } catch (err) {
      console.error('Error creating user:', err);
      alert('Failed to create user');
    }
  };

  return (
    <div className="ad_ud_container">
      <h2 className="ad_ud_heading">Create New User</h2>
      <div className="ad_ud_actions">
        <button className="ad_ud_edit" onClick={() => navigate(-1)}>Back</button>
      </div>
      <form className="ad_ud_form" onSubmit={handleSubmit}>
        <label className="ad_ud_label">Name:
          <input className="ad_ud_input" name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label className="ad_ud_label">Email:
          <input className="ad_ud_input" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label className="ad_ud_label">Password:
          <input className="ad_ud_input" name="password" type="password" value={formData.password} onChange={handleChange} required />
        </label>

        <label className="ad_ud_label">Phone:
          <input className="ad_ud_input" name="phone" value={formData.phone} onChange={handleChange} />
        </label>

        <label className="ad_ud_label">Gender:
          <select className="ad_ud_select" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="ad_ud_label">DOB:
          <input className="ad_ud_input" type="date" name="dob" value={formData.dob} onChange={handleChange} />
        </label>

        <label className="ad_ud_label">Address:
          <textarea className="ad_ud_textarea" name="address" value={formData.address} onChange={handleChange} />
        </label>

        <label className="ad_ud_label">Designation:
          <input className="ad_ud_input" name="designation" value={formData.designation} onChange={handleChange} />
        </label>

        <label className="ad_ud_label">Join Date:
          <input className="ad_ud_input" type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} />
        </label>

        <label className="ad_ud_label">Salary:
          <input className="ad_ud_input" type="number" name="salary" value={formData.salary} onChange={handleChange} />
        </label>

        <label className="ad_ud_label">Profile Image (URL):
          <input className="ad_ud_input" name="profileImage" value={formData.profileImage} onChange={handleChange} />
        </label>

        <label className="ad_ud_label">Status:
          <select className="ad_ud_select" name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <label className="ad_ud_label">Role:
          <select className="ad_ud_select" name="role" value={formData.role} onChange={handleChange}>
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label className="ad_ud_label">Account Number:
          <input className="ad_ud_input" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
        </label>

        <label className="ad_ud_label">Department:
          <select className="ad_ud_select" name="departmentId" value={formData.departmentId} onChange={handleChange} required>
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </label>

        <div className="ad_ud_actions">
          <button type="submit" className="ad_ud_save">Create</button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
