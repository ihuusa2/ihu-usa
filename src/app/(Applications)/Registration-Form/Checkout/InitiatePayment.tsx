'use client'

import InitiatePaypal from '@/components/Paypal'
import { createRegisterForm } from '@/Server/Registration'
import { RegisterForm } from '@/Types/Form'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

interface InitiatePaymentProps {
    registration: RegisterForm
    price?: string
    show: boolean
    onClose: () => void
}

const InitiatePayment = ({ registration, price, show, onClose }: InitiatePaymentProps) => {
    const route = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        console.log('InitiatePayment component mounted with props:', { registration, price, show })
    }, [registration, price, show])

    const handleCart = async (orderId: string) => {
        try {
            console.log('Handling cart with orderId:', orderId)
            setIsProcessing(true)
            await createRegisterForm({
                ...registration,
                orderId,
            })
            console.log('Registration form created successfully')
            route.push('/Success')
        } catch (error) {
            console.error('Error creating registration:', error)
            alert('There was an error processing your registration. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleTestPayment = async () => {
        try {
            console.log('Handling test payment')
            setIsProcessing(true)
            const orderId = 'TEST_' + Date.now();
            await handleCart(orderId);
        } catch (error) {
            console.error('Error processing test payment:', error)
            alert('There was an error processing your test payment. Please try again.')
            setIsProcessing(false)
        }
    }

    if (!show) {
        console.log('InitiatePayment: not showing')
        return null
    }

    console.log('InitiatePayment: rendering modal')

    return (
        <div className="w-full">
            {/* Modal Overlay */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                {/* Modal Content */}
                <div className="relative w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Complete Your Application
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="px-6 py-6">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Application Submitted Successfully!</h4>
                                    <p className="text-sm text-gray-600">Please complete the payment to finalize your registration.</p>
                                </div>
                            </div>
                            
                            {/* Payment Summary */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <h5 className="font-semibold text-blue-900 mb-3">Payment Summary</h5>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">Application Fee</span>
                                        <span className="text-sm text-gray-600">${price || '20'}</span>
                                    </div>
                                    <div className="border-t border-blue-200 pt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-900">Total Amount</span>
                                            <span className="text-lg font-bold text-blue-600">${price || '20'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-6">
                                Choose your preferred payment method below to securely complete your registration.
                            </p>
                        </div>

                        {/* Payment Options */}
                        <div className="space-y-4">
                            {/* PayPal Component */}
                            <div className="space-y-2">
                                <h6 className="text-sm font-medium text-gray-700">PayPal Payment</h6>
                                <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                                    <InitiatePaypal
                                        order_price={price || '20'}
                                        currency_code={"USD"}
                                        setResponse={(response) => {
                                            console.log('PayPal response received:', response)
                                            route.push('/Success')
                                        }}
                                        funcToCall={handleCart}
                                    />
                                </div>
                            </div>
                            
                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">OR</span>
                                </div>
                            </div>
                            
                            {/* Test Payment Button */}
                            <div className="space-y-2">
                                <h6 className="text-sm font-medium text-gray-700">Test Payment (Development)</h6>
                                <button
                                    onClick={handleTestPayment}
                                    disabled={isProcessing}
                                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Complete Test Payment
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-gray-500 text-center">
                                    Use this option for testing or if PayPal is not available
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Cancel Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InitiatePayment