import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5001/api';

function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employer: '', income: '', credit_score: '', move_in_date: '' });
  const [message, setMessage] = useState(null);

  const load = () => axios.get(`${API}/tenants`).then(res => setTenants(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/tenants`, form);
      setMessage({ type: 'success', text: 'Tenant created!' });
      setShowModal(false); load();
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.error }); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Tenants</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Tenant</button>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Employer</th><th>Income</th><th>Credit Score</th><th>Move-in Date</th></tr></thead>
        <tbody>
          {tenants.map(t => (
            <tr key={t.TenantID}>
              <td>{t.TenantID}</td>
              <td>{t.first_name} {t.last_name}</td>
              <td>{t.employer}</td>
              <td>${parseFloat(t.income || 0).toLocaleString()}</td>
              <td>{t.credit_score}</td>
              <td>{new Date(t.move_in_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Tenant</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Employer</label><input value={form.employer} onChange={e => setForm({...form, employer: e.target.value})} /></div>
              <div className="form-group"><label>Income</label><input type="number" value={form.income} onChange={e => setForm({...form, income: e.target.value})} /></div>
              <div className="form-group"><label>Credit Score</label><input type="number" min="300" max="850" value={form.credit_score} onChange={e => setForm({...form, credit_score: e.target.value})} /></div>
              <div className="form-group"><label>Move-in Date</label><input type="date" value={form.move_in_date} onChange={e => setForm({...form, move_in_date: e.target.value})} required /></div>
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

export default Tenants;