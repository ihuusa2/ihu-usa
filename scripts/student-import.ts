import { MongoClient } from 'mongodb';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection
const uri = process.env.MONGODBURL;
if (!uri) {
    throw new Error('MONGODBURL environment variable is required');
}

const client = new MongoClient(uri);
const db = client.db('ihuusa');

// Type definitions for student data
interface StudentRow {
    [key: string]: unknown;
}

interface StudentData {
    registrationNumber: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    emailAddress: string;
    courseType: string;
    paymentStatus: string;
    status: string;
    createdAt: Date;
    // Default values for missing fields
    formerOrMaidenName: string;
    dateOfBirth: string;
    gender: string;
    countryCode: string;
    phone: string;
    address: string;
    streetAddress2: string;
    city: string;
    state: string;
    countryOrRegion: string;
    zipOrPostalCode: string;
    resident: string;
    enrollmentType: string;
    presentLevelOfEducation: string;
    graduationYear: string;
    howDidYouHearAboutIHU: string;
    objectives: string;
    signature: string;
    recieved: {
        diploma: boolean;
        homeSchool: boolean;
        ged: boolean;
        other: boolean;
    };
}



class StudentImporter {
    private workbook: XLSX.WorkBook;
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
        if (!fs.existsSync(filePath)) {
            throw new Error(`Excel file not found: ${filePath}`);
        }
        this.workbook = XLSX.readFile(filePath);
    }

    // Get available sheet names
    getSheetNames(): string[] {
        return this.workbook.SheetNames;
    }

    // Read data from a specific sheet
    readSheet(sheetName: string): StudentRow[] {
        const worksheet = this.workbook.Sheets[sheetName];
        if (!worksheet) {
            throw new Error(`Sheet "${sheetName}" not found in Excel file`);
        }
        
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (data.length < 2) {
            throw new Error(`Sheet "${sheetName}" has insufficient data`);
        }

        const headers = data[0] as string[];
        const rows = data.slice(1) as unknown[][];

        return rows.map(row => {
            const obj: StudentRow = {};
            headers.forEach((header, index) => {
                if (header && row[index] !== undefined) {
                    obj[header] = row[index];
                }
            });
            return obj;
        });
    }

    // Transform Excel row to StudentData
    transformStudentData(row: StudentRow): StudentData {
        // Use the actual column names from your Excel file
        const firstName = String(row['firstName'] || '').trim();
        const emailAddress = String(row['emailAddress'] || '').trim();
        const courseType = String(row['courseType'] || 'General').trim();
        const registrationNumber = String(row['registrationNumber'] || '').trim();

        return {
            registrationNumber,
            firstName,
            middleName: '',
            lastName: '',
            emailAddress,
            courseType,
            paymentStatus: 'PENDING',
            status: 'PENDING',
            createdAt: new Date(),
            // Default values for missing fields
            formerOrMaidenName: '',
            dateOfBirth: '1990-01-01', // Default date
            gender: 'Not Specified',
            countryCode: '+1',
            phone: '000-000-0000',
            address: 'Address Not Provided',
            streetAddress2: '',
            city: 'City Not Provided',
            state: 'State Not Provided',
            countryOrRegion: 'USA',
            zipOrPostalCode: '00000',
            resident: 'Not Specified',
            enrollmentType: 'Full-time',
            presentLevelOfEducation: 'Not Specified',
            graduationYear: '2024',
            howDidYouHearAboutIHU: 'Legacy Import',
            objectives: 'Legacy student record',
            signature: 'Legacy Import',
            recieved: {
                diploma: false,
                homeSchool: false,
                ged: false,
                other: false
            }
        };
    }

    // Validate student data
    validateStudentData(data: StudentData): string[] {
        const errors: string[] = [];
        
        if (!data.registrationNumber) {
            errors.push('Registration number is required');
        }
        if (!data.firstName) {
            errors.push('First name is required');
        }
        if (!data.emailAddress) {
            errors.push('Email address is required');
        }
        if (!data.courseType) {
            errors.push('Course type is required');
        }

        return errors;
    }

    // Import students
    async importStudents(): Promise<{ success: number; errors: unknown[] }> {
        console.log('\n📊 Importing Student Records...');
        
        try {
            // Try to find the sheet with student data
            const sheetNames = this.getSheetNames();
            let targetSheet = '';
            
            // Look for common sheet names
            const possibleSheetNames = ['Students', 'Student Data', 'Registration', 'Sheet1', 'Data'];
            for (const name of possibleSheetNames) {
                if (sheetNames.includes(name)) {
                    targetSheet = name;
                    break;
                }
            }
            
            if (!targetSheet) {
                targetSheet = sheetNames[0]; // Use first sheet if no match found
            }
            
            console.log(`Using sheet: "${targetSheet}"`);
            
            const rows = this.readSheet(targetSheet);
            console.log(`Found ${rows.length} student records`);
            
            const collection = db.collection('Registration');
            const results = { success: 0, errors: [] as unknown[] };
            
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                try {
                    // Transform data
                    const studentData = this.transformStudentData(row);
                    
                    // Skip empty rows
                    if (!studentData.registrationNumber && !studentData.firstName && !studentData.emailAddress) {
                        console.log(`⏭️  Skipping empty row ${i + 2}`);
                        continue;
                    }
                    
                    // Debug logging for failed rows
                    if ([3, 104, 205, 306, 407, 508, 609].includes(i + 2)) {
                        console.log(`🔍 Debug Row ${i + 2}:`, {
                            registrationNumber: studentData.registrationNumber,
                            firstName: studentData.firstName,
                            emailAddress: studentData.emailAddress,
                            courseType: studentData.courseType
                        });
                    }
                    
                    // Validate data
                    const validationErrors = this.validateStudentData(studentData);
                    if (validationErrors.length > 0) {
                        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
                    }
                    
                    // Check if registration number already exists
                    const existingStudent = await collection.findOne({ 
                        registrationNumber: studentData.registrationNumber 
                    });
                    
                    if (existingStudent) {
                        // Update existing record with new data from Excel
                        const updateData = {
                            firstName: studentData.firstName,
                            emailAddress: studentData.emailAddress,
                            courseType: studentData.courseType,
                            updatedAt: new Date()
                        };
                        
                        await collection.updateOne(
                            { registrationNumber: studentData.registrationNumber },
                            { $set: updateData }
                        );
                        console.log(`🔄 Updated existing record: ${studentData.registrationNumber}`);
                        results.success++;
                    } else {
                        // Check if email already exists (for new records)
                        const existingEmail = await collection.findOne({ 
                            emailAddress: studentData.emailAddress 
                        });
                        
                        if (existingEmail) {
                            console.log(`⚠️  Skipping duplicate email: ${studentData.emailAddress}`);
                            continue;
                        }
                        
                        // Insert new record
                        await collection.insertOne(studentData);
                        console.log(`✅ Inserted new record: ${studentData.registrationNumber}`);
                        results.success++;
                    }
                    
                    if ((i + 1) % 50 === 0) {
                        console.log(`  Processed ${i + 1}/${rows.length} students...`);
                    }
                    
                } catch (error) {
                    const errorInfo = {
                        row: i + 2, // +2 because Excel is 1-indexed and we skip header
                        data: row,
                        error: error instanceof Error ? error.message : String(error)
                    };
                    results.errors.push(errorInfo);
                    console.error(`  ❌ Row ${i + 2}: ${errorInfo.error}`);
                }
            }
            
            console.log(`✅ Students: ${results.success} successful imports, ${results.errors.length} errors`);
            return results;
            
        } catch (error) {
            console.error(`❌ Error importing students:`, error);
            return { success: 0, errors: [{ error: String(error) }] };
        }
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log(`
📊 Student Data Importer for IHU USA

This script imports student records from Excel with minimal data:
- Registration Number
- Name (Full Name)
- Email Address
- Course Details

Usage:
  npm run import-students <excel-file-path>

Example:
  npm run import-students data/old-students.xlsx

Excel file should have columns:
  - Registration Number (or Reg No, Student ID)
  - Name (or Full Name, Student Name)
  - Email (or Email Address)
  - Course (or Course Detail, Course Type)

The script will:
  - Split full names into first, middle, last names
  - Set default values for missing fields
  - Skip duplicate registration numbers and emails
  - Import into the Registration collection
        `);
        return;
    }
    
    const filePath = args[0];
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const importer = new StudentImporter(filePath);
        await importer.importStudents();
        
    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

export { StudentImporter }; 