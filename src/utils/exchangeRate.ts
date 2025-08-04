// Exchange rate utility functions

export interface ExchangeRateData {
    success: boolean
    rate: number
    timestamp: string
    source: string
    error?: string
}

// Default fallback rate (more accurate than the previous 83)
export const DEFAULT_EXCHANGE_RATE = 83.5

// Fetch real-time exchange rate
export const fetchExchangeRate = async (): Promise<ExchangeRateData> => {
    try {
        const response = await fetch('/api/exchange-rate')
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching exchange rate:', error)
        return {
            success: false,
            rate: DEFAULT_EXCHANGE_RATE,
            timestamp: new Date().toISOString(),
            source: 'fallback',
            error: 'Failed to fetch exchange rate'
        }
    }
}

// Convert INR to USD using provided rate
export const convertINRtoUSD = (inrAmount: number, rate: number = DEFAULT_EXCHANGE_RATE): number => {
    return Math.round((inrAmount / rate) * 100) / 100
}

// Convert USD to INR using provided rate
export const convertUSDtoINR = (usdAmount: number, rate: number = DEFAULT_EXCHANGE_RATE): number => {
    return Math.round(usdAmount * rate * 100) / 100
}

// Format exchange rate for display
export const formatExchangeRate = (rate: number): string => {
    return `1 USD = ₹${rate.toFixed(2)}`
}

// Validate if exchange rate is reasonable (between 70-90 INR per USD)
export const isValidExchangeRate = (rate: number): boolean => {
    return rate >= 70 && rate <= 90
} 