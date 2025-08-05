import { NextResponse } from 'next/server';
import { getNextRegistrationNumber, parseRegistrationNumber } from '@/functions';

export async function GET() {
  try {
    console.log('=== Testing IHU Registration Number System ===');
    
    // Test 1: First registration should be IHU2501177
    const firstNumber = getNextRegistrationNumber(2025, []);
    console.log('Test 1 - First registration:', firstNumber);
    
    // Test 2: Second registration should be IHU2501178
    const secondNumber = getNextRegistrationNumber(2025, [firstNumber]);
    console.log('Test 2 - Second registration:', secondNumber);
    
    // Test 3: Third registration should be IHU2501179
    const thirdNumber = getNextRegistrationNumber(2025, [firstNumber, secondNumber]);
    console.log('Test 3 - Third registration:', thirdNumber);
    
    // Test 4: Test with existing numbers from different years
    const existingNumbers = [
      'IHU2501177',
      'IHU2501178', 
      'IHU2501179',
      'IHU2601180', // Next year
      'IHU2601181'  // Next year
    ];
    
    const nextNumber = getNextRegistrationNumber(2025, existingNumbers);
    console.log('Test 4 - Next number with existing data:', nextNumber);
    
    // Test 5: Test year change - should continue sequence
    const nextYearNumber = getNextRegistrationNumber(2026, existingNumbers);
    console.log('Test 5 - Next year number:', nextYearNumber);
    
    // Test 6: Parse registration numbers
    const parsedFirst = parseRegistrationNumber(firstNumber);
    const parsedSecond = parseRegistrationNumber(secondNumber);
    const parsedNextYear = parseRegistrationNumber(nextYearNumber);
    
    console.log('Test 6 - Parsed first number:', parsedFirst);
    console.log('Test 6 - Parsed second number:', parsedSecond);
    console.log('Test 6 - Parsed next year number:', parsedNextYear);
    
    // Test 7: Validate expected format
    const expectedFirst = 'IHU2501177';
    const expectedSecond = 'IHU2501178';
    const expectedNextYear = 'IHU2601182'; // Should continue from 1181
    
    const tests = [
      { name: 'First registration', actual: firstNumber, expected: expectedFirst },
      { name: 'Second registration', actual: secondNumber, expected: expectedSecond },
      { name: 'Next year registration', actual: nextYearNumber, expected: expectedNextYear }
    ];
    
    const results = tests.map(test => ({
      test: test.name,
      actual: test.actual,
      expected: test.expected,
      passed: test.actual === test.expected
    }));
    
    const allPassed = results.every(r => r.passed);
    
    console.log('=== Test Results ===');
    results.forEach(result => {
      console.log(`${result.test}: ${result.passed ? 'PASS' : 'FAIL'}`);
      if (!result.passed) {
        console.log(`  Expected: ${result.expected}, Got: ${result.actual}`);
      }
    });
    
    return NextResponse.json({
      success: allPassed,
      message: allPassed ? 'All tests passed!' : 'Some tests failed',
      results,
      summary: {
        systemStarted: 'IHU2501177',
        format: 'IHUYYXXXXX where YY=year, XXXXX=sequence starting from 01177',
        sequenceContinuesAcrossYears: true
      }
    });
    
  } catch (error) {
    console.error('Error testing registration number system:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to test registration number system' },
      { status: 500 }
    );
  }
} 