import { useState, useEffect } from 'react';
import api from '../services/api';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Viewer',
    status: 'Active'
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/users');
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingUser) {
        const body = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status
        };
        if (formData.password) {
          body.password = formData.password;
        }
        await api.put(`/users/${editingUser._id}`, body);
      } else {
        await api.post('/users', formData);
      }
      resetForm();
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', role: 'Viewer', status: 'Active' });
    setShowForm(false);
    setEditingUser(null);
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status
    });
    setShowForm(true);
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/users/${id}/status`, {});
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="users-section">
      <div className="users-header">
        <h2>Users</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          Add User
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="user-form">
          <h3>{editingUser ? 'Edit User' : 'Create User'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>{editingUser ? 'New Password (leave blank to keep current)' : 'Password'}</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} required={!editingUser} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleInputChange}>
                <option value="Viewer">Viewer</option>
                <option value="Analyst">Analyst</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingUser ? 'Update User' : 'Create User'}
            </button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="loading">Loading users...</p>
      ) : (
        <div className="users-table">
          <div className="user-row header">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {users.map((user) => (
            <div key={user._id} className="user-row">
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
              <span className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</span>
              <span className="actions-cell">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => openEditForm(user)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => toggleStatus(user._id)}
                >
                  {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
