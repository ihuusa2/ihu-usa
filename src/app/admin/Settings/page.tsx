'use client'

import type { Settings } from "@/Types/Settings";
import React, { useEffect, useState } from 'react'
import { H1 } from '@/components/Headings/index'
import { getSettings } from '@/Server/Settings'
import AddSettings from '../components/AddSettings'
import Image from "next/image";
import { 
  FaCog, 
  FaImage, 
  FaShare, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone, 
  FaInfoCircle,
  FaEdit,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaExternalLinkAlt,
  FaCheck,
  FaExclamationTriangle,
  FaTimes,
  FaPlus
} from 'react-icons/fa'

// Custom Modal Component
const CustomModal = ({ 
    isOpen, 
    onClose, 
    children 
}: {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}) => {
    if (!isOpen) return null
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto animate-fade-in">
                {children}
            </div>
        </div>
    )
}

// Custom Button Component
const CustomButton = ({ 
    children, 
    onClick, 
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = ''
}: {
    children: React.ReactNode
    onClick?: () => void
    variant?: 'primary' | 'secondary' | 'danger' | 'success'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    className?: string
}) => {
    const baseClasses = "font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 transform hover:scale-105 active:scale-95"
    
    const variantClasses = {
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg focus:ring-blue-200",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-200 focus:ring-gray-200",
        danger: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg focus:ring-red-200",
        success: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg focus:ring-green-200"
    }
    
    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    }
    
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' : ''} ${className}`}
        >
            {children}
        </button>
    )
}

// Custom Card Component
const CustomCard = ({ 
    children, 
    className = '',
    onClick
}: {
    children: React.ReactNode
    className?: string
    onClick?: () => void
}) => (
    <div 
        className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
    >
        {children}
    </div>
)

// Custom Badge Component
const CustomBadge = ({ 
    children, 
    variant = 'default',
    className = ''
}: {
    children: React.ReactNode
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger'
    className?: string
}) => {
    const variantClasses = {
        default: "bg-blue-100 text-blue-800 border-blue-200",
        secondary: "bg-gray-100 text-gray-800 border-gray-200",
        success: "bg-green-100 text-green-800 border-green-200",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
        danger: "bg-red-100 text-red-800 border-red-200"
    }
    
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    )
}

