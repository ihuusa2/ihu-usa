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
        const db = client.db('test')
        
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
            registrationDate: body.registrationDate ? new Date(body.registrationDate) : new Date(),
            createdAt: new Date()
        })

        // Update the event's attendees count (events are in ihuusa database)
        interface EventDoc { attendees: string[] }
        const ihuusaDb = client.db('ihuusa')
        await ihuusaDb.collection<EventDoc>('Events').updateOne(
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
        
        const db = client.db('test')
        
        let query = {}
        if (eventId) {
            query = { eventId }
        }
        
        const registrations = await db.collection('eventRegistrations')
            .find(query)
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