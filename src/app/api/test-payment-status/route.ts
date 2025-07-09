import { NextResponse } from "next/server";
import { PaymentStatus } from "@/Types/Form";

export async function GET() {
    try {
        // Test the PaymentStatus enum values
        const testCases = [
            { status: PaymentStatus.PENDING, expected: 'PENDING' },
            { status: PaymentStatus.COMPLETED, expected: 'COMPLETED' },
            { status: PaymentStatus.FAILED, expected: 'FAILED' },
            { status: PaymentStatus.REFUNDED, expected: 'REFUNDED' }
        ];

        const results = testCases.map(testCase => ({
            input: testCase.status,
            expected: testCase.expected,
            actual: testCase.status,
            passed: testCase.status === testCase.expected
        }));

        const allPassed = results.every(result => result.passed);
        const passedCount = results.filter(result => result.passed).length;

        return NextResponse.json({
            success: true,
            message: `Payment Status Test Results: ${passedCount}/${results.length} tests passed`,
            allTestsPassed: allPassed,
            results,
            summary: {
                total: results.length,
                passed: passedCount,
                failed: results.length - passedCount
            }
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Error testing payment status',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 