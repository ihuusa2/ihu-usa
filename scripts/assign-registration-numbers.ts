import { assignRegistrationNumbersToExisting } from '../src/Server/Registration'

async function main() {
    console.log('🚀 Starting registration number assignment for existing registrations...')
    
    try {
        const result = await assignRegistrationNumbersToExisting()
        
        if (result.success) {
            console.log(`✅ Successfully assigned registration numbers to ${result.count} registrations`)
            
            if (result.errors.length > 0) {
                console.log('⚠️ Some errors occurred:')
                result.errors.forEach(error => console.log(`   - ${error}`))
            }
        } else {
            console.log('❌ Failed to assign registration numbers')
            result.errors.forEach(error => console.log(`   - ${error}`))
        }
    } catch (error) {
        console.error('❌ Error running registration number assignment:', error)
    }
    
    console.log('🏁 Registration number assignment completed')
}

main() 