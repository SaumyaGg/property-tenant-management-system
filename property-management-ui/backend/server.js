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

// Database connection pool
let pool = null;
const getPool = async () => {
    if (!pool) {
        pool = await sql.connect(config);
    }
    return pool;
};

// Error handler middleware
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ========== COMPANIES ==========
app.get('/api/companies', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Company');
    res.json(result.recordset);
}));

app.get('/api/companies/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM Company WHERE CompanyID=@id');
    res.json(result.recordset[0] || null);
}));

app.post('/api/companies', asyncHandler(async (req, res) => {
    const { Name, Tier, is_active } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('Name', sql.VarChar, Name)
        .input('Tier', sql.VarChar, Tier)
        .input('is_active', sql.Bit, is_active ?? 1)
        .query('INSERT INTO Company (Name, Tier, is_active) OUTPUT INSERTED.CompanyID VALUES (@Name, @Tier, @is_active)');

    const CompanyID = result.recordset[0].CompanyID;

    // Auto-create PropertyManagement record so it shows up in Properties dropdown
    await pool.request()
        .input('CompanyID', sql.Int, CompanyID)
        .input('fee', sql.Decimal(10, 2), 1000.00)
        .query('INSERT INTO PropertyManagement (CompanyID, management_fee, start_date) VALUES (@CompanyID, @fee, GETDATE())');

    res.json({ message: 'Company created', CompanyID });
}));

app.put('/api/companies/:id', asyncHandler(async (req, res) => {
    const { Name, Tier, is_active } = req.body;
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .input('Name', sql.VarChar, Name)
        .input('Tier', sql.VarChar, Tier)
        .input('is_active', sql.Bit, is_active)
        .query('UPDATE Company SET Name=@Name, Tier=@Tier, is_active=@is_active WHERE CompanyID=@id');
    res.json({ message: 'Company updated' });
}));

app.delete('/api/companies/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const companyId = req.params.id;

    // 1. Nullify Properties linked via PropertyManagement
    await pool.request()
        .input('id', sql.Int, companyId)
        .query(`UPDATE Property SET ManagementID = NULL 
                WHERE ManagementID IN (SELECT ManagementID FROM PropertyManagement WHERE CompanyID = @id)`);

    // 2. Delete Audit Logs
    await pool.request()
        .input('id', sql.Int, companyId)
        .query('DELETE FROM AuditLog WHERE CompanyID = @id');

    // 3. Delete Users (CompanyID is NOT NULL in User table)
    await pool.request()
        .input('id', sql.Int, companyId)
        .query('DELETE FROM [User] WHERE CompanyID = @id');

    // 4. Delete Property Management records
    await pool.request()
        .input('id', sql.Int, companyId)
        .query('DELETE FROM PropertyManagement WHERE CompanyID = @id');

    // 5. Delete Company
    await pool.request()
        .input('id', sql.Int, companyId)
        .query('DELETE FROM Company WHERE CompanyID = @id');

    res.json({ message: 'Company and related records deleted' });
}));

// ========== ROLES ==========
app.get('/api/roles', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Role');
    res.json(result.recordset);
}));

app.post('/api/roles', asyncHandler(async (req, res) => {
    const { role_name, scope } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('role_name', sql.VarChar, role_name)
        .input('scope', sql.VarChar, scope)
        .query('INSERT INTO Role (role_name, scope) OUTPUT INSERTED.RoleID VALUES (@role_name, @scope)');
    res.json({ message: 'Role created', RoleID: result.recordset[0].RoleID });
}));

app.put('/api/roles/:id', asyncHandler(async (req, res) => {
    const { role_name, scope } = req.body;
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .input('role_name', sql.VarChar, role_name)
        .input('scope', sql.VarChar, scope)
        .query('UPDATE Role SET role_name=@role_name, scope=@scope WHERE RoleID=@id');
    res.json({ message: 'Role updated' });
}));

app.delete('/api/roles/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('DELETE FROM Role WHERE RoleID=@id');
    res.json({ message: 'Role deleted' });
}));

