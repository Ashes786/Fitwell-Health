# Medical Management System - Dummy Credentials

## System Roles

This document provides test credentials for all user roles in the Medical Management System.

---

## 🔑 Login Credentials

### 1. Super Admin
- **Email**: `superadmin@hospital.com`
- **Password**: `SuperAdmin123!`
- **Role**: System-wide administration and configuration

### 2. Admin
- **Email**: `admin@hospital.com`
- **Password**: `Admin123!`
- **Role**: Hospital administration and management

### 3. Doctor
- **Email**: `doctor.smith@hospital.com`
- **Password**: `Doctor123!`
- **Role**: Medical consultations and patient care

### 4. Patient
- **Email**: `patient.john@hospital.com`
- **Password**: `Patient123!`
- **Role**: Access personal health information and appointments

### 5. Control Room
- **Email**: `control.room@hospital.com`
- **Password**: `Control123!`
- **Role**: Monitor hospital operations and emergencies

### 6. Attendant
- **Email**: `attendant@hospital.com`
- **Password**: `Attendant123!`
- **Role**: Patient registration and appointment scheduling

---

## 📋 Role-Specific Features

### Super Admin
- System configuration and settings
- User management and permissions
- Audit logs and system monitoring
- Database management tools

### Admin
- Department management
- Staff scheduling
- Financial reporting
- Resource allocation

### Doctor
- Patient consultations
- Medical records access
- Prescription management
- Lab test ordering

### Patient
- Personal health dashboard
- Appointment scheduling
- Lab results viewing
- Health recommendations

### Control Room
- Real-time hospital statistics
- Emergency alerts management
- Bed occupancy monitoring
- Staff coordination

### Attendant
- Patient registration
- Appointment management
- Insurance verification
- Front desk operations

---

## 🔒 Security Notes

- All passwords use strong password requirements (minimum 8 characters, uppercase, lowercase, numbers, special characters)
- In production, implement multi-factor authentication
- Passwords should be changed immediately after first login
- Use HTTPS for all authentication requests

---

## 🧪 Testing Scenarios

### Basic Login Test
1. Navigate to `/login`
2. Enter credentials for any role
3. Verify successful redirect to role-specific dashboard

### Role-Based Access Test
1. Login with different roles
2. Verify only role-appropriate features are accessible
3. Test unauthorized access prevention

### Session Management Test
1. Login and verify session persistence
2. Test logout functionality
3. Verify session timeout behavior

---

## 📞 Support

For any login issues or credential problems:
- Contact system administrator
- Check browser console for error messages
- Verify network connectivity
- Clear browser cache and cookies