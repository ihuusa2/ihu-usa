import { NextResponse } from "next/server";
import { generateRegistrationNumber, getNextRegistrationNumber } from "@/functions";

export async function GET() {
    try {
        const currentYear = new Date().getFullYear();
        const testYear = 2025;
        
        // Test the functions
        const firstNumber = generateRegistrationNumber(currentYear, 1176);
        const secondNumber = generateRegistrationNumber(currentYear, 1177);
        const targetFormat = generateRegistrationNumber(testYear, 1176);
        
        // Test with existing numbers
        const existingNumbers = ['IHU2501176', 'IHU2501177', 'IHU2501178'];
        const nextNumber = getNextRegistrationNumber(testYear, existingNumbers);
        
        return NextResponse.json({
            success: true,
            tests: {
                firstNumber,
                secondNumber,
                targetFormat,
                nextNumber,
                expectedTarget: 'IHU2501179'
            },
            currentYear,
            testYear
        });
    } catch (error) {
        console.error('Error testing registration number generation:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to test registration number generation' },
            { status: 500 }
        );
    }
} 