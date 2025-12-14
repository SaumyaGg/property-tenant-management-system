-- Property Management Database Implementation
-- DDL SCRIPT

-- Create Database
CREATE DATABASE Property_Management_DB;
GO

USE Property_Management_DB;
GO

-- Drop existing tables if they exist
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AuditLog]') AND type in (N'U'))
DROP TABLE [dbo].[AuditLog];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MessageThread]') AND type in (N'U'))
DROP TABLE [dbo].[MessageThread];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Message]') AND type in (N'U'))
DROP TABLE [dbo].[Message];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Payment]') AND type in (N'U'))
DROP TABLE [dbo].[Payment];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Invoice]') AND type in (N'U'))
DROP TABLE [dbo].[Invoice];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Document]') AND type in (N'U'))
DROP TABLE [dbo].[Document];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RequestAssigned]') AND type in (N'U'))
DROP TABLE [dbo].[RequestAssigned];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Vendor]') AND type in (N'U'))
DROP TABLE [dbo].[Vendor];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MaintenanceRequest]') AND type in (N'U'))
DROP TABLE [dbo].[MaintenanceRequest];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Lease]') AND type in (N'U'))
DROP TABLE [dbo].[Lease];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Tenant]') AND type in (N'U'))
DROP TABLE [dbo].[Tenant];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UnitAmenity]') AND type in (N'U'))
DROP TABLE [dbo].[UnitAmenity];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Unit]') AND type in (N'U'))
DROP TABLE [dbo].[Unit];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PropertyAmenity]') AND type in (N'U'))
DROP TABLE [dbo].[PropertyAmenity];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Amenity]') AND type in (N'U'))
DROP TABLE [dbo].[Amenity];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Property]') AND type in (N'U'))
DROP TABLE [dbo].[Property];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PropertyManagement]') AND type in (N'U'))
DROP TABLE [dbo].[PropertyManagement];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Role]') AND type in (N'U'))
DROP TABLE [dbo].[User_Role];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Role]') AND type in (N'U'))
DROP TABLE [dbo].[Role];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User]') AND type in (N'U'))
DROP TABLE [dbo].[User];
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Company]') AND type in (N'U'))
DROP TABLE [dbo].[Company];
GO

-- Create Company table
CREATE TABLE Company (
    CompanyID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    Tier VARCHAR(50) NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,
    -- CHECK constraint 1: Ensure tier is valid
    CONSTRAINT CHK_Company_Tier CHECK (Tier IN ('Basic', 'Standard', 'Premium', 'Enterprise'))
);

-- Create Role table
CREATE TABLE Role (
    RoleID INT PRIMARY KEY IDENTITY(1,1),
    role_name VARCHAR(50) NOT NULL UNIQUE,
    scope VARCHAR(50) NOT NULL
);

-- Create User table
CREATE TABLE [User] (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    CompanyID INT NOT NULL,
    TenantID INT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NULL,
    FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID)
);

-- Create User_Role table
CREATE TABLE User_Role (
    RoleID INT NOT NULL,
    UserID INT NOT NULL,
    date DATETIME NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (RoleID, UserID),
    FOREIGN KEY (RoleID) REFERENCES Role(RoleID),
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

-- Create PropertyManagement table
CREATE TABLE PropertyManagement (
    ManagementID INT PRIMARY KEY IDENTITY(1,1),
    CompanyID INT NOT NULL,
    management_fee DECIMAL(10,2) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NULL,
    -- CHECK constraint 2: Ensure management fee is positive
    CONSTRAINT CHK_PropertyManagement_Fee CHECK (management_fee > 0),
    FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID)
);

-- Create Property table
CREATE TABLE Property (
    PropertyID INT PRIMARY KEY IDENTITY(1,1),
    ManagementID INT NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Address VARCHAR(200) NOT NULL,
    Type VARCHAR(50) NOT NULL,
    FOREIGN KEY (ManagementID) REFERENCES PropertyManagement(ManagementID)
);

-- Create Amenity table
CREATE TABLE Amenity (
    AmenityID INT PRIMARY KEY IDENTITY(1,1),
    scope VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_active BIT NOT NULL DEFAULT 1
);

-- Create PropertyAmenity table
CREATE TABLE PropertyAmenity (
    PropertyID INT NOT NULL,
    AmenityID INT NOT NULL,
    Name VARCHAR(100) NOT NULL,
    is_included BIT NOT NULL DEFAULT 0,
    PRIMARY KEY (PropertyID, AmenityID),
    FOREIGN KEY (PropertyID) REFERENCES Property(PropertyID),
    FOREIGN KEY (AmenityID) REFERENCES Amenity(AmenityID)
);

-- Create Unit table
CREATE TABLE Unit (
    UnitID INT PRIMARY KEY IDENTITY(1,1),
    PropertyID INT NOT NULL,
    unit_no VARCHAR(20) NOT NULL,
    beds INT NOT NULL,
    baths DECIMAL(3,1) NOT NULL,
    sq_ft INT NOT NULL,
    -- CHECK constraint 3: Ensure reasonable values for unit specifications
    CONSTRAINT CHK_Unit_Specs CHECK (beds >= 0 AND baths >= 0 AND sq_ft > 0),
    FOREIGN KEY (PropertyID) REFERENCES Property(PropertyID)
);

