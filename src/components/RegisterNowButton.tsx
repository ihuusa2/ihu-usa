'use client'

import React from 'react'
import Link from 'next/link'

interface RegisterNowButtonProps {
    courseTitle?: string
    courseType?: string
    className?: string
    children?: React.ReactNode
}

const RegisterNowButton = ({ courseTitle, courseType, className = "", children }: RegisterNowButtonProps) => {
    // If course information is provided, navigate to registration form
    if (courseTitle && courseType) {
        const registrationUrl = `/Registration-Form?course=${encodeURIComponent(courseTitle)}&courseType=${encodeURIComponent(courseType)}`
        
        return (
            <Link 
                href={registrationUrl}
                className={`px-8 py-4 bg-[var(--orange-saffron)] text-white font-bold rounded-xl shadow-lg hover:bg-[var(--amber-gold)] transition-all duration-300 text-lg animate-bounce-gentle ${className}`}
            >
                {children || "Register Now"}
            </Link>
        )
    }

    // Fallback to scroll behavior if no course info provided
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        const element = document.getElementById('register')
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <button 
            onClick={handleClick}
            className={`px-8 py-4 bg-[var(--orange-saffron)] text-white font-bold rounded-xl shadow-lg hover:bg-[var(--amber-gold)] transition-all duration-300 text-lg animate-bounce-gentle ${className}`}
        >
            {children || "Register Now"}
        </button>
    )
}

export default RegisterNowButton 