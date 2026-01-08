USE Property_Management_DB;
GO

/* ============================================================
   1) Companies
   ============================================================ */
INSERT INTO Company (Name, Tier, is_active) VALUES
('Apex Property Group', 'Enterprise', 1),
('Urban Living Management', 'Premium', 1),
('Sunrise Realty Solutions', 'Standard', 1),
('Metro Housing Corp', 'Premium', 1),
('Green Valley Properties', 'Basic', 1),
('Coastal Management LLC', 'Standard', 1),
('Mountain View Estates', 'Enterprise', 1),
('City Center Properties', 'Premium', 1),
('Suburban Homes Inc', 'Basic', 1),
('Premier Property Partners', 'Standard', 1);

/* ============================================================
   2) Role (must exist because your schema includes it)
   ============================================================ */
INSERT INTO Role (role_name, scope) VALUES
('Super Admin', 'System'),
('Company Admin', 'Company'),
('Property Manager', 'Property'),
('Leasing Agent', 'Property'),
('Maintenance Supervisor', 'Property'),
('Accountant', 'Company'),
('Tenant', 'Unit'),
('Vendor Admin', 'Vendor'),
('Regional Manager', 'Company'),
('Customer Support', 'Company');

/* ============================================================
   3) Tenants (25 total)
   ============================================================ */
INSERT INTO Tenant (employer, income, credit_score, move_in_date) VALUES
('Tech Solutions Inc', 85000, 750, '2024-01-15'),
('Boston Medical Center', 92000, 780, '2024-02-01'),
('State Street Bank', 110000, 800, '2023-12-01'),
('Harvard University', 65000, 720, '2024-03-10'),
('Wayfair', 78000, 690, '2024-01-20'),
('Liberty Mutual', 95000, 760, '2023-11-15'),
('Vertex Pharmaceuticals', 125000, 810, '2024-02-15'),
('Suffolk Construction', 88000, 730, '2024-01-05'),
('Boston Consulting Group', 145000, 820, '2023-10-01'),
('Northeastern University', 72000, 700, '2024-03-01'),
('Amazon', 98000, 770, '2024-04-01'),
('Google', 135000, 830, '2024-05-01'),
('Tufts University', 70000, 710, '2024-04-15'),
('MIT', 88000, 740, '2024-06-01'),
('Startup XYZ', 62000, 680, '2024-03-20'),
('Dell Technologies', 91000, 740, '2024-04-05'),
('Pfizer', 120000, 805, '2024-04-12'),
('HubSpot', 98000, 760, '2024-04-20'),
('Fidelity', 130000, 820, '2024-05-02'),
('General Electric', 87000, 725, '2024-05-10'),
('KPMG', 102000, 770, '2024-05-18'),
('Moderna', 140000, 835, '2024-06-01'),
('EY', 99000, 755, '2024-06-10'),
('Stripe', 155000, 840, '2024-06-15'),
('Amazon Robotics', 125000, 810, '2024-06-20');

/* ============================================================
   4) Users (staff + tenant users)
   NOTE: TenantID NULL is correct for staff users (company employees)
   ============================================================ */
-- 5 staff + 5 tenant users (original pattern)
INSERT INTO [User] (CompanyID, TenantID, email, first_name, last_name, phone) VALUES
(1, NULL, 'john.smith@apexproperty.com', 'John', 'Smith', '617-555-0101'),
(1, 1, 'sarah.jones@email.com', 'Sarah', 'Jones', '617-555-0102'),
(2, NULL, 'mike.brown@urbanliving.com', 'Michael', 'Brown', '617-555-0103'),
(2, 2, 'emma.davis@email.com', 'Emma', 'Davis', '617-555-0104'),
(3, NULL, 'robert.wilson@sunrise.com', 'Robert', 'Wilson', '617-555-0105'),
(3, 3, 'lisa.taylor@email.com', 'Lisa', 'Taylor', '617-555-0106'),
(4, NULL, 'james.anderson@metro.com', 'James', 'Anderson', '617-555-0107'),
(4, 4, 'david.martin@email.com', 'David', 'Martin', '617-555-0108'),
(5, NULL, 'jennifer.thomas@greenvalley.com', 'Jennifer', 'Thomas', '617-555-0109'),
(5, 5, 'maria.garcia@email.com', 'Maria', 'Garcia', '617-555-0110');

