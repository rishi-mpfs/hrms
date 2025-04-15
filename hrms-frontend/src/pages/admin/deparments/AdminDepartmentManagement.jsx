import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './AdminDepartment.css'; // make sure this path matches your folder structure
import './AdminDepartmentManagement.css';
const AdminDepartmentManagement  = () => {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState({ name: '' });
  const [editingDept, setEditingDept] = useState(null);

  // Fetch departments with employee count
  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/department', {
        withCredentials: true,
      });
      setDepartments(res.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Create new department
  const handleCreate = async () => {
    try {
      if (!newDept.name.trim()) return;
      await axios.post('http://localhost:5000/api/admin/department', newDept, {
        withCredentials: true,
      });
      setNewDept({ name: '' });
      fetchDepartments();
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  // Edit department
  const handleEdit = (dept) => {
    setEditingDept({ ...dept });
  };

  // Update department
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/department/${editingDept.id}`, editingDept, {
        withCredentials: true,
      });
      setEditingDept(null);
      fetchDepartments();
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  // Delete department
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/department/${id}`, {
        withCredentials: true,
      });
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  return (
    <div className="ad_dm_container">
      <h2 className="ad_dm_heading">Department Management</h2>

      <div className="ad_dm_form">
        <input
          type="text"
          className="ad_dm_input"
          placeholder="Department Name"
          value={newDept.name}
          onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
        />
        <button className="ad_dm_button" onClick={handleCreate}>
          Add
        </button>
      </div>

      <table className="ad_dm_table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Employee Count</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) =>
            editingDept?.id === dept.id ? (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>
                  <input
                    className="ad_dm_edit_input"
                    value={editingDept.name}
                    onChange={(e) =>
                      setEditingDept({ ...editingDept, name: e.target.value })
                    }
                  />
                </td>
                <td>{dept.employeeCount}</td>
                <td>{new Date(dept.createdAt).toLocaleDateString()}</td>
                <td className="ad_dm_action_buttons">
                  <button className="ad_dm_button" onClick={handleUpdate}>
                    Save
                  </button>
                  <button
                    className="ad_dm_button"
                    onClick={() => setEditingDept(null)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>{dept.name}</td>
                <td>{dept.employeeCount}</td>
                <td>{new Date(dept.createdAt).toLocaleDateString()}</td>
                <td className="ad_dm_action_buttons">
                  <button className="ad_dm_button" onClick={() => handleEdit(dept)}>
                    Edit
                  </button>
                  <button className="ad_dm_button" onClick={() => handleDelete(dept.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDepartmentManagement ;
