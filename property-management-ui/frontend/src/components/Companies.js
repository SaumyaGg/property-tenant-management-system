import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5001/api';

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ Name: '', Tier: 'Basic', is_active: true });
  const [message, setMessage] = useState(null);

  const load = () => axios.get(`${API}/companies`).then(res => setCompanies(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API}/companies/${editing}`, form);
        setMessage({ type: 'success', text: 'Company updated!' });
      } else {
        await axios.post(`${API}/companies`, form);
        setMessage({ type: 'success', text: 'Company created!' });
      }
      setShowModal(false);
      setEditing(null);
      setForm({ Name: '', Tier: 'Basic', is_active: true });
      load();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this company?')) {
      try {
        await axios.delete(`${API}/companies/${id}`);
        setMessage({ type: 'success', text: 'Company deleted!' });
        load();
      } catch (err) {
        setMessage({ type: 'error', text: 'Cannot delete - has related records' });
      }
    }
  };

  const openEdit = (company) => {
    setEditing(company.CompanyID);
    setForm({ Name: company.Name, Tier: company.Tier, is_active: company.is_active });
    setShowModal(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Companies</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ Name: '', Tier: 'Basic', is_active: true }); setShowModal(true); }}>+ Add Company</button>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Tier</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.CompanyID}>
              <td>{c.CompanyID}</td>
              <td>{c.Name}</td>
              <td>{c.Tier}</td>
              <td><span className={`status ${c.is_active ? 'paid' : 'overdue'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
              <td className="actions">
                <button className="btn btn-primary btn-sm" onClick={() => openEdit(c)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.CompanyID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editing ? 'Edit Company' : 'Add Company'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input value={form.Name} onChange={e => setForm({...form, Name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Tier</label>
                <select value={form.Tier} onChange={e => setForm({...form, Tier: e.target.value})}>
                  <option>Basic</option><option>Standard</option><option>Premium</option><option>Enterprise</option>
                </select>
              </div>
              <div className="form-group">
                <label><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /> Active</label>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Companies;