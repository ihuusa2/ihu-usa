'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FaHome, 
  FaUsers, 
  FaChalkboardTeacher, 
  FaBookOpen, 
  FaCalendarAlt, 
  FaEnvelope, 
  FaCog, 
  FaBlog,
  FaImages,
  FaClipboardList,
  FaDonate,
  FaSignOutAlt,
  FaUserGraduate,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight as FaExpand,
  FaInfoCircle
} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useHasMounted } from '@/hooks/useClientOnly'

const AdminSidebar = () => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const hasMounted = useHasMounted()

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) {
        setIsMobileOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Don't render mobile-specific elements until mounted to prevent hydration mismatch
  if (!hasMounted) {
    return (
      <div className="relative inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-2xl flex flex-col h-screen max-h-screen">
        {/* Header */}
        <div className="relative flex items-center justify-center p-4 sm:p-6 border-b border-gray-200 min-h-[80px] sm:min-h-[90px] bg-white">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaCog className="text-white text-lg sm:text-xl" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800 text-lg sm:text-xl">Admin Panel</h1>
                <p className="text-xs sm:text-sm text-gray-500">IHU USA</p>
              </div>
            </div>
          </div>
        </div>
        {/* Rest of sidebar content */}
      </div>
    )
  }

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: FaHome,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-50',
      exact: true
    },
    {
      title: 'Applications',
      href: '/admin/Registrations',
      icon: FaClipboardList,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-50'
    },
    {
      title: 'Course Selections',
      href: '/admin/Course-Selections',
      icon: FaUserGraduate,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      hoverColor: 'hover:bg-indigo-50'
    },
    {
      title: 'Users',
      href: '/admin/Users',
      icon: FaUsers,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-50'
    },
    {
      title: 'Team',
      href: '/admin/Team',
      icon: FaChalkboardTeacher,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-50'
    },
    {
      title: 'Courses',
      href: '/admin/Courses',
      icon: FaBookOpen,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      hoverColor: 'hover:bg-red-50'
    },
    {
      title: 'Course Types',
      href: '/admin/Courses/CourseType',
      icon: FaBookOpen,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      hoverColor: 'hover:bg-red-50'
    },
    {
      title: 'Events',
      href: '/admin/Events',
      icon: FaCalendarAlt,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      hoverColor: 'hover:bg-pink-50'
    },
    {
      title: 'Photo Gallery',
      href: '/admin/Photo-Gallery',
      icon: FaImages,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      hoverColor: 'hover:bg-cyan-50'
    },
    {
      title: 'Video Gallery',
      href: '/admin/Video-Gallery',
      icon: FaImages,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      hoverColor: 'hover:bg-teal-50'
    },
    {
      title: 'Webinars',
      href: '/admin/Webinars',
      icon: FaCalendarAlt,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200',
      hoverColor: 'hover:bg-violet-50'
    },
    {
      title: 'FAQ',
      href: '/admin/FAQ',
      icon: FaEnvelope,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      hoverColor: 'hover:bg-amber-50'
    },
    {
      title: 'Blogs',
      href: '/admin/Blogs',
      icon: FaBlog,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      hoverColor: 'hover:bg-rose-50'
    },
    {
      title: 'Contact',
      href: '/admin/Contact',
      icon: FaEnvelope,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      hoverColor: 'hover:bg-emerald-50'
    },
    {
      title: 'Donations',
      href: '/admin/Donations',
      icon: FaDonate,
      color: 'text-lime-600',
      bgColor: 'bg-lime-50',
      borderColor: 'border-lime-200',
      hoverColor: 'hover:bg-lime-50'
    },
    {
      title: 'Volunteer',
      href: '/admin/Volunteer',
      icon: FaUsers,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      hoverColor: 'hover:bg-sky-50'
    },
    {
      title: 'Popup Settings',
      href: '/admin/Popup-Settings',
      icon: FaInfoCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-50'
    },
    {
      title: 'Settings',
      href: '/admin/Settings',
      icon: FaCog,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      hoverColor: 'hover:bg-gray-50'
    }
  ]

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 p-3 bg-white shadow-xl rounded-2xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
          aria-label="Toggle sidebar"
        >
          {isMobileOpen ? (
            <FaTimes className="w-5 h-5 text-gray-700" />
          ) : (
            <FaBars className="w-5 h-5 text-gray-700" />
          )}
        </button>
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} inset-y-0 left-0 z-50
        ${isCollapsed && !isMobile ? 'w-20' : 'w-64'} 
        ${isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-2xl
        transition-all duration-300 ease-in-out
        flex flex-col h-screen max-h-screen
        ${isMobile ? 'w-80' : ''}
      `}>
        {/* Header */}
        <div className="relative flex items-center p-4 sm:p-6 border-b border-gray-200 min-h-[80px] sm:min-h-[90px] bg-white">
          {isCollapsed && !isMobile ? (
            // Collapsed header - centered icon only
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto flex-shrink-0">
              <FaCog className="text-white text-xl flex-shrink-0" />
            </div>
          ) : (
            // Expanded header - full content
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaCog className="text-white text-lg sm:text-xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="font-bold text-gray-800 text-lg sm:text-xl truncate">Admin Panel</h1>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">IHU USA</p>
                </div>
              </div>
              
              {!isMobile && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 flex-shrink-0 ml-2"
                  aria-label="Toggle sidebar collapse"
                >
                  <FaChevronLeft className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          )}
          
          {/* Expand button for collapsed state */}
          {isCollapsed && !isMobile && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-110"
              aria-label="Expand sidebar"
            >
              <FaExpand className="w-3 h-3 text-gray-600" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {navigationItems.map((item) => {
            const active = isActive(item.href, item.exact)
            const Icon = item.icon

            return (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={`
                    relative flex items-center gap-3 rounded-2xl
                    transition-all duration-300 ease-in-out group
                    ${isCollapsed && !isMobile 
                      ? 'justify-center px-2 py-3' 
                      : 'justify-start px-3 py-3'
                    }
                    ${active 
                      ? `${item.bgColor} ${item.color} shadow-md border ${item.borderColor} transform scale-[1.02]` 
                      : `text-gray-600 hover:text-gray-800 ${item.hoverColor} hover:shadow-md hover:transform hover:scale-[1.02]`
                    }
                    ${isMobile ? 'min-h-[56px]' : 'min-h-[52px]'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    transform transition-all duration-300
                  `}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {/* Icon container */}
                  <div className={`
                    flex items-center justify-center rounded-xl transition-all duration-300 flex-shrink-0
                    ${isCollapsed && !isMobile ? 'w-10 h-10' : 'w-9 h-9'}
                    ${active 
                      ? `${item.bgColor} shadow-md` 
                      : 'bg-transparent group-hover:bg-white/60 group-hover:scale-110'
                    }
                  `}>
                    <Icon className={`
                      ${isCollapsed && !isMobile ? 'w-5 h-5' : 'w-4 h-4'} 
                      ${active ? item.color : 'text-gray-500 group-hover:text-gray-700'}
                      transition-all duration-300
                    `} />
                  </div>
                  
                  {/* Text and arrow - hidden when collapsed */}
                  {(!isCollapsed || isMobile) && (
                    <>
                      <span className="font-medium flex-1 text-sm">{item.title}</span>
                      {active && <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />}
                    </>
                  )}
                </Link>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 
                                bg-gray-900 text-white text-sm rounded-xl px-3 py-2
                                opacity-0 group-hover:opacity-100 transition-all duration-300
                                pointer-events-none whitespace-nowrap z-50 shadow-2xl
                                before:absolute before:right-full before:top-1/2 before:transform before:-translate-y-1/2
                                before:border-4 before:border-transparent before:border-r-gray-900
                                transform scale-95 group-hover:scale-100">
                    {item.title}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
          <div className="relative group">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-2xl
                text-red-600 hover:bg-red-50 hover:text-red-700 active:bg-red-100
                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                ${isCollapsed && !isMobile ? 'justify-center' : 'justify-start'}
                ${isMobile ? 'min-h-[52px]' : ''}
                transform hover:scale-[1.02] hover:shadow-md
              `}
            >
              <div className={`
                flex items-center justify-center rounded-xl transition-all duration-300 flex-shrink-0
                ${isCollapsed && !isMobile ? 'w-10 h-10' : 'w-9 h-9'}
                bg-transparent group-hover:bg-red-100 group-hover:scale-110
              `}>
                <FaSignOutAlt className={`
                  ${isCollapsed && !isMobile ? 'w-5 h-5' : 'w-4 h-4'}
                  transition-all duration-300
                `} />
              </div>
              {(!isCollapsed || isMobile) && <span className="font-medium text-sm">Sign Out</span>}
            </button>
            
            {/* Tooltip for collapsed sign out */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 
                            bg-gray-900 text-white text-sm rounded-xl px-3 py-2
                            opacity-0 group-hover:opacity-100 transition-all duration-300
                            pointer-events-none whitespace-nowrap z-50 shadow-2xl
                            before:absolute before:right-full before:top-1/2 before:transform before:-translate-y-1/2
                            before:border-4 before:border-transparent before:border-r-gray-900
                            transform scale-95 group-hover:scale-100">
                Sign Out
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar 