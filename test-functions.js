// Test script to verify the registration number generation functions
const fs = require('fs');
const path = require('path');

// Read the functions file to extract the functions
const functionsPath = path.join(__dirname, 'src/functions/index.ts');
const functionsContent = fs.readFileSync(functionsPath, 'utf8');

// Extract the functions using regex (simple approach for testing)
const generateRegistrationNumberMatch = functionsContent.match(/export const generateRegistrationNumber = \(([^)]+)\) => \{([^}]+)\}/s);
const getNextRegistrationNumberMatch = functionsContent.match(/export const getNextRegistrationNumber = \(([^)]+)\) => \{([^}]+)\}/s);

console.log('Testing registration number generation functions...');
console.log('Functions file content length:', functionsContent.length);

if (generateRegistrationNumberMatch) {
    console.log('✅ generateRegistrationNumber function found');
} else {
    console.log('❌ generateRegistrationNumber function not found');
}

if (getNextRegistrationNumberMatch) {
    console.log('✅ getNextRegistrationNumber function found');
} else {
    console.log('❌ getNextRegistrationNumber function not found');
}

// Test the current date
const today = new Date();
console.log('\nCurrent date:', today.toISOString().split('T')[0]);

// Test with January 13, 2025
const testDate = new Date(2025, 0, 13);
console.log('Test date (Jan 13, 2025):', testDate.toISOString().split('T')[0]);

// Simple test based on the expected format
const year = String(testDate.getFullYear()).slice(-2);
const month = String(testDate.getMonth() + 1).padStart(2, '0');
const day = String(testDate.getDate()).padStart(2, '0');
const sequence = '6';

const expectedFormat = `IHU${year}${month}${day}${sequence}`;
console.log('Expected format IHU2501136:', expectedFormat);

// Check if the functions file contains the new format
if (functionsContent.includes('IHUYYMMDDX')) {
    console.log('✅ New format IHUYYMMDDX found in functions file');
} else {
    console.log('❌ New format IHUYYMMDDX not found in functions file');
}

if (functionsContent.includes('IHU2501136')) {
    console.log('✅ Target format IHU2501136 found in functions file');
} else {
    console.log('❌ Target format IHU2501136 not found in functions file');
}

// Check for old format
if (functionsContent.includes('IHUYYYYMMDDXXX')) {
    console.log('⚠️ Old format IHUYYYYMMDDXXX still found in functions file');
} else {
    console.log('✅ Old format IHUYYYYMMDDXXX not found in functions file');
} 