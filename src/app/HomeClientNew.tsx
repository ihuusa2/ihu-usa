'use client'

import About from '@/components/About';
import Programs from '@/components/Programs';
import FlyersSection from '@/components/Flyers';
import HeroCarousel from '@/components/HeroCarousel';
import { Blog } from '@/Types/Blogs';
import { CarouselImage } from '@/Types/Carousel';
import React from 'react'
import { CiCircleCheck } from 'react-icons/ci';
import { FaBook, FaHandsHelping, FaUser, FaGraduationCap, FaUsers, FaLightbulb, FaHeart, FaPlay, FaArrowRight, FaStar, FaAward, FaClock, FaShieldAlt } from "react-icons/fa";
import { MdSchool, MdSupportAgent } from "react-icons/md";
import { BsFillLightningFill, BsGlobe2, BsArrowUpRight } from "react-icons/bs";
import { GiLotus } from "react-icons/gi";
import { IoIosArrowForward } from "react-icons/io";
import Link from 'next/link'
import UpcomingCoursePopup from './UpcomingCoursePopup';
import Image from 'next/image';

type Props = {
  blogs: { list: Blog[], count: number }
  carouselImages: CarouselImage[]
}

const HomeClientNew = ({ blogs, carouselImages }: Props) => {
  // Transform carousel data to match HeroCarousel interface
  const transformedCarouselImages = carouselImages.map(image => ({
    src: image.src,
    alt: image.alt,
    title: image.title,
    description: image.description
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/30">
      <UpcomingCoursePopup />
      
      {/* Hero Carousel */}
      <HeroCarousel images={transformedCarouselImages} />
      
      {/* Flyers Section */}
      <FlyersSection />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* About Section */}
      <About />
      
      {/* Statistics */}
      <Statistics />
      
      {/* Features */}
      <Features />
      
      {/* Programs */}
      <Programs />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Virtual Tour */}
      <VirtualTour />
      
      {/* Latest Blogs */}
      {blogs?.list?.length > 0 && <LatestBlogs blogs={blogs} />}
      
      {/* Call to Action */}
      <CallToAction />
    </div>
  )
}

