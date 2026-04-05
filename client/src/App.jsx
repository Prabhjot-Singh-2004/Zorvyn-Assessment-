import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Users from './pages/Users';
import Profile from './pages/Profile';
import './App.css';

const App = () => {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) return <div className="loading-screen">Loading...</div>;

  if (!user) {
    return (
      <div className="app">
        <Login />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setActiveTab('dashboard');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', roles: ['Admin', 'Analyst', 'Viewer'] },
    { id: 'records', label: 'Records', roles: ['Admin', 'Analyst'] },
    { id: 'users', label: 'Users', roles: ['Admin'] },
    { id: 'profile', label: 'Profile', roles: ['Admin', 'Analyst', 'Viewer'] }
  ];

  const visibleTabs = tabs.filter((tab) => tab.roles.includes(user.role));

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-logo">Zorvyn Fintech</h1>
        <nav className="app-nav">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="app-user">
          <span className="user-info">{user.name} <span className="user-role">{user.role}</span></span>
          <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'records' && <Records />}
        {activeTab === 'users' && <Users />}
        {activeTab === 'profile' && <Profile />}
      </main>
    </div>
  );
};

export default App;
