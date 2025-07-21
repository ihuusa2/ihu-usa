# Sample Excel Template Structure

Create an Excel file with the following sheets and column headers:

## Sheet 1: Registration
```
Registration Number | First Name | Middle Name | Last Name | Former/Maiden Name | Date of Birth | Gender | Email Address | Country Code | Phone | Address | Street Address 2 | City | State | Country/Region | Zip/Postal Code | Resident | Enrollment Type | Course Type | Present Level of Education | Graduation Year | How did you hear about IHU | Objectives | Signature | Diploma | Home School | GED | Other
REG001 | John | M | Doe | Smith | 1990-01-15 | Male | john@example.com | +1 | 555-1234 | 123 Main St | Apt 4B | New York | NY | USA | 10001 | Yes | Full-time | Undergraduate | High School | 2020 | Google Search | Learn programming | John Doe | Yes | No | No | No
REG002 | Jane | A | Smith | Johnson | 1992-05-20 | Female | jane@example.com | +1 | 555-5678 | 456 Oak Ave | Suite 10 | Los Angeles | CA | USA | 90210 | No | Part-time | Graduate | Bachelor's | 2019 | Social Media | Advance career | Jane Smith | No | No | Yes | No
```

## Sheet 2: Users
```
Email | Name | Password | Contact | Address | Role | Registration Number
admin@ihu.edu | Admin User | admin123 | +1-555-0001 | 123 Admin St | admin | ADMIN001
user@example.com | Regular User | user123 | +1-555-0002 | 456 User Ave | user | REG001
faculty@ihu.edu | Faculty Member | faculty123 | +1-555-0003 | 789 Faculty Blvd | staff | FAC001
```

## Sheet 3: Courses
```
Title | Slug | Description | Type | Duration | Level | Instructor | Status
Introduction to Programming | intro-programming | Learn the basics of programming with hands-on projects | Online | 12 weeks | Beginner | Dr. Smith | active
Advanced Web Development | advanced-web | Master modern web technologies including React and Node.js | Hybrid | 16 weeks | Advanced | Dr. Johnson | active
Data Science Fundamentals | data-science | Introduction to data analysis and machine learning | Online | 14 weeks | Intermediate | Dr. Brown | active
Business Management | business-mgmt | Comprehensive business administration course | In-person | 20 weeks | All Levels | Dr. Wilson | active
```

## Sheet 4: Teams
```
Name | Role | Description | Category
Dr. John Smith | Director | Leading the institution with over 15 years of experience | Leadership
Sarah Johnson | Professor | Teaching computer science and software engineering | Faculty
Michael Brown | Administrator | Managing student affairs and enrollment | Administration
Lisa Davis | Marketing Manager | Promoting our programs and managing communications | Marketing
```

## Sheet 5: Blogs
```
Title | Content | Author | Slug
Welcome to IHU | Welcome to our new website! We are excited to share our journey and mission with you. | Admin | welcome-ihu
Student Success Stories | Read about our successful students who have achieved their dreams through our programs. | Faculty | student-success
Technology Trends 2024 | Exploring the latest trends in technology and how they impact education. | Dr. Smith | tech-trends-2024
Career Development Tips | Essential tips for advancing your career in today's competitive market. | Career Advisor | career-tips
```

## Sheet 6: Events
```
Title | Description | Date | Location | Image
Open House 2024 | Join us for our annual open house to learn about our programs and meet our faculty | 2024-03-15 | Main Campus | open-house.jpg
Graduation Ceremony | Celebrate our graduates as they receive their diplomas and certificates | 2024-05-20 | Auditorium | graduation.jpg
Tech Workshop | Hands-on workshop on emerging technologies | 2024-04-10 | Computer Lab | tech-workshop.jpg
Alumni Reunion | Connect with fellow alumni and share your success stories | 2024-06-15 | Conference Center | alumni-reunion.jpg
```

## Sheet 7: FAQ
```
Question | Answer | Category
How do I apply for a program? | Visit our registration page and fill out the application form. You'll need to provide personal information, educational background, and program preferences. | General
What are the tuition fees? | Our fees vary by program and duration. Please contact our admissions office for detailed pricing information. | Financial
Is financial aid available? | Yes, we offer various financial aid options including scholarships, grants, and payment plans. | Financial
What are the admission requirements? | Requirements vary by program but generally include a high school diploma or equivalent and English proficiency. | Admissions
How long are the programs? | Program duration ranges from 12 weeks to 2 years depending on the course and your enrollment type. | General
Can I transfer credits? | Yes, we accept transfer credits from accredited institutions. Each case is evaluated individually. | Academic
What career services do you offer? | We provide career counseling, job placement assistance, resume writing help, and networking opportunities. | Career
Is housing available? | We offer on-campus housing options and can help you find off-campus accommodations. | Housing
```

## Important Notes:

1. **Sheet Names**: The sheet names must exactly match: "Registration", "Users", "Courses", "Teams", "Blogs", "Events", "FAQ"

2. **Column Headers**: The column headers must exactly match the examples above

3. **Data Types**:
   - Dates should be in YYYY-MM-DD format
   - Boolean fields (Diploma, Home School, GED, Other) should be "Yes"/"No" or "True"/"False"
   - Phone numbers can include formatting like "+1-555-1234"
   - Email addresses should be valid format

4. **Required Fields**: Make sure to fill in all required fields for each collection

5. **File Format**: Save as .xlsx format

## Quick Start:

1. Copy this template structure into Excel
2. Replace the sample data with your actual data
3. Save as `old-website-data.xlsx`
4. Run: `npm run import-excel old-website-data.xlsx` 