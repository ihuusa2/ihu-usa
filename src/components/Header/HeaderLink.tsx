'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa'

type Props = {
    href: string;
    className?: React.AnchorHTMLAttributes<HTMLAnchorElement>['className'];
    children?: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

const HeaderLink = ({ href, className, children, ...otherProps }: Props) => {
    const pathname = usePathname()
    const isActive = pathname === href;
    
    return (
        <Link
            href={href}
            className={`
                block px-4 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 relative group
                ${isActive 
                    ? "font-medium text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 shadow-sm" 
                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-50 hover:shadow-sm"
                }
                text-nowrap
                ${className || ''}
            `}
            {...otherProps}
        >
            {children}
            {/* Active state indicator */}
            {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-orange-500 rounded-full"></div>
            )}
            {/* Hover effect underline */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-orange-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left w-full"></div>
        </Link>
    )
}

type UpperHeaderProps = {
    session: Session
}

export const UpperHeader = ({ session }: UpperHeaderProps) => {
    const pathname = usePathname()
    
    if (session?.user?.id) {
        return (
            <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <FaUser size={10} className="text-orange-400" />
                    </div>
                    <span>Welcome, {session.user.name?.split(' ')[0]}</span>
                </div>
                <button
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/40 transition-all duration-200 h-8 px-3 text-sm rounded-lg font-medium flex items-center gap-1.5 hover:shadow-md"
                    onClick={async () => {
                        try {
                            console.log('HeaderLink sign out from:', pathname)
                            await signOut({
                                redirect: true,
                                callbackUrl: '/'
                            })
                        } catch (error) {
                            console.error('Sign out error:', error)
                            window.location.href = '/'
                        }
                    }}
                >
                    <FaSignOutAlt size={12} />
                    <span className="hidden sm:inline">Sign Out</span>
                </button>
            </div>
        )
    }
    
    return (
        <Link href={`/SignIn?redirectUrl=${encodeURIComponent(pathname)}`}>
            <button 
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/40 transition-all duration-200 h-8 px-3 text-sm rounded-lg font-medium flex items-center gap-1.5 hover:shadow-md"
            >
                <FaSignInAlt size={12} />
                <span className="hidden sm:inline">Sign In</span>
            </button>
        </Link>
    )
}

export default HeaderLink