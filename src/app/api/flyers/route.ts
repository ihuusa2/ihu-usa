import { NextResponse } from 'next/server'
import { getActiveFlyers } from '@/Server/Flyers'

export async function GET() {
  try {
    const flyers = await getActiveFlyers()
    return NextResponse.json({ success: true, data: flyers })
  } catch (error) {
    console.error('Error fetching flyers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flyers' },
      { status: 500 }
    )
  }
} 