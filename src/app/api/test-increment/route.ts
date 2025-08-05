import { NextResponse } from 'next/server';
import { getNextRegistrationNumber } from '@/functions';

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();
    
    console.log('=== Testing Incremental Registration Numbers ===');
    
    // Test 1: First registration (should be IHU2501177)
    const first = getNextRegistrationNumber(currentYear, []);
    console.log('1st registration:', first);
    
    // Test 2: Second registration (should be IHU2501178)
    const second = getNextRegistrationNumber(currentYear, [first]);
    console.log('2nd registration:', second);
    
    // Test 3: Third registration (should be IHU2501179)
    const third = getNextRegistrationNumber(currentYear, [first, second]);
    console.log('3rd registration:', third);
    
    // Test 4: Fourth registration (should be IHU2501180)
    const fourth = getNextRegistrationNumber(currentYear, [first, second, third]);
    console.log('4th registration:', fourth);
    
    // Test 5: With mixed old and new format (should ignore old)
    const mixed = [
      'IHU25250512001', // Old format - should be ignored
      'IHU25250512002', // Old format - should be ignored
      first,            // New format
      second,           // New format
      third             // New format
    ];
    const fifth = getNextRegistrationNumber(currentYear, mixed);
    console.log('5th registration (with old format mixed in):', fifth);
    
    const expected = {
      first: 'IHU2501177',
      second: 'IHU2501178',
      third: 'IHU2501179',
      fourth: 'IHU2501180',
      fifth: 'IHU2501180' // Same as fourth since it should ignore old format
    };
    
    const actual = { first, second, third, fourth, fifth };
    
    const checks = Object.keys(expected).map(key => ({
      test: key,
      actual: actual[key as keyof typeof actual],
      expected: expected[key as keyof typeof expected],
      passed: actual[key as keyof typeof actual] === expected[key as keyof typeof expected]
    }));
    
    const allPassed = checks.every(check => check.passed);
    
    return NextResponse.json({
      success: allPassed,
      message: allPassed ? 'Incremental sequence working!' : 'Some tests failed',
      results: actual,
      expected,
      checks,
      note: 'Each registration should increment by 1'
    });
    
  } catch (error) {
    console.error('Increment test error:', error);
    return NextResponse.json(
      { success: false, error: 'Increment test failed' },
      { status: 500 }
    );
  }
}