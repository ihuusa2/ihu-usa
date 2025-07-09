import Container from '@/components/Container'
import { H1 } from '@/components/Headings'
import React from 'react'

const Success = () => {
  return (
    <Container className='py-10 flex flex-col gap-10'>
        <H1 className='text-center'>Payment Successful</H1>
        <p className='text-center text-lg'>Thank you for your payment. Your transaction has been completed successfully.</p>
        <p className='text-center text-lg'>You can now proceed to your dashboard to view your courses.</p>
        <p className='text-center text-lg'>If you have any questions, please contact our support team.</p>
    </Container>
  )
}

export default Success