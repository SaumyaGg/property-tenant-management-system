require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    options: { encrypt: false, trustServerCertificate: true }
};

// ========== COMPANIES ==========
app.get('/api/companies', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Company');
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/companies', async (req, res) => {
    const { Name, Tier, is_active } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('Name', sql.VarChar, Name)
            .input('Tier', sql.VarChar, Tier)
            .input('is_active', sql.Bit, is_active)
            .query('INSERT INTO Company (Name, Tier, is_active) VALUES (@Name, @Tier, @is_active)');
        res.json({ message: 'Company created' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/companies/:id', async (req, res) => {
    const { Name, Tier, is_active } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('Name', sql.VarChar, Name)
            .input('Tier', sql.VarChar, Tier)
            .input('is_active', sql.Bit, is_active)
            .query('UPDATE Company SET Name=@Name, Tier=@Tier, is_active=@is_active WHERE CompanyID=@id');
        res.json({ message: 'Company updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/companies/:id', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM Company WHERE CompanyID=@id');
        res.json({ message: 'Company deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== PROPERTIES ==========
app.get('/api/properties', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT p.*, pm.CompanyID, c.Name as CompanyName 
            FROM Property p 
            JOIN PropertyManagement pm ON p.ManagementID = pm.ManagementID
            JOIN Company c ON pm.CompanyID = c.CompanyID`);
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/properties', async (req, res) => {
    const { ManagementID, Name, Address, Type } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('ManagementID', sql.Int, ManagementID)
            .input('Name', sql.VarChar, Name)
            .input('Address', sql.VarChar, Address)
            .input('Type', sql.VarChar, Type)
            .query('INSERT INTO Property (ManagementID, Name, Address, Type) VALUES (@ManagementID, @Name, @Address, @Type)');
        res.json({ message: 'Property created' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/properties/:id', async (req, res) => {
    const { ManagementID, Name, Address, Type } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('ManagementID', sql.Int, ManagementID)
            .input('Name', sql.VarChar, Name)
            .input('Address', sql.VarChar, Address)
            .input('Type', sql.VarChar, Type)
            .query('UPDATE Property SET ManagementID=@ManagementID, Name=@Name, Address=@Address, Type=@Type WHERE PropertyID=@id');
        res.json({ message: 'Property updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/properties/:id', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        await pool.request().input('id', sql.Int, req.params.id)
            .query('DELETE FROM Property WHERE PropertyID=@id');
        res.json({ message: 'Property deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== TENANTS ==========
app.get('/api/tenants', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT t.*, u.first_name, u.last_name, u.email, u.phone
            FROM Tenant t
            LEFT JOIN [User] u ON u.TenantID = t.TenantID`);
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/tenants', async (req, res) => {
    const { employer, income, credit_score, move_in_date } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('employer', sql.VarChar, employer)
            .input('income', sql.Decimal(10,2), income)
            .input('credit_score', sql.Int, credit_score)
            .input('move_in_date', sql.DateTime, move_in_date)
            .query('INSERT INTO Tenant (employer, income, credit_score, move_in_date) VALUES (@employer, @income, @credit_score, @move_in_date)');
        res.json({ message: 'Tenant created' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/tenants/:id', async (req, res) => {
    const { employer, income, credit_score } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('employer', sql.VarChar, employer)
            .input('income', sql.Decimal(10,2), income)
            .input('credit_score', sql.Int, credit_score)
            .query('UPDATE Tenant SET employer=@employer, income=@income, credit_score=@credit_score WHERE TenantID=@id');
        res.json({ message: 'Tenant updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== UNITS ==========
app.get('/api/units', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT u.*, p.Name as PropertyName FROM Unit u
            JOIN Property p ON u.PropertyID = p.PropertyID`);
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/units', async (req, res) => {
    const { PropertyID, unit_no, beds, baths, sq_ft } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('PropertyID', sql.Int, PropertyID)
            .input('unit_no', sql.VarChar, unit_no)
            .input('beds', sql.Int, beds)
            .input('baths', sql.Decimal(3,1), baths)
            .input('sq_ft', sql.Int, sq_ft)
            .query('INSERT INTO Unit (PropertyID, unit_no, beds, baths, sq_ft) VALUES (@PropertyID, @unit_no, @beds, @baths, @sq_ft)');
        res.json({ message: 'Unit created' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== LEASES ==========
app.get('/api/leases', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM vw_ActiveLeasesReport');
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/leases', async (req, res) => {
    const { TenantID, UnitID, start_date, end_date, monthly_rent, deposit } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('TenantID', sql.Int, TenantID)
            .input('UnitID', sql.Int, UnitID)
            .input('start_date', sql.DateTime, start_date)
            .input('end_date', sql.DateTime, end_date)
            .input('monthly_rent', sql.Decimal(10,2), monthly_rent)
            .input('deposit', sql.Decimal(10,2), deposit)
            .query('INSERT INTO Lease VALUES (@TenantID, @UnitID, @start_date, @end_date, @monthly_rent, @deposit)');
        res.json({ message: 'Lease created' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== MAINTENANCE (Uses Stored Procedure) ==========
app.get('/api/maintenance', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM vw_MaintenanceRequestSummary');
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/maintenance', async (req, res) => {
    const { UnitID, TenantID, Category, Description } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('UnitID', sql.Int, UnitID)
            .input('TenantID', sql.Int, TenantID)
            .input('Category', sql.VarChar, Category)
            .input('Description', sql.VarChar, Description)
            .output('NewRequestID', sql.Int)
            .execute('sp_CreateMaintenanceRequest');
        res.json({ message: 'Request created', RequestID: result.output.NewRequestID });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== VENDORS ==========
app.get('/api/vendors', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Vendor');
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== ASSIGN VENDOR (Uses Stored Procedure) ==========
app.post('/api/maintenance/assign', async (req, res) => {
    const { RequestID, VendorID, Status } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('RequestID', sql.Int, RequestID)
            .input('VendorID', sql.Int, VendorID)
            .input('Status', sql.VarChar, Status)
            .output('ResultMessage', sql.VarChar(200))
            .execute('sp_AssignVendorToRequest');
        res.json({ message: result.output.ResultMessage });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== INVOICES & PAYMENTS ==========
app.get('/api/invoices', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM vw_UnpaidInvoices');
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/payments', async (req, res) => {
    const { TenantID, InvoiceID, Amount, Method } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('TenantID', sql.Int, TenantID)
            .input('InvoiceID', sql.Int, InvoiceID)
            .input('Amount', sql.Decimal(10,2), Amount)
            .input('Method', sql.VarChar, Method)
            .output('NewPaymentID', sql.Int)
            .output('Message', sql.VarChar(200))
            .execute('sp_AddPayment');
        res.json({ message: result.output.Message, PaymentID: result.output.NewPaymentID });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/payments', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM vw_TenantPaymentHistory');
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== DASHBOARD VIEWS ==========
app.get('/api/dashboard/portfolio', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM vw_CompanyPortfolioOverview');
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/dashboard/revenue', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM vw_LeaseRevenueSummary');
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== PROPERTY MANAGEMENT ==========
app.get('/api/property-management', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT pm.*, c.Name as CompanyName 
            FROM PropertyManagement pm
            JOIN Company c ON pm.CompanyID = c.CompanyID`);
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add this endpoint to show UDF usage
app.get('/api/tenants/:id/balance', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('TenantID', sql.Int, req.params.id)
            .query('SELECT dbo.udf_GetOutstandingBalance(@TenantID) as Balance');
        res.json(result.recordset[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/tenants/:id/fullname', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('TenantID', sql.Int, req.params.id)
            .query('SELECT dbo.udf_GetTenantFullName(@TenantID) as FullName');
        res.json(result.recordset[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/properties/:id/unitcount', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('PropertyID', sql.Int, req.params.id)
            .query('SELECT dbo.udf_GetPropertyUnitCount(@PropertyID) as UnitCount');
        res.json(result.recordset[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/leases/:id/active', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('LeaseID', sql.Int, req.params.id)
            .query('SELECT dbo.udf_IsLeaseActive(@LeaseID) as IsActive');
        res.json(result.recordset[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/audit', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT TOP 20 * FROM AuditLog ORDER BY created_at DESC');
        res.json(result.recordset);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});