import { getRegistrationByRegNum } from '@/Server/Registration'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const registrationNumber = searchParams.get('registrationNumber')

        if (!registrationNumber) {
            return NextResponse.json(
                { error: 'Registration number parameter is required' },
                { status: 400 }
            )
        }

        const registration = await getRegistrationByRegNum(registrationNumber)
        
        return NextResponse.json({ 
            exists: !!registration,
            registrationNumber: registrationNumber,
            message: registration ? 'Registration number is valid' : 'Invalid registration number. Please register first.',
            countryOrRegion: registration?.countryOrRegion || null
        })
    } catch (error) {
        console.error('Error checking registration number:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 