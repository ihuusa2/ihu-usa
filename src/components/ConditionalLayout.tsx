'use client'

import { usePathname } from 'next/navigation'
import React from 'react'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  
  // Simple check for admin routes
  if (pathname?.startsWith('/admin')) {
    return children
  }
  
  // For non-admin routes, render header and footer
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default ConditionalLayout 