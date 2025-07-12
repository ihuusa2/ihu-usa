'use client'

import React, { useState, useEffect } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

// Define a type for the PayPal response
interface PaypalResponse {
    id?: string;
    status?: string;
    purchase_units?: Array<{
        payments?: {
            captures?: Array<{
                id?: string;
            }>;
        };
    }>;
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
    // Validate currency support for PayPal
    const paypalSupportedCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    const isPaypalSupported = paypalSupportedCurrencies.includes(currency_code);
    
    if (!isPaypalSupported) {
        console.warn(`Currency ${currency_code} is not supported by PayPal. Falling back to USD.`);
    }
    
    const [status, setStatus] = useState('initializing')
    const [clientId, setClientId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const envClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
        
        console.log('PayPal Client ID:', envClientId)
        console.log('Currency Code:', currency_code)
        console.log('Order Price:', order_price)
        
        if (envClientId) {
            setClientId(envClientId)
            setStatus('ready')
        } else {
            setError('PayPal client ID is missing from environment variables')
            setStatus('error')
        }
    }, [order_price, currency_code])

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
                <p className="text-red-600 text-xs">{error || 'PayPal is not properly configured.'}</p>
                <div className="mt-2 text-xs text-red-500">
                    <p>Debug Info:</p>
                    <p>Client ID: {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 'Present' : 'Missing'}</p>
                    <p>Currency: {currency_code}</p>
                    <p>Amount: {order_price}</p>
                </div>
            </div>
        )
    }

    if (status === 'ready' && clientId) {
        return (
            <PayPalScriptProvider options={{ 
                clientId: clientId,
                currency: currency_code,
                intent: "capture"
            }}>
                <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                        console.log('Creating PayPal order with:', {
                            value: order_price,
                            currency_code: currency_code
                        })
                        
                        // Ensure we're using a supported currency
                        const finalCurrency = paypalSupportedCurrencies.includes(currency_code) ? currency_code : 'USD';
                        const finalAmount = paypalSupportedCurrencies.includes(currency_code) ? order_price : order_price;
                        
                        return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                                {
                                    amount: {
                                        value: finalAmount,
                                        currency_code: finalCurrency
                                    },
                                },
                            ],
                        });
                    }}
                    onApprove={async (data, actions) => {
                        if (actions.order) {
                            const order = await actions.order.capture();
                            
                            if (funcToCall) {
                                await funcToCall(order.id || '');
                            }
                            
                            if (setResponse) {
                                setResponse(order);
                            }
                        }
                    }}
                    onError={(err) => {
                        console.error('PayPal error:', err);
                        console.error('Error details:', {
                            currency: currency_code,
                            amount: order_price,
                            error: err,
                            clientId: clientId ? 'Present' : 'Missing',
                            environment: 'Sandbox'
                        });
                        setError(`Payment failed: ${err.message || 'Please try again.'}`);
                    }}
                />
            </PayPalScriptProvider>
        )
    }

    return (
        <div className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg">
            <p className="text-gray-600 text-sm">PayPal component status: {status}</p>
        </div>
    )
}

export default InitiatePaypal