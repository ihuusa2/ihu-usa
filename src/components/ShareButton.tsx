'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Share2, Copy, Check, Facebook, Twitter, Linkedin, Mail } from 'lucide-react'

interface ShareButtonProps {
    url: string
    title: string
    description?: string
    className?: string
    isFixed?: boolean
}

const ShareButton: React.FC<ShareButtonProps> = ({ url, title, description, className = '', isFixed = false }) => {
    const [showDropdown, setShowDropdown] = useState(false)
    const [copied, setCopied] = useState(false)
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
    const buttonRef = useRef<HTMLDivElement>(null)

    const shareData = {
        title: title,
        text: description || title,
        url: url
    }

    useEffect(() => {
        if (showDropdown && isFixed && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight
            const dropdownHeight = 400 // Approximate dropdown height
            
            // Calculate if dropdown should appear above or below the button
            const spaceBelow = windowHeight - rect.bottom
            const spaceAbove = rect.top
            
            let top = rect.bottom + 8 // Default: below the button
            const right = window.innerWidth - rect.right
            
            // If not enough space below, position above
            if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                top = rect.top - dropdownHeight - 8
            } else {
                // Move the popup up by reducing the gap from 8px to 2px
                top = rect.bottom + 2
            }
            
            setDropdownPosition({ top, right })
        }
    }, [showDropdown, isFixed])

    const handleShare = async (platform: string) => {
        const encodedUrl = encodeURIComponent(url)
        const encodedTitle = encodeURIComponent(title)
        const encodedDescription = encodeURIComponent(description || title)

        let shareUrl = ''

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
                break
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
                break
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
                break
            case 'email':
                shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
                break
            case 'native':
                if (navigator.share) {
                    try {
                        await navigator.share(shareData)
                        return
                    } catch (error) {
                        console.log('Error sharing:', error)
                    }
                }
                // Fallback to copy
                handleCopy()
                return
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400')
        }
        setShowDropdown(false)
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.log('Error copying:', error)
        }
        setShowDropdown(false)
    }

    return (
        <div className={`relative ${className}`} ref={buttonRef}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
                <Share2 className="w-5 h-5" />
                Share Article
            </button>

            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40 " 
                        onClick={() => setShowDropdown(false)}
                    />
                    
                    {/* Dropdown */}
                    <div 
                        className={`${isFixed ? 'fixed' : 'absolute'} bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 min-w-[280px] overflow-hidden ${isFixed ? '' : 'top-full mt-2 right-0'}`}
                        style={isFixed ? {
                            top: dropdownPosition.top,
                            right: dropdownPosition.right
                        } : {}}
                    >
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Share this article</h3>
                            
                            <div className="space-y-2">
                                {/* Native Share */}
                                {typeof navigator.share === 'function' && (
                                    <button
                                        onClick={() => handleShare('native')}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                            <Share2 className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Share</div>
                                            <div className="text-sm text-gray-500">Use native sharing</div>
                                        </div>
                                    </button>
                                )}

                                {/* Facebook */}
                                <button
                                    onClick={() => handleShare('facebook')}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Facebook className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Facebook</div>
                                        <div className="text-sm text-gray-500">Share on Facebook</div>
                                    </div>
                                </button>

                                {/* Twitter */}
                                <button
                                    onClick={() => handleShare('twitter')}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                                        <Twitter className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Twitter</div>
                                        <div className="text-sm text-gray-500">Share on Twitter</div>
                                    </div>
                                </button>

                                {/* LinkedIn */}
                                <button
                                    onClick={() => handleShare('linkedin')}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                                        <Linkedin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">LinkedIn</div>
                                        <div className="text-sm text-gray-500">Share on LinkedIn</div>
                                    </div>
                                </button>

                                {/* Email */}
                                <button
                                    onClick={() => handleShare('email')}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Email</div>
                                        <div className="text-sm text-gray-500">Share via email</div>
                                    </div>
                                </button>

                                {/* Copy Link */}
                                <button
                                    onClick={handleCopy}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                        {copied ? (
                                            <Check className="w-5 h-5 text-white" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {copied ? 'Copied!' : 'Copy Link'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {copied ? 'Link copied to clipboard' : 'Copy article URL'}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ShareButton 