const AdminSettings = () => {
    const [settings, setSettings] = useState<Settings | null>({
        logo: '',
        social: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: '',
            linkedin: '',
        },
        address: '',
        email: '',
        phone: '',
        about: '',
    })
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [imageModalOpen, setImageModalOpen] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const settingsData = await getSettings()
                if (settingsData) {
                    setSettings(settingsData)
                }
            } catch (error) {
                console.error('Failed to load settings:', error)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="text-gray-700 font-medium">Loading settings...</span>
                </div>
            </div>
        )
    }

    const socialIcons = {
        facebook: { icon: FaFacebook, color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
        instagram: { icon: FaInstagram, color: 'text-pink-600', bgColor: 'bg-pink-100', borderColor: 'border-pink-200' },
        twitter: { icon: FaTwitter, color: 'text-sky-500', bgColor: 'bg-sky-100', borderColor: 'border-sky-200' },
        youtube: { icon: FaYoutube, color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' },
        linkedin: { icon: FaLinkedin, color: 'text-blue-700', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className='py-8 px-6 max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <FaCog className="text-white text-2xl" />
                            </div>
                            <div>
                                <H1 className="mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                    Site Settings
                                </H1>
                                <p className='text-slate-600 text-lg'>Configure your website settings and preferences</p>
                            </div>
                        </div>
                        
                        <CustomButton
                            size="lg"
                            onClick={() => setModalOpen(true)}
                            className="shadow-lg shadow-blue-200/50"
                        >
                            <FaEdit size={16} />
                            Edit Settings
                        </CustomButton>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {/* Logo Section */}
                    <CustomCard className="group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
                        <div className="relative z-10 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <FaImage className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Website Logo</h3>
                                    <p className="text-slate-600">Your organization&apos;s brand identity</p>
                                </div>
                            </div>
                            
                            {settings?.logo ? (
                                <div 
                                    className="cursor-pointer group/logo"
                                    onClick={() => setImageModalOpen(true)}
                                >
                                    <div className="relative rounded-xl border-2 border-blue-200 p-6 hover:border-blue-400 transition-all duration-300 bg-white shadow-sm">
                                        {(typeof settings.logo === 'string' && settings.logo) || (settings.logo instanceof File) ? (
                                            <Image
                                                src={typeof settings.logo === 'string' ? settings.logo : URL.createObjectURL(settings.logo)}
                                                alt="Website Logo"
                                                width={250}
                                                height={120}
                                                className="w-full h-24 object-contain group-hover/logo:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <FaImage className="text-gray-400 text-2xl" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-blue-600/0 group-hover/logo:bg-blue-600/10 rounded-xl transition-all duration-300 flex items-center justify-center">
                                            <FaExternalLinkAlt className="text-blue-600 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-24 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-500 bg-slate-50">
                                    <div className="text-center">
                                        <FaImage className="mx-auto mb-2 text-2xl" />
                                        <p className="font-medium">No logo uploaded</p>
                                    </div>
                                </div>
                            )}
                            
                            <div className="mt-4 flex items-center justify-between">
                                <CustomBadge variant={settings?.logo ? "success" : "warning"}>
                                    {settings?.logo ? (
                                        <><FaCheck className="w-3 h-3 mr-1" /> Configured</>
                                    ) : (
                                        <><FaExclamationTriangle className="w-3 h-3 mr-1" /> Not Set</>
                                    )}
                                </CustomBadge>
                            </div>
                        </div>
                    </CustomCard>

                    {/* Contact Information */}
                    <CustomCard className="group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
                        <div className="relative z-10 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-green-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <FaInfoCircle className="text-green-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Contact Details</h3>
                                    <p className="text-slate-600">How people can reach you</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FaEnvelope className="text-green-600 mt-1" size={14} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Email</p>
                                        <p className="font-medium text-gray-800 truncate">
                                            {settings?.email || 'Not configured'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FaPhone className="text-green-600 mt-1" size={14} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Phone</p>
                                        <p className="font-medium text-gray-800 truncate">
                                            {settings?.phone || 'Not configured'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FaMapMarkerAlt className="text-green-600 mt-1" size={14} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Address</p>
                                        <p className="font-medium text-gray-800 text-sm leading-relaxed">
                                            {settings?.address || 'Not configured'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <CustomBadge variant={settings?.email && settings?.phone && settings?.address ? "success" : "warning"}>
                                    {settings?.email && settings?.phone && settings?.address ? (
                                        <><FaCheck className="w-3 h-3 mr-1" /> Complete</>
                                    ) : (
                                        <><FaExclamationTriangle className="w-3 h-3 mr-1" /> Incomplete</>
                                    )}
                                </CustomBadge>
                            </div>
                        </div>
                    </CustomCard>

                    {/* Social Media */}
                    <CustomCard className="group lg:col-span-2 xl:col-span-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                        <div className="relative z-10 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <FaShare className="text-purple-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Social Media</h3>
                                    <p className="text-slate-600">Connect with your audience</p>
                                </div>
                            </div>
                            
                            <div className="grid gap-3">
                                {Object.entries(socialIcons).map(([platform, config]) => {
                                    const Icon = config.icon
                                    const url = settings?.social[platform as keyof typeof settings.social]
                                    
                                    return (
                                        <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 ${config.bgColor} rounded-lg`}>
                                                    <Icon className={`${config.color}`} size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 capitalize">{platform}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {url ? 'Connected' : 'Not connected'}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                {url ? (
                                                    <>
                                                        <CustomBadge variant="success">
                                                            <FaCheck className="w-3 h-3 mr-1" />
                                                            Active
                                                        </CustomBadge>
                                                        <a
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                        >
                                                            <FaExternalLinkAlt size={12} />
                                                        </a>
                                                    </>
                                                ) : (
                                                    <CustomBadge variant="secondary">
                                                        <FaTimes className="w-3 h-3 mr-1" />
                                                        Inactive
                                                    </CustomBadge>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            
                            <div className="mt-4">
                                <CustomBadge variant={Object.values(settings?.social || {}).some(url => url) ? "success" : "warning"}>
                                    {Object.values(settings?.social || {}).filter(url => url).length} of 5 connected
                                </CustomBadge>
                            </div>
                        </div>
                    </CustomCard>

                    {/* About Section */}
                    <CustomCard className="lg:col-span-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5"></div>
                        <div className="relative z-10 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-orange-100 rounded-xl">
                                    <FaInfoCircle className="text-orange-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">About Organization</h3>
                                    <p className="text-slate-600">Tell your story to the world</p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-6">
                                {settings?.about ? (
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {settings.about}
                                    </p>
                                ) : (
                                    <div className="text-center py-8">
                                        <FaPlus className="mx-auto text-gray-400 mb-3" size={24} />
                                        <p className="text-gray-500 font-medium">No about information added yet</p>
                                        <p className="text-gray-400 text-sm">Add information about your organization</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-4">
                                <CustomBadge variant={settings?.about ? "success" : "warning"}>
                                    {settings?.about ? (
                                        <><FaCheck className="w-3 h-3 mr-1" /> Configured</>
                                    ) : (
                                        <><FaExclamationTriangle className="w-3 h-3 mr-1" /> Not Set</>
                                    )}
                                </CustomBadge>
                            </div>
                        </div>
                    </CustomCard>
                </div>
            </div>

            {/* Settings Modal */}
            <CustomModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                {settings && (
                    <AddSettings 
                        isEdit={true} 
                        editData={settings}
                        onClose={() => setModalOpen(false)}
                        setData={setSettings as React.Dispatch<React.SetStateAction<Settings>>}
                    />
                )}
            </CustomModal>

            {/* Image Modal */}
            <CustomModal isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)}>
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-3xl mx-auto">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">Website Logo</h3>
                            <button
                                onClick={() => setImageModalOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <FaTimes size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="p-8">
                        {settings?.logo && ((typeof settings.logo === 'string' && settings.logo) || (settings.logo instanceof File)) ? (
                            <Image
                                src={typeof settings.logo === 'string' ? settings.logo : URL.createObjectURL(settings.logo)}
                                alt="Website Logo"
                                width={800}
                                height={400}
                                className="w-full h-auto object-contain rounded-lg max-h-96"
                            />
                        ) : (
                            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <FaImage className="mx-auto text-gray-400 mb-3" size={48} />
                                    <p className="text-gray-500 font-medium">No logo available</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CustomModal>
        </div>
    )
}

export default AdminSettings