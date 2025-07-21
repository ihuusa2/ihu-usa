# Excel to MongoDB Import Tool

This tool allows you to import data from Excel files into your MongoDB database for the IHU USA website.

## Setup

1. Make sure you have your `.env` file configured with your MongoDB connection string:
   ```
   MONGODBURL=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/ihuusa?retryWrites=true&w=majority
   ```

2. Install dependencies (already done):
   ```bash
   npm install xlsx @types/xlsx tsx --legacy-peer-deps
   ```

## Usage

### Import All Collections
```bash
npm run import-excel path/to/your/excel-file.xlsx
```

### Import Specific Collection
```bash
npm run import-excel path/to/your/excel-file.xlsx registration
npm run import-excel path/to/your/excel-file.xlsx users
npm run import-excel path/to/your/excel-file.xlsx courses
```

## Excel File Structure

Your Excel file should have separate sheets for each collection. Here's the required structure:

### 1. Registration Sheet
| Registration Number | First Name | Middle Name | Last Name | Former/Maiden Name | Date of Birth | Gender | Email Address | Country Code | Phone | Address | Street Address 2 | City | State | Country/Region | Zip/Postal Code | Resident | Enrollment Type | Course Type | Present Level of Education | Graduation Year | How did you hear about IHU | Objectives | Signature | Diploma | Home School | GED | Other |
|-------------------|------------|-------------|-----------|-------------------|---------------|--------|---------------|--------------|-------|---------|------------------|------|-------|----------------|----------------|----------|----------------|-------------|---------------------------|-----------------|---------------------------|------------|-----------|---------|-------------|-----|-------|
| REG001 | John | M | Doe | Smith | 1990-01-15 | Male | john@example.com | +1 | 555-1234 | 123 Main St | Apt 4B | New York | NY | USA | 10001 | Yes | Full-time | Undergraduate | High School | 2020 | Google Search | Learn programming | John Doe | Yes | No | No | No |

### 2. Users Sheet
| Email | Name | Password | Contact | Address | Role | Registration Number |
|-------|------|----------|---------|---------|------|-------------------|
| admin@ihu.edu | Admin User | admin123 | +1-555-0001 | 123 Admin St | admin | ADMIN001 |
| user@example.com | Regular User | user123 | +1-555-0002 | 456 User Ave | user | REG001 |

### 3. Courses Sheet
| Title | Slug | Description | Type | Duration | Level | Instructor | Status |
|-------|------|-------------|------|----------|-------|------------|--------|
| Introduction to Programming | intro-programming | Learn the basics of programming | Online | 12 weeks | Beginner | Dr. Smith | active |
| Advanced Web Development | advanced-web | Master modern web technologies | Hybrid | 16 weeks | Advanced | Dr. Johnson | active |

### 4. Teams Sheet
| Name | Role | Description | Category |
|------|------|-------------|----------|
| Dr. John Smith | Director | Leading the institution | Leadership |
| Sarah Johnson | Professor | Teaching computer science | Faculty |

### 5. Blogs Sheet
| Title | Content | Author | Slug |
|-------|---------|--------|------|
| Welcome to IHU | Welcome to our new website... | Admin | welcome-ihu |
| Student Success Stories | Read about our successful students... | Faculty | student-success |

### 6. Events Sheet
| Title | Description | Date | Location | Image |
|-------|-------------|------|----------|-------|
| Open House 2024 | Join us for our annual open house | 2024-03-15 | Main Campus | open-house.jpg |
| Graduation Ceremony | Celebrate our graduates | 2024-05-20 | Auditorium | graduation.jpg |

### 7. FAQ Sheet
| Question | Answer | Category |
|----------|--------|----------|
| How do I apply? | Visit our registration page... | General |
| What are the tuition fees? | Our fees vary by program... | Financial |

## Field Mapping

The tool automatically maps Excel column headers to database fields:

### Registration Fields
- `Registration Number` → `registrationNumber`
- `First Name` → `firstName`
- `Middle Name` → `middleName`
- `Last Name` → `lastName`
- `Former/Maiden Name` → `formerOrMaidenName`
- `Date of Birth` → `dateOfBirth`
- `Gender` → `gender`
- `Email Address` → `emailAddress`
- `Country Code` → `countryCode`
- `Phone` → `phone`
- `Address` → `address`
- `Street Address 2` → `streetAddress2`
- `City` → `city`
- `State` → `state`
- `Country/Region` → `countryOrRegion`
- `Zip/Postal Code` → `zipOrPostalCode`
- `Resident` → `resident`
- `Enrollment Type` → `enrollmentType`
- `Course Type` → `courseType`
- `Present Level of Education` → `presentLevelOfEducation`
- `Graduation Year` → `graduationYear`
- `How did you hear about IHU` → `howDidYouHearAboutIHU`
- `Objectives` → `objectives`
- `Signature` → `signature`
- `Diploma` → `recieved.diploma` (boolean)
- `Home School` → `recieved.homeSchool` (boolean)
- `GED` → `recieved.ged` (boolean)
- `Other` → `recieved.other` (boolean)

### User Fields
- `Email` → `email`
- `Name` → `name`
- `Password` → `password` (will be hashed)
- `Contact` → `contact`
- `Address` → `address`
- `Role` → `role`
- `Registration Number` → `registrationNumber`

## Important Notes

1. **Required Fields**: Each collection has required fields that must be filled:
   - Registration: `firstName`, `lastName`, `emailAddress`
   - Users: `email`, `name`, `password`
   - Courses: `title`, `slug`, `description`
   - Teams: `name`, `role`
   - Blogs: `title`, `content`
   - Events: `title`, `description`
   - FAQ: `question`, `answer`

2. **Password Hashing**: User passwords are automatically hashed using bcrypt.

3. **Default Values**: The tool adds default values for:
   - Registration: `paymentStatus: 'PENDING'`, `status: 'PENDING'`, `createdAt: new Date()`
   - Users: `role: 'user'`, `image: ''`
   - Courses: `images: []`, `galleryImages: []`, `status: 'active'`
   - Teams: `image: ''`
   - Blogs: `createdAt: new Date()`, `updatedAt: new Date()`
   - Events: `date: new Date()`, `image: ''`
   - FAQ: `category: 'General'`

4. **Error Handling**: The tool will report any errors and continue processing other rows.

5. **Data Validation**: The tool validates required fields and data types.

## Example Usage

1. Create an Excel file with the structure shown above
2. Save it as `old-website-data.xlsx`
3. Run the import:
   ```bash
   npm run import-excel old-website-data.xlsx
   ```

4. Check the console output for import results and any errors.

## Troubleshooting

- **Missing required fields**: Make sure all required fields are filled in your Excel file
- **Invalid data types**: Ensure dates are in YYYY-MM-DD format
- **Connection errors**: Check your MongoDB connection string in `.env`
- **Permission errors**: Make sure your MongoDB user has write permissions

## Customization

You can modify the `importConfigs` in `scripts/excel-import.ts` to:
- Add new collections
- Change field mappings
- Add custom validation rules
- Modify data transformation logic 