import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Companies from './components/Companies';
import Properties from './components/Properties';
import Tenants from './components/Tenants';
import Units from './components/Units';
import Leases from './components/Leases';
import Maintenance from './components/Maintenance';
import Payments from './components/Payments';
import Users from './components/Users';
import Vendors from './components/Vendors';
import Invoices from './components/Invoices';
import AuditLog from './components/AuditLog';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <h2>🏢 Property MS</h2>
          <Link to="/" className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </Link>
          <Link to="/companies" className={activeTab === 'companies' ? 'active' : ''} onClick={() => setActiveTab('companies')}>
            🏛️ Companies
          </Link>
          <Link to="/properties" className={activeTab === 'properties' ? 'active' : ''} onClick={() => setActiveTab('properties')}>
            🏠 Properties
          </Link>
          <Link to="/units" className={activeTab === 'units' ? 'active' : ''} onClick={() => setActiveTab('units')}>
            🚪 Units
          </Link>
          <Link to="/tenants" className={activeTab === 'tenants' ? 'active' : ''} onClick={() => setActiveTab('tenants')}>
            👥 Tenants
          </Link>
          <Link to="/leases" className={activeTab === 'leases' ? 'active' : ''} onClick={() => setActiveTab('leases')}>
            📄 Leases
          </Link>
          <Link to="/invoices" className={activeTab === 'invoices' ? 'active' : ''} onClick={() => setActiveTab('invoices')}>
            💰 Invoices
          </Link>
          <Link to="/payments" className={activeTab === 'payments' ? 'active' : ''} onClick={() => setActiveTab('payments')}>
            💳 Payments
          </Link>
          <Link to="/maintenance" className={activeTab === 'maintenance' ? 'active' : ''} onClick={() => setActiveTab('maintenance')}>
            🔧 Maintenance
          </Link>
          <Link to="/vendors" className={activeTab === 'vendors' ? 'active' : ''} onClick={() => setActiveTab('vendors')}>
            🛠️ Vendors
          </Link>
          <Link to="/users" className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            👤 Users
          </Link>
          <Link to="/audit" className={activeTab === 'audit' ? 'active' : ''} onClick={() => setActiveTab('audit')}>
            📋 Audit Log
          </Link>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/units" element={<Units />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/leases" element={<Leases />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/users" element={<Users />} />
            <Route path="/audit" element={<AuditLog />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;