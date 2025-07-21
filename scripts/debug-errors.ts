import * as XLSX from 'xlsx';
import * as fs from 'fs';

const filePath = './nhs-data.xlsx';

if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

const workbook = XLSX.readFile(filePath);
const worksheet = workbook.Sheets['Online Application'];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = data[0] as string[];
console.log('📝 Headers:', headers);

// Check the specific rows that failed (rows 3, 104, 205, 306, 407, 508, 609)
const failedRows = [3, 104, 205, 306, 407, 508, 609];

console.log('\n🔍 Examining failed rows:');
console.log('========================');

for (const rowNum of failedRows) {
    if (data[rowNum]) {
        const row = data[rowNum] as unknown[];
        console.log(`\n❌ Row ${rowNum}:`);
        console.log('  Raw data:', row);
        
        // Map to column names (exactly like the import script)
        const rowData: Record<string, unknown> = {};
        headers.forEach((header, index) => {
            if (header && row[index] !== undefined) {
                rowData[header] = row[index];
            }
        });
        console.log('  Mapped data:', rowData);
        
        // Transform data exactly like the import script
        const firstName = String(rowData['firstName'] || '').trim();
        const emailAddress = String(rowData['emailAddress'] || '').trim();
        const courseType = String(rowData['courseType'] || 'General').trim();
        const registrationNumber = String(rowData['registrationNumber'] || '').trim();
        
        console.log('  Transformed data:');
        console.log('    registrationNumber:', `"${registrationNumber}"`, registrationNumber.length);
        console.log('    firstName:', `"${firstName}"`, firstName.length);
        console.log('    emailAddress:', `"${emailAddress}"`, emailAddress.length);
        console.log('    courseType:', `"${courseType}"`, courseType.length);
        
        // Check validation exactly like the import script
        const errors = [];
        if (!registrationNumber) {
            errors.push('Registration number is required');
        }
        if (!firstName) {
            errors.push('First name is required');
        }
        if (!emailAddress) {
            errors.push('Email address is required');
        }
        if (!courseType) {
            errors.push('Course type is required');
        }
        
        console.log('  Validation errors:', errors);
        
    } else {
        console.log(`\n❌ Row ${rowNum}: Row not found`);
    }
}

// Let's also check what the import script is actually reading
console.log('\n🔍 Checking import script row reading:');
console.log('=====================================');

// Simulate the import script's readSheet method
const rows = data.slice(1) as unknown[][];
console.log(`Total rows after slice: ${rows.length}`);

// Check the specific problematic rows (subtract 2 because of 0-indexing and header)
const problematicIndices = [1, 102, 203, 304, 405, 506, 607]; // rowNum - 2

for (const index of problematicIndices) {
    if (rows[index]) {
        const row = rows[index];
        console.log(`\n📊 Import script Row ${index + 2}:`);
        console.log('  Raw row:', row);
        
        // Map exactly like the import script
        const obj: Record<string, unknown> = {};
        headers.forEach((header, headerIndex) => {
            if (header && row[headerIndex] !== undefined) {
                obj[header] = row[headerIndex];
            }
        });
        console.log('  Mapped obj:', obj);
    }
} 