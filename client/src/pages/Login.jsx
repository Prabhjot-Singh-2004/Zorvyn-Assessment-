import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        const data = await api.post('/auth/signup', { name, email, password }, false);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.reload();
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Zorvyn Fintech</h1>
        <p className="login-subtitle">
          {isSignup ? 'Create your account' : 'Sign in to your dashboard'}
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {isSignup && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (isSignup ? 'Creating account...' : 'Signing in...') : (isSignup ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <p className="toggle-text">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button className="link-btn" onClick={toggleMode}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        {!isSignup && (
          <div className="demo-accounts">
            <p><strong>Demo Accounts:</strong></p>
            <p>admin@zorvyn.com / admin123</p>
            <p>analyst@zorvyn.com / analyst123</p>
            <p>viewer@zorvyn.com / viewer123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