// ========== USERS ==========
app.get('/api/users', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT u.*, c.Name as CompanyName, 
               STRING_AGG(r.role_name, ', ') as Roles
        FROM [User] u
        JOIN Company c ON u.CompanyID = c.CompanyID
        LEFT JOIN User_Role ur ON u.UserID = ur.UserID
        LEFT JOIN Role r ON ur.RoleID = r.RoleID
        GROUP BY u.UserID, u.CompanyID, u.TenantID, u.email, u.first_name, u.last_name, u.phone, c.Name
    `);
    res.json(result.recordset);
}));

app.get('/api/users/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM [User] WHERE UserID=@id');
    res.json(result.recordset[0] || null);
}));

app.post('/api/users', asyncHandler(async (req, res) => {
    const { CompanyID, TenantID, email, first_name, last_name, phone, RoleID } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('CompanyID', sql.Int, CompanyID)
        .input('TenantID', sql.Int, TenantID || null)
        .input('email', sql.VarChar, email)
        .input('first_name', sql.VarChar, first_name)
        .input('last_name', sql.VarChar, last_name)
        .input('phone', sql.VarChar, phone || null)
        .query(`INSERT INTO [User] (CompanyID, TenantID, email, first_name, last_name, phone) 
                OUTPUT INSERTED.UserID 
                VALUES (@CompanyID, @TenantID, @email, @first_name, @last_name, @phone)`);

    const UserID = result.recordset[0].UserID;

    // Assign role if provided
    if (RoleID) {
        await pool.request()
            .input('RoleID', sql.Int, RoleID)
            .input('UserID', sql.Int, UserID)
            .query('INSERT INTO User_Role (RoleID, UserID, date) VALUES (@RoleID, @UserID, GETDATE())');
    }

    res.json({ message: 'User created', UserID });
}));

app.put('/api/users/:id', asyncHandler(async (req, res) => {
    const { CompanyID, TenantID, email, first_name, last_name, phone } = req.body;
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .input('CompanyID', sql.Int, CompanyID)
        .input('TenantID', sql.Int, TenantID || null)
        .input('email', sql.VarChar, email)
        .input('first_name', sql.VarChar, first_name)
        .input('last_name', sql.VarChar, last_name)
        .input('phone', sql.VarChar, phone || null)
        .query(`UPDATE [User] SET CompanyID=@CompanyID, TenantID=@TenantID, email=@email, 
                first_name=@first_name, last_name=@last_name, phone=@phone WHERE UserID=@id`);
    res.json({ message: 'User updated' });
}));

app.delete('/api/users/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('DELETE FROM [User] WHERE UserID=@id');
    res.json({ message: 'User deleted' });
}));

// ========== PROPERTY MANAGEMENT ==========
app.get('/api/property-management', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT pm.*, c.Name as CompanyName 
        FROM PropertyManagement pm
        JOIN Company c ON pm.CompanyID = c.CompanyID
    `);
    res.json(result.recordset);
}));

app.post('/api/property-management', asyncHandler(async (req, res) => {
    const { CompanyID, management_fee, start_date, end_date } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('CompanyID', sql.Int, CompanyID)
        .input('management_fee', sql.Decimal(10, 2), management_fee)
        .input('start_date', sql.DateTime, start_date)
        .input('end_date', sql.DateTime, end_date || null)
        .query(`INSERT INTO PropertyManagement (CompanyID, management_fee, start_date, end_date) 
                OUTPUT INSERTED.ManagementID 
                VALUES (@CompanyID, @management_fee, @start_date, @end_date)`);
    res.json({ message: 'Property Management created', ManagementID: result.recordset[0].ManagementID });
}));

app.put('/api/property-management/:id', asyncHandler(async (req, res) => {
    const { CompanyID, management_fee, start_date, end_date } = req.body;
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .input('CompanyID', sql.Int, CompanyID)
        .input('management_fee', sql.Decimal(10, 2), management_fee)
        .input('start_date', sql.DateTime, start_date)
        .input('end_date', sql.DateTime, end_date || null)
        .query(`UPDATE PropertyManagement SET CompanyID=@CompanyID, management_fee=@management_fee, 
                start_date=@start_date, end_date=@end_date WHERE ManagementID=@id`);
    res.json({ message: 'Property Management updated' });
}));

app.delete('/api/property-management/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('DELETE FROM PropertyManagement WHERE ManagementID=@id');
    res.json({ message: 'Property Management deleted' });
}));

