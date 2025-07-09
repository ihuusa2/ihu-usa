import Container from '@/components/Container'
import { H1, H2, H4 } from '@/components/Headings'
import React from 'react'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaHandshake } from "react-icons/fa";
import Link from 'next/link';
import Form from './Form';
import { getSettings } from '@/Server/Settings';
import { Settings } from '@/Types/Settings';

const Contact = async () => {
    const site: Settings = await getSettings() as Settings

    const contactData = [
        {
            title: 'Email Us',
            description: site?.email,
            subtitle: 'Send us an email anytime',
            icon: <FaEnvelope size={28} className="text-orange-400" />,
            href: `mailto:${site?.email}`,
            bgGradient: 'from-orange-25 to-orange-50',
            borderColor: 'border-orange-100',
            hoverColor: 'hover:border-orange-150'
        },
        {
            title: 'Call Us',
            description: site?.phone,
            subtitle: 'Mon - Fri, 9AM - 6PM',
            icon: <FaPhoneAlt size={28} className="text-red-400" />,
            href: `tel:${site?.phone}`,
            bgGradient: 'from-red-25 to-red-50',
            borderColor: 'border-red-100',
            hoverColor: 'hover:border-red-150'
        },
        {
            title: 'Visit Us',
            description: site?.address,
            subtitle: 'Our office location',
            icon: <FaMapMarkerAlt size={28} className="text-amber-400" />,
            href: `https://www.google.com/maps/search/?api=1&query=${site?.address}`,
            bgGradient: 'from-amber-25 to-amber-50',
            borderColor: 'border-amber-100',
            hoverColor: 'hover:border-amber-150'
        }
    ]

    const features = [
        {
            icon: <FaClock className="text-orange-400" size={20} />,
            title: "Quick Response",
            description: "We respond to all inquiries within 24 hours"
        },
        {
            icon: <FaHandshake className="text-red-400" size={20} />,
            title: "Personal Support",
            description: "Get personalized assistance from our team"
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-25 to-amber-25">
            <title>Contact Us - Get in Touch</title>
            
            {/* Hero Section */}
            <div className="relative py-12 md:py-16 lg:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 to-amber-100/30"></div>
                <Container className="relative z-10">
                    <div className="text-center max-w-4xl mx-auto px-4">
                        <H1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
                            Get in Touch with Us
                        </H1>
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            We&apos;re here to help and answer any questions you might have. We look forward to hearing from you!
                        </p>
                        
                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-12 max-w-2xl mx-auto">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 md:p-6 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex-shrink-0 p-2 md:p-3 bg-orange-50 rounded-lg">
                                        {feature.icon}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-medium text-gray-800 text-sm md:text-base">{feature.title}</h3>
                                        <p className="text-xs md:text-sm text-gray-600">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Contact Cards Section */}
            <Container className="pb-12 md:pb-16 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
                    {contactData.map((item, index) => (
                        <Link 
                            key={index} 
                            href={item.href} 
                            target={item.title === 'Visit Us' ? '_blank' : '_self'}
                            className="group block transform transition-all duration-300 hover:scale-105"
                        >
                            <div className={`h-full bg-white border ${item.borderColor} ${item.hoverColor} shadow-sm hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden`}>
                                <div className="text-center p-6 md:p-8">
                                    <div className="mx-auto w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300 border border-gray-100 mb-4">
                                        {item.icon}
                                    </div>
                                    <div className="space-y-2">
                                        <H4 className="font-semibold text-gray-800 group-hover:text-gray-700 transition-colors text-base md:text-lg">
                                            {item.title}
                                        </H4>
                                        <p className="text-xs md:text-sm text-gray-500 font-medium">
                                            {item.subtitle}
                                        </p>
                                        <p className="text-gray-700 font-medium break-words text-xs md:text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Contact Form Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 md:px-8 py-8 md:py-10 text-center border-b border-gray-100">
                            <H2 className="text-gray-800 text-xl md:text-2xl font-bold mb-3">
                                Send us a Message
                            </H2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
                                Have a question or want to work together? Fill out the form below and we&apos;ll get back to you as soon as possible.
                            </p>
                        </div>
                        <div className="p-6 md:p-8 lg:p-10">
                            <Form />
                        </div>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="mt-12 md:mt-16 text-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-gray-100 shadow-sm max-w-2xl mx-auto">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                            Why Choose IHU?
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-xs md:text-sm">
                            We&apos;re committed to providing exceptional service and support. Our team is dedicated to helping you achieve your goals and answering any questions you may have along the way.
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <div className="w-8 h-0.5 bg-orange-200 rounded-full"></div>
                            <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
                            <div className="w-8 h-0.5 bg-amber-200 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}    

export default Contact 
