import { NextResponse } from 'next/server';
import { updatePopupSettings } from '@/Server/PopupSettings';
import { PopupSettings } from '@/Types/PopupSettings';

export async function POST() {
    try {
        const existingPopupData: PopupSettings = {
            isActive: true,
            title: 'Upcoming Course',
            courseName: 'Natural Health Science',
            startDate: '7th July 2025',
            description: 'Join our upcoming Natural Health Science course in collaboration with IMANAH, USA, under the guidance of Dr. Arun Sharma, ND. Learn the principles and practices of Natural Health Science to become self-reliant in maintaining your health and managing chronic illnesses through natural lifestyle approaches.',
            buttonText: 'Learn More & Enroll Now',
            courseLink: '/Course/natural-health-science',
            organization: 'IMANAH, USA',
            instructor: 'Dr. Arun Sharma, ND'
        };

        const result = await updatePopupSettings(existingPopupData);
        
        return NextResponse.json({ 
            success: true, 
            message: 'Popup data seeded successfully',
            data: result 
        });
    } catch (error) {
        console.error('Error seeding popup data:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Error seeding popup data',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 