// ========== PROPERTIES ==========
app.get('/api/properties', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT p.*, pm.CompanyID, c.Name as CompanyName 
        FROM Property p 
        JOIN PropertyManagement pm ON p.ManagementID = pm.ManagementID
        JOIN Company c ON pm.CompanyID = c.CompanyID
    `);
    res.json(result.recordset);
}));

app.get('/api/properties/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM Property WHERE PropertyID=@id');
    res.json(result.recordset[0] || null);
}));

app.post('/api/properties', asyncHandler(async (req, res) => {
    const { ManagementID, Name, Address, Type } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('ManagementID', sql.Int, ManagementID)
        .input('Name', sql.VarChar, Name)
        .input('Address', sql.VarChar, Address)
        .input('Type', sql.VarChar, Type)
        .query(`INSERT INTO Property (ManagementID, Name, Address, Type) 
                OUTPUT INSERTED.PropertyID 
                VALUES (@ManagementID, @Name, @Address, @Type)`);
    res.json({ message: 'Property created', PropertyID: result.recordset[0].PropertyID });
}));

app.put('/api/properties/:id', asyncHandler(async (req, res) => {
    const { ManagementID, Name, Address, Type } = req.body;
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .input('ManagementID', sql.Int, ManagementID)
        .input('Name', sql.VarChar, Name)
        .input('Address', sql.VarChar, Address)
        .input('Type', sql.VarChar, Type)
        .query('UPDATE Property SET ManagementID=@ManagementID, Name=@Name, Address=@Address, Type=@Type WHERE PropertyID=@id');
    res.json({ message: 'Property updated' });
}));

app.delete('/api/properties/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('DELETE FROM Property WHERE PropertyID=@id');
    res.json({ message: 'Property deleted' });
}));

// ========== AMENITIES ==========
app.get('/api/amenities', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Amenity');
    res.json(result.recordset);
}));

app.post('/api/amenities', asyncHandler(async (req, res) => {
    const { scope, category, is_active } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('scope', sql.VarChar, scope)
        .input('category', sql.VarChar, category)
        .input('is_active', sql.Bit, is_active ?? 1)
        .query(`INSERT INTO Amenity (scope, category, is_active) 
                OUTPUT INSERTED.AmenityID 
                VALUES (@scope, @category, @is_active)`);
    res.json({ message: 'Amenity created', AmenityID: result.recordset[0].AmenityID });
}));

app.put('/api/amenities/:id', asyncHandler(async (req, res) => {
    const { scope, category, is_active } = req.body;
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .input('scope', sql.VarChar, scope)
        .input('category', sql.VarChar, category)
        .input('is_active', sql.Bit, is_active)
        .query('UPDATE Amenity SET scope=@scope, category=@category, is_active=@is_active WHERE AmenityID=@id');
    res.json({ message: 'Amenity updated' });
}));

app.delete('/api/amenities/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('DELETE FROM Amenity WHERE AmenityID=@id');
    res.json({ message: 'Amenity deleted' });
}));

// ========== TENANTS ==========
app.get('/api/tenants', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT t.*, u.first_name, u.last_name, u.email, u.phone
        FROM Tenant t
        LEFT JOIN [User] u ON u.TenantID = t.TenantID
    `);
    res.json(result.recordset);
}));

app.get('/api/tenants/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM Tenant WHERE TenantID=@id');
    res.json(result.recordset[0] || null);
}));

app.post('/api/tenants', asyncHandler(async (req, res) => {
    const { first_name, last_name, email, employer, income, credit_score, move_in_date } = req.body;
    const pool = await getPool();

    // Get a valid CompanyID (first one)
    const companyRes = await pool.request().query('SELECT TOP 1 CompanyID FROM Company');
    const CompanyID = companyRes.recordset[0]?.CompanyID || 1;

    // 1. Insert into Tenant table
    const tenantResult = await pool.request()
        .input('employer', sql.VarChar, employer || null)
        .input('income', sql.Decimal(10, 2), income || null)
        .input('credit_score', sql.Int, credit_score || null)
        .input('move_in_date', sql.DateTime, move_in_date)
        .query(`INSERT INTO Tenant (employer, income, credit_score, move_in_date) 
                OUTPUT INSERTED.TenantID 
                VALUES (@employer, @income, @credit_score, @move_in_date)`);

    const TenantID = tenantResult.recordset[0].TenantID;

    // 2. Create corresponding User record
    await pool.request()
        .input('CompanyID', sql.Int, CompanyID)
        .input('TenantID', sql.Int, TenantID)
        .input('email', sql.VarChar, email || `tenant${TenantID}@example.com`)
        .input('first_name', sql.VarChar, first_name || 'New')
        .input('last_name', sql.VarChar, last_name || 'Tenant')
        .query(`INSERT INTO [User] (CompanyID, TenantID, email, first_name, last_name) 
                VALUES (@CompanyID, @TenantID, @email, @first_name, @last_name)`);

    res.json({ message: 'Tenant created', TenantID });
}));

