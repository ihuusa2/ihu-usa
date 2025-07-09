'use client'

import InitiatePaypal from '@/components/Paypal'
import { Cart } from '@/Types/Cart'
import { useRouter } from 'next/navigation'
import React from 'react'

const InitiatePayment = ({ cart }: { cart: Cart[] }) => {
    const [show, setShow] = React.useState(false)
    const route = useRouter()

    // const handleCart = async (orderId: string) => {
    //     await createMultiCourseRegForm(cart?.map(item => ({
    //         orderId,
    //         registrationNumber: item.registrationNumber,
    //         course: item.course,
    //         program: item.program,
    //         subjects: item.subjects,
    //         price: item.price,
    //         createdAt: new Date(),
    //         status: PaymentStatus.PENDING
    //     })))
    // }

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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setShow(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Payment Details</h2>
                                <button
                                    onClick={() => setShow(false)}
                                    className="text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-blue-100 mt-2">Review your order before proceeding</p>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {/* Items List */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items:</h3>
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <div 
                                            key={item._id as string} 
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.course}</p>
                                                <p className="text-sm text-gray-600">{item.program}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-green-600">
                                                    ${item.price.amount.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total Amount */}
                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                                    <span className="text-2xl font-bold text-green-600">${totalAmount}</span>
                                </div>
                            </div>

                            {/* Payment Instructions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-blue-800">
                                        Click the PayPal button below to securely complete your payment. 
                                        You&apos;ll be redirected to PayPal to finalize the transaction.
                                    </p>
                                </div>
                            </div>

                            {/* PayPal Component */}
                            <div className="flex justify-center">
                                <InitiatePaypal
                                    order_price={totalAmount}
                                    currency_code={"USD"}
                                    setResponse={(response) => {
                                        console.log(response)
                                        route.push('/Success')
                                    }}
                                    // funcToCall={handleCart}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
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