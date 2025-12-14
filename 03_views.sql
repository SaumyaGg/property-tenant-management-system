-- Revenue & Invoice Analytics View
CREATE VIEW vw_revenue_invoice AS
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

CREATE VIEW vw_payments AS
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

CREATE VIEW vw_occupancy AS
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

CREATE VIEW vw_maintenance_requests AS
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
CREATE VIEW vw_messages AS
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

CREATE VIEW vw_audit_activity AS
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