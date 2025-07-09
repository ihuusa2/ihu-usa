'use client'

import React, { useState, useEffect } from 'react'

// Define a type for the PayPal response
interface PaypalResponse {
    id?: string;
    status?: string;
    test?: boolean;
}

const InitiatePaypal = ({
    order_price = '0.01',
    currency_code = 'USD',
    setResponse,
    funcToCall,
}: {
    order_price?: string,
    currency_code?: string,
    setResponse?: (response: PaypalResponse) => void
    funcToCall?: (orderId: string) => Promise<void> | void
}) => {
    const [status, setStatus] = useState('initializing')
    const [clientId, setClientId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        console.log('🔍 PayPal component mounted')
        console.log('🔍 Props received:', { order_price, currency_code })
        
        const envClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
        console.log('🔍 Environment check:', {
            hasClientId: !!envClientId,
            clientIdLength: envClientId?.length,
            clientIdStart: envClientId?.substring(0, 10)
        })
        
        if (envClientId) {
            setClientId(envClientId)
            setStatus('ready')
            console.log('✅ PayPal client ID found')
        } else {
            setError('PayPal client ID is missing from environment variables')
            setStatus('error')
            console.log('❌ PayPal client ID missing')
        }
    }, [order_price, currency_code])

    const handleTestPayment = async () => {
        try {
            console.log('🔄 Starting test payment...')
            const orderId = 'TEST_' + Date.now()
            console.log('🆔 Test order ID:', orderId)
            
            if (funcToCall) {
                console.log('📞 Calling funcToCall...')
                await funcToCall(orderId)
                console.log('✅ funcToCall completed')
            }
            
            if (setResponse) {
                console.log('📤 Setting response...')
                setResponse({ id: orderId, status: 'completed', test: true })
                console.log('✅ Response set')
            }
        } catch (error) {
            console.error('❌ Test payment error:', error)
            setError('Test payment failed: ' + error)
        }
    }

    console.log('🎨 PayPal component rendering with status:', status)

    // Show different states based on status
    if (status === 'initializing') {
        return (
            <div className="w-full h-[50px] bg-blue-100 rounded flex items-center justify-center border border-blue-300">
                <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700 text-sm font-medium">Initializing PayPal...</span>
                </div>
            </div>
        )
    }

    if (status === 'error' || error) {
        return (
            <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700 text-sm font-medium">PayPal Configuration Error</span>
                </div>
                <p className="text-red-600 text-xs mb-3">{error || 'PayPal is not properly configured.'}</p>
                <button
                    onClick={handleTestPayment}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                    Use Test Payment Instead
                </button>
            </div>
        )
    }

    if (status === 'ready') {
        return (
            <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-700 text-sm font-medium">PayPal Ready</span>
                </div>
                <p className="text-green-600 text-xs mb-3">
                    PayPal is configured and ready. Client ID: {clientId?.substring(0, 10)}...
                </p>
                <div className="space-y-2">
                    <button
                        onClick={handleTestPayment}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                        Test Payment (Skip PayPal)
                    </button>
                    <div className="text-center p-2 bg-gray-100 rounded">
                        <span className="text-xs text-gray-500">
                            PayPal buttons would render here (Client ID: {clientId?.substring(0, 10)}...)
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    // Fallback
    return (
        <div className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg">
            <p className="text-gray-600 text-sm">PayPal component status: {status}</p>
            <button
                onClick={handleTestPayment}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors mt-2"
            >
                Test Payment
            </button>
        </div>
    )
}

export default InitiatePaypal