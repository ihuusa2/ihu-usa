import { NextRequest, NextResponse } from 'next/server';
import { getNextRegistrationNumber } from '@/functions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testYear = searchParams.get('year') ? parseInt(searchParams.get('year')!) : 2025;
    
    console.log('Testing new registration number system...');
    console.log('Test year:', testYear);
    
    // Test 1: Generate first registration number (should be IHU2501177)
    const firstNumber = getNextRegistrationNumber(testYear, []);
    console.log('First registration number:', firstNumber);
    
    // Test 2: Generate second registration number
    const secondNumber = getNextRegistrationNumber(testYear, [firstNumber]);
    console.log('Second registration number:', secondNumber);
    
    // Test 3: Generate third registration number
    const thirdNumber = getNextRegistrationNumber(testYear, [firstNumber, secondNumber]);
    console.log('Third registration number:', thirdNumber);
    
    // Test 4: Test with existing numbers from different years
    const existingNumbers = [
      'IHU2501177',
      'IHU2501178', 
      'IHU2501179',
      'IHU2601180', // Next year
      'IHU2601181'  // Next year
    ];
    
    const nextNumber = getNextRegistrationNumber(testYear, existingNumbers);
    console.log('Next number with existing data:', nextNumber);
    
    // Test 5: Test year change
    const nextYearNumber = getNextRegistrationNumber(2026, existingNumbers);
    console.log('Next year number:', nextYearNumber);
    
    return NextResponse.json({
      success: true,
      message: 'New registration number system test completed',
      results: {
        firstNumber,
        secondNumber,
        thirdNumber,
        nextNumber,
        nextYearNumber,
        expectedFormat: 'IHUYYXXXXX where YY=year, XXXXX=sequence starting from 01177'
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