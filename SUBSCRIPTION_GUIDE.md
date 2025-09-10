# Subscription Plan Creation Guide

## Overview

The Fitwell Health subscription system has been enhanced to support comprehensive healthcare plans with advanced features including specialist consultations, lab test discounts, and pharmacy medicine discounts.

## Key Features

### 1. Basic Subscription Features
- **Plan Name**: Name of the subscription plan
- **Category**: BASIC, PREMIUM, ENTERPRISE, or CUSTOM
- **Price**: Monthly/annual cost of the plan
- **Duration**: Plan duration in days, months, or years
- **Max Consultations**: Maximum number of general consultations (or unlimited)
- **Max Family Members**: Maximum number of family members covered (or unlimited)
- **Discount Percentage**: General discount percentage on services
- **Features**: List of included features (comma-separated)
- **Specializations**: List of medical specializations covered (comma-separated)

### 2. Advanced Features (Optional)

#### Specialist Consultations
Format: `specialization:free_limit`
Examples:
- `cardiology:5` - 5 free cardiology consultations
- `dermatology:3` - 3 free dermatology consultations  
- `pediatrics:unlimited` - Unlimited pediatric consultations
- `all:10` - 10 free consultations with any specialist

#### Lab Test Discounts
Format: `test_type:discount%`
Examples:
- `blood_test:15` - 15% discount on blood tests
- `xray:20` - 20% discount on X-rays
- `mri:10` - 10% discount on MRI scans
- `all:5` - 5% discount on all lab tests

#### Pharmacy Medicine Discounts
Format: `medicine_type:discount%`
Examples:
- `generic:20` - 20% discount on generic medicines
- `branded:10` - 10% discount on branded medicines
- `chronic:15` - 15% discount on chronic disease medications
- `all:5` - 5% discount on all medicines

## Creating Subscription Plans

### For Super Admins

1. **Navigate to Subscription Plans**: Go to Dashboard → Super Admin → Subscription Plans
2. **Click "Create Plan"**: Open the subscription creation dialog
3. **Select Admin Network**: Choose which admin network this plan belongs to
4. **Fill Basic Information**:
   - Plan Name (required)
   - Category (required)
   - Price (required)
   - Duration (required)
   - Description
   - Max Consultations (leave empty for unlimited)
   - Max Family Members (leave empty for unlimited)
   - Discount Percentage
   - Features (comma-separated)
   - Specializations (comma-separated)

5. **Configure Advanced Features** (Optional):
   - Click "Advanced Features" to expand
   - Configure specialist consultations with free limits
   - Set up lab test discounts
   - Configure pharmacy medicine discounts

6. **Create the Plan**: Click "Create Plan" to save

### For Admins

1. **Navigate to Subscription Plans**: Go to Dashboard → Admin → Subscription Plans
2. **Click "Create Plan"**: The admin network is automatically set to your network
3. **Fill Basic and Advanced Features**: Same as above
4. **Create the Plan**: Click "Create Plan" to save

## Example Subscription Plans

### Basic Plan
```
Name: Basic Health Plan
Category: BASIC
Price: 50
Duration: 30
Duration Unit: DAYS
Max Consultations: 5
Max Family Members: 2
Discount Percentage: 10
Features: ["GP consultations", "Basic lab tests", "Email support"]
Specializations: ["General Practice"]
```

### Premium Plan with Advanced Features
```
Name: Premium Health Plan
Category: PREMIUM
Price: 200
Duration: 30
Duration Unit: DAYS
Max Consultations: 15
Max Family Members: 5
Discount Percentage: 20
Features: ["GP consultations", "Specialist consultations", "Lab tests", "Pharmacy discounts", "Priority support"]
Specializations: ["General Practice", "Cardiology", "Dermatology", "Pediatrics"]

Specialist Consultations:
- cardiology:5
- dermatology:3
- pediatrics:unlimited

Lab Test Discounts:
- blood_test:15
- xray:20
- all:5

Pharmacy Discounts:
- generic:20
- chronic:15
- all:10
```

### Custom Enterprise Plan
```
Name: Corporate Health Plan
Category: CUSTOM
Price: 500
Duration: 365
Duration Unit: DAYS
Max Consultations: unlimited
Max Family Members: 10
Discount Percentage: 25
Features: ["Unlimited GP consultations", "All specialist consultations", "All lab tests", "All pharmacy discounts", "24/7 support", "Health card"]
Specializations: ["General Practice", "Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology"]

Specialist Consultations:
- all:unlimited

Lab Test Discounts:
- all:25

Pharmacy Discounts:
- all:25
```

## API Integration

The subscription system includes utility functions for parsing and using the advanced features:

```typescript
import { 
  getConsultationLimit, 
  getLabTestDiscount, 
  getPharmacyDiscount,
  calculateLabTestPrice,
  calculateMedicinePrice
} from '@/lib/subscription-helpers'

// Check if user has free consultations left
const hasFreeConsultations = getConsultationLimit(
  subscription.specialistConsultations,
  'cardiology'
)

// Get lab test discount
const discount = getLabTestDiscount(
  subscription.labTestDiscounts,
  'blood_test'
)

// Calculate discounted price
const finalPrice = calculateLabTestPrice(
  100, // original price
  subscription.labTestDiscounts,
  'blood_test'
)
```

## Database Schema

The subscription plans are stored in the `SubscriptionPlan` table with the following advanced fields:

- `specialistConsultations`: JSON string of specialist consultation limits
- `labTestDiscounts`: JSON string of lab test discount configurations
- `pharmacyDiscounts`: JSON string of pharmacy discount configurations

## Best Practices

1. **Keep Simple Plans Simple**: Use only basic features for straightforward plans
2. **Use Advanced Features Wisely**: Add specialist consultations and discounts only when needed
3. **Test Your Configurations**: Verify that discount percentages and limits work as expected
4. **Document Your Plans**: Keep clear records of what each plan includes
5. **Update Plans Regularly**: Review and update subscription plans based on user feedback

## Troubleshooting

### Common Issues

1. **Create Plan Button Not Working**
   - Ensure you have selected an admin network
   - Check that all required fields are filled
   - Verify you have super-admin permissions

2. **Discounts Not Applying**
   - Check the format: `test_type:discount%`
   - Ensure the test type matches exactly (case-sensitive)
   - Use "all" for applying discounts to all items

3. **Specialist Consultations Not Working**
   - Check the format: `specialization:free_limit`
   - Use "unlimited" for no limits
   - Ensure specializations match the doctor specializations in the system

### Getting Help

If you encounter issues with subscription creation:
1. Check the browser console for error messages
2. Verify the API responses in the network tab
3. Ensure all required fields are properly formatted
4. Contact the system administrator for database issues