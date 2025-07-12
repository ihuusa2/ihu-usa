'use client'

import InitiatePaypal from '@/components/Paypal'
import { createRegisterForm } from '@/Server/Registration'
import { RegisterForm } from '@/Types/Form'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface InitiatePaymentProps {
    registration: RegisterForm
    price?: string
    show: boolean
    onClose: () => void
}

const InitiatePayment = ({ registration, price, show, onClose }: InitiatePaymentProps) => {
    const route = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)

    // Determine currency based on resident status
    const getCurrencyInfo = () => {
        if (registration.resident === 'Indian Resident') {
            // For INR, we'll use USD for PayPal but display INR to user
            // Approximate conversion rate (you may want to use a real-time API)
            const inrToUsdRate = 0.012; // 1 INR ≈ 0.012 USD
            const inrAmount = 750;
            const usdAmount = (inrAmount * inrToUsdRate).toFixed(2);
            
            return {
                displayCode: 'INR',
                displaySymbol: '₹',
                displayAmount: '750',
                paypalCode: 'USD',
                paypalAmount: usdAmount
            }
        }
        return {
            displayCode: 'USD',
            displaySymbol: '$',
            displayAmount: price || '20',
            paypalCode: 'USD',
            paypalAmount: price || '20'
        }
    }

    const currencyInfo = getCurrencyInfo()

    const handleCart = async (orderId: string) => {
        try {
            setIsProcessing(true)
            await createRegisterForm({
                ...registration,
                orderId,
            })
            route.push('/Success')
        } catch (error) {
            console.error('Error creating registration:', error)
            alert('There was an error processing your registration. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    if (!show) {
        return null
    }

    return (
        <div className="w-full">
            {/* Modal Overlay */}
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                {/* Modal Content */}
                <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col">
                    {/* Modal Header */}
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-2">
                                Complete Your Application
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 sm:p-2 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                aria-label="Close modal"
                            >
                                <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="px-4 sm:px-6 py-4 sm:py-6 flex-1 overflow-y-auto">
                        <div className="mb-4 sm:mb-6">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Application Submitted Successfully!</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Please complete the payment to finalize your registration.</p>
                                </div>
                            </div>
                            
                            {/* Payment Summary */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                                <h5 className="font-semibold text-blue-900 mb-3 text-sm sm:text-base">Payment Summary</h5>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs sm:text-sm font-medium text-gray-700">Application Fee</span>
                                        <span className="text-xs sm:text-sm text-gray-600">{currencyInfo.displaySymbol}{currencyInfo.displayAmount}</span>
                                    </div>
                                    <div className="border-t border-blue-200 pt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs sm:text-sm font-semibold text-gray-900">Total Amount</span>
                                            <span className="text-base sm:text-lg font-bold text-blue-600">{currencyInfo.displaySymbol}{currencyInfo.displayAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                                Choose your preferred payment method below to securely complete your registration.
                            </p>
                            
                            {/* Currency Conversion Notice for INR */}
                            {currencyInfo.displayCode === 'INR' && (
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-amber-900 text-sm sm:text-base">Currency Conversion Notice</h4>
                                            <p className="text-xs sm:text-sm text-amber-700 mt-1">
                                                Your payment of ₹{currencyInfo.displayAmount} will be processed in USD (${currencyInfo.paypalAmount}) 
                                                due to PayPal currency requirements. The equivalent amount will be charged.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Options */}
                        <div className="space-y-4">
                            {/* PayPal Component */}
                            <div className="space-y-2">
                                <h6 className="text-sm font-medium text-gray-700">PayPal Payment</h6>
                                <div className="border border-gray-200 rounded-lg p-2 bg-gray-50 overflow-hidden">
                                    <div className="transform scale-90 sm:scale-100 origin-center">
                                        <InitiatePaypal
                                            order_price={currencyInfo.paypalAmount}
                                            currency_code={currencyInfo.paypalCode}
                                            setResponse={() => {
                                                route.push('/Success')
                                            }}
                                            funcToCall={handleCart}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="w-full px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 min-h-[44px]"
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