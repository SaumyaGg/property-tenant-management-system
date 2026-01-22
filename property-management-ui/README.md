# Property Management System - GUI

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **SQL Server** (2019 or higher) - [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **Azure Data Studio** or **SQL Server Management Studio (SSMS)** - For running SQL scripts
- **Git** (optional) - For cloning the repository

### Verify Node.js Installation
```bash
node --version
npm --version
```

---

## Database Setup

### Step 1: Create the Database

Open Azure Data Studio or SSMS and connect to your SQL Server instance.

### Step 2: Run SQL Scripts (In Order)

Execute the following scripts in this exact order:

1. **create_tables.sql** - Creates the database and all tables
2. **insert_script.sql** - Populates tables with sample data
3. **psm_script.sql** - Creates stored procedures, functions, views, and triggers
4. **indexes_script.sql** - Creates non-clustered indexes for performance
5. **encryption_script.sql** - Sets up column-level encryption (optional)

### Step 3: Verify Database

Run this query to confirm setup:
```sql
USE PropertyManagementDB;
SELECT COUNT(*) as CompanyCount FROM Company;
SELECT COUNT(*) as PropertyCount FROM Property;
SELECT COUNT(*) as TenantCount FROM Tenant;
```

You should see 10 companies, 10 properties, and 10 tenants.

---

## Backend Setup

### Step 1: Navigate to Backend Folder
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs: express, mssql, cors, dotenv

### Step 3: Configure Database Connection

Create a `.env` file in the `backend` folder:
```env
DB_SERVER=localhost
DB_DATABASE=PropertyManagementDB
DB_USER=sa
DB_PASSWORD=your_password_here
DB_PORT=1433
PORT=5001
```

#### Configuration Options:

**For SQL Server Authentication:**
```env
DB_SERVER=localhost
DB_DATABASE=PropertyManagementDB
DB_USER=sa
DB_PASSWORD=YourPassword123
DB_PORT=1433
PORT=5001
```

**For Windows Authentication:** 
Update the config in `server.js`:
```javascript
const config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'PropertyManagementDB',
    options: { 
        encrypt: false, 
        trustServerCertificate: true,
        trustedConnection: true
    }
};
```

### Step 4: Start the Backend Server
```bash
node server.js
```

You should see:
```
Server running on http://localhost:5001
```

### Step 5: Verify Backend is Working

Open in browser: `http://localhost:5001/api/companies`

You should see JSON data with company information.

---

## Frontend Setup

### Step 1: Open New Terminal

Keep the backend running and open a new terminal window.

### Step 2: Navigate to Frontend Folder
```bash
cd frontend
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Configure API URL (if using different port)

If you changed the backend port from 5001, update the API URL in these files:
- `src/components/Dashboard.js`
- `src/components/Companies.js`
- `src/components/Properties.js`
- `src/components/Tenants.js`
- `src/components/Units.js`
- `src/components/Leases.js`
- `src/components/Maintenance.js`
- `src/components/Payments.js`

Change:
```javascript
const API = 'http://localhost:5001/api';
```

### Step 5: Start the Frontend
```bash
npm start
```

The application will open automatically at `http://localhost:3000`

---

## Running the Application

You need **two terminal windows** running simultaneously:

### Terminal 1 - Backend
```bash
cd backend
node server.js
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

---

## Troubleshooting

### Issue: "Network Error" in Browser

**Cause:** Backend is not running or wrong port.

**Fix:** 
1. Ensure backend is running (`node server.js`)
2. Check the PORT in `.env` matches the API URL in frontend components

### Issue: "Access Denied" or HTTP 403 Error

**Cause (Mac):** AirPlay Receiver uses port 5000 by default.

**Fix:** 
1. Go to System Preferences → General → AirDrop & Handoff
2. Turn OFF "AirPlay Receiver"
3. Or change PORT to 5001 in `.env`

### Issue: "ConnectionError" or "Login Failed"

**Cause:** Wrong database credentials.

**Fix:** 
1. Verify SQL Server is running
2. Check username/password in `.env`
3. Ensure SQL Server allows TCP/IP connections

### Issue: "Cannot find module 'express'"

**Cause:** Dependencies not installed.

**Fix:**
```bash
cd backend
npm install express mssql cors dotenv
```

### Issue: SQL Server Connection Refused

**Fix:** Enable TCP/IP in SQL Server:
1. Open SQL Server Configuration Manager
2. SQL Server Network Configuration → Protocols for [Instance]
3. Right-click TCP/IP → Enable
4. Restart SQL Server service

---

## Project Structure
```
property-management-gui/
├── backend/
│   ├── server.js          # Express API server
│   ├── .env               # Database configuration
│   └── package.json       # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main application with routing
│   │   ├── App.css        # Global styles
│   │   └── components/
│   │       ├── Dashboard.js    # Overview with stats
│   │       ├── Companies.js    # CRUD for companies
│   │       ├── Properties.js   # CRUD for properties
│   │       ├── Units.js        # CRUD for units
│   │       ├── Tenants.js      # CRUD for tenants
│   │       ├── Leases.js       # CRUD for leases
│   │       ├── Maintenance.js  # Maintenance workflow
│   │       └── Payments.js     # Payment workflow
│   └── package.json       # Frontend dependencies
│
└── sql/
    ├── create_tables.sql      # DDL script
    ├── insert_script.sql      # Sample data
    ├── psm_script.sql         # Procedures, views, triggers
    ├── indexes_script.sql     # Non-clustered indexes
    └── encryption_script.sql  # Column encryption
```

### Database Objects Demonstrated

| Type | Objects |
|------|---------|
| Stored Procedures | `sp_CreateMaintenanceRequest`, `sp_AddPayment`, `sp_AssignVendorToRequest` |
| Views | `vw_ActiveLeasesReport`, `vw_MaintenanceRequestSummary`, `vw_TenantPaymentHistory`, `vw_CompanyPortfolioOverview`, `vw_LeaseRevenueSummary`, `vw_UnpaidInvoices` |
| Trigger | `trg_Audit_CompanyChanges` (fires on Company insert/update/delete) |
| UDFs | `udf_GetTenantFullName`, `udf_GetOutstandingBalance`, `udf_GetPropertyUnitCount`, `udf_IsLeaseActive` |

---

## Stopping the Application

1. **Frontend:** Press `Ctrl + C` in the frontend terminal
2. **Backend:** Press `Ctrl + C` in the backend terminal

---

## Support

If you encounter any issues, check:
1. Both terminals are running (backend + frontend)
2. SQL Server is running and accessible
3. `.env` file has correct credentials
4. Port 5001 is not blocked by firewall
