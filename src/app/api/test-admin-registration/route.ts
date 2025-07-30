import { NextResponse } from "next/server";
import { getNextRegistrationNumber } from "@/functions";

export async function GET() {
    try {
        const currentYear = new Date().getFullYear();
        
        // Simulate existing numbers from both student registrations and admin users
        const existingStudentNumbers = [
            'IHU2501176',
            'IHU2501177', 
            'IHU2501178'
        ];
        
        const existingAdminNumbers = [
            'IHU2501179',
            'IHU2501180'
        ];
        
        // Combine all existing numbers
        const allExistingNumbers = [...existingStudentNumbers, ...existingAdminNumbers];
        
        // Generate next numbers for admin users
        const nextAdminNumber1 = getNextRegistrationNumber(currentYear, allExistingNumbers);
        const nextAdminNumber2 = getNextRegistrationNumber(currentYear, [...allExistingNumbers, nextAdminNumber1]);
        const nextAdminNumber3 = getNextRegistrationNumber(currentYear, [...allExistingNumbers, nextAdminNumber1, nextAdminNumber2]);
        
        return NextResponse.json({
            success: true,
            existingStudentNumbers,
            existingAdminNumbers,
            allExistingNumbers,
            nextAdminNumbers: {
                first: nextAdminNumber1,
                second: nextAdminNumber2,
                third: nextAdminNumber3
            },
            format: "Admin users get registration numbers in the same continuous series as student registrations"
        });
    } catch (error) {
        console.error('Error testing admin registration:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to test admin registration' },
            { status: 500 }
        );
    }
} 