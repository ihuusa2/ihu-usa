import { NextResponse } from 'next/server';
import { getNextRegistrationNumber } from '@/functions';

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();
    
    // Simulate the progression you want
    console.log('=== Quick Test: Registration Number Progression ===');
    
    // Start fresh
    const reg1 = getNextRegistrationNumber(currentYear, []);
    console.log('1st registration:', reg1);
    
    // Add more registrations
    const reg2 = getNextRegistrationNumber(currentYear, [reg1]);
    console.log('2nd registration:', reg2);
    
    const reg3 = getNextRegistrationNumber(currentYear, [reg1, reg2]);
    console.log('3rd registration:', reg3);
    
    // Simulate many registrations to reach 1200
    const manyRegs = [];
    for (let i = 1177; i <= 1200; i++) {
      manyRegs.push(`IHU25${String(i).padStart(5, '0')}`);
    }
    
    const nextAfter1200 = getNextRegistrationNumber(currentYear, manyRegs);
    console.log('After IHU2501200:', nextAfter1200);
    
    // Test year change
    const nextYear2026 = getNextRegistrationNumber(2026, manyRegs);
    console.log('First in 2026:', nextYear2026);
    
    const secondIn2026 = getNextRegistrationNumber(2026, [...manyRegs, nextYear2026]);
    console.log('Second in 2026:', secondIn2026);
    
    return NextResponse.json({
      success: true,
      progression: {
        first: reg1,
        second: reg2,
        third: reg3,
        afterMany: nextAfter1200,
        firstIn2026: nextYear2026,
        secondIn2026: secondIn2026
      },
      expected: {
        first: 'IHU2501177',
        second: 'IHU2501178',
        third: 'IHU2501179',
        afterMany: 'IHU2501201',
        firstIn2026: 'IHU2601201',
        secondIn2026: 'IHU2601202'
      },
      note: 'Sequence continues across years, only year part changes'
    });
    
  } catch (error) {
    console.error('Quick test error:', error);
    return NextResponse.json(
      { success: false, error: 'Quick test failed' },
      { status: 500 }
    );
  }
}