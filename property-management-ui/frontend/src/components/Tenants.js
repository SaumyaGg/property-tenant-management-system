import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    employer: '',
    income: '',
    credit_score: '',
    move_in_date: ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await axios.get(`${API_URL}/tenants`);
      setTenants(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTenant) {
        await axios.put(`${API_URL}/tenants/${editingTenant.TenantID}`, formData);
        setMessage({ type: 'success', text: 'Tenant updated successfully!' });
      } else {
        await axios.post(`${API_URL}/tenants`, formData);
        setMessage({ type: 'success', text: 'Tenant created successfully!' });
      }
      fetchTenants();
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving tenant:', error);
      setMessage({ type: 'error', text: 'Error saving tenant: ' + (error.response?.data?.error || error.message) });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      try {
        await axios.delete(`${API_URL}/tenants/${id}`);
        setMessage({ type: 'success', text: 'Tenant deleted successfully!' });
        fetchTenants();
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error('Error deleting tenant:', error);
        setMessage({ type: 'error', text: 'Cannot delete: ' + (error.response?.data?.error || 'Has related leases or users') });
      }
    }
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setFormData({
      first_name: tenant.first_name || '',
      last_name: tenant.last_name || '',
      email: tenant.email || '',
      employer: tenant.employer,
      income: tenant.income,
      credit_score: tenant.credit_score,
      move_in_date: tenant.move_in_date ? tenant.move_in_date.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      employer: '',
      income: '',
      credit_score: '',
      move_in_date: ''
    });
    setEditingTenant(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading tenants...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>👥 Tenant Management</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Tenant
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Employer</th>
                <th>Income</th>
                <th>Credit Score</th>
                <th>Move-in Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    <div className="empty-state">
                      <div className="empty-state-icon">👥</div>
                      <h3>No tenants found</h3>
                      <p>Add your first tenant to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tenants.map((t) => (
                  <tr key={t.TenantID}>
                    <td>{t.TenantID}</td>
                    <td>{t.first_name} {t.last_name}</td>
                    <td>{t.employer}</td>
                    <td>${parseFloat(t.income || 0).toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${t.credit_score > 700 ? 'success' : t.credit_score > 600 ? 'warning' : 'danger'}`}>
                        {t.credit_score}
                      </span>
                    </td>
                    <td>{t.move_in_date ? new Date(t.move_in_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEdit(t)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.TenantID)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTenant ? 'Edit Tenant' : 'Add New Tenant'}</h3>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Leave blank for auto-generated"
                />
              </div>

              <div className="form-group">
                <label>Employer</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.employer}
                  onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Monthly Income</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Credit Score</label>
                  <input
                    type="number"
                    className="form-control"
                    min="300"
                    max="850"
                    value={formData.credit_score}
                    onChange={(e) => setFormData({ ...formData, credit_score: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Move-in Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.move_in_date}
                  onChange={(e) => setFormData({ ...formData, move_in_date: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTenant ? 'Update Tenant' : 'Create Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tenants;