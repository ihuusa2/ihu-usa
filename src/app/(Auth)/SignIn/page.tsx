'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Spinner from '@/components/Spinner'
import { useSearchParams } from 'next/navigation'
import { signInUser } from '@/Server/User'
import { signIn } from 'next-auth/react'
import { sendOtp, verifyOtp } from '@/Server/Otp'
import { useHasMounted } from '@/hooks/useClientOnly'
import { useMobileDetection } from '@/hooks/useMobileDetection'

// Client-side only animated dots component
const AnimatedDots = () => {
  const hasMounted = useHasMounted()
  
  if (!hasMounted) {
    return (
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 11) % 100}%`,
              animationDelay: `${(i * 0.1) % 2}s`,
              animationDuration: `${2 + (i * 0.1) % 2}s`
            }}
          />
        ))}
      </div>
    )
  }
  
  return (
    <div className="absolute inset-0 opacity-20">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  )
}

const SignIn = () => {
  const searchParams = useSearchParams()
  const { isMobile, isClient } = useMobileDetection()

  const [value, setValue] = useState({ email: '', password: '' })
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState<'registrationNumber' | 'password'>('registrationNumber')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Get redirect URL with fallback for mobile
  const getRedirectUrl = () => {
    const redirectUrl = searchParams.get('redirectUrl')
    if (redirectUrl) {
      return decodeURIComponent(redirectUrl)
    }
    // Mobile-specific redirects
    if (isClient && isMobile) {
      return type === 'registrationNumber' ? '/Student-Panel' : '/admin'
    }
    return type === 'registrationNumber' ? '/Student-Panel' : '/admin'
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!value.email || !value.password) return

    setIsPending(true)
    try {
      const res = await signInUser(value)
      if ('message' in res) {
        setMessage(res.message)
      } else {
        setMessage('')
        const redirectUrl = getRedirectUrl()
        console.log('Admin sign in - redirect URL:', redirectUrl)
        
        const result = await signIn('credentials', {
          id: res._id?.toString(),
          redirect: true,
          callbackUrl: redirectUrl,
        })
        
        if (result?.error) {
          console.error('Sign in error:', result.error)
          setMessage(result.error)
        }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setMessage('An error occurred during sign in. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  const verifyOtpAndSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!registrationNumber || !otp) return

    setIsPending(true)
    try {
      const isVerifyOtp = await verifyOtp(registrationNumber, otp)
      if (!isVerifyOtp.isVerified) {
        setMessage(isVerifyOtp.message)
        setIsPending(false)
        return
      }

      // For student login, redirect to student panel or home
      const redirectUrl = getRedirectUrl()
      console.log('Student sign in - redirect URL:', redirectUrl)
      
      const result = await signIn('credentials', {
        id: registrationNumber,
        redirect: true,
        callbackUrl: redirectUrl,
      })
      
      if (result?.error) {
        console.error('OTP sign in error:', result.error)
        setMessage(result.error)
      } else {
        setMessage('')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      setMessage('An error occurred during verification. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  const handleOtpSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!registrationNumber) return

    setIsPending(true)
    try {
      const res = await sendOtp(registrationNumber)
      setIsOtpSent(true)
      setMessage(res.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Decorative Background Section - Hidden on mobile, visible on tablet and desktop */}
      <div className="hidden md:flex md:w-1/2 lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
        <AnimatedDots />
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-blue-800 z-10 px-4 md:px-8">
            <div className="mb-6">
              <svg className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
              Welcome to IHUSA
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl drop-shadow-md max-w-md leading-relaxed">
              Sign in to access your account and explore our educational programs
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign-in Form Section - Mobile Optimized */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <Link href="/" className="inline-block mb-4 sm:mb-6">
              <Image
                src="/Images/logo.png"
                alt="IHUSA Logo"
                title="IHUSA Logo"
                width={700}
                height={700}
                className="w-64 sm:w-72 mx-auto my-4 sm:my-6 px-2 sm:px-4 py-1 sm:py-2"
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-sm sm:text-base text-gray-600">Sign in to your account to continue</p>
          </div>

          {/* Login Type Selector - Mobile Optimized */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-1 shadow-sm border border-gray-200">
            <div className="flex">
              <button
                type="button"
                className={`flex-1 px-3 sm:px-4 py-3 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300 min-h-[48px] ${
                  type === 'registrationNumber'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setType('registrationNumber')
                  setMessage('')
                  setIsOtpSent(false)
                }}
                disabled={isPending}
              >
                Student Login
              </button>
              <button
                type="button"
                className={`flex-1 px-3 sm:px-4 py-3 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300 min-h-[48px] ${
                  type === 'password'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setType('password')
                  setMessage('')
                }}
                disabled={isPending}
              >
                Admin Login
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
              message.includes('success') || message.includes('sent') 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <p className="text-xs sm:text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Admin Sign-In Form */}
          {type === 'password' && (
            <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      autoComplete="email"
                      disabled={isPending}
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={value.email}
                      onChange={(e) => setValue({ ...value, email: e.target.value })}
                      className="w-full px-3 sm:px-4 py-3 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 text-base h-12"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      autoComplete="current-password"
                      disabled={isPending}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      value={value.password}
                      onChange={(e) => setValue({ ...value, password: e.target.value })}
                      className="w-full px-3 sm:px-4 py-3 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg sm:rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 text-base h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isPending}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 text-white py-3 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base h-12"
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <Spinner />
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Student OTP Forms */}
          {type === 'registrationNumber' && (
            <div className="space-y-4 sm:space-y-6">
              {isOtpSent ? (
                <form onSubmit={verifyOtpAndSignIn} className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="otp" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      OTP Code
                    </label>
                    <input
                      id="otp"
                      autoComplete="one-time-code"
                      disabled={isPending}
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="w-full px-3 sm:px-4 py-3 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 text-center text-lg font-mono tracking-widest h-12"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Enter the 6-digit code sent to your registered mobile number
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-blue-600 text-white py-3 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base h-12"
                  >
                    {isPending ? (
                      <div className="flex items-center justify-center">
                        <Spinner />
                        <span className="ml-2">Verifying...</span>
                      </div>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpSent(false)
                      setMessage('')
                    }}
                    className="w-full text-gray-600 hover:text-gray-800 text-xs sm:text-sm font-medium transition-colors duration-200"
                    disabled={isPending}
                  >
                    ← Back to registration number
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSend} className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="registrationNumber" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      Registration Number
                    </label>
                    <input
                      id="registrationNumber"
                      disabled={isPending}
                      type="text"
                      placeholder="Enter your registration number"
                      name="registrationNumber"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      className="w-full px-3 sm:px-4 py-3 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 text-base h-12"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      We&apos;ll send an OTP to your registered mobile number
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-blue-600 text-white py-3 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base h-12"
                  >
                    {isPending ? (
                      <div className="flex items-center justify-center">
                        <Spinner />
                        <span className="ml-2">Sending OTP...</span>
                      </div>
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Footer Links */}
          <div className="text-center space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">
              Don&rsquo;t have an account?{' '}
              <Link href={isMobile ? "/Mobile-Signup" : "/Registration-Form"} className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                Register here
              </Link>
            </p>
            <Link href="/" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
              &#8592; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
