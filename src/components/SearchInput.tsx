'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const SearchInput = ({ children }: {
    children: React.ReactNode
}) => {
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const formValues = Object.fromEntries(formData.entries())
        const queryString = new URLSearchParams(formValues as Record<string, string>).toString()

        router.push(`?${queryString}`)
    }

    return (
        <form onSubmit={handleSubmit}>
            {children}
        </form>
    )
}

export default SearchInput