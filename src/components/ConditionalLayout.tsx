'use client'

import { usePathname } from 'next/navigation'
import React from 'react'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'
import { useHeaderHeight } from '@/hooks/useHeaderHeight'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  
  // Use the header height hook for non-admin routes
  const headerHeight = useHeaderHeight()
  
  // If pathname is undefined/null (like in not-found pages) or starts with /admin, don't show header/footer
  if (!pathname || pathname.toLowerCase().startsWith('/admin')) {
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