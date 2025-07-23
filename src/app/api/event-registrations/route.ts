import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/mongo'
import { ObjectId } from 'mongodb'

interface EventRegistration {
    eventId: string
    eventTitle: string
    firstName: string
    lastName: string
    email: string
    phone: string
    organization?: string
    dietaryRestrictions?: string
    specialRequirements?: string
    howDidYouHear?: string
    additionalComments?: string
    registrationDate: Date
}

export async function POST(request: NextRequest) {
    try {
        const body: EventRegistration = await request.json()
        
        // Validate required fields
        const requiredFields = ['eventId', 'eventTitle', 'firstName', 'lastName', 'email', 'phone']
        for (const field of requiredFields) {
            if (!body[field as keyof EventRegistration]) {
                return NextResponse.json(
                    { success: false, error: `${field} is required` },
                    { status: 400 }
                )
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Validate phone format
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
        if (!phoneRegex.test(body.phone)) {
            return NextResponse.json(
                { success: false, error: 'Invalid phone number format' },
                { status: 400 }
            )
        }

        // Connect to database
        const db = client.db()
        
        // Check if user is already registered for this event
        const existingRegistration = await db.collection('eventRegistrations').findOne({
            eventId: body.eventId,
            email: body.email
        })

        if (existingRegistration) {
            return NextResponse.json(
                { success: false, error: 'You are already registered for this event' },
                { status: 409 }
            )
        }

        // Insert the registration
        const result = await db.collection('eventRegistrations').insertOne({
            ...body,
            registrationDate: new Date(),
            createdAt: new Date()
        })

        // Update the event's attendees count
        interface EventDoc { attendees: string[] }
        await db.collection<EventDoc>('events').updateOne(
            { _id: new ObjectId(body.eventId) },
            { $push: { attendees: body.email } }
        )

        return NextResponse.json({
            success: true,
            message: 'Event registration successful',
            registrationId: result.insertedId
        })

    } catch (error) {
        console.error('Event registration error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const eventId = searchParams.get('eventId')
        
        if (!eventId) {
            return NextResponse.json(
                { success: false, error: 'Event ID is required' },
                { status: 400 }
            )
        }

        const db = client.db()
        
        const registrations = await db.collection('eventRegistrations')
            .find({ eventId })
            .sort({ registrationDate: -1 })
            .toArray()

        return NextResponse.json({
            success: true,
            registrations
        })

    } catch (error) {
        console.error('Get event registrations error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
} 