-- Additional tenant users for TenantID 6–25 (20 users)
INSERT INTO [User] (CompanyID, TenantID, email, first_name, last_name, phone) VALUES
(6, 6,  'liam.scott@email.com',     'Liam',   'Scott',   '617-555-0121'),
(7, 7,  'ava.green@email.com',      'Ava',    'Green',   '617-555-0122'),
(8, 8,  'noah.hall@email.com',      'Noah',   'Hall',    '617-555-0123'),
(9, 9,  'emma.king@email.com',      'Emma',   'King',    '617-555-0124'),
(10,10, 'olivia.wood@email.com',    'Olivia', 'Wood',    '617-555-0125'),
(6, 11, 'neha.patel@email.com',     'Neha',   'Patel',   '617-555-0111'),
(7, 12, 'ryan.lee@email.com',       'Ryan',   'Lee',     '617-555-0112'),
(8, 13, 'ananya.sharma@email.com',  'Ananya', 'Sharma',  '617-555-0113'),
(9, 14, 'ethan.ng@email.com',       'Ethan',  'Ng',      '617-555-0114'),
(10,15, 'priya.iyer@email.com',     'Priya',  'Iyer',    '617-555-0115'),
(6, 16, 'alex.chen@email.com',      'Alex',   'Chen',    '617-555-0116'),
(7, 17, 'meera.nair@email.com',     'Meera',  'Nair',    '617-555-0117'),
(8, 18, 'daniel.kim@email.com',     'Daniel', 'Kim',     '617-555-0118'),
(9, 19, 'sophia.wong@email.com',    'Sophia', 'Wong',    '617-555-0119'),
(10,20, 'omar.hassan@email.com',    'Omar',   'Hassan',  '617-555-0120'),
(6, 21, 'maya.joseph@email.com',    'Maya',   'Joseph',  '617-555-0126'),
(7, 22, 'ben.turner@email.com',     'Ben',    'Turner',  '617-555-0127'),
(8, 23, 'zara.khan@email.com',      'Zara',   'Khan',    '617-555-0128'),
(9, 24, 'kevin.park@email.com',     'Kevin',  'Park',    '617-555-0129'),
(10,25, 'isabella.lopez@email.com', 'Isabella','Lopez',  '617-555-0130');

/* ============================================================
   5) User_Role (keep your original 10 mappings + make all tenant users RoleID=7)
   ============================================================ */
INSERT INTO User_Role (RoleID, UserID, date) VALUES
(2, 1, '2024-01-01'),
(7, 2, '2024-01-15'),
(3, 3, '2024-01-10'),
(7, 4, '2024-02-01'),
(3, 5, '2024-01-05'),
(7, 6, '2023-12-01'),
(4, 7, '2024-01-12'),
(7, 8, '2024-03-10'),
(5, 9, '2024-01-08'),
(7, 10, '2024-01-20');

-- Assign Tenant role to Users 11–30
DECLARE @uid INT = 11;
WHILE @uid <= 30
BEGIN
  INSERT INTO User_Role (RoleID, UserID, date) VALUES (7, @uid, GETDATE());
  SET @uid += 1;
END
GO

/* ============================================================
   6) PropertyManagement
   ============================================================ */
INSERT INTO PropertyManagement (CompanyID, management_fee, start_date, end_date) VALUES
(1, 5000.00, '2023-01-01', NULL),
(1, 7500.00, '2023-06-01', NULL),
(2, 4500.00, '2023-03-15', NULL),
(2, 6000.00, '2023-08-01', NULL),
(3, 3500.00, '2023-02-01', NULL),
(4, 8000.00, '2023-04-01', NULL),
(5, 2500.00, '2023-05-01', NULL),
(6, 4000.00, '2023-07-01', NULL),
(7, 10000.00, '2023-01-15', NULL),
(8, 5500.00, '2023-09-01', NULL);

/* ============================================================
   7) Properties (15)
   ============================================================ */
