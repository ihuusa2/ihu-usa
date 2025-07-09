import React, { Suspense } from 'react'

import { Metadata } from 'next'
export const metadata: Metadata = {
    title: 'Login - International Hindu University',
    description: 'Login to your account at International Hindu University'
}

const SignInLayout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <Suspense>
            {children}
        </Suspense>
    )
}

export default SignInLayout