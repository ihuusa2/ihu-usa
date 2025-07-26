# Excel Registration Import

This directory contains files for importing registration data from Excel files into the MongoDB database.

## Excel File Format

Your Excel file should have the following columns (the script will try to match different column name variations):

### Required Columns:
1. **Registration Number** - The unique registration number for each student
   - Accepted column names: `registrationNo`, `Registration No`, `registration_no`, `Registration Number`
2. **Name** - Full name of the student
   - Accepted column names: `name`, `Name`, `Full Name`, `Student Name`
3. **Email** - Email address of the student
   - Accepted column names: `email`, `Email`, `Email Address`
4. **Course** - The course the student is enrolled in
   - Accepted column names: `course`, `Course`, `Selected Course`, `Course Name`

### Example Excel Structure:
| registrationNo | name | email | course |
|----------------|------|-------|--------|
| IHU2024001 | John Doe | john.doe@example.com | Natural Health Science |
| IHU2024002 | Jane Smith | jane.smith@example.com | Ayurvedic Medicine |

## How to Run the Import

### Method 1: Using the default file path
```bash
npm run import-excel
```

### Method 2: Specify your own file path
```bash
npx tsx src/scripts/run-excel-import.ts "path/to/your/file.xlsx"
```

### Method 3: Using the direct script
```bash
npx tsx src/scripts/import-excel-registrations.ts
```

## What the Script Does

1. **Reads your Excel file** and converts it to JSON format
2. **Validates the data** and filters out rows with missing required fields
3. **Checks for duplicates** based on registration number and email
4. **Transforms the data** to match the database schema:
   - Splits full name into first, middle, and last name
   - Sets default values for missing fields
   - Sets payment status to PENDING and status to PENDING
5. **Inserts new records** into the MongoDB Registration collection
6. **Provides a summary** of the import process

## Default Values Set

For fields not present in your Excel file, the script sets these default values:

- **Country Code**: +1 (US)
- **Country/Region**: United States
- **Enrollment Type**: Regular
- **Course Type**: Certificate
- **Payment Status**: PENDING
- **Status**: PENDING
- **How Did You Hear**: Excel Import
- **Signature**: Excel Import
- **Received Documents**: All set to false

## Important Notes

- The script will **skip duplicate registrations** based on registration number or email
- **Email addresses are converted to lowercase** for consistency
- **Names are automatically split** into first, middle, and last name components
- The script provides **detailed logging** of the import process
- **No existing data will be modified** - only new records are inserted

## Troubleshooting

### Common Issues:

1. **File not found**: Make sure your Excel file exists at the specified path
2. **Column names not recognized**: Check that your column headers match one of the accepted variations
3. **Database connection error**: Ensure your MongoDB connection is properly configured
4. **Permission errors**: Make sure you have read access to the Excel file

### Sample Files:
- `sample-registrations.csv` - Example of the expected format (you can convert this to Excel)
- `sample-registrations.xlsx` - Excel version of the sample data (if you have one)

## Support

If you encounter any issues, check the console output for detailed error messages. The script provides comprehensive logging to help identify and resolve problems. 