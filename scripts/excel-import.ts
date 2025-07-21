import { MongoClient } from 'mongodb';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// MongoDB connection
const uri = process.env.MONGODBURL;
if (!uri) {
    throw new Error('MONGODBURL environment variable is required');
}

const client = new MongoClient(uri);
const db = client.db('ihuusa');

// Type definitions for Excel data mapping
interface ExcelRow {
    [key: string]: unknown;
}

interface ImportConfig {
    collection: string;
    excelSheet: string;
    fieldMapping: { [excelField: string]: string };
    requiredFields: string[];
    optionalFields?: string[];
    transformData?: (row: ExcelRow) => Promise<ExcelRow> | ExcelRow;
    validateData?: (row: ExcelRow) => boolean;
}

type ImportError = { row: number; data: ExcelRow; error: string };

// Import configurations for different collections
const importConfigs: { [key: string]: ImportConfig } = {
    registration: {
        collection: 'Registration',
        excelSheet: 'Registration',
        fieldMapping: {
            'Registration Number': 'registrationNumber',
            'First Name': 'firstName',
            'Middle Name': 'middleName',
            'Last Name': 'lastName',
            'Former/Maiden Name': 'formerOrMaidenName',
            'Date of Birth': 'dateOfBirth',
            'Gender': 'gender',
            'Email Address': 'emailAddress',
            'Country Code': 'countryCode',
            'Phone': 'phone',
            'Address': 'address',
            'Street Address 2': 'streetAddress2',
            'City': 'city',
            'State': 'state',
            'Country/Region': 'countryOrRegion',
            'Zip/Postal Code': 'zipOrPostalCode',
            'Resident': 'resident',
            'Enrollment Type': 'enrollmentType',
            'Course Type': 'courseType',
            'Present Level of Education': 'presentLevelOfEducation',
            'Graduation Year': 'graduationYear',
            'How did you hear about IHU': 'howDidYouHearAboutIHU',
            'Objectives': 'objectives',
            'Signature': 'signature',
            'Diploma': 'recieved.diploma',
            'Home School': 'recieved.homeSchool',
            'GED': 'recieved.ged',
            'Other': 'recieved.other',
            'New Column Name': 'newFieldNameInMongo',
            // Add more as needed
        },
        requiredFields: ['firstName', 'lastName', 'emailAddress'],
        transformData: (row: ExcelRow) => {
            // Set N/A for missing fields (including nested)
            const mappedRow: Record<string, unknown> = { ...row };
            for (const [, dbField] of Object.entries(importConfigs.registration.fieldMapping)) {
                if (dbField.includes('.')) {
                    const [parent, child] = dbField.split('.');
                    if (!mappedRow[parent]) mappedRow[parent] = {};
                    if (
                        (mappedRow[parent] as Record<string, unknown>)[child] === undefined ||
                        (mappedRow[parent] as Record<string, unknown>)[child] === null ||
                        (mappedRow[parent] as Record<string, unknown>)[child] === ''
                    ) {
                        (mappedRow[parent] as Record<string, unknown>)[child] = 'N/A';
                    }
                } else {
                    if (
                        mappedRow[dbField] === undefined ||
                        mappedRow[dbField] === null ||
                        mappedRow[dbField] === ''
                    ) {
                        mappedRow[dbField] = 'N/A';
                    }
                }
            }
            return {
                ...mappedRow,
                paymentStatus: 'PENDING',
                status: 'PENDING',
                createdAt: new Date(),
                recieved: {
                    diploma: (mappedRow.recieved && (mappedRow.recieved as Record<string, unknown>).diploma) ?? false,
                    homeSchool: (mappedRow.recieved && (mappedRow.recieved as Record<string, unknown>).homeSchool) ?? false,
                    ged: (mappedRow.recieved && (mappedRow.recieved as Record<string, unknown>).ged) ?? false,
                    other: (mappedRow.recieved && (mappedRow.recieved as Record<string, unknown>).other) ?? false
                }
            };
        }
    },
    users: {
        collection: 'Users',
        excelSheet: 'Users',
        fieldMapping: {
            'Email': 'email',
            'Name': 'name',
            'Password': 'password',
            'Contact': 'contact',
            'Address': 'address',
            'Role': 'role',
            'Registration Number': 'registrationNumber'
        },
        requiredFields: ['email', 'name', 'password'],
        transformData: async (row: ExcelRow) => {
            const hashedPassword = await bcrypt.hash(String(row.password || 'defaultPassword123'), 10);
            return {
                ...row,
                password: hashedPassword,
                role: row.role || 'user',
                image: '' // Default empty image
            };
        }
    },
    courses: {
        collection: 'Courses',
        excelSheet: 'Courses',
        fieldMapping: {
            'Title': 'title',
            'Slug': 'slug',
            'Description': 'description',
            'Type': 'type',
            'Duration': 'duration',
            'Level': 'level',
            'Instructor': 'instructor',
            'Status': 'status'
        },
        requiredFields: ['title', 'slug', 'description'],
        transformData: (row: ExcelRow) => ({
            ...row,
            images: [],
            galleryImages: [],
            status: row.status || 'active'
        })
    },
    teams: {
        collection: 'Teams',
        excelSheet: 'Teams',
        fieldMapping: {
            'Name': 'name',
            'Role': 'role',
            'Description': 'description',
            'Category': 'category'
        },
        requiredFields: ['name', 'role'],
        transformData: (row: ExcelRow) => ({
            ...row,
            image: '' // Default empty image
        })
    },
    blogs: {
        collection: 'Blogs',
        excelSheet: 'Blogs',
        fieldMapping: {
            'Title': 'title',
            'Content': 'content',
            'Author': 'author',
            'Slug': 'slug'
        },
        requiredFields: ['title', 'content'],
        transformData: (row: ExcelRow) => ({
            ...row,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    },
    events: {
        collection: 'Events',
        excelSheet: 'Events',
        fieldMapping: {
            'Title': 'title',
            'Description': 'description',
            'Date': 'date',
            'Location': 'location',
            'Image': 'image'
        },
        requiredFields: ['title', 'description'],
        transformData: (row: ExcelRow) => ({
            ...row,
            date: row.date ? new Date(String(row.date)) : new Date(),
            image: row.image || ''
        })
    },
    faq: {
        collection: 'FAQ',
        excelSheet: 'FAQ',
        fieldMapping: {
            'Question': 'question',
            'Answer': 'answer',
            'Category': 'category'
        },
        requiredFields: ['question', 'answer'],
        transformData: (row: ExcelRow) => ({
            ...row,
            category: row.category || 'General'
        })
    }
};

class ExcelImporter {
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
    readSheet(sheetName: string): ExcelRow[] {
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
            const obj: ExcelRow = {};
            headers.forEach((header, index) => {
                if (header && row[index] !== undefined) {
                    obj[header] = row[index];
                }
            });
            return obj;
        });
    }

    // Map Excel fields to database fields
    mapFields(row: ExcelRow, fieldMapping: { [excelField: string]: string }): Record<string, unknown> {
        const mapped: Record<string, unknown> = {};
        
        for (const [excelField, dbField] of Object.entries(fieldMapping)) {
            if (row[excelField] !== undefined && row[excelField] !== null && row[excelField] !== '') {
                // Handle nested fields (e.g., 'recieved.diploma')
                if (dbField.includes('.')) {
                    const [parent, child] = dbField.split('.');
                    if (!mapped[parent]) mapped[parent] = {};
                    (mapped[parent] as Record<string, unknown>)[child] = row[excelField];
                } else {
                    mapped[dbField] = row[excelField];
                }
            }
        }
        
        return mapped;
    }

    // Validate required fields
    validateRequiredFields(data: Record<string, unknown>, requiredFields: string[]): string[] {
        const missing: string[] = [];
        for (const field of requiredFields) {
            if (!data[field] || data[field] === '') {
                missing.push(field);
            }
        }
        return missing;
    }

    // Import data for a specific collection
    async importCollection(config: ImportConfig): Promise<{ success: number; errors: ImportError[] }> {
        console.log(`\n📊 Importing ${config.collection}...`);
        
        try {
            const rows = this.readSheet(config.excelSheet);
            console.log(`Found ${rows.length} rows in sheet "${config.excelSheet}"`);
            
            const collection = db.collection(config.collection);
            const results = { success: 0, errors: [] as ImportError[] };
            
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                try {
                    // Map fields
                    let mappedData = this.mapFields(row, config.fieldMapping);
                    
                    // Validate required fields
                    const missingFields = this.validateRequiredFields(mappedData, config.requiredFields);
                    if (missingFields.length > 0) {
                        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
                    }
                    
                    // Transform data if transform function exists
                    if (config.transformData) {
                        mappedData = await config.transformData(mappedData);
                    }
                    
                    // Validate data if validation function exists
                    if (config.validateData && !config.validateData(mappedData)) {
                        throw new Error('Data validation failed');
                    }
                    
                    // Upsert (update if exists, insert if not)
                    await collection.updateOne(
                      {
                        $or: [
                          { registrationNumber: mappedData.registrationNumber },
                          { emailAddress: mappedData.emailAddress }
                        ]
                      },
                      { $set: mappedData },
                      { upsert: true }
                    );
                    results.success++;
                    
                    if ((i + 1) % 10 === 0) {
                        console.log(`  Processed ${i + 1}/${rows.length} rows...`);
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
            
            console.log(`✅ ${config.collection}: ${results.success} successful, ${results.errors.length} errors`);
            return results;
            
        } catch (error) {
            console.error(`❌ Error importing ${config.collection}:`, error);
            return { success: 0, errors: [{ row: -1, data: {}, error: String(error) }] };
        }
    }

    // Import all collections
    async importAll(): Promise<void> {
        console.log('🚀 Starting Excel import process...');
        console.log(`📁 File: ${this.filePath}`);
        console.log(`📋 Available sheets: ${this.getSheetNames().join(', ')}`);
        
        const summary = {
            totalSuccess: 0,
            totalErrors: 0,
            collections: {} as { [key: string]: { success: number; errors: number } }
        };
        
        for (const [key, config] of Object.entries(importConfigs)) {
            try {
                const result = await this.importCollection(config);
                summary.collections[key] = {
                    success: result.success,
                    errors: result.errors.length
                };
                summary.totalSuccess += result.success;
                summary.totalErrors += result.errors.length;
            } catch (error) {
                console.error(`❌ Failed to import ${key}:`, error);
                summary.collections[key] = { success: 0, errors: 1 };
                summary.totalErrors++;
            }
        }
        
        // Print summary
        console.log('\n📈 Import Summary:');
        console.log('==================');
        for (const [collection, stats] of Object.entries(summary.collections)) {
            console.log(`${collection}: ${stats.success} ✅, ${stats.errors} ❌`);
        }
        console.log(`\nTotal: ${summary.totalSuccess} successful imports, ${summary.totalErrors} errors`);
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log(`
📊 Excel to MongoDB Importer

Usage:
  npm run import-excel <excel-file-path> [collection-name]

Examples:
  npm run import-excel data/old-website-data.xlsx
  npm run import-excel data/old-website-data.xlsx registration
  npm run import-excel data/old-website-data.xlsx users

Available collections:
  ${Object.keys(importConfigs).join(', ')}

Excel file should have sheets named:
  ${Object.values(importConfigs).map(c => c.excelSheet).join(', ')}
        `);
        return;
    }
    
    const filePath = args[0];
    const specificCollection = args[1];
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const importer = new ExcelImporter(filePath);
        
        if (specificCollection) {
            const config = importConfigs[specificCollection];
            if (!config) {
                console.error(`❌ Collection "${specificCollection}" not found. Available: ${Object.keys(importConfigs).join(', ')}`);
                return;
            }
            await importer.importCollection(config);
        } else {
            await importer.importAll();
        }
        
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

export { ExcelImporter, importConfigs }; 