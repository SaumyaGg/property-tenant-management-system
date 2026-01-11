-- Revenue & Invoice Analytics View
CREATE OR ALTER VIEW vw_revenue_invoice AS
SELECT
    i.InvoiceID,
    i.due_date,
    DATENAME(MONTH, i.due_date) AS invoice_month,
    YEAR(i.due_date) AS invoice_year,
    i.amount_due,
    i.status AS invoice_status,

    l.LeaseID,
    l.monthly_rent,

    u.UnitID,
    p.PropertyID,
    p.Name AS PropertyName,
    p.Type AS PropertyType,

    c.CompanyID,
    c.Name AS CompanyName
FROM Invoice i
JOIN Lease l ON i.LeaseID = l.LeaseID
JOIN Unit u ON l.UnitID = u.UnitID
JOIN Property p ON u.PropertyID = p.PropertyID
JOIN PropertyManagement pm ON p.ManagementID = pm.ManagementID
JOIN Company c ON pm.CompanyID = c.CompanyID;


SELECT * FROM vw_revenue_invoice

----------------------------------------------------------------------------------------------------------------
-- Payment Performance View

CREATE OR ALTER VIEW vw_payments AS
SELECT
    pay.PaymentID,
    pay.date AS payment_date,
    DATENAME(MONTH, pay.date) AS payment_month,
    YEAR(pay.date) AS payment_year,
    pay.amount,
    pay.method AS payment_method,

    i.InvoiceID,
    i.due_date,
    i.status AS invoice_status,

    t.TenantID,

    p.PropertyID,
    p.Name AS PropertyName
FROM Payment pay
JOIN Invoice i ON pay.InvoiceID = i.InvoiceID
JOIN Lease l ON i.LeaseID = l.LeaseID
JOIN Tenant t ON pay.TenantID = t.TenantID
JOIN Unit u ON l.UnitID = u.UnitID
JOIN Property p ON u.PropertyID = p.PropertyID;


SELECT * FROM vw_payments

----------------------------------------------------------------------------------------------------------------
--Occupancy & Leasing View

CREATE OR ALTER VIEW vw_occupancy AS
SELECT
    p.PropertyID,
    p.Name AS PropertyName,
    u.UnitID,
    l.LeaseID,
    l.start_date,
    l.end_date,
    CASE
        WHEN GETDATE() BETWEEN l.start_date AND l.end_date THEN 1
        ELSE 0
    END AS is_occupied
FROM Unit u
JOIN Property p ON u.PropertyID = p.PropertyID
LEFT JOIN Lease l ON u.UnitID = l.UnitID;

SELECT * FROM vw_occupancy

----------------------------------------------------------------------------------------------------------------
-- Maintenance Operations View

CREATE OR ALTER VIEW vw_maintenance_requests AS
SELECT
    mr.RequestID,
    mr.category,
    mr.status AS request_status,

    u.UnitID,
    p.PropertyID,
    p.Name AS PropertyName,

    ra.date_assigned,
    ra.status AS assignment_status,

    v.VendorID,
    v.Name AS VendorName
FROM MaintenanceRequest mr
JOIN Unit u ON mr.UnitID = u.UnitID
JOIN Property p ON u.PropertyID = p.PropertyID
LEFT JOIN RequestAssigned ra ON mr.RequestID = ra.RequestID
LEFT JOIN Vendor v ON ra.VendorID = v.VendorID;

SELECT * FROM vw_maintenance_requests

----------------------------------------------------------------------------------------------------------------
-- Messaging & Engagement View
CREATE OR ALTER VIEW vw_messages AS
SELECT
    m.MessageID,
    m.sent_at,
    DATENAME(MONTH, m.sent_at) AS message_month,
    YEAR(m.sent_at) AS message_year,
    m.is_read,

    mt.ThreadID,
    mt.subject,

    u.UserID,
    u.email,

    c.CompanyID,
    c.Name AS CompanyName
FROM Message m
JOIN MessageThread mt ON m.ThreadID = mt.ThreadID
JOIN [User] u ON m.UserID = u.UserID
JOIN PropertyManagement pm ON mt.ManagementID = pm.ManagementID
JOIN Company c ON pm.CompanyID = c.CompanyID;


