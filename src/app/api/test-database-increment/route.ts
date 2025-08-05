import { NextResponse } from 'next/server';
import { getNextRegistrationNumber } from '@/functions';

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();
    
    console.log('=== Testing Database-Aware Registration Number Increment ===');
    
    // Test 1: No existing numbers (should start from IHU2501177)
    const test1 = getNextRegistrationNumber(currentYear, []);
    console.log('Test 1 - No existing numbers:', test1);
    
    // Test 2: With some new format numbers
    const existingNewFormat = [
      'IHU2501177',
      'IHU2501178',
      'IHU2501179'
    ];
    const test2 = getNextRegistrationNumber(currentYear, existingNewFormat);
    console.log('Test 2 - After IHU2501179:', test2);
    
    // Test 3: Mixed old and new format (should ignore old format)
    const mixedFormat = [
      'IHU25250512001', // Old format - should be ignored
      'IHU25250512002', // Old format - should be ignored
      'IHU2501177',     // New format
      'IHU2501178',     // New format
      'IHU2501179',     // New format
      'IHU2501180'      // New format
    ];
    const test3 = getNextRegistrationNumber(currentYear, mixedFormat);
    console.log('Test 3 - Mixed format (should ignore old):', test3);
    
    // Test 4: Higher sequence numbers
    const higherSequence = [
      'IHU2501177', 'IHU2501178', 'IHU2501179', 'IHU2501180',
      'IHU2501181', 'IHU2501182', 'IHU2501183', 'IHU2501184',
      'IHU2501185', 'IHU2501186', 'IHU2501187', 'IHU2501188',
      'IHU2501189', 'IHU2501190'
    ];
    const test4 = getNextRegistrationNumber(currentYear, higherSequence);
    console.log('Test 4 - After IHU2501190:', test4);
    
    // Test 5: Cross-year sequences
    const crossYear = [
      'IHU2501177', 'IHU2501178', 'IHU2501179',
      'IHU2601180', 'IHU2601181', 'IHU2601182'  // 2026 numbers
    ];
    const test5 = getNextRegistrationNumber(currentYear, crossYear);
    console.log('Test 5 - Cross-year sequence:', test5);
    
    const expected = {
      test1: 'IHU2501177',  // First number
      test2: 'IHU2501180',  // After 1179, next is 1180
      test3: 'IHU2501181',  // Ignores old format, continues from 1180
      test4: 'IHU2501191',  // After 1190, next is 1191
      test5: 'IHU2501183'   // Uses highest sequence (1182) + 1
    };
    
    const actual = { test1, test2, test3, test4, test5 };
    
    const checks = Object.keys(expected).map(key => ({
      test: key,
      actual: actual[key as keyof typeof actual],
      expected: expected[key as keyof typeof expected],
      passed: actual[key as keyof typeof actual] === expected[key as keyof typeof expected]
    }));
    
    const allPassed = checks.every(check => check.passed);
    
    return NextResponse.json({
      success: allPassed,
      message: allPassed ? 'Database increment working correctly!' : 'Some tests failed',
      results: actual,
      expected,
      checks,
      explanation: {
        logic: 'Finds highest sequence number >= 1177 in database and adds +1',
        ignores: 'Old format numbers and sequences < 1177',
        minimum: 'Always starts from 1177 if no valid numbers found'
      }
    });
    
  } catch (error) {
    console.error('Database increment test error:', error);
    return NextResponse.json(
      { success: false, error: 'Database increment test failed' },
      { status: 500 }
    );
  }
}