app.put('/api/tenants/:id', asyncHandler(async (req, res) => {
    const { first_name, last_name, email, employer, income, credit_score } = req.body;
    const TenantID = req.params.id;
    const pool = await getPool();

    // 1. Update Tenant table
    await pool.request()
        .input('id', sql.Int, TenantID)
        .input('employer', sql.VarChar, employer)
        .input('income', sql.Decimal(10, 2), income)
        .input('credit_score', sql.Int, credit_score)
        .query('UPDATE Tenant SET employer=@employer, income=@income, credit_score=@credit_score WHERE TenantID=@id');

    // 2. Upsert linked User record
    if (first_name || last_name || email) {
        const checkUser = await pool.request()
            .input('TenantID', sql.Int, TenantID)
            .query('SELECT UserID FROM [User] WHERE TenantID = @TenantID');

        if (checkUser.recordset.length > 0) {
            // Update
            await pool.request()
                .input('TenantID', sql.Int, TenantID)
                .input('first_name', sql.VarChar, first_name)
                .input('last_name', sql.VarChar, last_name)
                .input('email', sql.VarChar, email)
                .query(`UPDATE [User] SET 
                        first_name = ISNULL(@first_name, first_name),
                        last_name = ISNULL(@last_name, last_name),
                        email = ISNULL(@email, email)
                        WHERE TenantID = @TenantID`);
        } else {
            // Insert missing user
            const companyRes = await pool.request().query('SELECT TOP 1 CompanyID FROM Company');
            const CompanyID = companyRes.recordset[0]?.CompanyID || 1;

            await pool.request()
                .input('CompanyID', sql.Int, CompanyID)
                .input('TenantID', sql.Int, TenantID)
                .input('email', sql.VarChar, email || `tenant${TenantID}@example.com`)
                .input('first_name', sql.VarChar, first_name || 'New')
                .input('last_name', sql.VarChar, last_name || 'Tenant')
                .query(`INSERT INTO [User] (CompanyID, TenantID, email, first_name, last_name) 
                        VALUES (@CompanyID, @TenantID, @email, @first_name, @last_name)`);
        }
    }

    res.json({ message: 'Tenant updated' });
}));

app.delete('/api/tenants/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const tenantId = req.params.id;

    // 1. Unlink from User table
    await pool.request().input('id', sql.Int, tenantId).query('UPDATE [User] SET TenantID = NULL WHERE TenantID = @id');

    // 2. Delete related Leases
    await pool.request().input('id', sql.Int, tenantId).query('DELETE FROM Lease WHERE TenantID = @id');

    // 3. Delete Tenant
    await pool.request()
        .input('id', sql.Int, tenantId)
        .query('DELETE FROM Tenant WHERE TenantID=@id');
    res.json({ message: 'Tenant deleted' });
}));

// ========== UNITS ==========
app.get('/api/units', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT u.*, p.Name as PropertyName FROM Unit u
        JOIN Property p ON u.PropertyID = p.PropertyID
    `);
    res.json(result.recordset);
}));

app.get('/api/units/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM Unit WHERE UnitID=@id');
    res.json(result.recordset[0] || null);
}));

app.post('/api/units', asyncHandler(async (req, res) => {
    const { PropertyID, unit_no, beds, baths, sq_ft } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('PropertyID', sql.Int, PropertyID)
        .input('unit_no', sql.VarChar, unit_no)
        .input('beds', sql.Int, beds)
        .input('baths', sql.Decimal(3, 1), baths)
        .input('sq_ft', sql.Int, sq_ft)
        .query(`INSERT INTO Unit (PropertyID, unit_no, beds, baths, sq_ft) 
                OUTPUT INSERTED.UnitID 
                VALUES (@PropertyID, @unit_no, @beds, @baths, @sq_ft)`);
    res.json({ message: 'Unit created', UnitID: result.recordset[0].UnitID });
}));

app.put('/api/units/:id', asyncHandler(async (req, res) => {
    const { PropertyID, unit_no, beds, baths, sq_ft } = req.body;
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .input('PropertyID', sql.Int, PropertyID)
        .input('unit_no', sql.VarChar, unit_no)
        .input('beds', sql.Int, beds)
        .input('baths', sql.Decimal(3, 1), baths)
        .input('sq_ft', sql.Int, sq_ft)
        .query('UPDATE Unit SET PropertyID=@PropertyID, unit_no=@unit_no, beds=@beds, baths=@baths, sq_ft=@sq_ft WHERE UnitID=@id');
    res.json({ message: 'Unit updated' });
}));

app.delete('/api/units/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('DELETE FROM Unit WHERE UnitID=@id');
    res.json({ message: 'Unit deleted' });
}));

// ========== LEASES ==========
app.get('/api/leases', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT l.*, 
               t.TenantID, u_tenant.first_name + ' ' + u_tenant.last_name as TenantName,
               u.UnitID, u.unit_no, p.Name as PropertyName
        FROM Lease l
        JOIN Tenant t ON l.TenantID = t.TenantID
        JOIN Unit u ON l.UnitID = u.UnitID
        JOIN Property p ON u.PropertyID = p.PropertyID
        LEFT JOIN [User] u_tenant ON u_tenant.TenantID = t.TenantID
    `);
    res.json(result.recordset);
}));

