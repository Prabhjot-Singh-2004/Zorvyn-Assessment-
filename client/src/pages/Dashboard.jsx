import { useState, useEffect } from 'react';
import api from '../services/api';
import './Dashboard.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const SummaryCards = ({ summary }) => (
  <div className="summary-cards">
    <div className="card summary-card">
      <h3>Total Income</h3>
      <p className="amount positive">{formatCurrency(summary.totalIncome)}</p>
    </div>
    <div className="card summary-card">
      <h3>Total Expenses</h3>
      <p className="amount negative">{formatCurrency(summary.totalExpenses)}</p>
    </div>
    <div className="card summary-card">
      <h3>Net Balance</h3>
      <p className={`amount ${summary.netBalance >= 0 ? 'positive' : 'negative'}`}>
        {formatCurrency(summary.netBalance)}
      </p>
    </div>
  </div>
);

const RecentActivity = ({ activities }) => (
  <div className="card">
    <h3>Recent Activity</h3>
    {activities.length === 0 ? (
      <p className="empty-state">No records yet</p>
    ) : (
      <div className="activity-list">
        {activities.map((item) => (
          <div key={item._id} className="activity-item">
            <div className="activity-info">
              <span className="category">{item.category}</span>
              {item.notes && <span className="notes">{item.notes}</span>}
            </div>
            <span className={`activity-amount ${item.type === 'INCOME' ? 'positive' : 'negative'}`}>
              {item.type === 'INCOME' ? '+' : '-'}{formatCurrency(item.amount)}
            </span>
            <span className="activity-date">{formatDate(item.date)}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const CategoryBreakdown = ({ categories }) => (
  <div className="card">
    <h3>Category Breakdown</h3>
    {categories.length === 0 ? (
      <p className="empty-state">No data</p>
    ) : (
      categories.map((item) => (
        <div key={item._id} className="category-item">
          <span>{item._id}</span>
          <span className={item.type === 'INCOME' ? 'positive' : 'negative'}>
            {formatCurrency(item.total)}
          </span>
        </div>
      ))
    )}
  </div>
);

const MonthlyTrend = ({ trends }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="card">
      <h3>Monthly Trend</h3>
      {trends.length === 0 ? (
        <p className="empty-state">No data</p>
      ) : (
        trends.map((item) => (
          <div key={`${item._id.year}-${item._id.month}`} className="trend-item">
            <span className="trend-month">{months[item._id.month - 1]} {item._id.year}</span>
            <span className="trend-values">
              <span className="trend-income">+{formatCurrency(item.income)}</span>
              <span className="trend-expense">-{formatCurrency(item.expenses)}</span>
            </span>
          </div>
        ))
      )}
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const result = await api.get('/dashboard/summary');
      setData(result);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!data) return null;

  return (
    <div className="dashboard-content">
      <SummaryCards summary={data.summary} />

      <div className="dashboard-grid">
        <div className="card full-width">
          <RecentActivity activities={data.recentActivity} />
        </div>

        <div className="card">
          <CategoryBreakdown categories={data.categoryBreakdown} />
        </div>

        <div className="card">
          <MonthlyTrend trends={data.monthlyTrend} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