-- Create UnitAmenity table
CREATE TABLE UnitAmenity (
    UnitID INT NOT NULL,
    AmenityID INT NOT NULL,
    Name VARCHAR(100) NOT NULL,
    is_included BIT NOT NULL DEFAULT 0,
    PRIMARY KEY (UnitID, AmenityID),
    FOREIGN KEY (UnitID) REFERENCES Unit(UnitID),
    FOREIGN KEY (AmenityID) REFERENCES Amenity(AmenityID)
);

-- Create Tenant table
CREATE TABLE Tenant (
    TenantID INT PRIMARY KEY IDENTITY(1,1),
    employer VARCHAR(100) NULL,
    income DECIMAL(10,2) NULL,
    credit_score INT NULL,
    move_in_date DATETIME NOT NULL,
    -- CHECK constraint 4: Ensure credit score is within valid range
    CONSTRAINT CHK_Tenant_CreditScore CHECK (credit_score IS NULL OR (credit_score >= 300 AND credit_score <= 850))
);

-- Create Lease table
CREATE TABLE Lease (
    LeaseID INT PRIMARY KEY IDENTITY(1,1),
    TenantID INT NOT NULL,
    UnitID INT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    deposit DECIMAL(10,2) NOT NULL,
    -- CHECK constraint 5: Ensure rent and deposit are positive
    CONSTRAINT CHK_Lease_Amounts CHECK (monthly_rent > 0 AND deposit >= 0),
    FOREIGN KEY (TenantID) REFERENCES Tenant(TenantID),
    FOREIGN KEY (UnitID) REFERENCES Unit(UnitID)
);

-- Create MaintenanceRequest table
CREATE TABLE MaintenanceRequest (
    RequestID INT PRIMARY KEY IDENTITY(1,1),
    UnitID INT NOT NULL,
    TenantID INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open',
    FOREIGN KEY (UnitID) REFERENCES Unit(UnitID),
    FOREIGN KEY (TenantID) REFERENCES Tenant(TenantID)
);

-- Create Vendor table
CREATE TABLE Vendor (
    VendorID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

-- Create RequestAssigned table
CREATE TABLE RequestAssigned (
    RequestID INT NOT NULL,
    VendorID INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Assigned',
    date_assigned DATETIME NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (RequestID, VendorID),
    FOREIGN KEY (RequestID) REFERENCES MaintenanceRequest(RequestID),
    FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID)
);

-- Create Invoice table
CREATE TABLE Invoice (
    InvoiceID INT PRIMARY KEY IDENTITY(1,1),
    LeaseID INT NOT NULL,
    amount_due DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (LeaseID) REFERENCES Lease(LeaseID)
);

-- Create Payment table
CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    TenantID INT NOT NULL,
    InvoiceID INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATETIME NOT NULL DEFAULT GETDATE(),
    method VARCHAR(50) NOT NULL,
    FOREIGN KEY (TenantID) REFERENCES Tenant(TenantID),
    FOREIGN KEY (InvoiceID) REFERENCES Invoice(InvoiceID)
);

-- Create Document table
CREATE TABLE Document (
    DocumentID INT PRIMARY KEY IDENTITY(1,1),
    LeaseID INT NOT NULL,
    due_date DATETIME NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    FOREIGN KEY (LeaseID) REFERENCES Lease(LeaseID)
);

-- Create AuditLog table
CREATE TABLE AuditLog (
    AuditID INT PRIMARY KEY IDENTITY(1,1),
    CompanyID INT NOT NULL,
    actor VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID)
);

-- Create MessageThread table
CREATE TABLE MessageThread (
    ThreadID INT PRIMARY KEY IDENTITY(1,1),
    ManagementID INT NOT NULL,
    subject VARCHAR(200) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (ManagementID) REFERENCES PropertyManagement(ManagementID)
);

-- Create Message table
-- CREATE TABLE Message (
--     MessageID INT PRIMARY KEY IDENTITY(1,1),
--     ThreadID INT NOT NULL,
--     UserID INT NOT NULL,
--     body VARCHAR(MAX) NOT NULL,
--     sent_at DATETIME NOT NULL DEFAULT GETDATE(),
--     is_read BIT NOT NULL DEFAULT 0,
--     FOREIGN KEY (ThreadID) REFERENCES MessageThread(ThreadID),
--     FOREIGN KEY (UserID) REFERENCES [User](UserID)
-- );

CREATE TABLE Message (
    MessageID INT PRIMARY KEY IDENTITY(1,1),
    ThreadID INT NOT NULL,
    UserID INT NOT NULL,
    body VARCHAR(MAX) NOT NULL,
    sent_at DATETIME NOT NULL DEFAULT GETDATE(),
    is_read BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Message_Thread
        FOREIGN KEY (ThreadID) REFERENCES dbo.MessageThread(ThreadID),
    CONSTRAINT FK_Message_User
        FOREIGN KEY (UserID) REFERENCES dbo.[User](UserID)
);

DROP TABLE Message


-- Add foreign key for User.TenantID after Tenant table is created
ALTER TABLE dbo.[User]
ADD CONSTRAINT FK_User_Tenant
FOREIGN KEY (TenantID) REFERENCES dbo.Tenant(TenantID);


GO
