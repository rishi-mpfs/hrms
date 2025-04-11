import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './AdminEmployee.css';
const AdminEmployee = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/department', {
          withCredentials: true,
        });
        setDepartments(res.data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };

    fetchUsers();
    fetchDepartments();
  }, []);
  const createUser = () => {
    navigate('/admin/employee/add');
  }
  const handleRowClick = (id) => {
    navigate(`/admin/employee/${id}`);
  };

  const filteredUsers = users.filter((user) => {
    const matchName = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept ? user.departmentId === parseInt(selectedDept) : true;
    return matchName && matchDept;
  });

  return (
    <div className="ad_ul_container">
  <h1 className="ad_ul_title">User Management</h1>

  <div className="ad_ul_controls">
    <input
      type="text"
      placeholder="Search by name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
      <option value="">All Departments</option>
      {departments.map((dept) => (
        <option key={dept.id} value={dept.id}>
          {dept.name}
        </option>
      ))}
    </select>
    
    <button onClick={()=>createUser()}>CREATE USER</button>
  </div>

  <div className="ad_ul_listcon">
    <table>
      <thead>
        <tr>
          <th>User Name</th>
          <th>User ID</th>
          <th>Department</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((user) => (
          <tr
            key={user.id}
            onClick={() => handleRowClick(user.id)}
            className="clickable-row"
          >
            <td>{user.name}</td>
            <td>{user.id}</td>
            <td>{user.Department?.name || 'N/A'}</td>
          </tr>
        ))}
        {filteredUsers.length === 0 && (
          <tr>
            <td className="ad_ul_empty" colSpan="3">No users found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default AdminEmployee;
