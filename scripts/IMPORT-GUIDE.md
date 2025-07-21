# 🚀 Complete Guide: Import Excel Data to MongoDB

## Overview
You have 700 records in Excel that need to be imported into your new IHU USA website's MongoDB database. This guide will walk you through the entire process.

## ✅ What's Already Set Up
- ✅ MongoDB connection working
- ✅ Import script created (`scripts/excel-import.ts`)
- ✅ Dependencies installed (xlsx, tsx)
- ✅ Database collections exist and are accessible
- ✅ Test script working

## 📋 Current Database Status
Based on the test, your database currently has:
- **Registration**: 28 documents
- **Users**: 1 document  
- **Courses**: 27 documents
- **Teams**: 26 documents
- **Blogs**: 7 documents
- **Events**: 4 documents
- **FAQ**: 0 documents

## 🎯 Step-by-Step Import Process

### Step 1: Prepare Your Excel File

1. **Create a new Excel file** (`.xlsx` format)
2. **Create separate sheets** for each collection you want to import:
   - `Registration` - for student registrations
   - `Users` - for admin/staff users
   - `Courses` - for course catalog
   - `Teams` - for team members
   - `Blogs` - for blog posts
   - `Events` - for events
   - `FAQ` - for frequently asked questions

3. **Use the exact column headers** from the template in `scripts/sample-template.md`

### Step 2: Structure Your Data

#### For Registration Data:
```
Registration Number | First Name | Middle Name | Last Name | Former/Maiden Name | Date of Birth | Gender | Email Address | Country Code | Phone | Address | Street Address 2 | City | State | Country/Region | Zip/Postal Code | Resident | Enrollment Type | Course Type | Present Level of Education | Graduation Year | How did you hear about IHU | Objectives | Signature | Diploma | Home School | GED | Other
```

#### For Users Data:
```
Email | Name | Password | Contact | Address | Role | Registration Number
```

#### For Courses Data:
```
Title | Slug | Description | Type | Duration | Level | Instructor | Status
```

### Step 3: Data Formatting Rules

1. **Dates**: Use YYYY-MM-DD format (e.g., `1990-01-15`)
2. **Boolean fields**: Use "Yes"/"No" or "True"/"False"
3. **Phone numbers**: Can include formatting (e.g., `+1-555-1234`)
4. **Emails**: Must be valid email format
5. **Required fields**: Must be filled (see documentation for each collection)

### Step 4: Import Your Data

#### Option A: Import All Collections
```bash
npm run import-excel path/to/your/excel-file.xlsx
```

#### Option B: Import Specific Collection
```bash
# Import only registration data
npm run import-excel path/to/your/excel-file.xlsx registration

# Import only users
npm run import-excel path/to/your/excel-file.xlsx users

# Import only courses
npm run import-excel path/to/your/excel-file.xlsx courses
```

### Step 5: Monitor the Import Process

The script will show:
- ✅ Connection status
- 📊 Number of rows found in each sheet
- 🔄 Progress updates (every 10 rows)
- ❌ Any errors with specific row numbers
- 📈 Final summary with success/error counts

## 🔧 Customization Options

### If Your Excel Columns Don't Match

If your Excel file has different column names, you can modify the field mapping in `scripts/excel-import.ts`:

```typescript
// Example: If your Excel has "Student Name" instead of "First Name"
fieldMapping: {
    'Student Name': 'firstName',  // Changed from 'First Name'
    'Last Name': 'lastName',
    // ... other mappings
}
```

### Adding New Collections

To import data for collections not currently supported:

1. Add a new configuration to `importConfigs` in `scripts/excel-import.ts`
2. Define the field mapping
3. Specify required fields
4. Add any data transformation logic

## 🚨 Important Considerations

### 1. Data Validation
- The script validates required fields
- It checks for valid email formats
- It handles date conversions
- It processes boolean fields correctly

### 2. Duplicate Handling
- **Registration**: Checks for existing email addresses
- **Users**: Each email should be unique
- **Courses**: Each slug should be unique

### 3. Default Values
The script automatically adds:
- `createdAt: new Date()` for new records
- `paymentStatus: 'PENDING'` for registrations
- `status: 'PENDING'` for registrations
- `role: 'user'` for users (if not specified)
- `image: ''` for users and teams (empty placeholder)

### 4. Password Security
- User passwords are automatically hashed using bcrypt
- If no password is provided, a default password is set and hashed

## 🛠️ Troubleshooting

### Common Issues:

1. **"Sheet not found" error**
   - Make sure sheet names exactly match: "Registration", "Users", etc.
   - Check for extra spaces in sheet names

2. **"Missing required fields" error**
   - Fill in all required fields for each collection
   - Check the documentation for required field lists

3. **"Invalid email format" error**
   - Ensure email addresses are in valid format (user@domain.com)

4. **"MongoDB connection failed" error**
   - Check your `.env` file has the correct `MONGODBURL`
   - Verify your MongoDB cluster is accessible

5. **"Permission denied" error**
   - Ensure your MongoDB user has write permissions
   - Check if your IP is whitelisted in MongoDB Atlas

### Debug Commands:

```bash
# Test database connection
npm run test-db

# Check available collections
npm run test-db

# Import with verbose logging
npm run import-excel your-file.xlsx
```

## 📊 Post-Import Verification

After importing, verify your data:

1. **Check the console output** for success/error counts
2. **Test the database connection** to see updated document counts:
   ```bash
   npm run test-db
   ```
3. **Check your website** to see if the imported data appears
4. **Review any error logs** and fix data issues if needed

## 🔄 Re-importing Data

If you need to re-import data:

1. **Clear existing data** (if needed):
   ```javascript
   // In MongoDB shell or Compass
   db.Registration.deleteMany({})
   db.Users.deleteMany({})
   // etc.
   ```

2. **Fix data issues** in your Excel file
3. **Re-run the import**:
   ```bash
   npm run import-excel your-file.xlsx
   ```

## 📞 Support

If you encounter issues:

1. **Check the error messages** in the console output
2. **Review the documentation** in `scripts/README.md`
3. **Verify your Excel structure** matches the template
4. **Test with a small sample** first (5-10 rows)

## 🎉 Success Checklist

- [ ] Excel file created with correct sheet names
- [ ] Column headers match the template exactly
- [ ] Required fields are filled
- [ ] Data formats are correct (dates, emails, etc.)
- [ ] Import script runs without errors
- [ ] Data appears on your website
- [ ] All 700 records imported successfully

Good luck with your data import! 🚀 