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
  
  // If pathname is undefined/null (like in not-found pages) or starts with /admin, don't show header/footer
  if (!pathname || pathname.toLowerCase().startsWith('/admin')) {
    return children
  }
  
  // For non-admin routes, render header and footer
  return (
    <>
      <Header />
      <div className="pt-30">
        {children}
      </div>
      <Footer />
    </>
  )
}

export default ConditionalLayout 