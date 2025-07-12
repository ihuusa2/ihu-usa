import { checkEmailAlreadyExists } from '@/Server/Registration'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get('email')

        if (!email) {
            return NextResponse.json(
                { error: 'Email parameter is required' },
                { status: 400 }
            )
        }

        const emailExists = await checkEmailAlreadyExists(email)
        
        return NextResponse.json({ 
            exists: emailExists,
            email: email 
        })
    } catch (error) {
        console.error('Error checking email:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 