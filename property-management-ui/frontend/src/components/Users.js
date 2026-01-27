import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

function Users() {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [roles, setRoles] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        CompanyID: '',
        TenantID: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        RoleID: ''
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, companiesRes, rolesRes, tenantsRes] = await Promise.all([
                axios.get(`${API_URL}/users`),
                axios.get(`${API_URL}/companies`),
                axios.get(`${API_URL}/roles`),
                axios.get(`${API_URL}/tenants`)
            ]);
            setUsers(usersRes.data);
            setCompanies(companiesRes.data);
            setRoles(rolesRes.data);
            setTenants(tenantsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                TenantID: formData.TenantID || null,
                phone: formData.phone || null
            };

            if (editingUser) {
                await axios.put(`${API_URL}/users/${editingUser.UserID}`, dataToSend);
                setMessage({ type: 'success', text: 'User updated successfully!' });
            } else {
                await axios.post(`${API_URL}/users`, dataToSend);
                setMessage({ type: 'success', text: 'User created successfully!' });
            }
            fetchData();
            resetForm();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving user:', error);
            setMessage({ type: 'error', text: 'Error saving user: ' + (error.response?.data?.error || error.message) });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${API_URL}/users/${id}`);
                setMessage({ type: 'success', text: 'User deleted successfully!' });
                fetchData();
                setTimeout(() => setMessage(null), 3000);
            } catch (error) {
                console.error('Error deleting user:', error);
                setMessage({ type: 'error', text: 'Cannot delete user: ' + (error.response?.data?.error || 'Related records exist') });
            }
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            CompanyID: user.CompanyID,
            TenantID: user.TenantID || '',
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone || '',
            RoleID: ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            CompanyID: '',
            TenantID: '',
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
            RoleID: ''
        });
        setEditingUser(null);
        setShowModal(false);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading users...</p>
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
                    <h2>👥 User Management</h2>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        + Add User
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Company</th>
                                <th>Roles</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">👤</div>
                                            <h3>No users found</h3>
                                            <p>Add your first user to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.UserID}>
                                        <td>{user.UserID}</td>
                                        <td>{user.first_name} {user.last_name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || <span className="text-muted">N/A</span>}</td>
                                        <td>{user.CompanyName}</td>
                                        <td>
                                            {user.Roles ? (
                                                <span className="badge badge-primary">{user.Roles}</span>
                                            ) : (
                                                <span className="badge badge-info">No Role</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(user)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.UserID)}>
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
                            <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                            <button className="modal-close" onClick={resetForm}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Company *</label>
                                    <select
                                        className="form-control"
                                        value={formData.CompanyID}
                                        onChange={(e) => setFormData({ ...formData, CompanyID: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Company</option>
                                        {companies.map((company) => (
                                            <option key={company.CompanyID} value={company.CompanyID}>
                                                {company.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Tenant (Optional)</label>
                                    <select
                                        className="form-control"
                                        value={formData.TenantID}
                                        onChange={(e) => setFormData({ ...formData, TenantID: e.target.value })}
                                    >
                                        <option value="">Not a Tenant</option>
                                        {tenants.map((tenant) => (
                                            <option key={tenant.TenantID} value={tenant.TenantID}>
                                                {tenant.first_name} {tenant.last_name} (ID: {tenant.TenantID})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {!editingUser && (
                                <div className="form-group">
                                    <label>Initial Role</label>
                                    <select
                                        className="form-control"
                                        value={formData.RoleID}
                                        onChange={(e) => setFormData({ ...formData, RoleID: e.target.value })}
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map((role) => (
                                            <option key={role.RoleID} value={role.RoleID}>
                                                {role.role_name} ({role.scope})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={resetForm}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;
