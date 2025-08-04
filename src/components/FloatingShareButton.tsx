'use client'

import React, { useState, useEffect } from 'react'
import ShareButton from './ShareButton'

interface FloatingShareButtonProps {
    url: string
    title: string
    description?: string
}

const FloatingShareButton: React.FC<FloatingShareButtonProps> = ({ url, title, description }) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight
            
            // Show button when user has scrolled down 20% of the page
            const scrollThreshold = windowHeight * 0.2
            
            if (scrollTop > scrollThreshold && scrollTop < documentHeight - windowHeight - 100) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in lg:pb-20">
            <ShareButton 
                url={url}
                title={title}
                description={description}
                className="shadow-2xl"
                isFixed={true}
            />
        </div>
    )
}

export default FloatingShareButton 