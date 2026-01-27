import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

function Units() {
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [formData, setFormData] = useState({
    PropertyID: '',
    unit_no: '',
    beds: '',
    baths: '',
    sq_ft: ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [unitsRes, propsRes] = await Promise.all([
        axios.get(`${API_URL}/units`),
        axios.get(`${API_URL}/properties`)
      ]);
      setUnits(unitsRes.data);
      setProperties(propsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUnit) {
        await axios.put(`${API_URL}/units/${editingUnit.UnitID}`, formData);
        setMessage({ type: 'success', text: 'Unit updated successfully!' });
      } else {
        await axios.post(`${API_URL}/units`, formData);
        setMessage({ type: 'success', text: 'Unit created successfully!' });
      }
      fetchData();
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving unit:', error);
      setMessage({ type: 'error', text: 'Error saving unit: ' + (error.response?.data?.error || error.message) });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        await axios.delete(`${API_URL}/units/${id}`);
        setMessage({ type: 'success', text: 'Unit deleted successfully!' });
        fetchData();
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error('Error deleting unit:', error);
        setMessage({ type: 'error', text: 'Cannot delete: ' + (error.response?.data?.error || 'Has related leases or maintenance requests') });
      }
    }
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setFormData({
      PropertyID: unit.PropertyID,
      unit_no: unit.unit_no,
      beds: unit.beds,
      baths: unit.baths,
      sq_ft: unit.sq_ft
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ PropertyID: '', unit_no: '', beds: '', baths: '', sq_ft: '' });
    setEditingUnit(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading units...</p>
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
          <h2>🚪 Unit Management</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Unit
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Unit #</th>
                <th>Property</th>
                <th>Beds</th>
                <th>Baths</th>
                <th>Sq Ft</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    <div className="empty-state">
                      <div className="empty-state-icon">🚪</div>
                      <h3>No units found</h3>
                      <p>Add your first unit to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                units.map((u) => (
                  <tr key={u.UnitID}>
                    <td>{u.UnitID}</td>
                    <td>{u.unit_no}</td>
                    <td>{u.PropertyName}</td>
                    <td>{u.beds}</td>
                    <td>{u.baths}</td>
                    <td>{u.sq_ft}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEdit(u)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.UnitID)}>
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
              <h3>{editingUnit ? 'Edit Unit' : 'Add New Unit'}</h3>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Property *</label>
                <select
                  className="form-control"
                  value={formData.PropertyID}
                  onChange={e => setFormData({ ...formData, PropertyID: e.target.value })}
                  required
                >
                  <option value="">Select Property...</option>
                  {properties.map(p => (
                    <option key={p.PropertyID} value={p.PropertyID}>
                      {p.Name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Unit Number *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.unit_no}
                  onChange={(e) => setFormData({ ...formData, unit_no: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Beds</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.beds}
                    onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Baths</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={formData.baths}
                    onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Square Footage</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.sq_ft}
                  onChange={(e) => setFormData({ ...formData, sq_ft: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUnit ? 'Update Unit' : 'Create Unit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Units;