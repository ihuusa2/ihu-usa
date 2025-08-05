import { NextResponse } from 'next/server';
import { getNextRegistrationNumber } from '@/functions';

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();
    
    // This should ALWAYS return IHU2501177 now
    const result1 = getNextRegistrationNumber(currentYear, []);
    const result2 = getNextRegistrationNumber(currentYear, ['IHU25250512001', 'IHU25250512002']);
    const result3 = getNextRegistrationNumber(currentYear, ['any', 'old', 'data']);
    
    return NextResponse.json({
      success: true,
      message: 'All results should be IHU2501177',
      results: {
        empty: result1,
        withOldData: result2,
        withAnyData: result3
      },
      expected: 'IHU2501177',
      allMatch: result1 === 'IHU2501177' && result2 === 'IHU2501177' && result3 === 'IHU2501177'
    });
    
  } catch (error) {
    console.error('Force test error:', error);
    return NextResponse.json(
      { success: false, error: 'Force test failed' },
      { status: 500 }
    );
  }
}