import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API = 'http://localhost:5001/api';

function Payments() {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [form, setForm] = useState({ Amount: '', Method: 'ACH Transfer' });
  const [message, setMessage] = useState(null);

  const load = () => {
    axios.get(`${API}/invoices`).then(res => setInvoices(res.data));
    axios.get(`${API}/payments`).then(res => setPayments(res.data));
  };
  useEffect(() => { load(); }, []);

  const openPayment = (inv) => {
    setSelectedInvoice(inv);
    setForm({ Amount: inv.amount_due, Method: 'ACH Transfer' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/payments`, {
        TenantID: selectedInvoice.TenantID,
        InvoiceID: selectedInvoice.InvoiceID,
        Amount: form.Amount,
        Method: form.Method
      });
      setMessage({ type: 'success', text: `${res.data.message} (Using sp_AddPayment)` });
      setShowModal(false); load();
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.error }); }
  };

  return (
    <div>
      <div className="page-header"><h1>Payments & Invoices</h1></div>
      
      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <h2 style={{ marginBottom: '15px' }}>Unpaid Invoices</h2>
      <table style={{ marginBottom: '30px' }}>
        <thead><tr><th>Invoice ID</th><th>Tenant</th><th>Amount Due</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.InvoiceID}>
              <td>{inv.InvoiceID}</td>
              <td>{inv.TenantName}</td>
              <td>${parseFloat(inv.amount_due).toLocaleString()}</td>
              <td>{new Date(inv.due_date).toLocaleDateString()}</td>
              <td><span className={`status ${inv.status?.toLowerCase()}`}>{inv.status}</span></td>
              <td><button className="btn btn-success btn-sm" onClick={() => openPayment(inv)}>Pay Now</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginBottom: '15px' }}>Payment History</h2>
      <table>
        <thead><tr><th>Payment ID</th><th>Tenant</th><th>Invoice</th><th>Amount</th><th>Date</th><th>Method</th></tr></thead>
        <tbody>
          {payments.slice(0, 10).map(p => (
            <tr key={p.PaymentID}>
              <td>{p.PaymentID}</td>
              <td>{p.TenantName}</td>
              <td>#{p.InvoiceID}</td>
              <td>${parseFloat(p.PaymentAmount).toLocaleString()}</td>
              <td>{new Date(p.PaymentDate).toLocaleDateString()}</td>
              <td>{p.method}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Make Payment for Invoice #{selectedInvoice.InvoiceID}</h2>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>Uses: sp_AddPayment</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Tenant</label><input value={selectedInvoice.TenantName} disabled /></div>
              <div className="form-group"><label>Amount Due</label><input value={`$${selectedInvoice.amount_due}`} disabled /></div>
              <div className="form-group"><label>Payment Amount</label><input type="number" step="0.01" value={form.Amount} onChange={e => setForm({...form, Amount: e.target.value})} required /></div>
              <div className="form-group">
                <label>Payment Method</label>
                <select value={form.Method} onChange={e => setForm({...form, Method: e.target.value})}>
                  <option>ACH Transfer</option><option>Credit Card</option><option>Debit Card</option><option>Check</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-success">Process Payment</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;