import { NextResponse } from 'next/server';
import { getNextRegistrationNumber, generateRegistrationNumber } from '@/functions';

export async function GET() {
  try {
    console.log('=== DEBUG: Current Registration Issue ===');
    
    const currentYear = new Date().getFullYear();
    console.log('Current year:', currentYear);
    
    // Test what happens with empty array
    const test1 = getNextRegistrationNumber(currentYear, []);
    console.log('Test 1 - Empty array result:', test1);
    
    // Test direct generation
    const direct = generateRegistrationNumber(currentYear, 1177);
    console.log('Direct generation (year, 1177):', direct);
    
    // Test with problematic old format
    const oldFormat = ['IHU25250512001', 'IHU25250512002'];
    const test2 = getNextRegistrationNumber(currentYear, oldFormat);
    console.log('Test 2 - With old format numbers:', test2);
    
    // Check what's being parsed from old format
    oldFormat.forEach(num => {
      console.log(`Parsing ${num}:`);
      const sequencePart = num.slice(3);
      console.log(`  Sequence part: ${sequencePart} (length: ${sequencePart.length})`);
      
      if (sequencePart.length === 7) {
        console.log('  This would be considered new format!');
        const yearPart = sequencePart.slice(0, 2);
        const seqPart = sequencePart.slice(2);
        console.log(`  Year part: ${yearPart}, Sequence part: ${seqPart}`);
      } else {
        console.log('  Not new format - would be ignored');
      }
    });
    
    return NextResponse.json({
      success: true,
      debug: {
        currentYear,
        test1,
        direct,
        test2,
        issue: 'If test1 and direct are not IHU2501177, there is a problem',
        oldFormatAnalysis: 'Check console for parsing details'
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