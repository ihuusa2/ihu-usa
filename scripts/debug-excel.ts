import * as XLSX from 'xlsx';
import * as fs from 'fs';

const filePath = './nhs-data.xlsx';

if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

const workbook = XLSX.readFile(filePath);
console.log('📋 Available sheets:', workbook.SheetNames);

for (const sheetName of workbook.SheetNames) {
    console.log(`\n📊 Sheet: "${sheetName}"`);
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length > 0) {
        const headers = data[0] as string[];
        console.log('📝 Headers:', headers);
        console.log('📊 Total rows:', data.length - 1);
        
        if (data.length > 1) {
            console.log('📋 First row data:', data[1]);
        }
    } else {
        console.log('❌ No data found in sheet');
    }
} 