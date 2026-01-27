import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Tier: 'Basic',
    is_active: true
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/companies`);
      setCompanies(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await axios.put(`${API_URL}/companies/${editingCompany.CompanyID}`, formData);
        setMessage({ type: 'success', text: 'Company updated successfully!' });
      } else {
        await axios.post(`${API_URL}/companies`, formData);
        setMessage({ type: 'success', text: 'Company created successfully!' });
      }
      fetchCompanies();
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving company:', error);
      setMessage({ type: 'error', text: 'Error saving company: ' + (error.response?.data?.error || error.message) });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await axios.delete(`${API_URL}/companies/${id}`);
        setMessage({ type: 'success', text: 'Company deleted successfully!' });
        fetchCompanies();
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error('Error deleting company:', error);
        setMessage({ type: 'error', text: 'Cannot delete: ' + (error.response?.data?.error || 'Has related records') });
      }
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      Name: company.Name,
      Tier: company.Tier,
      is_active: company.is_active
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ Name: '', Tier: 'Basic', is_active: true });
    setEditingCompany(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading companies...</p>
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
          <h2>🏢 Company Management</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Company
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    <div className="empty-state">
                      <div className="empty-state-icon">🏢</div>
                      <h3>No companies found</h3>
                      <p>Add your first company to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                companies.map((c) => (
                  <tr key={c.CompanyID}>
                    <td>{c.CompanyID}</td>
                    <td>{c.Name}</td>
                    <td>
                      <span className={`badge badge-${c.Tier === 'Enterprise' ? 'primary' : c.Tier === 'Premium' ? 'info' : 'secondary'}`}>
                        {c.Tier}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${c.is_active ? 'success' : 'danger'}`}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEdit(c)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.CompanyID)}>
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
              <h3>{editingCompany ? 'Edit Company' : 'Add New Company'}</h3>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.Name}
                  onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tier</label>
                <select
                  className="form-control"
                  value={formData.Tier}
                  onChange={e => setFormData({ ...formData, Tier: e.target.value })}
                >
                  <option>Basic</option>
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Enterprise</option>
                </select>
              </div>

              <div className="form-group">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  Active
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCompany ? 'Update Company' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Companies;