INSERT INTO Property (ManagementID, Name, Address, Type) VALUES
(1, 'Beacon Hill Apartments', '123 Charles St, Boston, MA 02114', 'Apartment'),
(1, 'Back Bay Towers', '456 Newbury St, Boston, MA 02115', 'Condo'),
(2, 'Cambridge Commons', '789 Mass Ave, Cambridge, MA 02139', 'Apartment'),
(3, 'Brookline Village Homes', '321 Harvard St, Brookline, MA 02445', 'Townhouse'),
(4, 'Fenway Park Plaza', '654 Boylston St, Boston, MA 02116', 'Apartment'),
(5, 'South End Lofts', '987 Washington St, Boston, MA 02118', 'Loft'),
(6, 'Seaport District Residences', '246 Summer St, Boston, MA 02210', 'Condo'),
(7, 'North End Flats', '135 Hanover St, Boston, MA 02113', 'Apartment'),
(8, 'Jamaica Plain Houses', '864 Centre St, Jamaica Plain, MA 02130', 'Single Family'),
(9, 'Allston Student Housing', '975 Commonwealth Ave, Boston, MA 02134', 'Apartment'),
(1, 'Downtown Crossing Residences', '12 Winter St, Boston, MA 02108', 'Apartment'),
(2, 'Somerville Heights', '88 Broadway, Somerville, MA 02145', 'Apartment'),
(3, 'Medford Square Homes', '45 High St, Medford, MA 02155', 'Condo'),
(4, 'Dorchester Bay Apartments', '210 Columbia Rd, Dorchester, MA 02125', 'Apartment'),
(5, 'Roxbury Commons', '77 Dudley St, Roxbury, MA 02119', 'Apartment');

/* ============================================================
   8) Amenities + PropertyAmenity
   ============================================================ */
INSERT INTO Amenity (scope, category, is_active) VALUES
('Property', 'Recreation', 1),
('Property', 'Parking', 1),
('Property', 'Security', 1),
('Unit', 'Kitchen', 1),
('Unit', 'Bathroom', 1),
('Property', 'Fitness', 1),
('Property', 'Business', 1),
('Unit', 'Climate', 1),
('Property', 'Pet', 1),
('Unit', 'Storage', 1);

INSERT INTO PropertyAmenity (PropertyID, AmenityID, Name, is_included) VALUES
(1, 1, 'Swimming Pool', 1),
(1, 2, 'Covered Parking', 1),
(2, 3, '24/7 Security', 1),
(2, 6, 'Fitness Center', 1),
(3, 2, 'Guest Parking', 1),
(4, 9, 'Dog Park', 1),
(5, 7, 'Business Center', 1),
(6, 1, 'Rooftop Deck', 1),
(7, 3, 'Controlled Access', 1),
(8, 2, 'Garage Parking', 1);

/* ============================================================
   9) Units (29)
   ============================================================ */
-- First 10
INSERT INTO Unit (PropertyID, unit_no, beds, baths, sq_ft) VALUES
(1, '101', 1, 1.0, 750),
(1, '201', 2, 2.0, 1100),
(2, '301', 2, 1.5, 950),
(2, '401', 3, 2.0, 1400),
(3, '1A', 1, 1.0, 650),
(4, '2B', 2, 2.5, 1200),
(5, '501', 3, 2.0, 1350),
(6, 'L1', 0, 1.0, 550),
(7, '601', 2, 1.0, 900),
(8, '1', 4, 3.0, 2200);

-- Next 9 units (properties 11–15)
INSERT INTO Unit (PropertyID, unit_no, beds, baths, sq_ft) VALUES
(11, '101', 1, 1.0, 720),
(11, '102', 2, 1.0, 980),
(12, '201', 2, 2.0, 1150),
(12, '202', 3, 2.0, 1450),
(13, '1A', 1, 1.0, 680),
(14, '301', 2, 1.5, 1050),
(14, '302', 3, 2.0, 1380),
(15, '401', 1, 1.0, 700),
(15, '402', 2, 2.0, 1180);

-- Additional 10 units
INSERT INTO Unit (PropertyID, unit_no, beds, baths, sq_ft) VALUES
(11, '103', 1, 1.0, 740),
(11, '104', 2, 2.0, 1120),
(12, '203', 1, 1.0, 700),
(12, '204', 2, 2.0, 1200),
(13, '1B',  2, 1.5, 980),
(13, '2A',  1, 1.0, 660),
(14, '303', 2, 2.0, 1250),
(14, '304', 3, 2.0, 1480),
(15, '403', 1, 1.0, 710),
(15, '404', 2, 2.0, 1190);

/* ============================================================
   10) UnitAmenity
   ============================================================ */
