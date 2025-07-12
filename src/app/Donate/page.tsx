'use client'

import type { Donation } from "@/Types/Donation";
import { DonationPurpose } from "@/Types/Donation";
import { createDonateForm } from '@/Server/Donate'
import React from 'react'
import Spinner from "@/components/Spinner";
import InitiatePaypal from "@/components/Paypal";
import { FaDollarSign, FaHeart, FaGraduationCap, FaBuilding, FaUsers, FaFlask, FaCheckCircle, FaExclamationCircle, FaHandHoldingHeart, FaArrowRight, FaGlobe, FaLightbulb, FaHandshake, FaCreditCard } from 'react-icons/fa'

const initialValue: Donation = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    amount: 0,
    currency: 'USD',
    purpose: DonationPurpose.GENERAL,
    message: '',
    isAnonymous: false
}

const presetAmounts = [25, 50, 100, 250, 500, 1000]

const donationPurposes = [
    {
        value: DonationPurpose.GENERAL,
        label: 'General Support',
        icon: FaHeart,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        hoverColor: 'hover:bg-red-100',
        description: 'Support the overall mission and operations of IHU'
    },
    {
        value: DonationPurpose.EDUCATION,
        label: 'Educational Programs',
        icon: FaGraduationCap,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        hoverColor: 'hover:bg-blue-100',
        description: 'Fund innovative educational initiatives and curriculum development'
    },
    {
        value: DonationPurpose.SCHOLARSHIPS,
        label: 'Student Scholarships',
        icon: FaUsers,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        hoverColor: 'hover:bg-green-100',
        description: 'Provide financial aid to deserving students'
    },
    {
        value: DonationPurpose.INFRASTRUCTURE,
        label: 'Infrastructure',
        icon: FaBuilding,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        hoverColor: 'hover:bg-orange-100',
        description: 'Improve facilities, technology, and campus infrastructure'
    },
    {
        value: DonationPurpose.RESEARCH,
        label: 'Research & Development',
        icon: FaFlask,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        hoverColor: 'hover:bg-purple-100',
        description: 'Support cutting-edge research and academic innovation'
    },
    {
        value: DonationPurpose.COMMUNITY,
        label: 'Community Outreach',
        icon: FaHandHoldingHeart,
        color: 'text-pink-500',
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-200',
        hoverColor: 'hover:bg-pink-100',
        description: 'Fund community programs and outreach initiatives'
    }
]

