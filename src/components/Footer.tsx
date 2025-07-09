'use client'

import React, { useEffect, useState } from 'react'
import Container from './Container'
import Link from 'next/link'
import { FaFacebook, FaYoutube, FaGraduationCap, FaHandsHelping, FaBookOpen } from 'react-icons/fa'
import { AiFillInstagram } from "react-icons/ai";
import { FaLocationDot, FaPhone, FaXTwitter, FaEnvelope, FaHeart } from "react-icons/fa6";
import { IoLibraryOutline } from "react-icons/io5";
import { getSettings } from '@/Server/Settings';
import { Settings } from '@/Types/Settings';

const Footer = () => {
    const [site, setSite] = useState<Settings | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getSettings()
                setSite(settings)
            } catch (error) {
                console.error('Error fetching settings:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [])

    const quickLinks = [
        { title: "About IHU", path: "/About", icon: <FaBookOpen size={14} /> },
        { title: "Mission & Vision", path: "/Mission-vision", icon: <FaGraduationCap size={14} /> },
        { title: "Value & Spirit", path: "/Value-spirit", icon: <FaHeart size={14} /> },
        { title: "IHU Anthem", path: "/Kulgeet", icon: <IoLibraryOutline size={14} /> },
        { title: "Volunteer", path: "/Volunteer", icon: <FaHandsHelping size={14} /> }
    ]

    const educationLinks = [
        { title: "Vedic Studies", path: "/Courses/Vedic-Studies" },
        { title: "Yoga Certification", path: "/Courses/Yoga" },
        { title: "Ayurveda Programs", path: "/Courses/Ayurveda" },
        { title: "Sanskrit Learning", path: "/Courses/Sanskrit" },
        { title: "Philosophy & Ethics", path: "/Courses/Philosophy" }
    ]

    const mediaLinks = [
        { title: "Photo Gallery", path: "/Photo-Gallery" },
        { title: "Video Gallery", path: "/Video-Gallery" },
        { title: "Events", path: "/Events" },
        { title: "Blogs", path: "/Blogs" },
        { title: "Testimonials", path: "/Testimonials" }
    ]

    const socialLinks = [
        { 
            title: "facebook", 
            path: "https://facebook.com", 
            logo: <FaFacebook size={20} />,
            color: "hover:bg-blue-600"
        },
        { 
            title: "instagram", 
            path: "https://instagram.com", 
            logo: <AiFillInstagram size={22} />,
            color: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500"
        },
        { 
            title: "youtube", 
            path: "https://youtube.com", 
            logo: <FaYoutube size={22} />,
            color: "hover:bg-red-600"
        },
        { 
            title: "twitter", 
            path: "https://twitter.com", 
            logo: <FaXTwitter size={20} />,
            color: "hover:bg-gray-800"
        }
    ]

    // Show loading state while fetching data
    if (loading) {
        return (
            <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
                <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500"></div>
                <Container className="py-16">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
                    </div>
                </Container>
            </footer>
        )
    }

    return (
        <>
            {/* Main Footer with Traditional Design */}
            <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
                {/* Decorative Border */}
                <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500"></div>
                
                <Container className="py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        
                        {/* University Info Section with Traditional Elements */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                                    International Hindu University
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Preserving ancient wisdom while embracing modern education. A bridge between Eastern spirituality and Western knowledge.
                                </p>
                            </div>
                            
                            {/* Contact Information with Better Design */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 group">
                                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                                        <FaLocationDot className="text-orange-400" size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Address</p>
                                        <p className="text-gray-200 text-sm leading-relaxed">{site?.address}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                                        <FaPhone className="text-orange-400" size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Phone</p>
                                        <Link href={`tel:${site?.phone}`} className="text-gray-200 hover:text-orange-400 transition-colors">
                                            {site?.phone}
                                        </Link>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                                        <FaEnvelope className="text-orange-400" size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Email</p>
                                        <Link href={`mailto:${site?.email}`} className="text-gray-200 hover:text-orange-400 transition-colors">
                                            {site?.email}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links with Enhanced Styling */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-orange-400 border-b border-orange-500/30 pb-2">
                                Quick Links
                            </h4>
                            <ul className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link 
                                            href={link.path} 
                                            className="flex items-center gap-3 text-gray-300 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 group"
                                        >
                                            <span className="text-orange-500 group-hover:text-orange-400 transition-colors">
                                                {link.icon}
                                            </span>
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Education Programs */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-orange-400 border-b border-orange-500/30 pb-2">
                                Programs
                            </h4>
                            <ul className="space-y-3">
                                {educationLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link 
                                            href={link.path} 
                                            className="text-gray-300 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 block"
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Media & Resources */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-orange-400 border-b border-orange-500/30 pb-2">
                                Media & Resources
                            </h4>
                            <ul className="space-y-3">
                                {mediaLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link 
                                            href={link.path} 
                                            className="text-gray-300 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 block"
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            
                            {/* Social Media Section */}
                            <div className="mt-8">
                                <h5 className="text-sm font-semibold text-gray-400 mb-4">Follow Us</h5>
                                <div className="flex gap-3">
                                    {socialLinks.filter(link => site?.social[link.title as keyof Settings['social']]?.trim()).map((link, index) => {
                                        const siteLink = site?.social[link.title as keyof Settings['social']]
                                        return (
                                            <Link 
                                                key={index} 
                                                href={siteLink as string} 
                                                className={`w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg ${link.color}`}
                                            >
                                                {link.logo}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter & CTA Section */}
                    <div className="mt-16 pt-8 border-t border-gray-700">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h4 className="text-xl font-semibold text-orange-400 mb-2">
                                    Join Our Spiritual Learning Community
                                </h4>
                                <p className="text-gray-300">
                                    Embark on a journey of ancient wisdom and modern understanding. Apply today or support our mission.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link 
                                    href="/Registration-Form"
                                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <FaGraduationCap size={16} />
                                    Apply Now
                                </Link>
                                <Link 
                                    href="/Donate"
                                    className="border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <FaHandsHelping size={16} />
                                    Support Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </footer>

            {/* Copyright Footer with Traditional Pattern */}
            <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 py-6 border-t border-gray-700">
                <Container>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                                <IoLibraryOutline className="text-orange-400" size={16} />
                            </div>
                            <p className="text-gray-400 text-sm">
                                © 2025 International Hindu University. All rights reserved.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Developed with</span>
                            <FaHeart className="text-orange-500" size={14} />
                            <span>by ATIVA IT Solutions</span>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default Footer