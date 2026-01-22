import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5001/api';

function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  useEffect(() => {
    axios.get(`${API}/dashboard/portfolio`).then(res => setPortfolio(res.data));
    axios.get(`${API}/dashboard/revenue`).then(res => setRevenue(res.data));
    axios.get(`${API}/maintenance`).then(res => setMaintenance(res.data.slice(0, 5)));
  }, []);

  const totalUnits = portfolio.reduce((sum, p) => sum + p.TotalUnits, 0);
  const totalRevenue = revenue.reduce((sum, r) => sum + parseFloat(r.TotalMonthlyRent || 0), 0);
  const openRequests = maintenance.filter(m => m.RequestStatus === 'Open').length;

  return (
    <div>
      <div className="page-header"><h1>Dashboard</h1></div>
      
      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Properties</h3>
          <div className="value">{portfolio.reduce((sum, p) => sum + p.TotalProperties, 0)}</div>
        </div>
        <div className="card">
          <h3>Total Units</h3>
          <div className="value">{totalUnits}</div>
        </div>
        <div className="card">
          <h3>Monthly Revenue</h3>
          <div className="value">${totalRevenue.toLocaleString()}</div>
        </div>
        <div className="card">
          <h3>Open Maintenance</h3>
          <div className="value">{openRequests}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>Company Portfolio</h3>
          <table>
            <thead><tr><th>Company</th><th>Properties</th><th>Units</th></tr></thead>
            <tbody>
              {portfolio.map(p => (
                <tr key={p.CompanyID}>
                  <td>{p.CompanyName}</td>
                  <td>{p.TotalProperties}</td>
                  <td>{p.TotalUnits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>Revenue by Property</h3>
          <table>
            <thead><tr><th>Property</th><th>Monthly Rent</th></tr></thead>
            <tbody>
              {revenue.map(r => (
                <tr key={r.PropertyID}>
                  <td>{r.PropertyName}</td>
                  <td>${parseFloat(r.TotalMonthlyRent).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;