'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SignInButton = () => {
    const pathname = usePathname()
    
    return (
        <Link href={`/SignIn?redirectUrl=${encodeURIComponent(pathname)}`}>
            <button className="bg-white text-black font-medium rounded-md px-3 sm:px-5 py-2 text-sm sm:text-base shadow-none">SignIn</button>
        </Link>
    )
}

export default SignInButton 