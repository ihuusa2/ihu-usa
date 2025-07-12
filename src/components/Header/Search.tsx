'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { FaSearch, FaChevronDown } from 'react-icons/fa'
import HydrationGuard from '../HydrationGuard'

const Search = () => {
    const pathName = usePathname()
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [selectedField, setSelectedField] = useState<string>('search')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, inputName: string) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const searchQuery = formData.get(inputName)?.toString()
        
        if (searchQuery && searchQuery.trim()) {
            router.push(`${pathName}?${inputName}=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const inputNames = [
        {
            path: '/Blogs',
            name: 'title',
            placeholder: 'Search blogs...',
            fields: ['title', 'description', 'content', 'author']
        },
        {
            path: '/Team',
            name: 'name',
            placeholder: 'Search team...',
            fields: ['name', 'role', 'description']
        },
        {
            path: '/Courses',
            name: 'title',
            placeholder: 'Search courses...',
            fields: ['title', 'description']
        },
        {
            path: '/Events',
            name: 'title',
            placeholder: 'Search events...',
            fields: ['title', 'description']
        },
        {
            path: '/admin/Registrations',
            name: 'firstName',
            placeholder: 'Search registrations...',
            fields: ['firstName', 'lastName', 'emailAddress', 'phone']
        },
        {
            path: '/admin/Course-Selections',
            name: 'registrationNumber',
            placeholder: 'Search course selections...',
            fields: ['registrationNumber', 'course', 'program']
        },
    ]

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (formRef.current) {
            formRef.current.reset();
        }
        setSelectedField('search')
        setIsDropdownOpen(false)
    }, [pathName])

    const currentPage = inputNames.find((item) => pathName.includes(item.path))
    const hasFields = (currentPage?.fields ?? []).length > 0

    // Set default selected field based on current page
    useEffect(() => {
        if (currentPage?.name) {
            setSelectedField(currentPage.name)
        } else {
            setSelectedField('search')
        }
    }, [currentPage?.name])

    const handleFieldSelect = (field: string) => {
        setSelectedField(field)
        setIsDropdownOpen(false)
    }

    return (
        <HydrationGuard fallback={
            <div className="flex items-center gap-2 w-full max-w-md">
                <div className="w-32 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
        }>
            <form
                ref={formRef}
                onSubmit={(event) => handleSubmit(event, selectedField)}
                className="flex items-center gap-2 w-full max-w-md"
            >
                {/* Custom Field Selector - Only show when relevant */}
                {hasFields && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-32 h-9 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 flex items-center justify-between"
                        >
                            <span className="truncate">
                                {selectedField.charAt(0).toUpperCase() + selectedField.slice(1)}
                            </span>
                            <FaChevronDown 
                                className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                                    isDropdownOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {/* Custom Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-15 overflow-hidden">
                                {currentPage?.fields?.map((field) => (
                                    <button
                                        key={field}
                                        type="button"
                                        onClick={() => handleFieldSelect(field)}
                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-orange-50 focus:bg-orange-50 focus:outline-none transition-colors duration-150 ${
                                            selectedField === field 
                                                ? 'bg-orange-50 text-orange-600 font-medium' 
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Search Input */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        disabled={false}
                        name={selectedField || currentPage?.name || 'search'}
                        placeholder={currentPage?.placeholder || 'Search...'}
                        className="w-full h-9 pl-10 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-400 transition-all duration-200"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    className="h-9 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                    <FaSearch size={12} />
                    <span className="hidden sm:inline">Search</span>
                </button>
            </form>
        </HydrationGuard>
    )
}

export default Search