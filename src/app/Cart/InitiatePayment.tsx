'use client'

import InitiatePaypal from '@/components/Paypal'
import { createMultiCourseRegForm } from '@/Server/CourseRegForm'
import { Cart } from '@/Types/Cart'
import { PaymentStatus } from '@/Types/Form'
import { useRouter } from 'next/navigation'
import React from 'react'

const InitiatePayment = ({ cart }: { cart: Cart[] }) => {
    const [show, setShow] = React.useState(false)
    const [isProcessing, setIsProcessing] = React.useState(false)
    const route = useRouter()

    const handleCart = async (orderId: string) => {
        try {
            setIsProcessing(true)
            
            // Create course registrations with orderId
            await createMultiCourseRegForm(cart?.map(item => ({
                orderId,
                registrationNumber: item.registrationNumber,
                course: item.course,
                program: item.program,
                subjects: item.subjects,
                price: {
                    amount: item.price.amount,
                    currency: item.price.type // Map type to currency
                },
                createdAt: new Date(),
                status: PaymentStatus.PENDING
            })))
            
            // Immediately update payment status to COMPLETED
            try {
                const updateResponse = await fetch('/api/payments/update-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        orderId: orderId,
                        status: 'COMPLETED'
                    })
                });

                if (!updateResponse.ok) {
                    console.warn('Failed to update payment status immediately, but webhook will handle it');
                } else {
                    console.log('Payment status updated to COMPLETED immediately');
                }
            } catch (updateError) {
                console.warn('Error updating payment status immediately:', updateError);
                // Don't fail the entire process - webhook will handle the update
            }
            
            route.push('/Success')
        } catch (error) {
            console.error('Error creating course registrations:', error)
            alert('There was an error processing your course registrations. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const totalAmount = cart?.reduce((acc, item) => acc + item.price.amount, 0).toFixed(2)

    return (
        <div>
            {/* Trigger Button */}
            <button
                onClick={() => setShow(true)}
                disabled={cart.length === 0}
                className={`
                    px-6 py-3 rounded-lg font-medium transition-all duration-200 
                    transform hover:scale-105 active:scale-95
                    ${cart.length === 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    w-full sm:w-auto
                `}
            >
                Proceed to Payment
            </button>

            {/* Modal Overlay */}
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setShow(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg sm:text-xl font-bold pr-2">Payment Details</h2>
                                <button
                                    onClick={() => setShow(false)}
                                    className="text-white hover:text-gray-200 transition-colors duration-200 p-1 sm:p-2 rounded-full hover:bg-white hover:bg-opacity-20 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-blue-100 mt-2 text-sm sm:text-base">Review your order before proceeding</p>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                            {/* Items List */}
                            <div className="mb-4 sm:mb-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Order Items:</h3>
                                <div className="space-y-2 sm:space-y-3">
                                    {cart.map((item) => (
                                        <div 
                                            key={item._id as string} 
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="flex-1 min-w-0 pr-2">
                                                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.course}</p>
                                                <p className="text-xs sm:text-sm text-gray-600 truncate">{item.program}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-semibold text-green-600 text-sm sm:text-base">
                                                    ${item.price.amount.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total Amount */}
                            <div className="border-t border-gray-200 pt-3 sm:pt-4 mb-4 sm:mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-base sm:text-lg font-semibold text-gray-800">Total Amount:</span>
                                    <span className="text-xl sm:text-2xl font-bold text-green-600">${totalAmount}</span>
                                </div>
                            </div>

                            {/* Payment Instructions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                                <div className="flex items-start">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-xs sm:text-sm text-blue-800">
                                        Click the PayPal button below to securely complete your payment. 
                                        You&apos;ll be redirected to PayPal to finalize the transaction.
                                    </p>
                                </div>
                            </div>

                            {/* PayPal Component */}
                            <div className="flex justify-center overflow-hidden">
                                <div className="transform scale-90 sm:scale-100 origin-center">
                                    {isProcessing ? (
                                        <div className="w-full p-4 bg-blue-100 border border-blue-300 rounded-lg">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                <span className="text-blue-700 text-sm font-medium">Processing payment...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <InitiatePaypal
                                            order_price={totalAmount}
                                            currency_code={"USD"}
                                            setResponse={() => {
                                                route.push('/Success')
                                            }}
                                            funcToCall={handleCart}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex-shrink-0">
                            <p className="text-xs text-gray-500 text-center">
                                Your payment is secured by PayPal&apos;s industry-leading security measures
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InitiatePayment