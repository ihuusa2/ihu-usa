import { NextResponse } from 'next/server';
import { getNextRegistrationNumber } from '@/functions';

export async function GET() {
  try {
    console.log('=== Testing Registration Number Sequence Continuation ===');
    
    // Test 1: Start from empty (should be IHU2501177)
    const test1 = getNextRegistrationNumber(2025, []);
    console.log('Test 1 - First registration (empty array):', test1);
    
    // Test 2: After first registration (should be IHU2501178)
    const test2 = getNextRegistrationNumber(2025, ['IHU2501177']);
    console.log('Test 2 - Second registration:', test2);
    
    // Test 3: Multiple registrations in 2025
    const existingIn2025 = [
      'IHU2501177',
      'IHU2501178', 
      'IHU2501179',
      'IHU2501180',
      'IHU2501181'
    ];
    const test3 = getNextRegistrationNumber(2025, existingIn2025);
    console.log('Test 3 - Next in 2025 sequence:', test3);
    
    // Test 4: Reaching higher numbers in 2025
    const moreIn2025 = [
      'IHU2501177', 'IHU2501178', 'IHU2501179', 'IHU2501180', 'IHU2501181',
      'IHU2501182', 'IHU2501183', 'IHU2501184', 'IHU2501185', 'IHU2501186',
      'IHU2501187', 'IHU2501188', 'IHU2501189', 'IHU2501190', 'IHU2501191',
      'IHU2501192', 'IHU2501193', 'IHU2501194', 'IHU2501195', 'IHU2501196',
      'IHU2501197', 'IHU2501198', 'IHU2501199', 'IHU2501200'
    ];
    const test4 = getNextRegistrationNumber(2025, moreIn2025);
    console.log('Test 4 - After IHU2501200:', test4);
    
    // Test 5: Year change - sequence should continue (IHU2601201)
    const test5 = getNextRegistrationNumber(2026, moreIn2025);
    console.log('Test 5 - First in 2026 (should continue sequence):', test5);
    
    // Test 6: More registrations in 2026
    const mixedYears = [
      ...moreIn2025,
      'IHU2601201', 'IHU2601202', 'IHU2601203'
    ];
    const test6 = getNextRegistrationNumber(2026, mixedYears);
    console.log('Test 6 - Next in 2026:', test6);
    
    // Test 7: Back to 2025 (should continue from highest sequence)
    const test7 = getNextRegistrationNumber(2025, mixedYears);
    console.log('Test 7 - Back to 2025 (should use highest sequence):', test7);
    
    // Expected results
    const expectedResults = {
      test1: 'IHU2501177',
      test2: 'IHU2501178', 
      test3: 'IHU2501182',
      test4: 'IHU2501201',
      test5: 'IHU2601201', // Same sequence, different year
      test6: 'IHU2601204',
      test7: 'IHU2501204'  // Uses highest sequence regardless of year
    };
    
    const results = {
      test1,
      test2,
      test3,
      test4,
      test5,
      test6,
      test7
    };
    
    // Check if results match expectations
    const checks = (Object.keys(expectedResults) as (keyof typeof expectedResults)[]).map(key => ({
      test: key,
      actual: results[key],
      expected: expectedResults[key],
      passed: results[key] === expectedResults[key]
    }));
    
    const allPassed = checks.every(check => check.passed);
    
    console.log('=== Test Results ===');
    checks.forEach(check => {
      console.log(`${check.test}: ${check.passed ? 'PASS' : 'FAIL'} - ${check.actual}`);
      if (!check.passed) {
        console.log(`  Expected: ${check.expected}, Got: ${check.actual}`);
      }
    });
    
    return NextResponse.json({
      success: allPassed,
      message: allPassed ? 'All sequence tests passed!' : 'Some tests failed',
      results,
      expectedResults,
      checks,
      summary: {
        startFrom: 'IHU2501177',
        sequenceContinuesAcrossYears: true,
        yearChangesFormat: '2025 → IHU25XXXXX, 2026 → IHU26XXXXX',
        sequenceExample: 'IHU2501200 → IHU2601201 (year changes, sequence continues)'
      }
    });
    
  } catch (error) {
    console.error('Sequence test error:', error);
    return NextResponse.json(
      { success: false, error: 'Sequence test failed' },
      { status: 500 }
    );
  }
}