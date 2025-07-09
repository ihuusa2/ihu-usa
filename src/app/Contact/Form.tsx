'use client'

import Spinner from '@/components/Spinner'
import { createContactForm } from '@/Server/Contact'
import { Contact } from '@/Types/Form'
import React from 'react'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCommentDots, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

const initialData: Contact = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    message: ''
}

const Form = () => {
    const [value, setValue] = React.useState(initialData);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [fieldErrors, setFieldErrors] = React.useState<{[key: string]: string}>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value: inputValue } = e.target;
        setValue(prev => ({ ...prev, [name]: inputValue }));
        
        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        // Clear general error
        if (error) setError('');
        if (message) setMessage('');
    };

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
        if (!value.address.trim()) errors.address = 'Address is required';
        if (!value.message.trim()) {
            errors.message = 'Message is required';
        } else if (value.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters long';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            setError('Please fix the errors above');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            await createContactForm(value);
            setValue(initialData);
            setMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
            setFieldErrors({});
        } catch (err) {
            setError('Failed to send message. Please try again later.');
            console.error('Contact form error:', err);
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ 
        name, 
        label, 
        type = 'text', 
        icon, 
        value, 
        placeholder,
        className = ''
    }: {
        name: string;
        label: string;
        type?: string;
        icon: React.ReactNode;
        value: string;
        placeholder?: string;
        className?: string;
    }) => (
        <div className={`w-full flex flex-col gap-2 ${className}`}>
            <label htmlFor={name} className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                {icon}
                {label}
            </label>
            <div className="relative">
                <input 
                    id={name}
                    type={type} 
                    name={name} 
                    placeholder={placeholder}
                    disabled={loading} 
                    value={value} 
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200 ${
                        fieldErrors[name] 
                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                            : 'border-gray-200 focus:border-orange-400 hover:border-gray-300 bg-white'
                    } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                />
                {fieldErrors[name] && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <FaExclamationCircle className="text-red-500" size={16} />
                    </div>
                )}
            </div>
            {fieldErrors[name] && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <FaExclamationCircle size={12} />
                    {fieldErrors[name]}
                </p>
            )}
        </div>
    );

    return (
        <div className="w-full">
            {/* Status Messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <FaExclamationCircle className="text-red-500 flex-shrink-0" size={20} />
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}
            
            {message && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" size={20} />
                    <p className="text-green-700 font-medium">{message}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className='flex flex-col w-full gap-6'>
                {/* Name Fields */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full'>
                    <InputField
                        name="firstName"
                        label="First Name"
                        icon={<FaUser size={14} className="text-orange-500" />}
                        value={value.firstName}
                        placeholder="Enter your first name"
                    />
                    <InputField
                        name="lastName"
                        label="Last Name"
                        icon={<FaUser size={14} className="text-orange-500" />}
                        value={value.lastName}
                        placeholder="Enter your last name"
                    />
                </div>

                {/* Contact Fields */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                    <InputField
                        name="email"
                        label="Email Address"
                        type="email"
                        icon={<FaEnvelope size={14} className="text-orange-500" />}
                        value={value.email}
                        placeholder="your.email@example.com"
                    />
                    <InputField
                        name="phone"
                        label="Phone Number"
                        type="tel"
                        icon={<FaPhone size={14} className="text-orange-500" />}
                        value={value.phone}
                        placeholder="+1 (555) 123-4567"
                    />
                </div>

                {/* Address Field */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FaMapMarkerAlt size={14} className="text-orange-500" />
                        Address
                    </label>
                    <div className="relative">
                        <textarea 
                            id="address"
                            name='address' 
                            placeholder="Enter your full address"
                            disabled={loading} 
                            value={value.address} 
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-[80px] resize-none ${
                                fieldErrors.address 
                                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                    : 'border-gray-200 focus:border-orange-400 hover:border-gray-300 bg-white'
                            } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                        />
                        {fieldErrors.address && (
                            <div className="absolute right-3 top-3">
                                <FaExclamationCircle className="text-red-500" size={16} />
                            </div>
                        )}
                    </div>
                    {fieldErrors.address && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <FaExclamationCircle size={12} />
                            {fieldErrors.address}
                        </p>
                    )}
                </div>

                {/* Message Field */}
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="message" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FaCommentDots size={14} className="text-orange-500" />
                        Message
                    </label>
                    <div className="relative">
                        <textarea 
                            id="message"
                            name='message' 
                            placeholder="Tell us about your inquiry, questions, or how we can help you..."
                            className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-[120px] resize-y ${
                                fieldErrors.message 
                                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                    : 'border-gray-200 focus:border-orange-400 hover:border-gray-300 bg-white'
                            } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                            disabled={loading} 
                            value={value.message} 
                            onChange={handleChange} 
                        />
                        {fieldErrors.message && (
                            <div className="absolute right-3 top-3">
                                <FaExclamationCircle className="text-red-500" size={16} />
                            </div>
                        )}
                    </div>
                    {fieldErrors.message && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <FaExclamationCircle size={12} />
                            {fieldErrors.message}
                        </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        {value.message.length}/500 characters minimum 10
                    </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                    <button 
                        type='submit' 
                        disabled={loading}
                        className="min-w-[200px] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-2"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Spinner size='1.2rem' />
                                Sending...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <FaEnvelope size={16} />
                                Send Message
                            </div>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Form