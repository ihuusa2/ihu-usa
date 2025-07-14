import { checkMobileAlreadyExists } from '@/Server/Registration'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const countryCode = searchParams.get('countryCode')
        const phone = searchParams.get('phone')

        if (!countryCode || !phone) {
            return NextResponse.json(
                { error: 'Both countryCode and phone parameters are required' },
                { status: 400 }
            )
        }

        const mobileExists = await checkMobileAlreadyExists(countryCode, phone)
        
        return NextResponse.json({ 
            exists: mobileExists,
            countryCode: countryCode,
            phone: phone 
        })
    } catch (error) {
        console.error('Error checking mobile:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 