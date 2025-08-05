// Test script to verify registration number generation
const { generateRegistrationNumber, getNextRegistrationNumber } = require('./src/functions/index.ts');

console.log('=== Testing Registration Number Generation ===');

const currentYear = new Date().getFullYear();
console.log('Current year:', currentYear);

// Test 1: Generate first number (should be IHU2501177)
console.log('\n--- Test 1: Empty database (should start from IHU2501177) ---');
const firstNumber = getNextRegistrationNumber(currentYear, []);
console.log('First registration number:', firstNumber);

// Test 2: Simulate existing number IHU2501176 (should generate IHU2501177)
console.log('\n--- Test 2: With existing IHU2501176 (should generate IHU2501177) ---');
const afterIHU2501176 = getNextRegistrationNumber(currentYear, ['IHU2501176']);
console.log('After IHU2501176:', afterIHU2501176);

// Test 3: Sequential generation from IHU2501177
console.log('\n--- Test 3: Sequential generation starting from IHU2501177 ---');
const existingNumbers = ['IHU2501177'];
for (let i = 0; i < 5; i++) {
    const nextNumber = getNextRegistrationNumber(currentYear, existingNumbers);
    console.log(`Registration ${i + 2}:`, nextNumber);
    existingNumbers.push(nextNumber);
}

// Test 4: Direct generation of specific numbers
console.log('\n--- Test 4: Direct generation of specific numbers ---');
console.log('IHU2501177:', generateRegistrationNumber(currentYear, 1177));
console.log('IHU2501178:', generateRegistrationNumber(currentYear, 1178));
console.log('IHU2501179:', generateRegistrationNumber(currentYear, 1179));
console.log('IHU2501180:', generateRegistrationNumber(currentYear, 1180));

console.log('\n=== Test Complete ===');