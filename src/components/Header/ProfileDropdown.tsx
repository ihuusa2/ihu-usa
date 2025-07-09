'use client'

import React, { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { 
    FaUser, 
    FaCog, 
    FaSignOutAlt, 
    FaChevronDown, 
    FaUserCircle,
    FaGraduationCap,
    FaPhone,
    FaMapMarkerAlt,
    FaIdCard
} from 'react-icons/fa'
import { UserRole } from '@/Types/User'

interface User {
    _id?: string;
    email: string;
    name: string;
    contact: string;
    address: string;
    role: UserRole;
    image: File | string;
    registrationNumber: string;
}

interface ProfileDropdownProps {
    user: User;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isSigningOut, setIsSigningOut] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    // const pathname = usePathname() // removed unused

    const handleSignOut = async () => {
        setIsSigningOut(true)
        try {
            await signOut({
                redirect: true,
                callbackUrl: '/'
            })
        } catch (error) {
            console.error('Sign out error:', error)
            window.location.href = '/'
        } finally {
            setIsSigningOut(false)
        }
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Close dropdown on escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    const isAdmin = user.role === UserRole.Admin

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white text-black font-medium rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base shadow-none cursor-pointer hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span>Profile</span>
                <FaChevronDown 
                    className={`w-3 h-3 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                    {/* User Info Section */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-orange-200">
                                {typeof user.image === 'string' && user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="w-full h-full text-gray-400 p-2" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        isAdmin 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {isAdmin ? 'Admin' : 'User'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Details Section */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <FaPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-700">{user.contact}</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <FaMapMarkerAlt className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 line-clamp-2">{user.address}</span>
                            </div>
                            {user.registrationNumber && (
                                <div className="flex items-center gap-3 text-sm">
                                    <FaIdCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-700">{user.registrationNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="p-2">
                        <Link
                            href="/Profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <FaUser className="w-4 h-4 text-gray-400" />
                            <span>My Profile</span>
                        </Link>

                        <Link
                            href="/Student-Panel"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <FaGraduationCap className="w-4 h-4 text-gray-400" />
                            <span>Student Panel</span>
                        </Link>

                        {isAdmin && (
                            <Link
                                href="/Admin"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200"
                            >
                                <FaCog className="w-4 h-4 text-red-500" />
                                <span>Admin Panel</span>
                            </Link>
                        )}
                    </div>

                    {/* Sign Out Button */}
                    <div className="p-2 border-t border-gray-100">
                        <button
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaSignOutAlt className="w-4 h-4" />
                            <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileDropdown 
