'use client'

import React from 'react'

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

const AdminLayoutWrapper: React.FC<AdminLayoutWrapperProps> = ({ children }) => {
  // This wrapper ensures that admin content is rendered without header/footer
  // It works in conjunction with ConditionalLayout
  return <>{children}</>
}

export default AdminLayoutWrapper 