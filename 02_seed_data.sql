-- INSERTING DATA

-- Insert Companies
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

-- Insert Roles
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

-- Insert Tenants
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
('Northeastern University', 72000, 700, '2024-03-01');

-- Insert Users
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

-- Insert User_Role associations
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

-- Insert PropertyManagement
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

-- Insert Properties
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
(9, 'Allston Student Housing', '975 Commonwealth Ave, Boston, MA 02134', 'Apartment');

-- Insert Amenities
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

-- Insert PropertyAmenity
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

-- Insert Units
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

-- Insert UnitAmenity (10 rows)
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

-- Insert Leases
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
(10, 10, '2024-03-01', '2025-02-28', 4500.00, 4500.00);

-- Insert MaintenanceRequest
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
(10, 10, 'Plumbing', 'Slow drain in bathroom', 'Open');

-- Insert Vendors (10 rows)
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

-- Insert RequestAssigned
INSERT INTO RequestAssigned (RequestID, VendorID, status, date_assigned) VALUES
(1, 1, 'Assigned', '2024-03-15'),
(2, 2, 'In Progress', '2024-03-14'),
(3, 3, 'Assigned', '2024-03-16'),
(4, 4, 'Completed', '2024-03-10'),
(5, 1, 'Assigned', '2024-03-17'),
(6, 2, 'In Progress', '2024-03-13'),
(7, 5, 'Assigned', '2024-03-18'),
(8, 3, 'Completed', '2024-03-11'),
(9, 4, 'In Progress', '2024-03-15'),
(10, 1, 'Assigned', '2024-03-19');

-- Insert Invoices
INSERT INTO Invoice (LeaseID, amount_due, due_date, status) VALUES
(1, 2200.00, '2024-04-01', 'Paid'),
(2, 3100.00, '2024-04-01', 'Pending'),
(3, 2800.00, '2024-04-01', 'Paid'),
(4, 3800.00, '2024-04-10', 'Pending'),
(5, 1900.00, '2024-04-20', 'Paid'),
(6, 3500.00, '2024-03-15', 'Paid'),
(7, 3600.00, '2024-04-15', 'Pending'),
(8, 1600.00, '2024-04-05', 'Paid'),
(9, 2500.00, '2024-04-01', 'Overdue'),
(10, 4500.00, '2024-04-01', 'Pending');

-- Insert Payments
INSERT INTO Payment (TenantID, InvoiceID, amount, date, method) VALUES
(1, 1, 2200.00, '2024-03-28', 'ACH Transfer'),
(3, 3, 2800.00, '2024-03-30', 'Credit Card'),
(5, 5, 1900.00, '2024-03-25', 'Check'),
(6, 6, 3500.00, '2024-03-14', 'ACH Transfer'),
(8, 8, 1600.00, '2024-04-01', 'Debit Card'),
(1, 1, 2200.00, '2024-02-28', 'ACH Transfer'),
(3, 3, 2800.00, '2024-02-28', 'Credit Card'),
(5, 5, 1900.00, '2024-02-25', 'Check'),
(6, 6, 3500.00, '2024-02-14', 'ACH Transfer'),
(8, 8, 1600.00, '2024-03-01', 'Debit Card');

-- Insert Documents (10 rows)
INSERT INTO Document (LeaseID, due_date, status) VALUES
(1, '2024-01-01', 'Active'),
(2, '2024-01-15', 'Active'),
(3, '2023-11-15', 'Active'),
(4, '2024-02-28', 'Active'),
(5, '2024-01-10', 'Active'),
(6, '2023-11-01', 'Active'),
(7, '2024-02-01', 'Active'),
(8, '2023-12-20', 'Active'),
(9, '2023-09-15', 'Active'),
(10, '2024-02-15', 'Active');

-- Insert AuditLog
INSERT INTO AuditLog (CompanyID, actor, entity, action, created_at) VALUES
(1, 'john.smith@apexproperty.com', 'Lease', 'CREATE', '2024-01-15'),
(1, 'john.smith@apexproperty.com', 'Tenant', 'UPDATE', '2024-01-16'),
(2, 'mike.brown@urbanliving.com', 'Payment', 'CREATE', '2024-02-01'),
(2, 'mike.brown@urbanliving.com', 'MaintenanceRequest', 'UPDATE', '2024-02-02'),
(3, 'robert.wilson@sunrise.com', 'Unit', 'CREATE', '2024-01-05'),
(4, 'james.anderson@metro.com', 'Invoice', 'CREATE', '2024-03-01'),
(5, 'jennifer.thomas@greenvalley.com', 'Vendor', 'UPDATE', '2024-01-08'),
(6, 'admin@coastal.com', 'Property', 'CREATE', '2023-07-01'),
(7, 'admin@mountainview.com', 'User', 'CREATE', '2023-01-15'),
(8, 'admin@citycenter.com', 'Role', 'UPDATE', '2023-09-01');

-- Insert MessageThread
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

-- Insert Messages
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

