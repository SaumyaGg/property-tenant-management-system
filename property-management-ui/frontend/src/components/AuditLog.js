import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/audit`);
      setLogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    const badges = {
      'CREATE': 'badge-success',
      'UPDATE': 'badge-warning',
      'DELETE': 'badge-danger',
      'RECONCILE': 'badge-info',
      'AUTO_GENERATE': 'badge-primary'
    };
    return badges[action] || 'badge-info';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading audit logs...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <h2>📋 Audit Log</h2>
          <button className="btn btn-primary" onClick={fetchLogs}>
            🔄 Refresh
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date/Time</th>
                <th>Company</th>
                <th>Actor</th>
                <th>Entity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <div className="empty-state">
                      <div className="empty-state-icon">📋</div>
                      <h3>No audit logs found</h3>
                      <p>System activity will appear here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.AuditID}>
                    <td>{log.AuditID}</td>
                    <td>{new Date(log.created_at).toLocaleString()}</td>
                    <td>{log.CompanyName}</td>
                    <td>{log.actor}</td>
                    <td>{log.entity}</td>
                    <td>
                      <span className={`badge ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AuditLog;