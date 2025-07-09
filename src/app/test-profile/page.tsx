'use client'

import React from 'react'
import ProfileDropdown from '@/components/Header/ProfileDropdown'
import { UserRole } from '@/Types/User'

const TestProfilePage = () => {
    // Mock user data for testing
    const mockUser = {
        _id: '1',
        email: 'test@example.com',
        name: 'Test User',
        contact: '+1234567890',
        address: '123 Test Street, Test City, Test State 12345',
        role: UserRole.Admin,
        image: '',
        registrationNumber: 'REG123456'
    }

    const mockRegularUser = {
        _id: '2',
        email: 'user@example.com',
        name: 'Regular User',
        contact: '+0987654321',
        address: '456 User Avenue, User City, User State 54321',
        role: UserRole.User,
        image: '',
        registrationNumber: 'REG654321'
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Profile Dropdown Test</h1>
                
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-xl font-semibold mb-6">Admin User Profile Dropdown</h2>
                    <div className="flex justify-center mb-8">
                        <ProfileDropdown user={mockUser} />
                    </div>

                    <h2 className="text-xl font-semibold mb-6">Regular User Profile Dropdown</h2>
                    <div className="flex justify-center">
                        <ProfileDropdown user={mockRegularUser} />
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Click on the profile buttons above to open the dropdowns</li>
                        <li>Verify that admin users see the &quot;Admin Panel&quot; option</li>
                        <li>Verify that regular users don&apos;t see the &quot;Admin Panel&quot; option</li>
                        <li>Check that user information is displayed correctly</li>
                        <li>Test the navigation links (Profile, Student Panel)</li>
                        <li>Test the sign out functionality</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default TestProfilePage 