const Donate = () => {
    const [value, setValue] = React.useState<Donation>(initialValue)
    const [loading, setLoading] = React.useState(false)
    const [msg, setMsg] = React.useState('')
    const [error, setError] = React.useState('')
    const [fieldErrors, setFieldErrors] = React.useState<{[key: string]: string}>({})
    const [customAmount, setCustomAmount] = React.useState(false)
    const [showPaymentModal, setShowPaymentModal] = React.useState(false)
    const [donationId, setDonationId] = React.useState<string>('')

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    };

    const validateForm = () => {
        const errors: {[key: string]: string} = {};

        if (!value.firstName.trim()) errors.firstName = 'First name is required';
        if (!value.lastName.trim()) errors.lastName = 'Last name is required';
        if (!value.email.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(value.email)) {
            errors.email = 'Please enter a valid email address';
        }
        if (!value.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!validatePhone(value.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }
        if (!value.amount || value.amount <= 0) {
            errors.amount = 'Please enter a valid donation amount';
        } else if (value.amount < 1) {
            errors.amount = 'Minimum donation amount is $1';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (field: keyof Donation, val: string | number | boolean) => {
        setValue(prev => ({ ...prev, [field]: val }));
        
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
        
        // Clear general messages
        if (error) setError('');
        if (msg) setMsg('');
    };

    const handleAmountSelect = (amount: number) => {
        setValue(prev => ({ ...prev, amount }));
        setCustomAmount(false);
        if (fieldErrors.amount) {
            setFieldErrors(prev => ({ ...prev, amount: '' }));
        }
    };

    const handleCustomAmount = () => {
        setCustomAmount(true);
        setValue(prev => ({ ...prev, amount: 0 }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            setError('Please fix the errors above');
            return;
        }

        setLoading(true);
        setError('');
        setMsg('');

        try {
            // Create donation record first
            const result = await createDonateForm(value);
            setDonationId(result.insertedId?.toString() || '');
            setShowPaymentModal(true);
        } catch (err) {
            setError('Failed to process donation. Please try again later.');
            console.error('Donation error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Define a type for the PayPal response
    interface PaypalResponse {
        id?: string;
        purchase_units?: Array<{
            payments?: {
                captures?: Array<{
                    id?: string;
                }>;
            };
        }>;
    }

    const handlePaymentSuccess = async (response: PaypalResponse) => {
        try {
            // Update donation status to completed
            const updateResponse = await fetch('/api/donations/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    donationId: donationId,
                    status: 'COMPLETED',
                    transactionId: response.id || response.purchase_units?.[0]?.payments?.captures?.[0]?.id
                })
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update donation status');
            }

            setMsg('Thank you for your generous donation! Your contribution makes a difference in advancing education and building a better future.');
            setValue(initialValue);
            setCustomAmount(false);
            setFieldErrors({});
            setShowPaymentModal(false);
        } catch (err) {
            setError('Payment successful but failed to update donation status. Please contact support.');
            console.error('Payment success error:', err);
        }
    };

    const selectedPurpose = donationPurposes.find(p => p.value === value.purpose);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-25 to-amber-25">
            <title>Donate - Support IHU&apos;s Mission</title>
            
            {/* Hero Section */}
            <div className="relative py-8 sm:py-12 lg:py-16 xl:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-orange-100/30"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-5xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
                            Empower Global Minds, Support The Vision Of IHU
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
                            Your donation bridges cultures, builds futures, and creates opportunities for students worldwide. 
                            Join us in preserving ancient wisdom while embracing modern knowledge.
                        </p>
                        
                        {/* Impact Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                            {[
                                { icon: FaGraduationCap, label: 'Students Supported', value: '500+', color: 'text-blue-600', bgColor: 'bg-blue-50' },
                                { icon: FaBuilding, label: 'Programs Funded', value: '25+', color: 'text-orange-600', bgColor: 'bg-orange-50' },
                                { icon: FaHeart, label: 'Lives Impacted', value: '1000+', color: 'text-red-600', bgColor: 'bg-red-50' }
                            ].map((stat, index) => (
                                <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className={`${stat.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                        <stat.icon className={`${stat.color}`} size={28} />
                                    </div>
                                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{stat.value}</div>
                                    <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Donate Section */}
            <div className="py-12 sm:py-16 lg:py-20 bg-white/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-4">
                            Why Your Donation Matters
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                            Every contribution directly impacts our ability to provide quality education and preserve cultural heritage
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            {
                                icon: FaGlobe,
                                title: 'Global Impact',
                                description: 'Support students from diverse backgrounds and cultures worldwide',
                                color: 'text-blue-600',
                                bgColor: 'bg-blue-50'
                            },
                            {
                                icon: FaLightbulb,
                                title: 'Innovation',
                                description: 'Fund cutting-edge research and modern educational technologies',
                                color: 'text-orange-600',
                                bgColor: 'bg-orange-50'
                            },
                            {
                                icon: FaHandshake,
                                title: 'Community Building',
                                description: 'Create lasting connections and foster cultural understanding',
                                color: 'text-green-600',
                                bgColor: 'bg-green-50'
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className={`${item.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                                    <item.icon className={item.color} size={24} />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Donation Form */}
            <div className="py-12 sm:py-16 lg:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 sm:px-8 lg:px-12 py-8 sm:py-12 text-center border-b border-gray-100">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                                    <FaDollarSign className="text-orange-500" size={32} />
                                    Make a Donation
                                </h2>
                                <p className="text-base sm:text-lg text-gray-600">
                                    Every contribution, no matter the size, helps us continue our mission of providing quality education and preserving cultural heritage.
                                </p>
                            </div>
                        </div>
                        
                        {/* Form Content */}
                        <div className="p-6 sm:p-8 lg:p-12">
                            {/* Status Messages */}
                            {error && (
                                <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4">
                                    <FaExclamationCircle className="text-red-500 flex-shrink-0" size={24} />
                                    <p className="text-red-700 font-medium text-base sm:text-lg">{error}</p>
                                </div>
                            )}
                            
                            {msg && (
                                <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-4">
                                    <FaCheckCircle className="text-green-500 flex-shrink-0" size={24} />
                                    <p className="text-green-700 font-medium text-base sm:text-lg">{msg}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
                                {/* Donation Amount */}
                                <div>
                                    <label className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 block">
                                        Choose Donation Amount
                                    </label>
                                    
                                    {/* Preset Amounts */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                                        {presetAmounts.map((amount) => (
                                            <button
                                                key={amount}
                                                type="button"
                                                className={`py-4 px-6 font-bold rounded-2xl border-2 transition-all duration-300 text-lg ${
                                                    value.amount === amount && !customAmount 
                                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-orange-500 shadow-xl transform scale-105' 
                                                        : 'bg-white hover:bg-orange-50 hover:border-orange-300 border-gray-200 text-gray-700 hover:text-orange-700 hover:shadow-lg'
                                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={() => handleAmountSelect(amount)}
                                                disabled={loading}
                                            >
                                                ${amount}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {/* Custom Amount */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            type="button"
                                            className={`py-4 px-8 font-bold rounded-2xl border-2 transition-all duration-300 text-lg ${
                                                customAmount 
                                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-orange-500 shadow-xl transform scale-105' 
                                                    : 'bg-white hover:bg-orange-50 hover:border-orange-300 border-gray-200 text-gray-700 hover:text-orange-700 hover:shadow-lg'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={handleCustomAmount}
                                            disabled={loading}
                                        >
                                            Custom Amount
                                        </button>
                                        
                                        {customAmount && (
                                            <div className="flex-1 relative">
                                                <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="number"
                                                    placeholder="Enter amount"
                                                    value={value.amount || ''}
                                                    onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                                                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg ${
                                                        fieldErrors.amount ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'
                                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={loading}
                                                    min="1"
                                                    step="0.01"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {fieldErrors.amount && (
                                        <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
                                            <FaExclamationCircle size={14} />
                                            {fieldErrors.amount}
                                        </p>
                                    )}
                                </div>

                                {/* Donation Purpose */}
                                <div>
                                    <label className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 block">
                                        Donation Purpose
                                    </label>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {donationPurposes.map((purpose) => {
                                            const Icon = purpose.icon;
                                            const isSelected = value.purpose === purpose.value;
                                            
                                            return (
                                                <div
                                                    key={purpose.value}
                                                    className={`cursor-pointer transition-all duration-300 rounded-2xl border-2 p-6 ${
                                                        isSelected 
                                                            ? 'ring-4 ring-orange-400/30 bg-orange-50 border-orange-200 shadow-xl transform scale-105' 
                                                            : `hover:shadow-lg hover:border-gray-300 border-gray-200 ${purpose.hoverColor} hover:transform hover:scale-105`
                                                    }`}
                                                    onClick={() => handleChange('purpose', purpose.value)}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`p-3 rounded-xl ${purpose.bgColor}`}>
                                                            <Icon className={purpose.color} size={24} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-gray-800 mb-2 text-lg">
                                                                {purpose.label}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                                {purpose.description}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <FaCheckCircle className="text-orange-500 flex-shrink-0" size={24} />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div>
                                    <label className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 block">
                                        Your Information
                                    </label>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-base font-semibold text-gray-700 mb-3">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={value.firstName}
                                                onChange={(e) => handleChange('firstName', e.target.value)}
                                                className={`w-full px-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg ${
                                                    fieldErrors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'
                                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={loading}
                                                placeholder="Enter your first name"
                                            />
                                            {fieldErrors.firstName && (
                                                <p className="text-red-500 text-sm mt-2">{fieldErrors.firstName}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-base font-semibold text-gray-700 mb-3">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={value.lastName}
                                                onChange={(e) => handleChange('lastName', e.target.value)}
                                                className={`w-full px-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg ${
                                                    fieldErrors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'
                                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={loading}
                                                placeholder="Enter your last name"
                                            />
                                            {fieldErrors.lastName && (
                                                <p className="text-red-500 text-sm mt-2">{fieldErrors.lastName}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-base font-semibold text-gray-700 mb-3">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                value={value.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                className={`w-full px-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg ${
                                                    fieldErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'
                                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={loading}
                                                placeholder="your.email@example.com"
                                            />
                                            {fieldErrors.email && (
                                                <p className="text-red-500 text-sm mt-2">{fieldErrors.email}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-base font-semibold text-gray-700 mb-3">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                value={value.phone}
                                                onChange={(e) => handleChange('phone', e.target.value)}
                                                className={`w-full px-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg ${
                                                    fieldErrors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'
                                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={loading}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                            {fieldErrors.phone && (
                                                <p className="text-red-500 text-sm mt-2">{fieldErrors.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Optional Message */}
                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-3">
                                        Message (Optional)
                                    </label>
                                    <textarea
                                        value={value.message || ''}
                                        onChange={(e) => handleChange('message', e.target.value)}
                                        placeholder="Share why you're supporting IHU or leave a message of encouragement..."
                                        className={`w-full px-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 min-h-[120px] resize-none text-lg ${
                                            loading ? 'opacity-50 cursor-not-allowed' : 'border-gray-200'
                                        }`}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Anonymous Donation Option */}
                                <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
                                    <input
                                        type="checkbox"
                                        id="anonymous"
                                        checked={value.isAnonymous || false}
                                        onChange={(e) => handleChange('isAnonymous', e.target.checked)}
                                        className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                                        disabled={loading}
                                    />
                                    <label htmlFor="anonymous" className="text-base text-gray-700 font-medium">
                                        Make this donation anonymous
                                    </label>
                                </div>

                                {/* Donation Summary */}
                                {value.amount > 0 && (
                                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200">
                                        <h3 className="font-bold text-gray-800 mb-6 text-xl">Donation Summary</h3>
                                        <div className="space-y-4 text-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Amount:</span>
                                                <span className="font-bold text-2xl text-orange-600">${value.amount.toFixed(2)} USD</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Purpose:</span>
                                                <span className="font-semibold text-gray-800">{selectedPurpose?.label}</span>
                                            </div>
                                            {value.isAnonymous && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Anonymous:</span>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                                        Yes
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex justify-center pt-8">
                                    <button
                                        type="submit"
                                        disabled={loading || !value.amount}
                                        className="min-w-[300px] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-6 px-12 rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-xl"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner size="1.5rem" />
                                                <span>Processing Donation...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaCreditCard size={20} />
                                                <span>Proceed to Payment</span>
                                                <FaArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setShowPaymentModal(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 sm:p-6 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg sm:text-xl font-bold pr-2">Complete Your Donation</h2>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="text-white hover:text-gray-200 transition-colors duration-200 p-1 sm:p-2 rounded-full hover:bg-white hover:bg-opacity-20 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-orange-100 mt-2 text-sm sm:text-base">Secure payment powered by PayPal</p>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
                            {/* Donation Summary */}
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-orange-200">
                                <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">Donation Summary</h3>
                                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-bold text-xl sm:text-2xl text-orange-600">${value.amount.toFixed(2)} USD</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Purpose:</span>
                                        <span className="font-semibold text-gray-800 truncate ml-2">{selectedPurpose?.label}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Donor:</span>
                                        <span className="font-semibold text-gray-800 truncate ml-2">
                                            {value.isAnonymous ? 'Anonymous' : `${value.firstName} ${value.lastName}`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Instructions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                                <div className="flex items-start">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-xs sm:text-sm text-blue-800">
                                        Click the PayPal button below to securely complete your donation. 
                                        You&apos;ll be redirected to PayPal to finalize the transaction.
                                    </p>
                                </div>
                            </div>

                            {/* PayPal Component */}
                            <div className="flex justify-center overflow-hidden">
                                <div className="transform scale-90 sm:scale-100 origin-center">
                                    <InitiatePaypal
                                        order_price={value.amount.toString()}
                                        currency_code={"USD"}
                                        setResponse={handlePaymentSuccess}
                                        funcToCall={async (orderId: string) => {
                                            // Update donation with order ID
                                            try {
                                                await fetch('/api/donations/update-status', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify({
                                                        donationId: donationId,
                                                        status: 'PENDING',
                                                        orderId: orderId
                                                    })
                                                });
                                            } catch (err) {
                                                console.error('Failed to update donation with order ID:', err);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex-shrink-0">
                            <p className="text-xs text-gray-500 text-center">
                                Your donation is secured by PayPal&apos;s industry-leading security measures
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Donate