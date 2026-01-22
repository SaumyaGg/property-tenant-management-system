import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5001/api';

function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form, setForm] = useState({ UnitID: '', TenantID: '', Category: 'Plumbing', Description: '' });
  const [assignForm, setAssignForm] = useState({ VendorID: '', Status: 'Assigned' });
  const [message, setMessage] = useState(null);

  const load = () => {
    axios.get(`${API}/maintenance`).then(res => setRequests(res.data));
    axios.get(`${API}/units`).then(res => setUnits(res.data));
    axios.get(`${API}/tenants`).then(res => setTenants(res.data));
    axios.get(`${API}/vendors`).then(res => setVendors(res.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/maintenance`, form);
      setMessage({ type: 'success', text: `Request #${res.data.RequestID} created! (Using sp_CreateMaintenanceRequest)` });
      setShowModal(false); load();
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.error }); }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/maintenance/assign`, { ...assignForm, RequestID: selectedRequest });
      setMessage({ type: 'success', text: `${res.data.message} (Using sp_AssignVendorToRequest)` });
      setShowAssign(false); load();
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.error }); }
  };

  const getStatusClass = (status) => status?.toLowerCase().replace(' ', '-');

  return (
    <div>
      <div className="page-header">
        <h1>Maintenance Requests</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Request</button>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <table>
        <thead><tr><th>ID</th><th>Category</th><th>Description</th><th>Property</th><th>Unit</th><th>Tenant</th><th>Status</th><th>Vendor</th><th>Actions</th></tr></thead>
        <tbody>
          {requests.map(r => (
            <tr key={`${r.RequestID}-${r.VendorID || 'none'}`}>
              <td>{r.RequestID}</td>
              <td>{r.category}</td>
              <td>{r.description?.substring(0, 30)}...</td>
              <td>{r.PropertyName}</td>
              <td>{r.unit_no}</td>
              <td>{r.TenantName}</td>
              <td><span className={`status ${getStatusClass(r.RequestStatus)}`}>{r.RequestStatus}</span></td>
              <td>{r.VendorName || '-'}</td>
              <td>
                {!r.VendorID && (
                  <button className="btn btn-success btn-sm" onClick={() => { setSelectedRequest(r.RequestID); setShowAssign(true); }}>Assign Vendor</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Maintenance Request</h2>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>Uses: sp_CreateMaintenanceRequest</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Unit</label>
                <select value={form.UnitID} onChange={e => setForm({...form, UnitID: e.target.value})} required>
                  <option value="">Select...</option>
                  {units.map(u => <option key={u.UnitID} value={u.UnitID}>{u.PropertyName} - {u.unit_no}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Tenant</label>
                <select value={form.TenantID} onChange={e => setForm({...form, TenantID: e.target.value})} required>
                  <option value="">Select...</option>
                  {tenants.map(t => <option key={t.TenantID} value={t.TenantID}>{t.first_name} {t.last_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.Category} onChange={e => setForm({...form, Category: e.target.value})}>
                  <option>Plumbing</option><option>HVAC</option><option>Electrical</option><option>Appliance</option><option>General</option>
                </select>
              </div>
              <div className="form-group"><label>Description</label><textarea value={form.Description} onChange={e => setForm({...form, Description: e.target.value})} required /></div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Create</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssign && (
        <div className="modal">
          <div className="modal-content">
            <h2>Assign Vendor to Request #{selectedRequest}</h2>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>Uses: sp_AssignVendorToRequest</p>
            <form onSubmit={handleAssign}>
              <div className="form-group">
                <label>Vendor</label>
                <select value={assignForm.VendorID} onChange={e => setAssignForm({...assignForm, VendorID: e.target.value})} required>
                  <option value="">Select...</option>
                  {vendors.map(v => <option key={v.VendorID} value={v.VendorID}>{v.Name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={assignForm.Status} onChange={e => setAssignForm({...assignForm, Status: e.target.value})}>
                  <option>Assigned</option><option>In Progress</option><option>Completed</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-success">Assign</button>
                <button type="button" className="btn" onClick={() => setShowAssign(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Maintenance;