app.get('/api/leases/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM Lease WHERE LeaseID=@id');
    res.json(result.recordset[0] || null);
}));

app.post('/api/leases', asyncHandler(async (req, res) => {
    const { TenantID, UnitID, start_date, end_date, monthly_rent, deposit } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('TenantID', sql.Int, TenantID)
        .input('UnitID', sql.Int, UnitID)
        .input('start_date', sql.DateTime, start_date)
        .input('end_date', sql.DateTime, end_date)
        .input('monthly_rent', sql.Decimal(10, 2), monthly_rent)
        .input('deposit', sql.Decimal(10, 2), deposit)
        .query(`INSERT INTO Lease (TenantID, UnitID, start_date, end_date, monthly_rent, deposit) 
                OUTPUT INSERTED.LeaseID 
                VALUES (@TenantID, @UnitID, @start_date, @end_date, @monthly_rent, @deposit)`);
    res.json({ message: 'Lease created', LeaseID: result.recordset[0].LeaseID });
}));

app.put('/api/leases/:id', asyncHandler(async (req, res) => {
    const { TenantID, UnitID, start_date, end_date, monthly_rent, deposit } = req.body;
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .input('TenantID', sql.Int, TenantID)
        .input('UnitID', sql.Int, UnitID)
        .input('start_date', sql.DateTime, start_date)
        .input('end_date', sql.DateTime, end_date)
        .input('monthly_rent', sql.Decimal(10, 2), monthly_rent)
        .input('deposit', sql.Decimal(10, 2), deposit)
        .query(`UPDATE Lease SET TenantID=@TenantID, UnitID=@UnitID, start_date=@start_date, 
                end_date=@end_date, monthly_rent=@monthly_rent, deposit=@deposit WHERE LeaseID=@id`);
    res.json({ message: 'Lease updated' });
}));

app.delete('/api/leases/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('DELETE FROM Lease WHERE LeaseID=@id');
    res.json({ message: 'Lease deleted' });
}));

// ========== MAINTENANCE REQUESTS ==========
app.get('/api/maintenance', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT mr.*, u.unit_no, p.Name as PropertyName,
               t_user.first_name + ' ' + t_user.last_name as TenantName,
               v.Name as VendorName, ra.status as AssignmentStatus
        FROM MaintenanceRequest mr
        JOIN Unit u ON mr.UnitID = u.UnitID
        JOIN Property p ON u.PropertyID = p.PropertyID
        JOIN Tenant t ON mr.TenantID = t.TenantID
        LEFT JOIN [User] t_user ON t_user.TenantID = t.TenantID
        LEFT JOIN RequestAssigned ra ON mr.RequestID = ra.RequestID
        LEFT JOIN Vendor v ON ra.VendorID = v.VendorID
    `);
    res.json(result.recordset);
}));

app.post('/api/maintenance', asyncHandler(async (req, res) => {
    const { UnitID, TenantID, category, description, status } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('UnitID', sql.Int, UnitID)
        .input('TenantID', sql.Int, TenantID)
        .input('category', sql.VarChar, category)
        .input('description', sql.VarChar, description)
        .input('status', sql.VarChar, status || 'Open')
        .query(`INSERT INTO MaintenanceRequest (UnitID, TenantID, category, description, status) 
                OUTPUT INSERTED.RequestID 
                VALUES (@UnitID, @TenantID, @category, @description, @status)`);
    res.json({ message: 'Maintenance request created', RequestID: result.recordset[0].RequestID });
}));

app.put('/api/maintenance/:id', asyncHandler(async (req, res) => {
    const { category, description, status } = req.body;
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .input('category', sql.VarChar, category)
        .input('description', sql.VarChar, description)
        .input('status', sql.VarChar, status)
        .query('UPDATE MaintenanceRequest SET category=@category, description=@description, status=@status WHERE RequestID=@id');
    res.json({ message: 'Maintenance request updated' });
}));

app.delete('/api/maintenance/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const requestId = req.params.id;
    // Delete from RequestAssigned first
    await pool.request().input('id', sql.Int, requestId).query('DELETE FROM RequestAssigned WHERE RequestID=@id');
    // Then delete from MaintenanceRequest
    await pool.request().input('id', sql.Int, requestId).query('DELETE FROM MaintenanceRequest WHERE RequestID=@id');
    res.json({ message: 'Maintenance request deleted' });
}));

// ========== VENDORS ==========
app.get('/api/vendors', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Vendor');
    res.json(result.recordset);
}));

app.get('/api/vendors/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM Vendor WHERE VendorID=@id');
    res.json(result.recordset[0] || null);
}));

app.post('/api/vendors', asyncHandler(async (req, res) => {
    const { Name, email, phone } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('Name', sql.VarChar, Name)
        .input('email', sql.VarChar, email)
        .input('phone', sql.VarChar, phone)
        .query(`INSERT INTO Vendor (Name, email, phone) 
                OUTPUT INSERTED.VendorID 
                VALUES (@Name, @email, @phone)`);
    res.json({ message: 'Vendor created', VendorID: result.recordset[0].VendorID });
}));

app.put('/api/vendors/:id', asyncHandler(async (req, res) => {
    const { Name, email, phone } = req.body;
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .input('Name', sql.VarChar, Name)
        .input('email', sql.VarChar, email)
        .input('phone', sql.VarChar, phone)
        .query('UPDATE Vendor SET Name=@Name, email=@email, phone=@phone WHERE VendorID=@id');
    res.json({ message: 'Vendor updated' });
}));

app.delete('/api/vendors/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('DELETE FROM Vendor WHERE VendorID=@id');
    res.json({ message: 'Vendor deleted' });
}));

// ========== ASSIGN VENDOR TO REQUEST ==========
app.post('/api/maintenance/assign', asyncHandler(async (req, res) => {
    const { RequestID, VendorID, status } = req.body;
    const pool = await getPool();
    await pool.request()
        .input('RequestID', sql.Int, RequestID)
        .input('VendorID', sql.Int, VendorID)
        .input('status', sql.VarChar, status || 'Assigned')
        .query(`INSERT INTO RequestAssigned (RequestID, VendorID, status, date_assigned) 
                VALUES (@RequestID, @VendorID, @status, GETDATE())`);
    res.json({ message: 'Vendor assigned to request' });
}));

// ========== INVOICES ==========
app.get('/api/invoices', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT i.*, l.LeaseID, l.monthly_rent, t.TenantID,
               t_user.first_name + ' ' + t_user.last_name as TenantName,
               u.unit_no, p.Name as PropertyName
        FROM Invoice i
        JOIN Lease l ON i.LeaseID = l.LeaseID
        JOIN Tenant t ON l.TenantID = t.TenantID
        LEFT JOIN [User] t_user ON t_user.TenantID = t.TenantID
        JOIN Unit u ON l.UnitID = u.UnitID
        JOIN Property p ON u.PropertyID = p.PropertyID
        ORDER BY i.due_date DESC
    `);
    res.json(result.recordset);
}));

