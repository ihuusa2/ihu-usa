import { db } from '../src/lib/mongo'
import { PaymentStatus } from '../src/Types/Form'

async function manualPaymentFix() {
    console.log('🔧 Manual Payment Status Fix Tool\n')
    
    try {
        // First, let's see what records we have
        console.log('📊 Current Database State:')
        
        const allRegistrations = await db.collection('Registration').find({}).toArray()
        console.log(`\n📝 Total Registrations: ${allRegistrations.length}`)
        
        const pendingRegistrations = allRegistrations.filter(reg => reg.paymentStatus === PaymentStatus.PENDING)
        console.log(`⏳ Registrations with PENDING payment: ${pendingRegistrations.length}`)
        
        const completedRegistrations = allRegistrations.filter(reg => reg.paymentStatus === PaymentStatus.COMPLETED)
        console.log(`✅ Registrations with COMPLETED payment: ${completedRegistrations.length}`)
        
        // Show pending registrations
        if (pendingRegistrations.length > 0) {
            console.log('\n📋 Pending Registrations:')
            pendingRegistrations.forEach((reg, index) => {
                console.log(`${index + 1}. ${reg.firstName} ${reg.lastName} (${reg.emailAddress})`)
                console.log(`   Registration Number: ${reg.registrationNumber || 'Not assigned'}`)
                console.log(`   Order ID: ${reg.orderId || 'Not set'}`)
                console.log(`   Payment Status: ${reg.paymentStatus}`)
                console.log(`   Registration Status: ${reg.status}`)
                console.log(`   Created: ${reg.createdAt}`)
                console.log('')
            })
        }
        
        // Check CourseRegForm collection
        const allCourseRegForms = await db.collection('CourseRegForm').find({}).toArray()
        console.log(`\n📚 Total CourseRegForms: ${allCourseRegForms.length}`)
        
        const pendingCourseRegForms = allCourseRegForms.filter(course => course.status === PaymentStatus.PENDING)
        console.log(`⏳ CourseRegForms with PENDING status: ${pendingCourseRegForms.length}`)
        
        const completedCourseRegForms = allCourseRegForms.filter(course => course.status === PaymentStatus.COMPLETED)
        console.log(`✅ CourseRegForms with COMPLETED status: ${completedCourseRegForms.length}`)
        
        // Interactive fix options
        console.log('\n🔧 Fix Options:')
        console.log('1. Mark all registrations with orderId as COMPLETED')
        console.log('2. Mark specific registration by email as COMPLETED')
        console.log('3. Mark specific registration by registration number as COMPLETED')
        console.log('4. Sync all CourseRegForm statuses with Registration paymentStatus')
        console.log('5. Exit')
        
        // For now, let's implement option 1 and 4 automatically
        console.log('\n🔄 Running automatic fixes...')
        
        // Option 1: Mark all registrations with orderId as COMPLETED
        const registrationsWithOrderId = allRegistrations.filter(reg => reg.orderId && reg.orderId.trim() !== '')
        console.log(`\n1️⃣ Found ${registrationsWithOrderId.length} registrations with orderId`)
        
        let updatedCount = 0
        for (const reg of registrationsWithOrderId) {
            if (reg.paymentStatus !== PaymentStatus.COMPLETED) {
                console.log(`   🔄 Updating ${reg.firstName} ${reg.lastName} (${reg.emailAddress}) from ${reg.paymentStatus} to COMPLETED`)
                
                await db.collection('Registration').updateOne(
                    { _id: reg._id },
                    { $set: { paymentStatus: PaymentStatus.COMPLETED } }
                )
                updatedCount++
            }
        }
        console.log(`   ✅ Updated ${updatedCount} registrations`)
        
        // Option 4: Sync CourseRegForm statuses
        console.log('\n4️⃣ Syncing CourseRegForm statuses with Registration paymentStatus...')
        
        let courseUpdatedCount = 0
        for (const reg of allRegistrations) {
            if (reg.paymentStatus === PaymentStatus.COMPLETED) {
                const courseRegForms = await db.collection('CourseRegForm').find({
                    registrationNumber: reg.registrationNumber
                }).toArray()
                
                for (const courseReg of courseRegForms) {
                    if (courseReg.status !== PaymentStatus.COMPLETED) {
                        console.log(`   🔄 Updating CourseRegForm for ${reg.registrationNumber} from ${courseReg.status} to COMPLETED`)
                        
                        await db.collection('CourseRegForm').updateOne(
                            { _id: courseReg._id },
                            { $set: { status: PaymentStatus.COMPLETED } }
                        )
                        courseUpdatedCount++
                    }
                }
            }
        }
        console.log(`   ✅ Updated ${courseUpdatedCount} CourseRegForm records`)
        
        // Final summary
        console.log('\n📈 Final Summary:')
        const finalRegistrations = await db.collection('Registration').find({}).toArray()
        const finalPendingReg = finalRegistrations.filter(reg => reg.paymentStatus === PaymentStatus.PENDING)
        const finalCompletedReg = finalRegistrations.filter(reg => reg.paymentStatus === PaymentStatus.COMPLETED)
        
        console.log(`📝 Registrations - PENDING: ${finalPendingReg.length}, COMPLETED: ${finalCompletedReg.length}`)
        
        const finalCourseRegForms = await db.collection('CourseRegForm').find({}).toArray()
        const finalPendingCourse = finalCourseRegForms.filter(course => course.status === PaymentStatus.PENDING)
        const finalCompletedCourse = finalCourseRegForms.filter(course => course.status === PaymentStatus.COMPLETED)
        
        console.log(`📚 CourseRegForms - PENDING: ${finalPendingCourse.length}, COMPLETED: ${finalCompletedCourse.length}`)
        
        console.log('\n🎉 Manual fix completed!')
        console.log('\n💡 If you still have pending payments that should be completed:')
        console.log('   - Check if the PayPal webhook is properly configured')
        console.log('   - Verify the orderId matches between PayPal and your database')
        console.log('   - Check PayPal webhook logs for any errors')
        
    } catch (error) {
        console.error('❌ Error in manualPaymentFix:', error)
    } finally {
        process.exit(0)
    }
}

manualPaymentFix() 