import Container from '@/components/Container'
import FadeContainer from '@/components/FadeContainer'
import React from 'react'
import { CiCircleCheck } from 'react-icons/ci'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'Values & Spirit of International Hindu University',
    description: 'Explore the core values and spirit that guide International Hindu University in its mission to educate and inspire students in Vedic Studies, Yoga, and more.'
}

const ValueSpirit = () => {
    const values = [
        {
            title: "Ahimsã (Non-injury)",
            description: "Don't harm others by word, deed or thought."
        },
        {
            title: "Satya (Truthfulness)",
            description: "Refrain from lying and betraying promises."
        },
        {
            title: "Asteya (Non-stealing)",
            description: "Don't steal, covet or enter into debt."
        },
        {
            title: "Brahmachãrya (Controlling Sex)",
            description: "Observe celibacy when single and faithfulness in marriage."
        },
        {
            title: "Kshamã (Forgiveness)",
            description: "Restrain from intolerance and ill will."
        },
        {
            title: "Dhriti (Firmness)",
            description: "Overcome fear, indecision, and fickleness."
        },
        {
            title: "Dayã (Compassion)",
            description: "Conquer callous and insensitive feelings."
        },
        {
            title: "Ãrjava (Honesty)",
            description: "Renounce fraud, cheating and stealing."
        },
        {
            title: "Mitãhãra (Moderation)",
            description: "Refrain from overeating and consuming meat."
        },
        {
            title: "Shaucha (Purity)",
            description: "Observe purity of the body, mind and intellect."
        },
        {
            title: "Hrî (Remorse)",
            description: "Be modest and show remorse for misconduct."
        },
        {
            title: "Santosha (Contentment)",
            description: "Don't be a slave to the senses. Seek joy and serenity in the Self."
        },
        {
            title: "Dãna (Tithing)",
            description: "Give generously without thought of reward. The more you give, the more you get."
        },
        {
            title: "Ãstikya (Faith)",
            description: "Have unwavering faith in God's grace."
        },
        {
            title: "Pûjana (Worship)",
            description: "Perform daily worship and meditation."
        },
        {
            title: "Shravana (Hearing of Scriptures)",
            description: "Study scriptures, listen to the teachings of the wise, and faithfully follow guru's advice."
        },
        {
            title: "Mati (Cognition)",
            description: "Sharpen the intellect with guru's guidance."
        },
        {
            title: "Vrata (Sacred Vows)",
            description: "Observe scriptural injunctions faithfully."
        },
        {
            title: "Japa (Chanting)",
            description: "Chant God's names and sacred mantras daily."
        },
        {
            title: "Tapas (Austerity)",
            description: "Perform sãdh."
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
            <Container className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
                            <Image 
                                src="/Images/about1.png" 
                                alt="Dharma Symbol" 
                                width={64}
                                height={64}
                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full"
                            />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                    </div>
                    
                    <FadeContainer direction="up" className="mb-6">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            Values & Spirit
                        </h1>
                        <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
                    </FadeContainer>
                    
                    <FadeContainer direction="up" delay={100}>
                        <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                            Dharma protects those who protect it. Our values follow the Yamas and Niyamas - 
                            Moral and Ethical Ideals of Hindus
                        </p>
                    </FadeContainer>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {values.map((value, index) => (
                        <FadeContainer 
                            key={index} 
                            direction="up" 
                            delay={index * 50}
                            className="group"
                        >
                            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 h-full border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <CiCircleCheck className="text-white text-lg" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </FadeContainer>
                    ))}
                </div>

                {/* Bottom Quote Section */}
                <FadeContainer direction="up" delay={1000}>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 sm:p-12 text-center border border-green-100">
                        <div className="max-w-3xl mx-auto">
                            <div className="text-4xl sm:text-6xl text-green-600 mb-4">&ldquo;</div>
                            <p className="text-xl sm:text-2xl font-medium text-gray-800 mb-6 leading-relaxed">
                                The highest dharma is non-violence, the highest truth is non-violence, 
                                and the highest yoga is non-violence.
                            </p>
                            <div className="text-4xl sm:text-6xl text-green-600">&rdquo;</div>
                            <p className="text-sm text-gray-600 mt-4">- Ancient Hindu Wisdom</p>
                        </div>
                    </div>
                </FadeContainer>
            </Container>
        </div>
    )
}

export default ValueSpirit