INSERT INTO UnitAmenity (UnitID, AmenityID, Name, is_included) VALUES
(1, 4, 'Granite Countertops', 1),
(1, 8, 'Central AC', 1),
(2, 5, 'Double Vanity', 1),
(3, 10, 'Walk-in Closet', 1),
(4, 4, 'Stainless Appliances', 1),
(5, 8, 'Heat Included', 1),
(6, 10, 'Extra Storage', 1),
(7, 5, 'Jacuzzi Tub', 1),
(8, 4, 'Kitchen Island', 1),
(9, 8, 'Ceiling Fans', 1);

/* ============================================================
   11) Lease (25) - map tenants to units
   ============================================================ */
INSERT INTO Lease (TenantID, UnitID, start_date, end_date, monthly_rent, deposit) VALUES
(1, 1, '2024-01-15', '2025-01-14', 2200.00, 2200.00),
(2, 2, '2024-02-01', '2025-01-31', 3100.00, 3100.00),
(3, 3, '2023-12-01', '2024-11-30', 2800.00, 2800.00),
(4, 4, '2024-03-10', '2025-03-09', 3800.00, 3800.00),
(5, 5, '2024-01-20', '2025-01-19', 1900.00, 1900.00),
(6, 6, '2023-11-15', '2024-11-14', 3500.00, 3500.00),
(7, 7, '2024-02-15', '2025-02-14', 3600.00, 3600.00),
(8, 8, '2024-01-05', '2025-01-04', 1600.00, 1600.00),
(9, 9, '2023-10-01', '2024-09-30', 2500.00, 2500.00),
(10, 10, '2024-03-01', '2025-02-28', 4500.00, 4500.00),
(11, 11, '2024-04-01', '2025-03-31', 2300, 2300),
(12, 12, '2024-05-01', '2025-04-30', 3200, 3200),
(13, 13, '2024-04-15', '2025-04-14', 1950, 1950),
(14, 14, '2024-06-01', '2025-05-31', 3600, 3600),
(15, 15, '2024-03-20', '2025-03-19', 2100, 2100),
(16, 20, '2024-04-05', '2025-04-04', 2400, 2400),
(17, 21, '2024-04-12', '2025-04-11', 3350, 3350),
(18, 22, '2024-04-20', '2025-04-19', 2050, 2050),
(19, 23, '2024-05-02', '2025-05-01', 3400, 3400),
(20, 24, '2024-05-10', '2025-05-09', 2250, 2250),
(21, 25, '2024-05-18', '2025-05-17', 2100, 2100),
(22, 26, '2024-06-01', '2025-05-31', 3700, 3700),
(23, 27, '2024-06-10', '2025-06-09', 3900, 3900),
(24, 28, '2024-06-15', '2025-06-14', 2550, 2550),
(25, 29, '2024-06-20', '2025-06-19', 2600, 2600);

/* ============================================================
   12) MaintenanceRequest (more rows)
   ============================================================ */
INSERT INTO MaintenanceRequest (UnitID, TenantID, category, description, status) VALUES
(1, 1, 'Plumbing', 'Leaking faucet in kitchen', 'Open'),
(2, 2, 'HVAC', 'AC unit not cooling properly', 'In Progress'),
(3, 3, 'Electrical', 'Outlet in bedroom not working', 'Open'),
(4, 4, 'Appliance', 'Refrigerator making loud noise', 'Completed'),
(5, 5, 'Plumbing', 'Toilet running constantly', 'Open'),
(6, 6, 'HVAC', 'Heating not working', 'In Progress'),
(7, 7, 'General', 'Window screen torn', 'Open'),
(8, 8, 'Electrical', 'Light fixture flickering', 'Completed'),
(9, 9, 'Appliance', 'Dishwasher not draining', 'In Progress'),
(10, 10, 'Plumbing', 'Slow drain in bathroom', 'Open'),
(11, 11, 'HVAC', 'AC making loud noise', 'Open'),
(12, 12, 'Plumbing', 'Low water pressure', 'In Progress'),
(13, 13, 'Electrical', 'Breaker keeps tripping', 'Completed'),
(14, 14, 'General', 'Door handle loose', 'Open'),
(15, 15, 'Appliance', 'Microwave not heating', 'Open'),
(20, 16, 'Plumbing', 'Kitchen sink leaking', 'Open'),
(21, 17, 'HVAC', 'AC not cooling', 'In Progress'),
(22, 18, 'Electrical', 'Bedroom outlet sparks', 'Open'),
(23, 19, 'Appliance', 'Fridge not cooling', 'Open'),
(24, 20, 'General', 'Door lock jammed', 'Completed'),
(25, 21, 'Plumbing', 'Shower drain slow', 'Open'),
(26, 22, 'HVAC', 'Heater not working', 'In Progress'),
(27, 23, 'Electrical', 'Hallway light flickers', 'Completed'),
(28, 24, 'Appliance', 'Dishwasher not draining', 'In Progress'),
(29, 25, 'General', 'Window won’t close fully', 'Open');

