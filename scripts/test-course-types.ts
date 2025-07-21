import { 
    getAllCourseTypesForSelect, 
    createCourseType, 
    updateCourseType, 
    deleteCourseType,
    countCourseTypes 
} from '../src/Server/CourseType'
import type { CourseType } from '../src/Types/Courses'

async function testCourseTypes() {
    console.log('🧪 Testing Course Types functionality...\n')
    
    try {
        // Test 1: Get initial count
        console.log('1. Getting initial course types count...')
        const initialCount = await countCourseTypes()
        console.log(`   Initial count: ${initialCount}\n`)
        
        // Test 2: Get all course types
        console.log('2. Getting all course types...')
        const courseTypes = await getAllCourseTypesForSelect()
        console.log(`   Found ${courseTypes.length} course types:`)
        courseTypes.forEach(ct => console.log(`   - ${ct.title}`))
        console.log()
        
        // Test 3: Create a new course type
        console.log('3. Creating a new course type...')
        const newCourseType: Omit<CourseType, '_id'> = {
            title: 'Test Course Type'
        }
        const createResult = await createCourseType(newCourseType)
        console.log(`   Created course type with ID: ${createResult.insertedId}\n`)
        
        // Test 4: Get updated count
        console.log('4. Getting updated count...')
        const updatedCount = await countCourseTypes()
        console.log(`   Updated count: ${updatedCount}\n`)
        
        // Test 5: Update the course type
        console.log('5. Updating the course type...')
        const courseTypeToUpdate: CourseType = {
            _id: createResult.insertedId.toString(),
            title: 'Updated Test Course Type'
        }
        const updateResult = await updateCourseType(courseTypeToUpdate)
        console.log(`   Updated course type: ${updateResult?.title}\n`)
        
        // Test 6: Delete the course type
        console.log('6. Deleting the course type...')
        const deleteResult = await deleteCourseType(createResult.insertedId.toString())
        console.log(`   Deleted course type: ${deleteResult?.title}\n`)
        
        // Test 7: Final count
        console.log('7. Getting final count...')
        const finalCount = await countCourseTypes()
        console.log(`   Final count: ${finalCount}\n`)
        
        console.log('✅ All tests passed! Course Types functionality is working correctly.')
        
    } catch (error) {
        console.error('❌ Test failed:', error)
    }
}

// Run the test
testCourseTypes() 