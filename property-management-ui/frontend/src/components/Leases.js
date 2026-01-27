import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

function Leases() {
  const [leases, setLeases] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLease, setEditingLease] = useState(null);
  const [formData, setFormData] = useState({
    TenantID: '',
    UnitID: '',
    start_date: '',
    end_date: '',
    monthly_rent: '',
    deposit: ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leasesRes, tenantsRes, unitsRes] = await Promise.all([
        axios.get(`${API_URL}/leases`),
        axios.get(`${API_URL}/tenants`),
        axios.get(`${API_URL}/units`)
      ]);
      setLeases(leasesRes.data);
      setTenants(tenantsRes.data);
      setUnits(unitsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLease) {
        await axios.put(`${API_URL}/leases/${editingLease.LeaseID}`, formData);
        setMessage({ type: 'success', text: 'Lease updated successfully!' });
      } else {
        await axios.post(`${API_URL}/leases`, formData);
        setMessage({ type: 'success', text: 'Lease created successfully!' });
      }
      fetchData();
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving lease:', error);
      setMessage({ type: 'error', text: 'Error saving lease: ' + (error.response?.data?.error || error.message) });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lease?')) {
      try {
        await axios.delete(`${API_URL}/leases/${id}`);
        setMessage({ type: 'success', text: 'Lease deleted successfully!' });
        fetchData();
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error('Error deleting lease:', error);
        setMessage({ type: 'error', text: 'Cannot delete: ' + (error.response?.data?.error || 'Has related invoices or documents') });
      }
    }
  };

  const handleEdit = (lease) => {
    setEditingLease(lease);

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      try {
        const d = new Date(dateStr);
        return d.toISOString().split('T')[0];
      } catch (e) {
        return '';
      }
    };

    setFormData({
      TenantID: lease.TenantID || '',
      UnitID: lease.UnitID || '',
      start_date: formatDate(lease.start_date),
      end_date: formatDate(lease.end_date),
      monthly_rent: lease.monthly_rent || '',
      deposit: lease.deposit || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ TenantID: '', UnitID: '', start_date: '', end_date: '', monthly_rent: '', deposit: '' });
    setEditingLease(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading leases...</p>
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
          <h2>📄 Lease Management</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Lease
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tenant</th>
                <th>Property</th>
                <th>Start</th>
                <th>End</th>
                <th>Rent</th>
                <th>Deposit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leases.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    <div className="empty-state">
                      <div className="empty-state-icon">📄</div>
                      <h3>No leases found</h3>
                      <p>Create your first lease to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leases.map((l) => (
                  <tr key={l.LeaseID}>
                    <td>{l.LeaseID}</td>
                    <td>{l.TenantName}</td>
                    <td>{l.PropertyName} - {l.unit_no}</td>
                    <td>{l.start_date ? new Date(l.start_date).toLocaleDateString() : 'N/A'}</td>
                    <td>{l.end_date ? new Date(l.end_date).toLocaleDateString() : 'N/A'}</td>
                    <td>${parseFloat(l.monthly_rent).toLocaleString()}</td>
                    <td>${parseFloat(l.deposit).toLocaleString()}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEdit(l)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(l.LeaseID)}>
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
              <h3>{editingLease ? 'Edit Lease' : 'New Lease Agreement'}</h3>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tenant *</label>
                <select
                  className="form-control"
                  value={formData.TenantID}
                  onChange={e => setFormData({ ...formData, TenantID: e.target.value })}
                  required
                >
                  <option value="">Select Tenant...</option>
                  {tenants.map(t => (
                    <option key={t.TenantID} value={t.TenantID}>
                      {t.first_name} {t.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Unit *</label>
                <select
                  className="form-control"
                  value={formData.UnitID}
                  onChange={e => setFormData({ ...formData, UnitID: e.target.value })}
                  required
                >
                  <option value="">Select Unit...</option>
                  {units.map(u => (
                    <option key={u.UnitID} value={u.UnitID}>
                      {u.PropertyName} - Unit {u.unit_no}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Monthly Rent *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.monthly_rent}
                    onChange={(e) => setFormData({ ...formData, monthly_rent: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Security Deposit *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingLease ? 'Update Lease' : 'Create Lease'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leases;