/* ============================================================
   13) Vendor
   ============================================================ */
INSERT INTO Vendor (Name, email, phone) VALUES
('Boston Plumbing Services', 'info@bostonplumbing.com', '617-555-0201'),
('Elite HVAC Solutions', 'service@elitehvac.com', '617-555-0202'),
('Spark Electrical Co', 'contact@sparkelectric.com', '617-555-0203'),
('Appliance Repair Pros', 'repairs@appliancepros.com', '617-555-0204'),
('General Maintenance LLC', 'admin@generalmaint.com', '617-555-0205'),
('Quick Fix Services', 'help@quickfix.com', '617-555-0206'),
('Property Care Experts', 'team@propertycare.com', '617-555-0207'),
('24/7 Emergency Repairs', 'emergency@24-7repairs.com', '617-555-0208'),
('Professional Handyman', 'book@prohandyman.com', '617-555-0209'),
('Complete Home Services', 'info@completehome.com', '617-555-0210');

/* ============================================================
   14) RequestAssigned (assign vendors to maintenance requests)
   ============================================================ */
INSERT INTO RequestAssigned (RequestID, VendorID, status, date_assigned)
SELECT
  mr.RequestID,
  ((mr.RequestID - 1) % 10) + 1 AS VendorID,
  CASE
    WHEN mr.status = 'Completed' THEN 'Completed'
    WHEN mr.status = 'In Progress' THEN 'In Progress'
    ELSE 'Assigned'
  END AS status,
  DATEADD(day, 1, mr.move_in_date)
FROM (
  SELECT mr.RequestID, mr.status, t.move_in_date
  FROM MaintenanceRequest mr
  JOIN Tenant t ON mr.TenantID = t.TenantID
) mr;

/* ============================================================
   15) Invoices (generate May–Sep for every lease)
   ============================================================ */
;WITH Months AS (
  SELECT CAST('2024-05-01' AS date) AS due_date
  UNION ALL SELECT '2024-06-01'
  UNION ALL SELECT '2024-07-01'
  UNION ALL SELECT '2024-08-01'
  UNION ALL SELECT '2024-09-01'
)
INSERT INTO Invoice (LeaseID, amount_due, due_date, status)
SELECT
  l.LeaseID,
  l.monthly_rent,
  m.due_date,
  CASE
    WHEN m.due_date <= '2024-06-01' THEN 'Paid'
    WHEN m.due_date =  '2024-07-01' THEN 'Pending'
    WHEN m.due_date =  '2024-08-01' THEN 'Overdue'
    ELSE 'Pending'
  END
FROM Lease l
CROSS JOIN Months m;

/* ============================================================
   16) Payments (pay all Paid invoices + some Pending)
   ============================================================ */
-- Pay all "Paid" invoices
INSERT INTO Payment (TenantID, InvoiceID, amount, date, method)
SELECT
  l.TenantID,
  i.InvoiceID,
  i.amount_due,
  DATEADD(day, -2, CAST(i.due_date AS datetime)),
  CASE (ABS(CHECKSUM(NEWID())) % 4)
    WHEN 0 THEN 'ACH Transfer'
    WHEN 1 THEN 'Credit Card'
    WHEN 2 THEN 'Debit Card'
    ELSE 'Check'
  END
FROM Invoice i
JOIN Lease l ON i.LeaseID = l.LeaseID
WHERE i.status = 'Paid';

-- Pay some "Pending" invoices
INSERT INTO Payment (TenantID, InvoiceID, amount, date, method)
SELECT TOP 30
  l.TenantID,
  i.InvoiceID,
  i.amount_due,
  DATEADD(day, -1, CAST(i.due_date AS datetime)),
  'ACH Transfer'
FROM Invoice i
JOIN Lease l ON i.LeaseID = l.LeaseID
WHERE i.status = 'Pending'
ORDER BY NEWID();

/* ============================================================
   17) Documents (one per lease)
   ============================================================ */
