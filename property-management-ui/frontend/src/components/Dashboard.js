import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [kpisRes, revenueRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/kpis`),
        axios.get(`${API_URL}/dashboard/revenue`)
      ]);
      setKpis(kpisRes.data);
      setRevenue(revenueRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 style={{ marginBottom: '2rem', color: 'var(--dark)', fontSize: '2rem', fontWeight: '700' }}>
        📊 Dashboard Overview
      </h1>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-label">Total Properties</div>
          <div className="stat-value">{kpis?.TotalProperties || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚪</div>
          <div className="stat-label">Total Units</div>
          <div className="stat-value">{kpis?.TotalUnits || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Tenants</div>
          <div className="stat-value">{kpis?.TotalTenants || 0}</div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">
            ${kpis?.TotalRevenue ? parseFloat(kpis.TotalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">🔧</div>
          <div className="stat-label">Open Maintenance</div>
          <div className="stat-value">{kpis?.OpenMaintenanceRequests || 0}</div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2>💵 Revenue Breakdown (Recent Months)</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Overdue</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {revenue.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No revenue data available</td>
                </tr>
              ) : (
                revenue.slice(0, 6).map((item, index) => {
                  const total = parseFloat(item.PaidAmount || 0) + parseFloat(item.PendingAmount || 0) + parseFloat(item.OverdueAmount || 0);
                  return (
                    <tr key={index}>
                      <td>{item.Month}</td>
                      <td>
                        <span className="badge badge-success">
                          ${parseFloat(item.PaidAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-warning">
                          ${parseFloat(item.PendingAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-danger">
                          ${parseFloat(item.OverdueAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>
                        <strong>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;