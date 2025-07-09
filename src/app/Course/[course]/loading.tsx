import Container from '@/components/Container'

export default function CourseLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
            {/* Hero Section Skeleton */}
            <div className="relative bg-gradient-to-br from-[var(--orange-saffron)] to-[var(--amber-gold)] min-h-[400px] flex flex-col justify-center items-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--orange-saffron)]/20 to-[var(--amber-gold)]/20"></div>
                
                <div className="relative z-10 py-12 md:py-20 w-full max-w-5xl mx-auto px-4">
                    {/* Course Badge Skeleton */}
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                        <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
                        <div className="w-24 h-4 bg-white/60 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Course Title Skeleton */}
                    <div className="w-3/4 h-16 bg-white/30 rounded-2xl mx-auto mb-4 animate-pulse"></div>
                    
                    {/* Decorative Line */}
                    <div className="w-32 h-1 bg-white mx-auto mb-6"></div>
                    
                    {/* Course Description Skeleton */}
                    <div className="w-full max-w-3xl mx-auto space-y-2">
                        <div className="w-full h-4 bg-white/30 rounded animate-pulse"></div>
                        <div className="w-5/6 h-4 bg-white/30 rounded animate-pulse"></div>
                        <div className="w-4/5 h-4 bg-white/30 rounded animate-pulse"></div>
                    </div>
                    
                    {/* CTA Buttons Skeleton */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                        <div className="w-40 h-12 bg-white/30 rounded-2xl animate-pulse"></div>
                        <div className="w-40 h-12 bg-white/20 rounded-2xl animate-pulse"></div>
                    </div>
                </div>
            </div>

            <Container className="py-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[65%_35%] gap-12">
                    {/* LEFT: Course Details Skeleton */}
                    <div className="space-y-10">
                        {/* Course Overview Card Skeleton */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
                                <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>

                        {/* Benefits Checklist Skeleton */}
                        <div className="bg-gradient-to-br from-[var(--amber-gold)]/10 to-[var(--wisdom-green)]/10 rounded-3xl p-8 border border-[var(--amber-gold)]/30 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div key={item} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                                        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                                        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Testimonial Videos Skeleton */}
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-[var(--spiritual-blue)]/5 to-[var(--amber-gold)]/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                                    <div className="w-40 h-6 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[1, 2].map((item) => (
                                        <div key={item} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                                            <div className="p-6">
                                                <div className="w-32 h-6 bg-gray-200 rounded mx-auto mb-3 animate-pulse"></div>
                                                <div className="w-48 h-4 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
                                                <div className="w-full h-48 bg-gray-200 rounded-xl animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Gallery Skeleton */}
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-[var(--wisdom-green)]/5 to-[var(--amber-gold)]/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                                    <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                        <div key={item} className="w-full h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* FAQs Skeleton */}
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-[var(--spiritual-blue)]/5 to-[var(--amber-gold)]/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                                    <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="space-y-4">
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="border border-gray-200 rounded-2xl overflow-hidden">
                                            <div className="px-6 py-4">
                                                <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Statistics Skeleton */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-center">
                                    <div className="w-16 h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                                    <div className="w-24 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Sidebar Skeleton */}
                    <div className="space-y-8">
                        {/* Course Image Card Skeleton */}
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                            <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-36 h-4 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Info Card Skeleton */}
                        <div className="bg-gradient-to-br from-[var(--spiritual-blue)]/10 to-[var(--amber-gold)]/10 rounded-3xl p-6 border border-[var(--spiritual-blue)]/20 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
                                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div key={item} className="flex justify-between items-center py-3 border-b border-[var(--spiritual-blue)]/10">
                                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions Skeleton */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                            <div className="w-32 h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
} 