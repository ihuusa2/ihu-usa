// Test script to demonstrate payment status logic
// This script shows the logic without requiring database connection

import { PaymentStatus } from '../src/Types/Form'

// Mock data to demonstrate the issue
const mockRegistrations = [
    {
        _id: '1',
        registrationNumber: 'REG001',
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        paymentStatus: PaymentStatus.COMPLETED,
        status: 'APPROVED',
        orderId: 'PAY-123'
    },
    {
        _id: '2',
        registrationNumber: 'REG002',
        firstName: 'Jane',
        lastName: 'Smith',
        emailAddress: 'jane@example.com',
        paymentStatus: PaymentStatus.PENDING,
        status: 'PENDING',
        orderId: 'PAY-456'
    }
]

const mockCourseRegForms = [
    {
        _id: '1',
        registrationNumber: 'REG001',
        course: 'Computer Science',
        program: 'Bachelor',
        status: PaymentStatus.PENDING, // This should be COMPLETED
        orderId: 'PAY-123'
    },
    {
        _id: '2',
        registrationNumber: 'REG002',
        course: 'Mathematics',
        program: 'Master',
        status: PaymentStatus.PENDING,
        orderId: 'PAY-456'
    }
]

function demonstrateIssue() {
    console.log('🔍 Demonstrating Payment Status Issue\n')
    
    console.log('📊 Current Data State:')
    console.log('Registration Collection:')
    mockRegistrations.forEach(reg => {
        console.log(`  ${reg.registrationNumber}: paymentStatus=${reg.paymentStatus}, status=${reg.status}`)
    })
    
    console.log('\nCourseRegForm Collection:')
    mockCourseRegForms.forEach(course => {
        console.log(`  ${course.registrationNumber}: status=${course.status}`)
    })
    
    console.log('\n❌ ISSUE: Registration REG001 has paymentStatus=COMPLETED but CourseRegForm has status=PENDING')
    console.log('   This causes the Course Selections page to show PENDING instead of COMPLETED')
}

function demonstrateFix() {
    console.log('\n🔧 Applying Fix Logic:\n')
    
    // Forward sync: Registration -> CourseRegForm
    console.log('1️⃣ Forward Sync (Registration -> CourseRegForm):')
    mockRegistrations.forEach(reg => {
        if (reg.paymentStatus === PaymentStatus.COMPLETED) {
            const courseReg = mockCourseRegForms.find(c => c.registrationNumber === reg.registrationNumber)
            if (courseReg && courseReg.status !== PaymentStatus.COMPLETED) {
                console.log(`   🔄 Updating CourseRegForm for ${reg.registrationNumber} from ${courseReg.status} to COMPLETED`)
                courseReg.status = PaymentStatus.COMPLETED
            }
        }
    })
    
    // Reverse sync: CourseRegForm -> Registration
    console.log('\n2️⃣ Reverse Sync (CourseRegForm -> Registration):')
    mockCourseRegForms.forEach(course => {
        if (course.status === PaymentStatus.COMPLETED) {
            const reg = mockRegistrations.find(r => r.registrationNumber === course.registrationNumber)
            if (reg && reg.paymentStatus !== PaymentStatus.COMPLETED) {
                console.log(`   🔄 Updating Registration paymentStatus for ${course.registrationNumber} from ${reg.paymentStatus} to COMPLETED`)
                reg.paymentStatus = PaymentStatus.COMPLETED
            }
        }
    })
    
    console.log('\n✅ After Fix:')
    console.log('Registration Collection:')
    mockRegistrations.forEach(reg => {
        console.log(`  ${reg.registrationNumber}: paymentStatus=${reg.paymentStatus}, status=${reg.status}`)
    })
    
    console.log('\nCourseRegForm Collection:')
    mockCourseRegForms.forEach(course => {
        console.log(`  ${course.registrationNumber}: status=${course.status}`)
    })
    
    console.log('\n🎉 RESULT: Both collections now show consistent COMPLETED status')
}

function demonstrateWebhookEnhancement() {
    console.log('\n🔧 Enhanced PayPal Webhook Logic:\n')
    
    const orderId = 'PAY-123'
    console.log(`Processing payment completion for orderId: ${orderId}`)
    
    // Step 1: Update CourseRegForm
    console.log('1️⃣ Updating CourseRegForm...')
    const courseUpdateResult = { matchedCount: 1, modifiedCount: 1, acknowledged: true }
    console.log(`   Result: ${courseUpdateResult.matchedCount} matched, ${courseUpdateResult.modifiedCount} modified`)
    
    // Step 2: Update Registration by orderId
    console.log('2️⃣ Updating Registration by orderId...')
    const regUpdateResult = { matchedCount: 0, modifiedCount: 0, acknowledged: true }
    console.log(`   Result: ${regUpdateResult.matchedCount} matched, ${regUpdateResult.modifiedCount} modified`)
    
    // Step 3: Fallback - Update by registration number
    if (regUpdateResult.matchedCount === 0) {
        console.log('3️⃣ ⚠️ No Registration found with orderId, trying registration number...')
        const courseData = [{ registrationNumber: 'REG001' }]
        const registrationNumbers = courseData.map(course => course.registrationNumber)
        console.log(`   Found registration numbers: ${registrationNumbers.join(', ')}`)
        
        const regByNumberResult = { matchedCount: 1, modifiedCount: 1, acknowledged: true }
        console.log(`   Fallback result: ${regByNumberResult.matchedCount} matched, ${regByNumberResult.modifiedCount} modified`)
    }
    
    console.log('\n✅ Enhanced webhook ensures both collections are updated even if orderId doesn\'t match')
}

// Run demonstrations
demonstrateIssue()
demonstrateFix()
demonstrateWebhookEnhancement()

console.log('\n📋 Summary:')
console.log('• The issue was caused by inconsistencies between Registration and CourseRegForm collections')
console.log('• The fix includes both a database cleanup script and enhanced webhook logic')
console.log('• The enhanced webhook includes fallback logic to update by registration number')
console.log('• Both collections should now show consistent payment status information') 