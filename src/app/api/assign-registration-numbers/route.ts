import { NextRequest, NextResponse } from 'next/server'
import { assignRegistrationNumbersToExisting } from '@/Server/Registration'

export async function POST(req: NextRequest) {
    try {
        // Check if this is an admin request (you might want to add proper authentication)
        const authHeader = req.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const result = await assignRegistrationNumbersToExisting()
        
        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `Successfully assigned registration numbers to ${result.count} registrations`,
                count: result.count,
                errors: result.errors
            })
        } else {
            return NextResponse.json({
                success: false,
                message: 'Failed to assign registration numbers',
                errors: result.errors
            }, { status: 500 })
        }
    } catch (error) {
        console.error('Error in assign-registration-numbers API:', error)
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
} 