# Student Import Excel Template

## Required Excel Structure

Your Excel file should have the following columns (in any order):

| Column Header | Description | Required | Example |
|---------------|-------------|----------|---------|
| Registration Number | Student's registration number | Yes | REG001, IHU2024001 |
| Name | Full name of the student | Yes | John Michael Doe |
| Email | Student's email address | Yes | john.doe@example.com |
| Course | Course or program details | Yes | Computer Science, MBA |

## Supported Column Name Variations

The script is flexible and will recognize these variations:

### Registration Number
- `Registration Number`
- `Reg No`
- `Student ID`
- `ID`

### Name
- `Name`
- `Full Name`
- `Student Name`
- `Student`

### Email
- `Email`
- `Email Address`
- `E-mail`

### Course
- `Course`
- `Course Detail`
- `Course Type`
- `Program`
- `Subject`

## Example Excel Data

```
Registration Number | Name | Email | Course
REG001 | John Michael Doe | john.doe@example.com | Computer Science
REG002 | Jane Smith | jane.smith@example.com | Business Administration
REG003 | Robert Johnson | robert.j@example.com | Engineering
```

## What the Script Does

1. **Name Splitting**: Automatically splits full names into first, middle, and last names
2. **Default Values**: Sets sensible defaults for missing fields
3. **Duplicate Prevention**: Skips records with existing registration numbers or emails
4. **Validation**: Ensures required fields are present
5. **Database Import**: Inserts valid records into the Registration collection

## Default Values Set

For missing fields, the script sets these defaults:
- `dateOfBirth`: 1990-01-01
- `gender`: "Not Specified"
- `countryCode`: "+1"
- `phone`: "000-000-0000"
- `address`: "Address Not Provided"
- `city`: "City Not Provided"
- `state`: "State Not Provided"
- `countryOrRegion`: "USA"
- `zipOrPostalCode`: "00000"
- `resident`: "Not Specified"
- `enrollmentType`: "Full-time"
- `presentLevelOfEducation`: "Not Specified"
- `graduationYear`: "2024"
- `howDidYouHearAboutIHU`: "Legacy Import"
- `objectives`: "Legacy student record"
- `signature`: "Legacy Import"
- `paymentStatus`: "PENDING"
- `status`: "PENDING"

## Usage

1. Prepare your Excel file with the required columns
2. Run the import command:
   ```bash
   npm run import-students path/to/your/excel-file.xlsx
   ```
3. The script will show progress and results
4. Check the console output for any errors or skipped records 