'use client'

import InitiatePaypal from '@/components/Paypal'
import { useState } from 'react'

// Define a type for the PayPal response
interface PaypalResponse {
    id?: string;
    status?: string;
    test?: boolean;
}

export default function TestPaypalPage() {
    const [response, setResponse] = useState<PaypalResponse | null>(null)

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">PayPal Test</h1>
                
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Environment Check</h2>
                    <div className="bg-gray-100 p-3 rounded text-sm">
                        <p>NEXT_PUBLIC_PAYPAL_CLIENT_ID: {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? '✅ Set' : '❌ Missing'}</p>
                        <p>Length: {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.length || 0}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">PayPal Component</h2>
                    <InitiatePaypal
                        order_price="20"
                        currency_code="USD"
                        setResponse={setResponse}
                        funcToCall={async (orderId) => {
                            console.log('Test funcToCall called with:', orderId)
                        }}
                    />
                </div>

                {response && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Response</h2>
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                            <pre className="text-sm text-green-800">{JSON.stringify(response, null, 2)}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 