import { NextResponse } from 'next/server';
import { getNextRegistrationNumber } from '@/functions';
import { resetRegistrationCounter } from '@/utils/registrationCounter';

export async function GET() {
  try {
    console.log('=== Testing Sequential Registration Numbers ===');
    
    // Reset counter to start fresh
    resetRegistrationCounter(1177);
    
    const currentYear = new Date().getFullYear();
    
    // Generate 5 sequential registration numbers
    const registrations = [];
    for (let i = 0; i < 5; i++) {
      const regNumber = getNextRegistrationNumber(currentYear, []);
      registrations.push(regNumber);
      console.log(`Registration ${i + 1}: ${regNumber}`);
    }
    
    const expected = [
      'IHU2501177',
      'IHU2501178', 
      'IHU2501179',
      'IHU2501180',
      'IHU2501181'
    ];
    
    const allCorrect = registrations.every((reg, index) => reg === expected[index]);
    
    return NextResponse.json({
      success: allCorrect,
      message: allCorrect ? 'Sequential generation working perfectly!' : 'Sequence is incorrect',
      generated: registrations,
      expected: expected,
      note: 'Each call should increment: IHU2501177 → IHU2501178 → IHU2501179 etc.'
    });
    
  } catch (error) {
    console.error('Sequential test error:', error);
    return NextResponse.json(
      { success: false, error: 'Sequential test failed' },
      { status: 500 }
    );
  }
}