app.get('/api/invoices/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM Invoice WHERE InvoiceID=@id');
    res.json(result.recordset[0] || null);
}));

app.post('/api/invoices', asyncHandler(async (req, res) => {
    const { LeaseID, amount_due, due_date, status } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('LeaseID', sql.Int, LeaseID)
        .input('amount_due', sql.Decimal(10, 2), amount_due)
        .input('due_date', sql.Date, due_date)
        .input('status', sql.VarChar, status || 'Pending')
        .query(`INSERT INTO Invoice (LeaseID, amount_due, due_date, status) 
                OUTPUT INSERTED.InvoiceID 
                VALUES (@LeaseID, @amount_due, @due_date, @status)`);
    res.json({ message: 'Invoice created', InvoiceID: result.recordset[0].InvoiceID });
}));

app.put('/api/invoices/:id', asyncHandler(async (req, res) => {
    const { amount_due, due_date, status } = req.body;
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .input('amount_due', sql.Decimal(10, 2), amount_due)
        .input('due_date', sql.Date, due_date)
        .input('status', sql.VarChar, status)
        .query('UPDATE Invoice SET amount_due=@amount_due, due_date=@due_date, status=@status WHERE InvoiceID=@id');
    res.json({ message: 'Invoice updated' });
}));

app.delete('/api/invoices/:id', asyncHandler(async (req, res) => {
    const invoiceId = parseInt(req.params.id);
    console.log(`Attempting to delete invoice ID: ${invoiceId}`);

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        // 1. Delete associated payments first
        console.log(`Deleting payments for invoice ${invoiceId}...`);
        await request
            .input('id', sql.Int, invoiceId)
            .query('DELETE FROM Payment WHERE InvoiceID = @id');

        // 2. Delete the invoice
        console.log(`Deleting invoice ${invoiceId}...`);
        await request.query('DELETE FROM Invoice WHERE InvoiceID = @id');

        await transaction.commit();
        console.log(`Invoice ${invoiceId} and associated payments deleted successfully.`);
        res.json({ message: 'Invoice and associated payments deleted' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error during invoice deletion:', error);
        res.status(500).json({ error: 'Failed to delete invoice: ' + error.message });
    }
}));

// ========== PAYMENTS ==========
app.get('/api/payments', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT p.*, i.InvoiceID, i.amount_due, i.due_date,
               t_user.first_name + ' ' + t_user.last_name as TenantName
        FROM Payment p
        JOIN Invoice i ON p.InvoiceID = i.InvoiceID
        JOIN Tenant t ON p.TenantID = t.TenantID
        LEFT JOIN [User] t_user ON t_user.TenantID = t.TenantID
        ORDER BY p.date DESC
    `);
    res.json(result.recordset);
}));

app.post('/api/payments', asyncHandler(async (req, res) => {
    let { TenantID, InvoiceID, amount, method } = req.body;
    const pool = await getPool();

    // Safety: If TenantID is missing, try to derive it from the Invoice
    if (!TenantID) {
        const invoiceRes = await pool.request()
            .input('InvoiceID', sql.Int, InvoiceID)
            .query('SELECT l.TenantID FROM Invoice i JOIN Lease l ON i.LeaseID = l.LeaseID WHERE i.InvoiceID = @InvoiceID');

        if (invoiceRes.recordset.length > 0) {
            TenantID = invoiceRes.recordset[0].TenantID;
        } else {
            return res.status(400).json({ error: 'Could not find tenant for this invoice' });
        }
    }

    const result = await pool.request()
        .input('TenantID', sql.Int, TenantID)
        .input('InvoiceID', sql.Int, InvoiceID)
        .input('amount', sql.Decimal(10, 2), amount)
        .input('method', sql.VarChar, method)
        .query(`INSERT INTO Payment (TenantID, InvoiceID, amount, date, method) 
                OUTPUT INSERTED.PaymentID 
                VALUES (@TenantID, @InvoiceID, @amount, GETDATE(), @method)`);

    // Update invoice status if fully paid (optional but good)
    await pool.request()
        .input('InvoiceID', sql.Int, InvoiceID)
        .query("UPDATE Invoice SET status = 'Paid' WHERE InvoiceID = @InvoiceID");

    res.json({ message: 'Payment recorded', PaymentID: result.recordset[0].PaymentID });
}));

// ========== DOCUMENTS ==========
app.get('/api/documents', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT d.*, l.LeaseID,
               t_user.first_name + ' ' + t_user.last_name as TenantName,
               u.unit_no, p.Name as PropertyName
        FROM Document d
        JOIN Lease l ON d.LeaseID = l.LeaseID
        JOIN Tenant t ON l.TenantID = t.TenantID
        LEFT JOIN [User] t_user ON t_user.TenantID = t.TenantID
        JOIN Unit u ON l.UnitID = u.UnitID
        JOIN Property p ON u.PropertyID = p.PropertyID
    `);
    res.json(result.recordset);
}));

