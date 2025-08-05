import { NextResponse } from 'next/server';
import { getNextRegistrationNumber } from '@/functions';

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();
    
    console.log('=== Testing Date-Based Registration Number Logic ===');
    
    // Test 1: No existing numbers (should start from IHU2501177)
    const test1 = getNextRegistrationNumber(currentYear, []);
    console.log('Test 1 - No existing numbers:', test1);
    
    // Test 2: Based on most recent registration by date
    // Simulating: last registration by date was IHU2501185
    const lastByDate = ['IHU2501185'];
    const test2 = getNextRegistrationNumber(currentYear, lastByDate);
    console.log('Test 2 - After last date registration IHU2501185:', test2);
    
    // Test 3: Another example - last was IHU2501199
    const lastByDate2 = ['IHU2501199'];
    const test3 = getNextRegistrationNumber(currentYear, lastByDate2);
    console.log('Test 3 - After last date registration IHU2501199:', test3);
    
    // Test 4: Cross-year example - last was IHU2601205 (from 2026)
    const crossYear = ['IHU2601205'];
    const test4 = getNextRegistrationNumber(currentYear, crossYear);
    console.log('Test 4 - After cross-year registration IHU2601205:', test4);
    
    const expected = {
      test1: 'IHU2501177',  // First number
      test2: 'IHU2501186',  // 1185 + 1 = 1186
      test3: 'IHU2501200',  // 1199 + 1 = 1200
      test4: 'IHU2501206'   // 1205 + 1 = 1206 (uses current year)
    };
    
    const actual = { test1, test2, test3, test4 };
    
    const checks = Object.keys(expected).map(key => ({
      test: key,
      actual: actual[key as keyof typeof actual],
      expected: expected[key as keyof typeof expected],
      passed: actual[key as keyof typeof actual] === expected[key as keyof typeof expected]
    }));
    
    const allPassed = checks.every(check => check.passed);
    
    return NextResponse.json({
      success: allPassed,
      message: allPassed ? 'Date-based logic working correctly!' : 'Some tests failed',
      results: actual,
      expected,
      checks,
      explanation: {
        logic: 'Finds most recent registration by date, extracts sequence number, adds +1',
        dateOrder: 'Uses createdAt field to find latest registration',
        yearHandling: 'Uses current year for new registration regardless of last registration year'
      }
    });
    
  } catch (error) {
    console.error('Date-based test error:', error);
    return NextResponse.json(
      { success: false, error: 'Date-based test failed' },
      { status: 500 }
    );
  }
}