INSERT INTO Document (LeaseID, due_date, status)
SELECT LeaseID, DATEADD(day, -10, start_date), 'Active'
FROM Lease;

/* ============================================================
   18) AuditLog (base + extra activity)
   ============================================================ */
INSERT INTO AuditLog (CompanyID, actor, entity, action, created_at) VALUES
(1, 'john.smith@apexproperty.com', 'Lease', 'CREATE', '2024-01-15'),
(1, 'john.smith@apexproperty.com', 'Tenant', 'UPDATE', '2024-01-16'),
(2, 'mike.brown@urbanliving.com', 'Payment', 'CREATE', '2024-02-01'),
(2, 'mike.brown@urbanliving.com', 'MaintenanceRequest', 'UPDATE', '2024-02-02'),
(3, 'robert.wilson@sunrise.com', 'Unit', 'CREATE', '2024-01-05'),
(4, 'james.anderson@metro.com', 'Invoice', 'CREATE', '2024-03-01'),
(5, 'jennifer.thomas@greenvalley.com', 'Vendor', 'UPDATE', '2024-01-08');

-- Extra logs for trends
INSERT INTO AuditLog (CompanyID, actor, entity, action, created_at)
SELECT TOP 80
  (ABS(CHECKSUM(NEWID())) % 10) + 1,
  'system',
  CASE (ABS(CHECKSUM(NEWID())) % 5)
    WHEN 0 THEN 'Invoice'
    WHEN 1 THEN 'Payment'
    WHEN 2 THEN 'Lease'
    WHEN 3 THEN 'MaintenanceRequest'
    ELSE 'Message'
  END,
  CASE (ABS(CHECKSUM(NEWID())) % 4)
    WHEN 0 THEN 'CREATE'
    WHEN 1 THEN 'UPDATE'
    WHEN 2 THEN 'RECONCILE'
    ELSE 'AUTO_GENERATE'
  END,
  DATEADD(day, -1 * (ABS(CHECKSUM(NEWID())) % 180), GETDATE())
FROM sys.objects;

/* ============================================================
   19) MessageThread + Message
   ============================================================ */
INSERT INTO MessageThread (ManagementID, subject, created_at) VALUES
(1, 'Welcome to Beacon Hill Apartments', '2024-01-15'),
(1, 'Monthly Maintenance Schedule', '2024-02-01'),
(2, 'Parking Policy Update', '2024-02-15'),
(3, 'Emergency Contact Information', '2024-01-10'),
(4, 'Rent Payment Reminder', '2024-03-01'),
(5, 'Community Event Announcement', '2024-02-20'),
(6, 'Building Maintenance Notice', '2024-03-05'),
(7, 'Security System Upgrade', '2024-01-25'),
(8, 'Holiday Schedule', '2024-12-15'),
(9, 'Lease Renewal Information', '2024-02-28');

INSERT INTO Message (ThreadID, UserID, body, sent_at, is_read) VALUES
(1, 1, 'Welcome to your new home! Please let us know if you need anything.', '2024-01-15', 1),
(1, 2, 'Thank you! Everything looks great so far.', '2024-01-16', 1),
(2, 3, 'This months maintenance will include HVAC filter changes.', '2024-02-01', 1),
(3, 3, 'Please note the new parking assignments effective immediately.', '2024-02-15', 0),
(4, 5, 'Here are the emergency contact numbers for after-hours issues.', '2024-01-10', 1),
(5, 7, 'Reminder: Rent is due on the 1st of each month.', '2024-03-01', 0),
(6, 9, 'Join us for a community BBQ this Saturday!', '2024-02-20', 0),
(7, 1, 'Water will be shut off temporarily on Tuesday for repairs.', '2024-03-05', 0),
(8, 3, 'New key fob system will be installed next week.', '2024-01-25', 1),
(9, 5, 'Office will be closed for the holidays from Dec 24-26.', '2024-12-15', 1);

/* ============================================================
   Final sanity checks
   ============================================================ */
SELECT COUNT(*) AS Tenants FROM Tenant;
SELECT COUNT(*) AS Leases FROM Lease;
SELECT COUNT(*) AS Invoices FROM Invoice;
SELECT COUNT(*) AS Payments FROM Payment;
SELECT COUNT(*) AS MaintenanceRequests FROM MaintenanceRequest;
SELECT COUNT(*) AS Messages FROM Message;
GO