const HeroSection = () => {
  return (
    <section className="relative w-full">
      {/* Hero Content - Separate Section */}
      <div className="bg-gradient-to-br from-white via-orange-50/40 to-amber-50/40 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-amber-300/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-5">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md border border-orange-200/60 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                <GiLotus className="text-white text-sm sm:text-lg" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700">International Hindu University</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight text-gray-800 px-2">
              Where Ancient Wisdom
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                Meets Modern Education
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
              Discover the perfect blend of traditional Hindu knowledge and contemporary learning in a supportive, culturally rich environment designed for your spiritual and academic growth.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 mb-10">
              <Link href="/Courses/Certificate" className="w-full sm:w-auto">
                <button className="group w-full sm:w-auto bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-400/25 font-semibold flex items-center justify-center">
                  <span>Explore Courses</span>
                  <FaArrowRight className="ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
              <Link href="/About" className="w-full sm:w-auto">
                <button className="group w-full sm:w-auto border-2 border-orange-400 text-orange-600 hover:bg-orange-400 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-semibold flex items-center justify-center">
                  <span>Learn More</span>
                  <IoIosArrowForward className="ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const QuickActions = () => {
  const actionItems = [
    {
      icon: <FaUser className="text-xl sm:text-2xl" />,
      title: "Student Application",
      desc: "Apply for courses and scholarships with our streamlined process designed for your success.",
      link: "/SignIn",
      gradient: "from-blue-400 to-blue-500",
      hoverGradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-400"
    },
    {
      icon: <FaBook className="text-xl sm:text-2xl" />,
      title: "View All Courses",
      desc: "Explore our comprehensive range of traditional and modern courses tailored for every learner.",
      link: "/Courses/Certificate",
      gradient: "from-orange-400 to-amber-400",
      hoverGradient: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      iconBg: "bg-orange-400"
    },
    {
      icon: <FaHandsHelping className="text-xl sm:text-2xl" />,
      title: "Become A Volunteer",
      desc: "Join our community in making a meaningful difference through service and dedication.",
      link: "/Contact",
      gradient: "from-green-400 to-green-500",
      hoverGradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-400"
    },
  ]

  return (
    <section className="relative -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20 xl:-mt-24 mb-0 sm:mb-2 md:mb-4 lg:mb-6 xl:mb-8 z-5 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {actionItems.map((item, index) => (
            <div
              key={index}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <Link href={item.link} className="block h-full">
                <div className={`h-full bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl border-2 ${item.borderColor} p-6 sm:p-8 transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 relative overflow-hidden ${item.bgColor}`}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-orange-300 to-amber-200 rounded-full -translate-y-10 sm:-translate-y-12 md:-translate-y-16 translate-x-10 sm:translate-x-12 md:translate-x-16"></div>
                  </div>
                  
                  {/* Icon */}
                  <div className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:bg-gradient-to-br ${item.hoverGradient} transition-all duration-500 group-hover:scale-110 shadow-lg`}>
                    {item.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                    {item.desc}
                  </p>
                  
                  {/* CTA */}
                  <div className="flex items-center text-orange-500 font-semibold group-hover:text-orange-600 transition-colors duration-300 text-sm sm:text-base">
                    <span>Get Started</span>
                    <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Statistics = () => {
  const stats = [
    { number: "1.5M+", label: "Students Registered", icon: <FaUsers />, color: "from-blue-400 to-blue-500" },
    { number: "500+", label: "Courses Offered", icon: <FaBook />, color: "from-orange-400 to-amber-400" },
    { number: "100+", label: "Volunteers", icon: <FaHandsHelping />, color: "from-green-400 to-green-500" },
    { number: "50+", label: "Expert Instructors", icon: <FaGraduationCap />, color: "from-purple-400 to-purple-500" },
  ]

  return (
    <section className="bg-gradient-to-br from-white via-orange-50/40 to-amber-50/40 py-4 sm:py-6 md:py-8 lg:py-12 xl:py-16 my-0 sm:my-2 md:my-4 lg:my-6 xl:my-8 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-orange-300/20 rounded-full -translate-x-16 sm:-translate-x-24 md:-translate-x-32 -translate-y-16 sm:-translate-y-24 md:-translate-y-32 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-amber-300/20 rounded-full translate-x-16 sm:translate-x-24 md:translate-x-32 translate-y-16 sm:translate-y-24 md:translate-y-32 blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-5">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md border border-orange-200/60 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 shadow-lg">
            <FaAward className="text-orange-400 text-base sm:text-lg" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">Our Achievements</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 text-gray-800 px-2">
            Building a Legacy of
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 block">
              Excellence
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            Preserving Hindu traditions while advancing modern education through innovative programs and dedicated community support.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-lg sm:text-2xl group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 text-center">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold text-center text-xs sm:text-sm">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Features = () => {
  const features = [
    {
      icon: <MdSchool className="text-xl sm:text-2xl" />,
      title: "Traditional Wisdom",
      description: "Learn from ancient Hindu scriptures and philosophical texts with modern interpretation and practical applications",
      color: "from-orange-400 to-amber-400"
    },
    {
      icon: <FaLightbulb className="text-xl sm:text-2xl" />,
      title: "Modern Education",
      description: "Contemporary courses designed for today's world with practical applications and real-world relevance",
      color: "from-blue-400 to-blue-500"
    },
    {
      icon: <BsGlobe2 className="text-xl sm:text-2xl" />,
      title: "Global Community",
      description: "Connect with students and scholars worldwide in a supportive environment that fosters cultural exchange",
      color: "from-green-400 to-green-500"
    },
    {
      icon: <FaShieldAlt className="text-xl sm:text-2xl" />,
      title: "Quality Assurance",
      description: "Accredited programs meeting international standards and best practices for educational excellence",
      color: "from-purple-400 to-purple-500"
    },
    {
      icon: <FaClock className="text-xl sm:text-2xl" />,
      title: "Flexible Learning",
      description: "Study at your own pace with online, hybrid, and in-person options tailored to your lifestyle",
      color: "from-orange-400 to-orange-500"
    },
    {
      icon: <FaHeart className="text-xl sm:text-2xl" />,
      title: "Cultural Preservation",
      description: "Dedicated to preserving and promoting Hindu culture and values for future generations",
      color: "from-red-400 to-red-500"
    }
  ]

  return (
    <section className="pt-6 sm:pt-8 md:pt-10 lg:pt-12 xl:pt-16 pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-amber-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-5">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-orange-50 border border-orange-200 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
            <BsFillLightningFill className="text-orange-400 text-base sm:text-lg" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">Why Choose IHU?</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 text-gray-800 px-2">
            Experience the Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 block">
              Blend
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-5xl mx-auto leading-relaxed px-4">
            Ancient wisdom meets modern education in a supportive, culturally rich environment designed for your spiritual and academic growth.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-gray-100 hover:border-orange-200 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <div className={`absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br ${feature.color} rounded-full -translate-y-10 sm:-translate-y-12 md:-translate-y-16 translate-x-10 sm:translate-x-12 md:translate-x-16`}></div>
                </div>
                
                <div className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Graduate Student",
      content: "IHU has transformed my understanding of both ancient wisdom and modern education. The blend is perfect and the community is incredibly supportive!",
      avatar: "PS",
      rating: 5
    },
    {
      name: "Raj Patel",
      role: "Undergraduate",
      content: "The supportive community and expert instructors make learning both traditional and contemporary subjects truly enriching and meaningful.",
      avatar: "RP",
      rating: 5
    },
    {
      name: "Dr. Meera Singh",
      role: "Faculty Member",
      content: "Teaching at IHU allows me to bridge the gap between ancient knowledge and modern applications effectively. It's a unique educational experience.",
      avatar: "MS",
      rating: 5
    }
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gradient-to-br from-gray-50 to-orange-50/40 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-5">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md border border-orange-200/60 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 shadow-lg">
            <FaStar className="text-orange-400 text-base sm:text-lg" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">Student Testimonials</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 text-gray-800 px-2">
            What Our Students
            <span className="pb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 block">
              Say
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                {/* Rating */}
                <div className="flex items-center mb-4 sm:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-orange-400 text-base sm:text-lg" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                {/* Author */}
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg mr-3 sm:mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base sm:text-lg">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm sm:text-base">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const VirtualTour = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-orange-400/20 rounded-full -translate-x-20 sm:-translate-x-28 md:-translate-x-32 lg:-translate-x-48 -translate-y-20 sm:-translate-y-28 md:-translate-y-32 lg:-translate-y-48 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-80 lg:h-80 bg-amber-400/20 rounded-full translate-x-16 sm:translate-x-20 md:translate-x-28 lg:translate-x-40 translate-y-16 sm:translate-y-20 md:translate-y-28 lg:translate-y-40 blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="relative group animate-fade-in-left">
            {/* Video container with enhanced styling */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-2xl sm:rounded-3xl transform rotate-1 sm:rotate-2 group-hover:rotate-1 transition-transform duration-500"></div>
              <iframe
                className="w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[28rem] rounded-2xl sm:rounded-3xl relative z-10"
                src="https://www.youtube.com/embed/eIYKgjiguxE"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe>
            </div>
          </div>
          
          <div className="space-y-6 sm:space-y-8 animate-fade-in-right">
            <div>
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
                <FaPlay className="text-orange-400 text-base sm:text-lg" />
                <span className="text-xs sm:text-sm font-semibold">Virtual Tour</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
                Take A Virtual
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 block">
                  Tour
                </span>
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-6 sm:mb-8">
                Our university serves as a bridge between the East and the West. Experience our unique approach to learning and spreading knowledge from the world&apos;s oldest living tradition.
              </p>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {[
                "Interactive online courses with expert guidance",
                "Experienced instructors from diverse backgrounds",
                "Flexible learning schedules to fit your lifestyle",
                "Supportive community fostering spiritual growth"
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 sm:space-x-4 group">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <CiCircleCheck className="text-white text-sm sm:text-lg" />
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-gray-300 group-hover:text-white transition-colors duration-300">{feature}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/Courses/Certificate" className="w-full sm:w-auto">
                <button className="group w-full sm:w-auto bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-400/25 font-semibold flex items-center justify-center">
                  <span>Start Your Journey</span>
                  <FaArrowRight className="ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
              <Link href="/About" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-semibold">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const LatestBlogs = ({ blogs }: { blogs: { list: Blog[], count: number } }) => {
  const latestBlogs = blogs.list.slice(0, 3)

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-white relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-5">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-orange-50 border border-orange-200 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
            <FaBook className="text-orange-400 text-base sm:text-lg" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">Latest Insights</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 text-gray-800 px-2">
            Latest from Our
            <span className="pb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 block">
              Blog
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            Stay updated with the latest insights, news, and educational content from our community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {latestBlogs.map((blog, index) => (
            <div
              key={blog._id}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <Link href={`/Blogs/${blog.slug}`}>
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100 flex items-center justify-center">
                    <BlogImage
                      src={typeof blog.image === 'string' ? blog.image : '/Images/about1.png'}
                      alt={blog.title}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6 line-clamp-3">
                      {blog.description}
                    </p>
                    
                    <div className="flex items-center justify-end">
                      <div className="flex items-center text-orange-500 font-semibold text-sm sm:text-base">
                        <span>Read More</span>
                        <BsArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8 sm:mt-12">
          <Link href="/Blogs">
            <button className="group bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-400/25 font-semibold flex items-center mx-auto">
              <span>View All Blogs</span>
              <FaArrowRight className="ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Component to handle blog image with fallback
const BlogImage = ({ src, alt, className }: { src: string, alt: string, className: string }) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(src);

  React.useEffect(() => {
    setImageSrc(src);
    setImageError(false);
  }, [src]);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc('/Images/about1.png'); // Fallback image
    }
  };

  return (
    <Image
      width={600}
      height={400}
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      onLoad={() => setImageError(false)}
    />
  );
};

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-white/10 rounded-full -translate-x-20 sm:-translate-x-28 md:-translate-x-32 lg:-translate-x-48 -translate-y-20 sm:-translate-y-28 md:-translate-y-32 lg:-translate-y-48 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-80 lg:h-80 bg-white/10 rounded-full translate-x-16 sm:translate-x-20 md:translate-x-28 lg:translate-x-40 translate-y-16 sm:translate-y-20 md:translate-y-28 lg:translate-y-40 blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-5 text-center">
        <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
          <FaStar className="text-white text-base sm:text-lg" />
          <span className="text-xs sm:text-sm font-semibold text-white">Ready to Begin?</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 text-white leading-tight px-2">
          Ready to Begin Your
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-100 block">
            Spiritual Journey?
          </span>
        </h2>
        
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
          Join thousands of students who have discovered the perfect balance of ancient wisdom and modern education at International Hindu University.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
          <Link href="/Courses/Certificate" className="w-full sm:w-auto">
            <button className="group w-full sm:w-auto bg-white text-orange-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl font-semibold flex items-center justify-center">
              <span>Explore Courses</span>
              <FaArrowRight className="ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
          <Link href="/Contact" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-orange-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-semibold flex items-center justify-center">
              <MdSupportAgent className="mr-2 sm:mr-3" />
              Contact Us
            </button>
          </Link>
        </div>
        
        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-8 sm:pt-12 border-t border-white/20">
          {[
            { number: "15+", label: "Years Experience" },
            { number: "50+", label: "Expert Instructors" },
            { number: "100%", label: "Student Satisfaction" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">{stat.number}</div>
              <div className="text-xs sm:text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeClientNew 