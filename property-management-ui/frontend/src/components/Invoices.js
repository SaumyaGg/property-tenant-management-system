import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [leases, setLeases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [formData, setFormData] = useState({
        LeaseID: '',
        amount_due: '',
        due_date: '',
        status: 'Pending'
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [invoicesRes, leasesRes] = await Promise.all([
                axios.get(`${API_URL}/invoices`),
                axios.get(`${API_URL}/leases`)
            ]);
            setInvoices(invoicesRes.data);
            setLeases(leasesRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingInvoice) {
                await axios.put(`${API_URL}/invoices/${editingInvoice.InvoiceID}`, formData);
                setMessage({ type: 'success', text: 'Invoice updated successfully!' });
            } else {
                await axios.post(`${API_URL}/invoices`, formData);
                setMessage({ type: 'success', text: 'Invoice created successfully!' });
            }
            fetchData();
            resetForm();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving invoice:', error);
            setMessage({ type: 'error', text: 'Error saving invoice: ' + (error.response?.data?.error || error.message) });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await axios.delete(`${API_URL}/invoices/${id}`);
                setMessage({ type: 'success', text: 'Invoice deleted successfully!' });
                fetchData();
                setTimeout(() => setMessage(null), 3000);
            } catch (error) {
                console.error('Error deleting invoice:', error);
                setMessage({ type: 'error', text: 'Cannot delete invoice: ' + (error.response?.data?.error || 'Related payments exist') });
            }
        }
    };

    const handleEdit = (invoice) => {
        setEditingInvoice(invoice);
        setFormData({
            LeaseID: invoice.LeaseID,
            amount_due: invoice.amount_due,
            due_date: invoice.due_date.split('T')[0],
            status: invoice.status
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            LeaseID: '',
            amount_due: '',
            due_date: '',
            status: 'Pending'
        });
        setEditingInvoice(null);
        setShowModal(false);
    };

    const getStatusBadge = (status) => {
        const badges = {
            'Paid': 'badge-success',
            'Pending': 'badge-warning',
            'Overdue': 'badge-danger'
        };
        return badges[status] || 'badge-info';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading invoices...</p>
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
                    <h2>📄 Invoice Management</h2>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        + Create Invoice
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tenant</th>
                                <th>Property</th>
                                <th>Unit</th>
                                <th>Amount Due</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">📄</div>
                                            <h3>No invoices found</h3>
                                            <p>Create your first invoice to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice) => (
                                    <tr key={invoice.InvoiceID}>
                                        <td>{invoice.InvoiceID}</td>
                                        <td>{invoice.TenantName || 'N/A'}</td>
                                        <td>{invoice.PropertyName}</td>
                                        <td>{invoice.unit_no}</td>
                                        <td>${parseFloat(invoice.amount_due).toFixed(2)}</td>
                                        <td>{new Date(invoice.due_date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(invoice)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.InvoiceID)}>
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
                            <h3>{editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}</h3>
                            <button className="modal-close" onClick={resetForm}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Lease *</label>
                                <select
                                    className="form-control"
                                    value={formData.LeaseID}
                                    onChange={(e) => setFormData({ ...formData, LeaseID: e.target.value })}
                                    required
                                    disabled={editingInvoice}
                                >
                                    <option value="">Select Lease</option>
                                    {leases.map((lease) => (
                                        <option key={lease.LeaseID} value={lease.LeaseID}>
                                            {lease.TenantName} - {lease.PropertyName} Unit {lease.unit_no}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Amount Due *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        value={formData.amount_due}
                                        onChange={(e) => setFormData({ ...formData, amount_due: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Due Date *</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formData.due_date}
                                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Status *</label>
                                <select
                                    className="form-control"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    required
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={resetForm}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Invoices;
