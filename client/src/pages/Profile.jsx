import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const body = { name };
      if (password) {
        body.password = password;
      }
      const data = await api.put('/users/profile', body);
      setSuccess('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <h2>My Profile</h2>

      <div className="profile-info">
        <div className="info-item">
          <label>Email</label>
          <span>{user?.email}</span>
        </div>
        <div className="info-item">
          <label>Role</label>
          <span className={`role-badge ${user?.role?.toLowerCase()}`}>{user?.role}</span>
        </div>
        <div className="info-item">
          <label>Status</label>
          <span className={`status-badge ${user?.status?.toLowerCase()}`}>{user?.status}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <h3>Update Profile</h3>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">New Password (leave blank to keep current)</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
