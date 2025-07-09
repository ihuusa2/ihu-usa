import { updatePopupSettings } from '@/Server/PopupSettings';
import { PopupSettings } from '@/Types/PopupSettings';

const seedPopupData = async () => {
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

    try {
        const result = await updatePopupSettings(existingPopupData);
        console.log('Popup data seeded successfully:', result);
        return result;
    } catch (error) {
        console.error('Error seeding popup data:', error);
        throw error;
    }
};

export default seedPopupData; 