------------------------------------------------------------------------------------------------------------------------
-- Additional Properties
INSERT INTO Property (ManagementID, Name, Address, Type) VALUES
(1, 'Downtown Crossing Residences', '12 Winter St, Boston, MA 02108', 'Apartment'),
(2, 'Somerville Heights', '88 Broadway, Somerville, MA 02145', 'Apartment'),
(3, 'Medford Square Homes', '45 High St, Medford, MA 02155', 'Condo'),
(4, 'Dorchester Bay Apartments', '210 Columbia Rd, Dorchester, MA 02125', 'Apartment'),
(5, 'Roxbury Commons', '77 Dudley St, Roxbury, MA 02119', 'Apartment');

-- Additional Units
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

-- Additional Tenants
INSERT INTO Tenant (employer, income, credit_score, move_in_date) VALUES
('Amazon', 98000, 770, '2024-04-01'),
('Google', 135000, 830, '2024-05-01'),
('Tufts University', 70000, 710, '2024-04-15'),
('MIT', 88000, 740, '2024-06-01'),
('Startup XYZ', 62000, 680, '2024-03-20');

-- Additional Leases
INSERT INTO Lease (TenantID, UnitID, start_date, end_date, monthly_rent, deposit) VALUES
(11, 11, '2024-04-01', '2025-03-31', 2300, 2300),
(12, 12, '2024-05-01', '2025-04-30', 3200, 3200),
(13, 13, '2024-04-15', '2025-04-14', 1950, 1950),
(14, 14, '2024-06-01', '2025-05-31', 3600, 3600),
(15, 15, '2024-03-20', '2025-03-19', 2100, 2100);

-- Additional Invoices
INSERT INTO Invoice (LeaseID, amount_due, due_date, status) VALUES
(11, 2300, '2024-05-01', 'Paid'),
(11, 2300, '2024-06-01', 'Paid'),
(12, 3200, '2024-06-01', 'Pending'),
(13, 1950, '2024-05-15', 'Paid'),
(14, 3600, '2024-07-01', 'Pending'),
(15, 2100, '2024-04-01', 'Overdue');

-- Additional Payments
INSERT INTO Payment (TenantID, InvoiceID, amount, date, method) VALUES
(11, 11, 2300, '2024-04-28', 'ACH Transfer'),
(11, 12, 2300, '2024-05-29', 'ACH Transfer'),
(13, 14, 1950, '2024-05-12', 'Debit Card'),
(15, 16, 2100, '2024-04-10', 'Check');

-- Additional Maintenance Requests
INSERT INTO MaintenanceRequest (UnitID, TenantID, category, description, status) VALUES
(11, 11, 'HVAC', 'AC making loud noise', 'Open'),
(12, 12, 'Plumbing', 'Low water pressure', 'In Progress'),
(13, 13, 'Electrical', 'Breaker keeps tripping', 'Completed'),
(14, 14, 'General', 'Door handle loose', 'Open'),
(15, 15, 'Appliance', 'Microwave not heating', 'Open');

-- Assign vendors
INSERT INTO RequestAssigned (RequestID, VendorID, status, date_assigned) VALUES
(11, 2, 'Assigned', '2024-04-20'),
(12, 1, 'In Progress', '2024-04-22'),
(13, 3, 'Completed', '2024-04-18'),
(14, 5, 'Assigned', '2024-04-25'),
(15, 4, 'Assigned', '2024-04-26');

-- Additional Audit Logs
INSERT INTO AuditLog (CompanyID, actor, entity, action, created_at) VALUES
(1, 'system', 'Invoice', 'AUTO_GENERATE', '2024-04-01'),
(2, 'accountant@urbanliving.com', 'Payment', 'RECONCILE', '2024-04-05'),
(3, 'manager@sunrise.com', 'MaintenanceRequest', 'CREATE', '2024-04-18'),
(4, 'admin@metro.com', 'Lease', 'RENEW', '2024-03-30'),
(5, 'support@greenvalley.com', 'Message', 'SEND', '2024-04-10');

-- Additional Message Threads
INSERT INTO MessageThread (ManagementID, subject) VALUES
(1, 'April Rent Reminder'),
(2, 'Planned Water Shutdown'),
(3, 'Lease Renewal Options');

-- Additional Messages
INSERT INTO Message (ThreadID, UserID, body, is_read) VALUES
(11, 1, 'April rent is due by the 1st.', 0),
(12, 3, 'Water shutdown scheduled for Friday 10am–2pm.', 0),
(13, 5, 'Please review renewal options sent via email.', 0);

SELECT * FROM Amenity
SELECT * FROM AuditLog
SELECT * FROM Company
SELECT * FROM Document
SELECT * FROM Invoice
SELECT * FROM Lease
SELECT * FROM MaintenanceRequest
SELECT * FROM Message
SELECT * FROM MessageThread
SELECT * FROM Payment
SELECT * FROM Property
SELECT * FROM PropertyAmenity
SELECT * FROM PropertyManagement
SELECT * FROM RequestAssigned
SELECT * FROM Role
SELECT * FROM Tenant
SELECT * FROM Unit
SELECT * FROM UnitAmenity
SELECT * FROM [User]
SELECT * FROM User_Role
SELECT * FROM Vendor