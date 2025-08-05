import { NextResponse } from 'next/server';
import { getNextRegistrationNumber, generateRegistrationNumber } from '@/functions';

export async function GET() {
  try {
    console.log('=== DEBUG: Registration Number Generation ===');
    
    const currentYear = new Date().getFullYear();
    console.log('Current year:', currentYear);
    
    // Test 1: Generate with empty array (should be IHU2501177)
    const test1 = getNextRegistrationNumber(currentYear, []);
    console.log('Test 1 (empty array):', test1);
    
    // Test 2: Generate with some old format numbers
    const oldNumbers = ['IHU25250512001', 'IHU25250512002'];
    const test2 = getNextRegistrationNumber(currentYear, oldNumbers);
    console.log('Test 2 (with old numbers):', test2);
    
    // Test 3: Generate with new format numbers
    const newNumbers = ['IHU2501177', 'IHU2501178'];
    const test3 = getNextRegistrationNumber(currentYear, newNumbers);
    console.log('Test 3 (with new numbers):', test3);
    
    // Test 4: Direct generation
    const direct1 = generateRegistrationNumber(currentYear, 1177);
    const direct2 = generateRegistrationNumber(currentYear, 1178);
    console.log('Direct generation 1177:', direct1);
    console.log('Direct generation 1178:', direct2);
    
    return NextResponse.json({
      success: true,
      debug: {
        currentYear,
        test1,
        test2,
        test3,
        direct1,
        direct2,
        expected: 'IHU2501177'
      }
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { success: false, error: 'Debug failed' },
      { status: 500 }
    );
  }
} 