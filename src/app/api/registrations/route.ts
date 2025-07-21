import { NextRequest, NextResponse } from 'next/server'
import { createRegisterForm } from '@/Server/Registration'

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        const result = await createRegisterForm(data)
        if (!result || !result.insertedId) {
            return NextResponse.json({ error: 'Registration failed or already exists.' }, { status: 400 })
        }
        return NextResponse.json({ success: true, insertedId: result.insertedId })
    } catch (error) {
        return NextResponse.json({ error: 'Server error', details: (error as Error).message }, { status: 500 })
    }
} 