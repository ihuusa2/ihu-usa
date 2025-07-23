import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/mongo'
import { ObjectId } from 'mongodb'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Registration ID is required' },
                { status: 400 }
            )
        }

        // Get the registration to find the event ID and email
        const registration = await db.collection('eventRegistrations').findOne({ _id: new ObjectId(id) })

        if (!registration) {
            return NextResponse.json(
                { success: false, error: 'Registration not found' },
                { status: 404 }
            )
        }

        // Delete the registration
        await db.collection('eventRegistrations').deleteOne({ _id: new ObjectId(id) })

        // Remove the email from the event's attendees array
        await db.collection('events').updateOne(
            { _id: registration.eventId },
            { $pull: { attendees: registration.email } }
        )

        return NextResponse.json({
            success: true,
            message: 'Registration deleted successfully'
        })

    } catch (error) {
        console.error('Delete event registration error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
} 