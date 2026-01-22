import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5001/api';

function Leases() {
  const [leases, setLeases] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ TenantID: '', UnitID: '', start_date: '', end_date: '', monthly_rent: '', deposit: '' });

  const load = () => {
    axios.get(`${API}/leases`).then(res => setLeases(res.data));
    axios.get(`${API}/tenants`).then(res => setTenants(res.data));
    axios.get(`${API}/units`).then(res => setUnits(res.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/leases`, form);
    setShowModal(false); load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Leases</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Lease</button>
      </div>

      <table>
        <thead><tr><th>ID</th><th>Tenant</th><th>Property</th><th>Start</th><th>End</th><th>Monthly Rent</th><th>Deposit</th></tr></thead>
        <tbody>
          {leases.map(l => (
            <tr key={l.LeaseID}>
              <td>{l.LeaseID}</td>
              <td>{l.TenantName}</td>
              <td>{l.PropertyName}</td>
              <td>{new Date(l.start_date).toLocaleDateString()}</td>
              <td>{new Date(l.end_date).toLocaleDateString()}</td>
              <td>${parseFloat(l.monthly_rent).toLocaleString()}</td>
              <td>${parseFloat(l.deposit).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Lease</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tenant</label>
                <select value={form.TenantID} onChange={e => setForm({...form, TenantID: e.target.value})} required>
                  <option value="">Select...</option>
                  {tenants.map(t => <option key={t.TenantID} value={t.TenantID}>{t.first_name} {t.last_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select value={form.UnitID} onChange={e => setForm({...form, UnitID: e.target.value})} required>
                  <option value="">Select...</option>
                  {units.map(u => <option key={u.UnitID} value={u.UnitID}>{u.PropertyName} - Unit {u.unit_no}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Start Date</label><input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} required /></div>
              <div className="form-group"><label>End Date</label><input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} required /></div>
              <div className="form-group"><label>Monthly Rent</label><input type="number" value={form.monthly_rent} onChange={e => setForm({...form, monthly_rent: e.target.value})} required /></div>
              <div className="form-group"><label>Deposit</label><input type="number" value={form.deposit} onChange={e => setForm({...form, deposit: e.target.value})} required /></div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Create</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leases;