import { createCourseType } from '../src/Server/CourseType'
import type { CourseType } from '../src/Types/Courses'

const initialCourseTypes: Omit<CourseType, '_id'>[] = [
    { title: 'Certificate' },
    { title: 'Diploma' },
    { title: 'Bachelor' },
    { title: 'Master' },
    { title: 'PhD' },
    { title: 'Associate Degree' },
    { title: 'Professional Certificate' },
    { title: 'Short Course' }
]

async function seedCourseTypes() {
    console.log('🌱 Seeding course types...')
    
    try {
        for (const courseType of initialCourseTypes) {
            await createCourseType(courseType)
            console.log(`✅ Created course type: ${courseType.title}`)
        }
        
        console.log('🎉 Course types seeded successfully!')
    } catch (error) {
        console.error('❌ Error seeding course types:', error)
    }
}

// Run the seeding function
seedCourseTypes() 