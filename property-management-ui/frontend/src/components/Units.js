import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5001/api';

function Units() {
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ PropertyID: '', unit_no: '', beds: '', baths: '', sq_ft: '' });

  const load = () => {
    axios.get(`${API}/units`).then(res => setUnits(res.data));
    axios.get(`${API}/properties`).then(res => setProperties(res.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/units`, form);
    setShowModal(false); load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Units</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Unit</button>
      </div>

      <table>
        <thead><tr><th>ID</th><th>Unit #</th><th>Property</th><th>Beds</th><th>Baths</th><th>Sq Ft</th></tr></thead>
        <tbody>
          {units.map(u => (
            <tr key={u.UnitID}>
              <td>{u.UnitID}</td><td>{u.unit_no}</td><td>{u.PropertyName}</td><td>{u.beds}</td><td>{u.baths}</td><td>{u.sq_ft}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Unit</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Property</label>
                <select value={form.PropertyID} onChange={e => setForm({...form, PropertyID: e.target.value})} required>
                  <option value="">Select...</option>
                  {properties.map(p => <option key={p.PropertyID} value={p.PropertyID}>{p.Name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Unit #</label><input value={form.unit_no} onChange={e => setForm({...form, unit_no: e.target.value})} required /></div>
              <div className="form-group"><label>Beds</label><input type="number" value={form.beds} onChange={e => setForm({...form, beds: e.target.value})} required /></div>
              <div className="form-group"><label>Baths</label><input type="number" step="0.5" value={form.baths} onChange={e => setForm({...form, baths: e.target.value})} required /></div>
              <div className="form-group"><label>Sq Ft</label><input type="number" value={form.sq_ft} onChange={e => setForm({...form, sq_ft: e.target.value})} required /></div>
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

export default Units;