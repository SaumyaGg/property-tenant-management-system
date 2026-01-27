import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [selectedRequestID, setSelectedRequestID] = useState(null);

  const [formData, setFormData] = useState({
    UnitID: '',
    TenantID: '',
    category: 'Plumbing',
    description: '',
    status: 'Open'
  });

  const [assignData, setAssignData] = useState({
    VendorID: '',
    status: 'Assigned'
  });

  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqRes, unitsRes, tenantsRes, vendorsRes] = await Promise.all([
        axios.get(`${API_URL}/maintenance`),
        axios.get(`${API_URL}/units`),
        axios.get(`${API_URL}/tenants`),
        axios.get(`${API_URL}/vendors`)
      ]);
      setRequests(reqRes.data);
      setUnits(unitsRes.data);
      setTenants(tenantsRes.data);
      setVendors(vendorsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRequest) {
        await axios.put(`${API_URL}/maintenance/${editingRequest.RequestID}`, formData);
        setMessage({ type: 'success', text: 'Maintenance request updated successfully!' });
      } else {
        await axios.post(`${API_URL}/maintenance`, formData);
        setMessage({ type: 'success', text: 'Maintenance request created successfully!' });
      }
      fetchData();
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving maintenance request:', error);
      setMessage({ type: 'error', text: 'Error saving request: ' + (error.response?.data?.error || error.message) });
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/maintenance/assign`, {
        ...assignData,
        RequestID: selectedRequestID
      });
      setMessage({ type: 'success', text: 'Vendor assigned successfully!' });
      fetchData();
      setShowAssignModal(false);
      setAssignData({ VendorID: '', status: 'Assigned' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error assigning vendor:', error);
      setMessage({ type: 'error', text: 'Error assigning vendor: ' + (error.response?.data?.error || error.message) });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance request?')) {
      try {
        await axios.delete(`${API_URL}/maintenance/${id}`);
        setMessage({ type: 'success', text: 'Maintenance request deleted successfully!' });
        fetchData();
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error('Error deleting request:', error);
        setMessage({ type: 'error', text: 'Cannot delete: ' + (error.response?.data?.error || 'Has related assignments') });
      }
    }
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setFormData({
      UnitID: request.UnitID,
      TenantID: request.TenantID,
      category: request.category,
      description: request.description,
      status: request.status
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      UnitID: '',
      TenantID: '',
      category: 'Plumbing',
      description: '',
      status: 'Open'
    });
    setEditingRequest(null);
    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'warning';
      case 'open': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading maintenance requests...</p>
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
          <h2>🔧 Maintenance Requests</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Request
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Unit</th>
                <th>Tenant</th>
                <th>Status</th>
                <th>Vendor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    <div className="empty-state">
                      <div className="empty-state-icon">🔧</div>
                      <h3>No requests found</h3>
                      <p>Create your first maintenance request to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={`${r.RequestID}-${r.VendorID || 'none'}`}>
                    <td>{r.RequestID}</td>
                    <td>{r.category}</td>
                    <td title={r.description}>{r.description?.substring(0, 30)}...</td>
                    <td>{r.PropertyName} ({r.unit_no})</td>
                    <td>{r.TenantName}</td>
                    <td>
                      <span className={`badge badge-${getStatusBadge(r.status || r.RequestStatus)}`}>
                        {r.status || r.RequestStatus}
                      </span>
                    </td>
                    <td>{r.VendorName || <span className="text-muted">Unassigned</span>}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEdit(r)}>
                          Edit
                        </button>
                        {!r.VendorID && (
                          <button className="btn btn-sm btn-success" onClick={() => { setSelectedRequestID(r.RequestID); setShowAssignModal(true); }}>
                            Assign
                          </button>
                        )}
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.RequestID)}>
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
              <h3>{editingRequest ? 'Edit Request' : 'New Maintenance Request'}</h3>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
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
                        {u.PropertyName} - {u.unit_no}
                      </option>
                    ))}
                  </select>
                </div>
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
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Plumbing</option>
                  <option>HVAC</option>
                  <option>Electrical</option>
                  <option>Appliance</option>
                  <option>General</option>
                  <option>Landscaping</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Describe the issue..."
                />
              </div>

              {editingRequest && (
                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-control"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRequest ? 'Update Request' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Vendor to Request #{selectedRequestID}</h3>
              <button className="modal-close" onClick={() => setShowAssignModal(false)}>×</button>
            </div>

            <form onSubmit={handleAssign}>
              <div className="form-group">
                <label>Vendor *</label>
                <select
                  className="form-control"
                  value={assignData.VendorID}
                  onChange={e => setAssignData({ ...assignData, VendorID: e.target.value })}
                  required
                >
                  <option value="">Select Vendor...</option>
                  {vendors.map(v => (
                    <option key={v.VendorID} value={v.VendorID}>
                      {v.Name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Assignment Status</label>
                <select
                  className="form-control"
                  value={assignData.status}
                  onChange={e => setAssignData({ ...assignData, status: e.target.value })}
                >
                  <option>Assigned</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAssignModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Assign Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Maintenance;