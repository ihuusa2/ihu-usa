'use client'

import React, { useState } from 'react'
import type { FAQ } from '@/Types/Gallery'
import HydrationGuard from '@/components/HydrationGuard'

type Props = {
    data: { list: FAQ[], count: number }
}

// Custom FAQ Item Component
const FAQItem = ({ question, answer, isOpen, onClick }: { 
    question: string, 
    answer: string, 
    isOpen: boolean, 
    onClick: () => void 
}) => {
    return (
        <div className='border border-gray-200 rounded-2xl mb-4 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300'>
            <button
                onClick={onClick}
                className='w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50'
            >
                <span className='text-lg font-semibold text-gray-900 pr-4'>{question}</span>
                <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className='w-6 h-6 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className='px-6 pb-5 text-gray-600 leading-relaxed'>
                    {answer}
                </div>
            </div>
        </div>
    )
}

export const FAQClient = ({ data }: Props) => {
    const [openItems, setOpenItems] = useState<number[]>([])

    const toggleItem = (index: number) => {
        setOpenItems(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index)
                : [...prev, index]
        )
    }

    return (
        <HydrationGuard fallback={
            <div className="space-y-4">
                {data?.list?.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
                        <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                ))}
            </div>
        }>
            <div className='space-y-2'>
                {data?.list?.map((item, index) => (
                    <FAQItem
                        key={index}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openItems.includes(index)}
                        onClick={() => toggleItem(index)}
                    />
                ))}
            </div>
        </HydrationGuard>
    )
} 