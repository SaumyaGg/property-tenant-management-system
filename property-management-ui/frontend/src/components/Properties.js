import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [managements, setManagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    ManagementID: '',
    Name: '',
    Address: '',
    Type: 'Apartment'
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [propRes, mgmtRes] = await Promise.all([
        axios.get(`${API_URL}/properties`),
        axios.get(`${API_URL}/property-management`)
      ]);
      setProperties(propRes.data);
      setManagements(mgmtRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProperty) {
        await axios.put(`${API_URL}/properties/${editingProperty.PropertyID}`, formData);
        setMessage({ type: 'success', text: 'Property updated successfully!' });
      } else {
        await axios.post(`${API_URL}/properties`, formData);
        setMessage({ type: 'success', text: 'Property created successfully!' });
      }
      fetchData();
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving property:', error);
      setMessage({ type: 'error', text: 'Error saving property: ' + (error.response?.data?.error || error.message) });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`${API_URL}/properties/${id}`);
        setMessage({ type: 'success', text: 'Property deleted successfully!' });
        fetchData();
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error('Error deleting property:', error);
        setMessage({ type: 'error', text: 'Cannot delete: ' + (error.response?.data?.error || 'Has related units or leases') });
      }
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      ManagementID: property.ManagementID,
      Name: property.Name,
      Address: property.Address,
      Type: property.Type
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ ManagementID: '', Name: '', Address: '', Type: 'Apartment' });
    setEditingProperty(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading properties...</p>
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
          <h2>🏠 Property Management</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Property
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Type</th>
                <th>Management Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <div className="empty-state">
                      <div className="empty-state-icon">🏠</div>
                      <h3>No properties found</h3>
                      <p>Add your first property to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                properties.map((p) => (
                  <tr key={p.PropertyID}>
                    <td>{p.PropertyID}</td>
                    <td>{p.Name}</td>
                    <td>{p.Address}</td>
                    <td>
                      <span className="badge badge-info">{p.Type}</span>
                    </td>
                    <td>{p.CompanyName}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEdit(p)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.PropertyID)}>
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
              <h3>{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Management Company *</label>
                <select
                  className="form-control"
                  value={formData.ManagementID}
                  onChange={e => setFormData({ ...formData, ManagementID: e.target.value })}
                  required
                >
                  <option value="">Select Company...</option>
                  {managements.map(m => (
                    <option key={m.ManagementID} value={m.ManagementID}>
                      {m.CompanyName} (ID: {m.ManagementID})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Property Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.Name}
                  onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.Address}
                  onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  className="form-control"
                  value={formData.Type}
                  onChange={e => setFormData({ ...formData, Type: e.target.value })}
                >
                  <option>Apartment</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Single Family</option>
                  <option>Loft</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProperty ? 'Update Property' : 'Create Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Properties;