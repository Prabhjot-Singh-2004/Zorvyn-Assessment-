import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Records.css';

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

const toInputDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
};

const Records = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    category: '',
    date: toInputDate(new Date()),
    notes: ''
  });

  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    loadRecords();
  }, [pagination.page]);

  const loadRecords = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit
      });

      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const data = await api.get(`/records?${params}`);
      setRecords(data.records);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    loadRecords();
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateForm = () => {
    setEditingRecord(null);
    setFormData({
      amount: '',
      type: 'EXPENSE',
      category: '',
      date: toInputDate(new Date()),
      notes: ''
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const openEditForm = (record) => {
    setEditingRecord(record);
    setFormData({
      amount: record.amount.toString(),
      type: record.type,
      category: record.category,
      date: toInputDate(record.date),
      notes: record.notes || ''
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const body = {
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: new Date(formData.date),
      notes: formData.notes
    };

    try {
      if (editingRecord) {
        await api.put(`/records/${editingRecord._id}`, body);
        setSuccess('Record updated successfully');
      } else {
        await api.post('/records', body);
        setSuccess('Record created successfully');
      }
      closeForm();
      loadRecords();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      await api.delete(`/records/${id}`);
      loadRecords();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="records-section">
      <div className="records-header">
        <h2>Financial Records</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openCreateForm}>
            Add Record
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <form onSubmit={handleSubmit} className="record-form">
          <h3>{editingRecord ? 'Edit Record' : 'Add Record'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g. Salary, Marketing"
                required
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Optional description"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingRecord ? 'Update Record' : 'Add Record'}
            </button>
            <button type="button" className="btn btn-outline" onClick={closeForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <form onSubmit={handleFilterSubmit} className="filters-form">
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleFilterChange}
        />

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />

        <button type="submit" className="btn btn-primary">Filter</button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      {loading ? (
        <p className="loading">Loading records...</p>
      ) : (
        <>
          <div className="records-table">
            <div className="record-row header">
              <span>Amount</span>
              <span>Type</span>
              <span>Category</span>
              <span>Date</span>
              <span>Notes</span>
              <span>Created By</span>
              {isAdmin && <span>Actions</span>}
            </div>

            {records.length === 0 ? (
              <p className="empty-state">No records found</p>
            ) : (
              records.map((record) => (
                <div key={record._id} className="record-row">
                  <span className={record.type === 'INCOME' ? 'positive' : 'negative'}>
                    {formatCurrency(record.amount)}
                  </span>
                  <span className={`record-type ${record.type}`}>{record.type}</span>
                  <span>{record.category}</span>
                  <span>{formatDate(record.date)}</span>
                  <span className="notes-cell">{record.notes || '-'}</span>
                  <span>{record.createdBy?.name || 'Unknown'}</span>
                  {isAdmin && (
                    <span className="actions-cell">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openEditForm(record)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(record._id)}
                      >
                        Delete
                      </button>
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline"
                disabled={pagination.page <= 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              >
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.pages}</span>
              <button
                className="btn btn-outline"
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Records;
