import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminEmployeedetails.css';
import './admin.css';

const AdminEmployeedetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUserAndDepartments = async () => {
      try {
        const [userRes, deptRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/admin/user/${id}`, {
            withCredentials: true
          }),
          axios.get('http://localhost:5000/api/admin/department', {
            withCredentials: true
          })
        ]);
        setUser(userRes.data);
        setDepartments(deptRes.data);
        setFormData(userRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchUserAndDepartments();
  }, [id]);

  const handleEditToggle = () => setIsEditing(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/user/${id}`, formData, {
        withCredentials: true
      });
      setIsEditing(false);
      alert('User updated successfully');
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/user/${id}`, {
          withCredentials: true
        });
        alert('User deleted successfully');
        navigate(-1); // Go back
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="ad_ud_container">
    <h2 className="ad_ud_heading">User Detail</h2>
  
    <div className="ad_ud_actions">
    <button className="ad_ud_edit" onClick={() => navigate(-1)}>Back</button>
      <button className="ad_ud_delete" onClick={handleDelete}>Delete User</button>
      {!isEditing ? (
        <button className="ad_ud_edit" onClick={handleEditToggle}>Edit</button>
        
      ) : (
        <button className="ad_ud_save" onClick={handleSave}>Save</button>
      )}
    </div>
  
    <form className="ad_ud_form">
      <label className="ad_ud_label">Name:
        <input className="ad_ud_input" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} />
      </label>
  
      <label className="ad_ud_label">Email:
        <input className="ad_ud_input" name="email" value={formData.email} disabled />
      </label>
  
      <label className="ad_ud_label">Phone:
        <input className="ad_ud_input" name="phone" value={formData.phone || ''} onChange={handleInputChange} disabled={!isEditing} />
      </label>
  
      <label className="ad_ud_label">Gender:
        <select className="ad_ud_select" name="gender" value={formData.gender || ''} onChange={handleInputChange} disabled={!isEditing}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </label>
  
      <label className="ad_ud_label">DOB:
        <input className="ad_ud_input" type="date" name="dob" value={formData.dob?.slice(0, 10) || ''} onChange={handleInputChange} disabled={!isEditing} />
      </label>
  
      <label className="ad_ud_label">Address:
        <textarea className="ad_ud_textarea" name="address" value={formData.address || ''} onChange={handleInputChange} disabled={!isEditing} />
      </label>
  
      <label className="ad_ud_label">Join Date:
        <input className="ad_ud_input" type="date" name="joinDate" value={formData.joinDate?.slice(0, 10) || ''} onChange={handleInputChange} disabled={!isEditing} />
      </label>
  
      <label className="ad_ud_label">Role:
        <select className="ad_ud_select" name="role" value={formData.role || 'employee'} onChange={handleInputChange} disabled={!isEditing}>
          <option value="employee">Employee</option>
          <option value="hr">HR</option>
          <option value="admin">Admin</option>
        </select>
      </label>
  
      <label className="ad_ud_label">Department:
        <select
          className="ad_ud_select"
          name="departmentId"
          value={formData.departmentId || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
        >
          <option value="">Select</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </label>
    </form>
  </div>
  
  );
};

export default AdminEmployeedetails;
