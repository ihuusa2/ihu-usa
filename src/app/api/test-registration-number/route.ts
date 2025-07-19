import { NextResponse } from "next/server";
import { generateRegistrationNumber, getNextRegistrationNumber } from "@/functions";

export async function GET() {
    try {
        const today = new Date();
        const testDate = new Date(2025, 0, 13); // January 13, 2025
        
        // Test the functions
        const todayFirst = generateRegistrationNumber(today, 1);
        const todaySixth = generateRegistrationNumber(today, 6);
        const targetFormat = generateRegistrationNumber(testDate, 6);
        
        // Test with existing numbers
        const existingNumbers = ['IHU2501131', 'IHU2501132', 'IHU2501135'];
        const nextNumber = getNextRegistrationNumber(testDate, existingNumbers);
        
        return NextResponse.json({
            success: true,
            tests: {
                todayFirst,
                todaySixth,
                targetFormat,
                nextNumber,
                expectedTarget: 'IHU2501136'
            },
            currentDate: today.toISOString(),
            testDate: testDate.toISOString()
        });
    } catch (error) {
        console.error('Error testing registration number generation:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to test registration number generation' },
            { status: 500 }
        );
    }
} 