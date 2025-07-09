import { H1 } from '@/components/Headings'
import { countCourses } from '@/Server/Course'
import { countCourseRegForm } from '@/Server/CourseRegForm'
import { totalDonationAmount } from '@/Server/Donate'
import { countEvents } from '@/Server/Events'
import { countUsers } from '@/Server/User'
import { UserRole } from '@/Types/User'
import Link from 'next/link'
import React from 'react'
import { 
  FaUserGraduate, 
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
  FaArrowRight,
  FaChartLine
} from 'react-icons/fa'

const Admin = async () => {
  let totalCourseReg = 0;
  let totalStaffs = 0;
  let totalUsers = 0;
  let totalCourses = 0;
  let totalEvents = 0;
  let totalDonationAmounts = 0;

  try {
    console.log('Fetching course registrations...');
    totalCourseReg = await countCourseRegForm();
    console.log('Course registrations:', totalCourseReg);

    console.log('Fetching staff count...');
    totalStaffs = await countUsers({ role: UserRole.Staff });
    console.log('Staff count:', totalStaffs);

    console.log('Fetching user count...');
    totalUsers = await countUsers({ role: UserRole.User });
    console.log('User count:', totalUsers);

    console.log('Fetching course count...');
    totalCourses = await countCourses();
    console.log('Course count:', totalCourses);

    console.log('Fetching event count...');
    totalEvents = await countEvents();
    console.log('Event count:', totalEvents);

    console.log('Fetching donation amount...');
    totalDonationAmounts = await totalDonationAmount();
    console.log('Donation amount:', totalDonationAmounts);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }

  const managementCards = [
    {
      title: 'Application Management',
      description: 'Manage admissions and applications',
      link: '/admin/Registrations',
      icon: FaClipboardList,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Media Management',
      description: 'Manage photos, videos and gallery',
      link: '/admin/Photo-Gallery',
      icon: FaImages,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      title: 'User Management',
      description: 'Manage users and their roles',
      link: '/admin/Users',
      icon: FaUsers,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      title: 'Team Management',
      description: 'Manage teams and members',
      link: '/admin/Team',
      icon: FaChalkboardTeacher,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Courses Management',
      description: 'Manage courses and curriculum',
      link: '/admin/Courses',
      icon: FaBookOpen,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      title: 'Contact Management',
      description: 'Manage contacts and inquiries',
      link: '/admin/Contact',
      icon: FaEnvelope,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      borderColor: 'border-teal-200'
    },
    {
      title: 'Site Settings',
      description: 'Configure application settings',
      link: '/admin/Settings',
      icon: FaCog,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
      borderColor: 'border-gray-200'
    },
    {
      title: 'Blogs Management',
      description: 'Manage blogs and articles',
      link: '/admin/Blogs',
      icon: FaBlog,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200'
    },
  ]

  const statsCards = [
    {
      title: 'Course Registrations',
      value: totalCourseReg,
      icon: FaUserGraduate,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      link: '/admin/Registrations',
      growth: '+12%'
    },
    {
      title: 'Staff Members',
      value: totalStaffs,
      icon: FaChalkboardTeacher,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      link: `/admin/Users?role=${UserRole.Staff}`,
      growth: '+5%'
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: FaUsers,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      link: '/admin/Users',
      growth: '+18%'
    },
    {
      title: 'Active Courses',
      value: totalCourses,
      icon: FaBookOpen,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      link: '/admin/Courses',
      growth: '+8%'
    },
    {
      title: 'Upcoming Events',
      value: totalEvents,
      icon: FaCalendarAlt,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      link: '/admin/Events',
      growth: '+25%'
    },
    {
      title: 'Total Donations',
      value: `₹${totalDonationAmounts}`,
      icon: FaDonate,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      link: '/admin/Donations',
      growth: '+15%'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaCog className="text-white text-xl sm:text-2xl" />
            </div>
            <div className="flex-1">
              <H1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent font-bold">
                Admin Dashboard
              </H1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                Welcome back! Manage your platform with ease and efficiency
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview Section */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-white text-sm sm:text-lg" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
              Overview & Analytics
            </h2>
          </div>
          
          {/* Responsive stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
            {statsCards.map((stat, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
                  
                  {/* Card content */}
                  <div className="relative z-10 p-4 sm:p-6">
                    {/* Header with icon and growth */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 sm:p-4 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`${stat.iconColor} text-lg sm:text-xl`} />
                      </div>
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {stat.growth}
                      </span>
                    </div>
                    
                    {/* Stats value and title */}
                    <div className="mb-4">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 break-words">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600 leading-tight">{stat.title}</p>
                    </div>
                    
                    {/* View details button */}
                    <Link href={stat.link} className="block">
                      <button className="w-full text-left text-xs sm:text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center justify-between group-hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <span>View Details</span>
                        <FaArrowRight className="h-3 w-3 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Management Tools Section */}
        <div>
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FaCog className="text-white text-sm sm:text-lg" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
              Management Tools
            </h2>
          </div>
          
          {/* Responsive management cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {managementCards.map((card, index) => (
              <Link href={card.link} key={index} className="block group">
                <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5`}></div>
                  
                  {/* Card content */}
                  <div className="relative z-10 p-6">
                    {/* Icon */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-4 ${card.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className={`${card.iconColor} text-2xl sm:text-3xl`} />
                      </div>
                    </div>
                    
                    {/* Title and description */}
                    <div className="mb-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors leading-tight mb-2">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                      </div>
                    </div>
                    
                    {/* Access button */}
                    <div className="flex items-center justify-between text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                      <span>Access Panel</span>
                      <FaArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin