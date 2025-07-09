'use client'
import { signOut } from 'next-auth/react'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'

const SignOutButton = () => {
  const pathname = usePathname()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      console.log('Signing out from:', pathname)
      await signOut({
        redirect: true,
        callbackUrl: '/'
      })
    } catch (error) {
      console.error('Sign out error:', error)
      // Fallback redirect
      window.location.href = '/'
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <button 
        className="bg-white text-black font-medium rounded-md px-3 sm:px-5 py-2 text-sm sm:text-base shadow-none cursor-pointer hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={handleSignOut}
        disabled={isSigningOut}
    >
        {isSigningOut ? 'Signing Out...' : 'SignOut'}
    </button>
  )
}

export default SignOutButton