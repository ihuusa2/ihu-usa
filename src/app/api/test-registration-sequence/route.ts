import { NextResponse } from "next/server";
import { generateRegistrationNumber, getNextRegistrationNumber } from "@/functions";

export async function GET() {
    try {
        const year2025 = 2025;
        const year2026 = 2026;
        const year2027 = 2027;
        
        // Simulate existing numbers from 2025
        const existing2025Numbers = [
            'IHU2501176',
            'IHU2501177', 
            'IHU2501178'
        ];
        
        // Generate next numbers for each year
        const next2025 = getNextRegistrationNumber(year2025, existing2025Numbers);
        const next2026 = getNextRegistrationNumber(year2026, existing2025Numbers);
        const next2027 = getNextRegistrationNumber(year2027, existing2025Numbers);
        
        // Generate a sequence showing the continuous series
        const sequence = [];
        const currentSequence = 1176;
        
        // 2025 sequence
        for (let i = 0; i < 3; i++) {
            sequence.push(generateRegistrationNumber(year2025, currentSequence + i));
        }
        
        // 2026 sequence (continuing from where 2025 left off)
        for (let i = 0; i < 3; i++) {
            sequence.push(generateRegistrationNumber(year2026, currentSequence + 3 + i));
        }
        
        // 2027 sequence (continuing from where 2026 left off)
        for (let i = 0; i < 3; i++) {
            sequence.push(generateRegistrationNumber(year2027, currentSequence + 6 + i));
        }
        
        return NextResponse.json({
            success: true,
            existing2025Numbers,
            nextNumbers: {
                next2025,
                next2026,
                next2027
            },
            continuousSequence: sequence,
            format: "IHUYYXXXXX where YY=year suffix, XXXXX=continuous 5-digit sequence across years"
        });
    } catch (error) {
        console.error('Error testing registration sequence:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to test registration sequence' },
            { status: 500 }
        );
    }
} 