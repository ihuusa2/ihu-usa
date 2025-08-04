import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // Using a free exchange rate API (you can replace with any reliable source)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rate')
        }
        
        const data = await response.json()
        const inrRate = data.rates.INR
        
        return NextResponse.json({
            success: true,
            rate: inrRate,
            timestamp: new Date().toISOString(),
            source: 'exchangerate-api.com'
        })
    } catch (error) {
        console.error('Error fetching exchange rate:', error)
        
        // Fallback to a more accurate static rate if API fails
        const fallbackRate = 83.5 // More accurate than the current 83
        
        return NextResponse.json({
            success: false,
            rate: fallbackRate,
            timestamp: new Date().toISOString(),
            source: 'fallback',
            error: 'Using fallback rate due to API error'
        })
    }
} 