app.post('/api/documents', asyncHandler(async (req, res) => {
    const { LeaseID, due_date, status } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('LeaseID', sql.Int, LeaseID)
        .input('due_date', sql.DateTime, due_date || null)
        .input('status', sql.VarChar, status || 'Active')
        .query(`INSERT INTO Document (LeaseID, due_date, status) 
                OUTPUT INSERTED.DocumentID 
                VALUES (@LeaseID, @due_date, @status)`);
    res.json({ message: 'Document created', DocumentID: result.recordset[0].DocumentID });
}));

app.put('/api/documents/:id', asyncHandler(async (req, res) => {
    const { due_date, status } = req.body;
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .input('due_date', sql.DateTime, due_date)
        .input('status', sql.VarChar, status)
        .query('UPDATE Document SET due_date=@due_date, status=@status WHERE DocumentID=@id');
    res.json({ message: 'Document updated' });
}));

app.delete('/api/documents/:id', asyncHandler(async (req, res) => {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('DELETE FROM Document WHERE DocumentID=@id');
    res.json({ message: 'Document deleted' });
}));

// ========== MESSAGE THREADS ==========
app.get('/api/message-threads', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT mt.*, pm.ManagementID, c.Name as CompanyName,
               (SELECT COUNT(*) FROM Message WHERE ThreadID = mt.ThreadID) as MessageCount
        FROM MessageThread mt
        JOIN PropertyManagement pm ON mt.ManagementID = pm.ManagementID
        JOIN Company c ON pm.CompanyID = c.CompanyID
        ORDER BY mt.created_at DESC
    `);
    res.json(result.recordset);
}));

app.post('/api/message-threads', asyncHandler(async (req, res) => {
    const { ManagementID, subject } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('ManagementID', sql.Int, ManagementID)
        .input('subject', sql.VarChar, subject)
        .query(`INSERT INTO MessageThread (ManagementID, subject, created_at) 
                OUTPUT INSERTED.ThreadID 
                VALUES (@ManagementID, @subject, GETDATE())`);
    res.json({ message: 'Message thread created', ThreadID: result.recordset[0].ThreadID });
}));

// ========== MESSAGES ==========
app.get('/api/messages', asyncHandler(async (req, res) => {
    const { threadId } = req.query;
    const pool = await getPool();

    let query = `
        SELECT m.*, mt.subject, u.first_name + ' ' + u.last_name as SenderName, u.email
        FROM Message m
        JOIN MessageThread mt ON m.ThreadID = mt.ThreadID
        JOIN [User] u ON m.UserID = u.UserID
    `;

    if (threadId) {
        query += ` WHERE m.ThreadID = @threadId`;
    }

    query += ` ORDER BY m.sent_at DESC`;

    const request = pool.request();
    if (threadId) {
        request.input('threadId', sql.Int, threadId);
    }

    const result = await request.query(query);
    res.json(result.recordset);
}));

app.post('/api/messages', asyncHandler(async (req, res) => {
    const { ThreadID, UserID, body } = req.body;
    const pool = await getPool();
    const result = await pool.request()
        .input('ThreadID', sql.Int, ThreadID)
        .input('UserID', sql.Int, UserID)
        .input('body', sql.VarChar(sql.MAX), body)
        .query(`INSERT INTO Message (ThreadID, UserID, body, sent_at, is_read) 
                OUTPUT INSERTED.MessageID 
                VALUES (@ThreadID, @UserID, @body, GETDATE(), 0)`);
    res.json({ message: 'Message sent', MessageID: result.recordset[0].MessageID });
}));

app.put('/api/messages/:id/read', asyncHandler(async (req, res) => {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('UPDATE Message SET is_read=1 WHERE MessageID=@id');
    res.json({ message: 'Message marked as read' });
}));

// ========== AUDIT LOG ==========
app.get('/api/audit', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT TOP 100 a.*, c.Name as CompanyName 
        FROM AuditLog a
        JOIN Company c ON a.CompanyID = c.CompanyID
        ORDER BY a.created_at DESC
    `);
    res.json(result.recordset);
}));

