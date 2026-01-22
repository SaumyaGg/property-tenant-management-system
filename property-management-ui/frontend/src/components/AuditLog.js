import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5001/api';

function AuditLog() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    axios.get(`${API}/audit`).then(res => setLogs(res.data));
  }, []);

  return (
    <div>
      <h1>Audit Log (Trigger: trg_Audit_CompanyChanges)</h1>
      <table>
        <thead><tr><th>ID</th><th>Actor</th><th>Entity</th><th>Action</th><th>Timestamp</th></tr></thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.AuditID}>
              <td>{l.AuditID}</td><td>{l.actor}</td><td>{l.entity}</td><td>{l.action}</td><td>{new Date(l.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AuditLog;