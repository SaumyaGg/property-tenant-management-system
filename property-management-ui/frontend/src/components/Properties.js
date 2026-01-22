import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5001/api';
function Properties() {
  const [properties, setProperties] = useState([]);
  const [managements, setManagements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ManagementID: '', Name: '', Address: '', Type: 'Apartment' });
  const [message, setMessage] = useState(null);

  const load = () => {
    axios.get(`${API}/properties`).then(res => setProperties(res.data));
    axios.get(`${API}/property-management`).then(res => setManagements(res.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API}/properties/${editing}`, form);
      } else {
        await axios.post(`${API}/properties`, form);
      }
      setMessage({ type: 'success', text: editing ? 'Updated!' : 'Created!' });
      setShowModal(false); setEditing(null); load();
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.error }); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Properties</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ ManagementID: managements[0]?.ManagementID || '', Name: '', Address: '', Type: 'Apartment' }); setShowModal(true); }}>+ Add Property</button>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Address</th><th>Type</th><th>Company</th><th>Actions</th></tr></thead>
        <tbody>
          {properties.map(p => (
            <tr key={p.PropertyID}>
              <td>{p.PropertyID}</td><td>{p.Name}</td><td>{p.Address}</td><td>{p.Type}</td><td>{p.CompanyName}</td>
              <td className="actions">
                <button className="btn btn-primary btn-sm" onClick={() => { setEditing(p.PropertyID); setForm(p); setShowModal(true); }}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => axios.delete(`${API}/properties/${p.PropertyID}`).then(load)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editing ? 'Edit' : 'Add'} Property</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Management</label>
                <select value={form.ManagementID} onChange={e => setForm({...form, ManagementID: e.target.value})} required>
                  <option value="">Select...</option>
                  {managements.map(m => <option key={m.ManagementID} value={m.ManagementID}>{m.CompanyName} - ${m.management_fee}/mo</option>)}
                </select>
              </div>
              <div className="form-group"><label>Name</label><input value={form.Name} onChange={e => setForm({...form, Name: e.target.value})} required /></div>
              <div className="form-group"><label>Address</label><input value={form.Address} onChange={e => setForm({...form, Address: e.target.value})} required /></div>
              <div className="form-group">
                <label>Type</label>
                <select value={form.Type} onChange={e => setForm({...form, Type: e.target.value})}>
                  <option>Apartment</option><option>Condo</option><option>Townhouse</option><option>Single Family</option><option>Loft</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Properties;