// ========== DASHBOARD VIEWS ==========
app.get('/api/dashboard/kpis', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT
            (SELECT COUNT(*) FROM Property) as TotalProperties,
            (SELECT COUNT(*) FROM Unit) as TotalUnits,
            (SELECT COUNT(*) FROM Tenant) as TotalTenants,
            (SELECT COUNT(*) FROM Lease WHERE GETDATE() BETWEEN start_date AND end_date) as ActiveLeases,
            (SELECT SUM(amount_due) FROM Invoice WHERE status = 'Paid') as TotalRevenue,
            (SELECT SUM(amount_due) FROM Invoice WHERE status IN ('Pending', 'Overdue')) as OutstandingAmount,
            (SELECT COUNT(*) FROM MaintenanceRequest WHERE status != 'Completed') as OpenMaintenanceRequests,
            (SELECT AVG(monthly_rent) FROM Lease WHERE GETDATE() BETWEEN start_date AND end_date) as AvgRent
    `);
    res.json(result.recordset[0]);
}));

app.get('/api/dashboard/revenue', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT 
            FORMAT(due_date, 'yyyy-MM') as Month,
            SUM(CASE WHEN status = 'Paid' THEN amount_due ELSE 0 END) as PaidAmount,
            SUM(CASE WHEN status = 'Pending' THEN amount_due ELSE 0 END) as PendingAmount,
            SUM(CASE WHEN status = 'Overdue' THEN amount_due ELSE 0 END) as OverdueAmount
        FROM Invoice
        GROUP BY FORMAT(due_date, 'yyyy-MM')
        ORDER BY Month DESC
    `);
    res.json(result.recordset);
}));

app.get('/api/dashboard/occupancy', asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT 
            p.Name as PropertyName,
            COUNT(u.UnitID) as TotalUnits,
            COUNT(CASE WHEN GETDATE() BETWEEN l.start_date AND l.end_date THEN 1 END) as OccupiedUnits,
            CAST(COUNT(CASE WHEN GETDATE() BETWEEN l.start_date AND l.end_date THEN 1 END) * 100.0 / COUNT(u.UnitID) AS DECIMAL(5,2)) as OccupancyRate
        FROM Property p
        JOIN Unit u ON p.PropertyID = u.PropertyID
        LEFT JOIN Lease l ON u.UnitID = l.UnitID
        GROUP BY p.PropertyID, p.Name
    `);
    res.json(result.recordset);
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: err.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api/*`);
});