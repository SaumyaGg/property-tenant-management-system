# Property Management System - Full Stack Application

A comprehensive property management system built with React and Node.js, featuring complete CRUD operations for managing properties, tenants, leases, maintenance requests, invoices, and more.

## 🚀 Features

- **Dashboard**: Real-time KPIs, revenue tracking, and occupancy rates
- **Property Management**: Manage properties, units, and amenities
- **Tenant Management**: Track tenants, leases, and rental agreements
- **Financial Operations**: Invoice generation, payment tracking, and revenue analytics
- **Maintenance**: Request tracking and vendor assignment
- **User Management**: Role-based access control and user administration
- **Audit Logging**: Complete activity tracking and audit trail

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **SQL Server** (with Property_Management_DB database)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the Repository

```bash
cd /Users/saumyagorantala/Documents/Projects/Property_Management_Database/property-management-ui
```

### 2. Set Up the Database

1. Ensure SQL Server is running
2. Execute the SQL scripts in order:
   ```bash
   # Navigate to the sql directory
   cd ../sql
   
   # Run these scripts in SQL Server Management Studio or Azure Data Studio:
   # 1. 01_create_schema.sql
   # 2. 02_seed_data.sql
   # 3. 03_views.sql (optional, for analytics)
   ```

### 3. Configure Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your database credentials:
   ```env
   DB_SERVER=localhost
   DB_DATABASE=Property_Management_DB
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_PORT=1433
   PORT=5000
   NODE_ENV=development
   ```

### 4. Configure Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🚀 Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:5000`

### Start the Frontend

In a new terminal:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## 📚 API Endpoints

### Companies
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create a company
- `PUT /api/companies/:id` - Update a company
- `DELETE /api/companies/:id` - Delete a company

### Properties
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create a property
- `PUT /api/properties/:id` - Update a property
- `DELETE /api/properties/:id` - Delete a property

### Tenants
- `GET /api/tenants` - Get all tenants
- `POST /api/tenants` - Create a tenant
- `PUT /api/tenants/:id` - Update a tenant
- `DELETE /api/tenants/:id` - Delete a tenant

### Units
- `GET /api/units` - Get all units
- `POST /api/units` - Create a unit
- `PUT /api/units/:id` - Update a unit
- `DELETE /api/units/:id` - Delete a unit

### Leases
- `GET /api/leases` - Get all leases
- `POST /api/leases` - Create a lease
- `PUT /api/leases/:id` - Update a lease
- `DELETE /api/leases/:id` - Delete a lease

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create an invoice
- `PUT /api/invoices/:id` - Update an invoice
- `DELETE /api/invoices/:id` - Delete an invoice

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Record a payment

### Maintenance Requests
- `GET /api/maintenance` - Get all maintenance requests
- `POST /api/maintenance` - Create a maintenance request
- `PUT /api/maintenance/:id` - Update a maintenance request
- `DELETE /api/maintenance/:id` - Delete a maintenance request

### Vendors
- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Create a vendor
- `PUT /api/vendors/:id` - Update a vendor
- `DELETE /api/vendors/:id` - Delete a vendor

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Dashboard
- `GET /api/dashboard/kpis` - Get key performance indicators
- `GET /api/dashboard/revenue` - Get revenue breakdown
- `GET /api/dashboard/occupancy` - Get occupancy rates

### Audit Log
- `GET /api/audit` - Get audit log entries

## 🎨 Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **mssql** - SQL Server driver
- **dotenv** - Environment configuration
- **cors** - Cross-origin resource sharing

### Database
- **Microsoft SQL Server** - Relational database
- 17 tables with relationships
- Multiple analytical views
- Stored procedures and functions

## 📁 Project Structure

```
property-management-ui/
├── backend/
│   ├── server.js          # Express server with all API routes
│   ├── package.json       # Backend dependencies
│   ├── .env.example       # Environment template
│   └── .env               # Your configuration (create this)
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── Companies.js
│   │   │   ├── Properties.js
│   │   │   ├── Tenants.js
│   │   │   ├── Units.js
│   │   │   ├── Leases.js
│   │   │   ├── Invoices.js
│   │   │   ├── Payments.js
│   │   │   ├── Maintenance.js
│   │   │   ├── Vendors.js
│   │   │   ├── Users.js
│   │   │   └── AuditLog.js
│   │   ├── App.js         # Main app component
│   │   ├── App.css        # Application styles
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🔧 Troubleshooting

### Database Connection Issues
- Verify SQL Server is running
- Check database credentials in `.env`
- Ensure SQL Server allows TCP/IP connections
- Verify port 1433 is not blocked by firewall

### CORS Errors
- Ensure backend is running on port 5000
- Check that frontend is configured to use `http://localhost:5000/api`

### Missing Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## 🎯 Next Steps

1. **Configure Database**: Update `.env` with your SQL Server credentials
2. **Run Database Scripts**: Execute schema and seed data scripts
3. **Start Backend**: `cd backend && npm start`
4. **Start Frontend**: `cd frontend && npm start`
5. **Access Application**: Open `http://localhost:3000`

## 📝 License

This project is part of a property management database system.

## 👥 Support

For issues or questions, please refer to the implementation documentation.
