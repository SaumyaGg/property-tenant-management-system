import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

function Payments() {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState({
    Amount: '',
    Method: 'ACH Transfer'
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invoicesRes, paymentsRes] = await Promise.all([
        axios.get(`${API_URL}/invoices`),
        axios.get(`${API_URL}/payments`)
      ]);
      setInvoices(invoicesRes.data);
      setPayments(paymentsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const openPaymentModal = (invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      Amount: invoice.amount_due,
      Method: 'ACH Transfer'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/payments`, {
        TenantID: selectedInvoice.TenantID,
        InvoiceID: selectedInvoice.InvoiceID,
        amount: formData.Amount,
        method: formData.Method
      });
      setMessage({ type: 'success', text: 'Payment processed successfully!' });
      fetchData();
      setShowModal(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error processing payment:', error);
      setMessage({ type: 'error', text: 'Error processing payment: ' + (error.response?.data?.error || error.message) });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading payments and invoices...</p>
      </div>
    );
  }

  const unpaidInvoices = invoices.filter(inv => inv.status !== 'Paid');

  return (
    <div className="fade-in">
      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">
          <h2>📅 Unpaid Invoices</h2>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Tenant</th>
                <th>Amount Due</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {unpaidInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <div className="empty-state">
                      <div className="empty-state-icon">✅</div>
                      <h3>All invoices paid</h3>
                      <p>No outstanding balances to show</p>
                    </div>
                  </td>
                </tr>
              ) : (
                unpaidInvoices.map((inv) => (
                  <tr key={inv.InvoiceID}>
                    <td>#{inv.InvoiceID}</td>
                    <td>{inv.TenantName}</td>
                    <td>${parseFloat(inv.amount_due).toLocaleString()}</td>
                    <td>{new Date(inv.due_date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${inv.status === 'Overdue' ? 'danger' : 'warning'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-success" onClick={() => openPaymentModal(inv)}>
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>history Payment History</h2>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Tenant</th>
                <th>Invoice</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <div className="empty-state">
                      <div className="empty-state-icon">💳</div>
                      <h3>No payments recorded</h3>
                      <p>Start receiving payments to see them here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.slice(0, 20).map((p) => (
                  <tr key={p.PaymentID}>
                    <td>#{p.PaymentID}</td>
                    <td>{p.TenantName}</td>
                    <td>Pinvoice-#{p.InvoiceID}</td>
                    <td>${parseFloat(p.PaymentAmount || p.amount).toLocaleString()}</td>
                    <td>{p.PaymentDate ? new Date(p.PaymentDate).toLocaleDateString() : new Date(p.date).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-info">{p.method}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Process Payment for Invoice #{selectedInvoice.InvoiceID}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tenant</label>
                <input type="text" className="form-control" value={selectedInvoice.TenantName} disabled />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount Due</label>
                  <input type="text" className="form-control" value={`$${parseFloat(selectedInvoice.amount_due).toLocaleString()}`} disabled />
                </div>
                <div className="form-group">
                  <label>Payment Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={formData.Amount}
                    onChange={(e) => setFormData({ ...formData, Amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  className="form-control"
                  value={formData.Method}
                  onChange={e => setFormData({ ...formData, Method: e.target.value })}
                >
                  <option>ACH Transfer</option>
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Check</option>
                  <option>Cash</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Process Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;