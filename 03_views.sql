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

