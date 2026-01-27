import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

function Vendors() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [formData, setFormData] = useState({
        Name: '',
        ServiceType: 'Plumbing',
        ContactName: '',
        phone: '',
        email: '',
        is_active: true
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const response = await axios.get(`${API_URL}/vendors`);
            setVendors(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVendor) {
                await axios.put(`${API_URL}/vendors/${editingVendor.VendorID}`, formData);
                setMessage({ type: 'success', text: 'Vendor updated successfully!' });
            } else {
                await axios.post(`${API_URL}/vendors`, formData);
                setMessage({ type: 'success', text: 'Vendor created successfully!' });
            }
            fetchVendors();
            resetForm();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving vendor:', error);
            setMessage({ type: 'error', text: 'Error saving vendor: ' + (error.response?.data?.error || error.message) });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            try {
                await axios.delete(`${API_URL}/vendors/${id}`);
                setMessage({ type: 'success', text: 'Vendor deleted successfully!' });
                fetchVendors();
                setTimeout(() => setMessage(null), 3000);
            } catch (error) {
                console.error('Error deleting vendor:', error);
                setMessage({ type: 'error', text: 'Cannot delete vendor: ' + (error.response?.data?.error || 'Has related maintenance records') });
            }
        }
    };

    const handleEdit = (vendor) => {
        setEditingVendor(vendor);
        setFormData({
            Name: vendor.Name,
            ServiceType: vendor.ServiceType,
            ContactName: vendor.ContactName || '',
            phone: vendor.phone || vendor.Phone || '',
            email: vendor.email || vendor.Email || '',
            is_active: vendor.is_active
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            Name: '',
            ServiceType: 'Plumbing',
            ContactName: '',
            phone: '',
            email: '',
            is_active: true
        });
        setEditingVendor(null);
        setShowModal(false);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading vendors...</p>
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
                    <h2>🔧 Vendor Management</h2>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        + Add Vendor
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Service</th>
                                <th>Contact</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">🔧</div>
                                            <h3>No vendors found</h3>
                                            <p>Add your first vendor to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                vendors.map((vendor) => (
                                    <tr key={vendor.VendorID}>
                                        <td>{vendor.VendorID}</td>
                                        <td>{vendor.Name}</td>
                                        <td>
                                            <span className="badge badge-info">{vendor.ServiceType}</span>
                                        </td>
                                        <td>{vendor.ContactName || 'N/A'}</td>
                                        <td>{vendor.Phone || 'N/A'}</td>
                                        <td>
                                            <span className={`badge badge-${vendor.is_active ? 'success' : 'danger'}`}>
                                                {vendor.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(vendor)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(vendor.VendorID)}>
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
                            <h3>{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</h3>
                            <button className="modal-close" onClick={resetForm}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Company Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.Name}
                                    onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Service Type</label>
                                <select
                                    className="form-control"
                                    value={formData.ServiceType}
                                    onChange={e => setFormData({ ...formData, ServiceType: e.target.value })}
                                >
                                    <option>Plumbing</option>
                                    <option>HVAC</option>
                                    <option>Electrical</option>
                                    <option>Landscaping</option>
                                    <option>Roofing</option>
                                    <option>General Contractor</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Contact Person</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.ContactName}
                                        onChange={(e) => setFormData({ ...formData, ContactName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                    Active Vendor
                                </label>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={resetForm}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingVendor ? 'Update Vendor' : 'Register Vendor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Vendors;
