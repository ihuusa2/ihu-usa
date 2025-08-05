import { NextResponse } from 'next/server';
import { getNextRegistrationNumber, generateRegistrationNumber } from '@/functions';

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();
    
    // Test 1: Direct generation
    const direct1 = generateRegistrationNumber(currentYear, 1177);
    const direct2 = generateRegistrationNumber(currentYear, 1178);
    
    // Test 2: Next number with empty array
    const next1 = getNextRegistrationNumber(currentYear, []);
    
    // Test 3: Next number with existing new format
    const next2 = getNextRegistrationNumber(currentYear, ['IHU2501177']);
    
    // Test 4: Next number with old format (should be ignored)
    const next3 = getNextRegistrationNumber(currentYear, ['IHU25250512001', 'IHU25250512002']);
    
    return NextResponse.json({
      success: true,
      tests: {
        direct1,
        direct2,
        next1,
        next2,
        next3,
        expected: 'IHU2501177'
      },
      currentYear,
      message: 'All new registrations should start from IHU2501177'
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { success: false, error: 'Test failed' },
      { status: 500 }
    );
  }
} 