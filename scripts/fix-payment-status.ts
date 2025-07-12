import { db } from '../src/lib/mongo'
import { PaymentStatus } from '../src/Types/Form'

async function fixPaymentStatus() {
    console.log('🔍 Starting payment status consistency check...')
    
    try {
        // Get all registrations with completed payment status
        const completedRegistrations = await db.collection('Registration').find({
            paymentStatus: PaymentStatus.COMPLETED
        }).toArray()
        
        console.log(`📊 Found ${completedRegistrations.length} registrations with COMPLETED payment status`)
        
        let updatedCount = 0
        let errorCount = 0
        
        for (const registration of completedRegistrations) {
            try {
                // Check if corresponding CourseRegForm has the same status
                const courseRegForm = await db.collection('CourseRegForm').findOne({
                    registrationNumber: registration.registrationNumber
                })
                
                if (courseRegForm) {
                    if (courseRegForm.status !== PaymentStatus.COMPLETED) {
                        console.log(`🔄 Updating CourseRegForm for registration ${registration.registrationNumber} from ${courseRegForm.status} to COMPLETED`)
                        
                        await db.collection('CourseRegForm').updateMany(
                            { registrationNumber: registration.registrationNumber },
                            { $set: { status: PaymentStatus.COMPLETED } }
                        )
                        
                        updatedCount++
                    } else {
                        console.log(`✅ CourseRegForm for registration ${registration.registrationNumber} already has COMPLETED status`)
                    }
                } else {
                    console.log(`⚠️ No CourseRegForm found for registration ${registration.registrationNumber}`)
                }
            } catch (error) {
                console.error(`❌ Error processing registration ${registration.registrationNumber}:`, error)
                errorCount++
            }
        }
        
        console.log('\n📈 Summary:')
        console.log(`✅ Successfully updated: ${updatedCount} CourseRegForm records`)
        console.log(`❌ Errors encountered: ${errorCount}`)
        console.log(`📊 Total registrations processed: ${completedRegistrations.length}`)
        
        // Also check for CourseRegForm records with COMPLETED status but PENDING payment status in Registration
        console.log('\n🔍 Checking for CourseRegForm records with COMPLETED status...')
        
        const completedCourseRegForms = await db.collection('CourseRegForm').find({
            status: PaymentStatus.COMPLETED
        }).toArray()
        
        console.log(`📊 Found ${completedCourseRegForms.length} CourseRegForm records with COMPLETED status`)
        
        let regUpdatedCount = 0
        
        for (const courseRegForm of completedCourseRegForms) {
            try {
                const registration = await db.collection('Registration').findOne({
                    registrationNumber: courseRegForm.registrationNumber
                })
                
                if (registration && registration.paymentStatus !== PaymentStatus.COMPLETED) {
                    console.log(`🔄 Updating Registration paymentStatus for ${courseRegForm.registrationNumber} from ${registration.paymentStatus} to COMPLETED`)
                    
                    await db.collection('Registration').updateMany(
                        { registrationNumber: courseRegForm.registrationNumber },
                        { $set: { paymentStatus: PaymentStatus.COMPLETED } }
                    )
                    
                    regUpdatedCount++
                }
            } catch (error) {
                console.error(`❌ Error processing CourseRegForm ${courseRegForm.registrationNumber}:`, error)
            }
        }
        
        console.log(`✅ Successfully updated: ${regUpdatedCount} Registration paymentStatus records`)
        
    } catch (error) {
        console.error('❌ Error in fixPaymentStatus:', error)
    } finally {
        process.exit(0)
    }
}

fixPaymentStatus() 