SELECT * FROM vw_messages

----------------------------------------------------------------------------------------------------------------
-- Audit & Activity View

CREATE OR ALTER VIEW vw_audit_activity AS
SELECT
    AuditID,
    created_at,
    DATENAME(MONTH, created_at) AS activity_month,
    YEAR(created_at) AS activity_year,
    entity,
    action,
    actor,
    c.CompanyID,
    c.Name AS CompanyName
FROM AuditLog a
JOIN Company c ON a.CompanyID = c.CompanyID;


SELECT * FROM vw_audit_activity

----------------------------------------------------------------------------------------------------------------
--

CREATE OR ALTER VIEW vw_dashboard_kpis AS
SELECT
    SUM(CASE WHEN i.status = 'Paid' THEN i.amount_due ELSE 0 END) AS total_revenue_collected,
    SUM(CASE WHEN i.status IN ('Pending','Overdue') THEN i.amount_due ELSE 0 END) AS outstanding_amount,
    COUNT(DISTINCT CASE WHEN GETDATE() BETWEEN l.start_date AND l.end_date THEN u.UnitID END) * 1.0
        / COUNT(DISTINCT u.UnitID) AS occupancy_rate,
    COUNT(DISTINCT mr.RequestID) AS open_maintenance_requests,
    AVG(l.monthly_rent) AS avg_rent
FROM Unit u
LEFT JOIN Lease l ON u.UnitID = l.UnitID
LEFT JOIN Invoice i ON l.LeaseID = i.LeaseID
LEFT JOIN MaintenanceRequest mr ON mr.UnitID = u.UnitID AND mr.status <> 'Completed';

SELECT * FROM vw_dashboard_kpis

----------------------------------------------------------------------------------------------------------------
--

CREATE VIEW vw_property_revenue AS
SELECT
    p.Name AS PropertyName,
    SUM(i.amount_due) AS total_revenue
FROM Invoice i
JOIN Lease l ON i.LeaseID = l.LeaseID
JOIN Unit u ON l.UnitID = u.UnitID
JOIN Property p ON u.PropertyID = p.PropertyID
WHERE i.status = 'Paid'
GROUP BY p.Name;


SELECT * FROM vw_property_revenue

----------------------------------------------------------------------------------------------------------------
--

CREATE VIEW vw_property_risk AS
SELECT
    p.Name AS PropertyName,
    p.Type,
    COUNT(DISTINCT l.TenantID) AS tenant_count,
    SUM(i.amount_due) AS total_revenue,
    SUM(CASE WHEN i.status = 'Overdue' THEN i.amount_due ELSE 0 END) AS overdue_amount
FROM Property p
JOIN Unit u ON p.PropertyID = u.PropertyID
JOIN Lease l ON u.UnitID = l.UnitID
JOIN Invoice i ON l.LeaseID = i.LeaseID
GROUP BY p.Name, p.Type;

SELECT * FROM vw_property_risk

----------------------------------------------------------------------------------------------------------------
--

CREATE VIEW vw_tenant_risk AS
SELECT
    t.TenantID,
    t.credit_score,
    SUM(l.monthly_rent) AS rent_exposure
FROM Tenant t
JOIN Lease l ON t.TenantID = l.TenantID
GROUP BY t.TenantID, t.credit_score;


SELECT * FROM vw_tenant_risk

----------------------------------------------------------------------------------------------------------------
--

CREATE VIEW vw_maintenance_funnel AS
SELECT
    status,
    COUNT(*) AS request_count
FROM MaintenanceRequest
GROUP BY status;


SELECT * FROM vw_maintenance_funnel

----------------------------------------------------------------------------------------------------------------
--

CREATE VIEW vw_vendor_performance AS
SELECT
    v.Name AS VendorName,
    mr.category,
    COUNT(*) AS total_requests
FROM Vendor v
JOIN RequestAssigned ra ON v.VendorID = ra.VendorID
JOIN MaintenanceRequest mr ON ra.RequestID = mr.RequestID
GROUP BY v.Name, mr.category;


SELECT * FROM vw_vendor_performance

