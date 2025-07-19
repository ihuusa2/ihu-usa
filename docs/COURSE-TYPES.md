# Course Types Management

## Overview

The Course Types feature allows administrators to manage different types of courses offered by the International Hindu University. This feature provides a centralized way to manage course types that are used across various forms and course management interfaces.

## Features

### Admin Panel Integration
- **Navigation**: Course Types section is accessible from the admin sidebar under "Course Types"
- **Location**: `/admin/Courses/CourseType`
- **CRUD Operations**: Create, Read, Update, Delete course types
- **Real-time Updates**: Changes reflect immediately across all forms

### Dynamic Form Integration
Course types are dynamically loaded in the following forms:
- Admin Registration Form (`/admin/Registrations/Add`)
- Public Registration Form (`/Registration-Form`)
- Mobile Signup Form (`/Mobile-Signup`)
- Course Creation Form (`/admin/Courses/Add`)

## Database Schema

### CourseType Collection
```typescript
interface CourseType {
    _id?: ObjectId | string
    title: string
}
```

## API Endpoints

### Server Functions (src/Server/CourseType.ts)
- `getAllCourseTypesForSelect()` - Get all course types for dropdowns
- `getAllCourseTypes()` - Get paginated course types with search
- `createCourseType()` - Create new course type
- `updateCourseType()` - Update existing course type
- `deleteCourseType()` - Delete course type
- `getCourseTypeById()` - Get single course type by ID
- `countCourseTypes()` - Get total count of course types

## Usage

### Adding Course Types
1. Navigate to Admin Panel → Course Types
2. Click "Add Course Type" button
3. Enter the course type title
4. Click "Create" to save

### Editing Course Types
1. In the Course Types list, click "Edit" button
2. Modify the title
3. Click "Update" to save changes

### Deleting Course Types
1. In the Course Types list, click "Delete" button
2. Confirm deletion in the popup dialog

### Seeding Initial Data
Run the seeding script to populate initial course types:
```bash
npx tsx scripts/seed-course-types.ts
```

## Benefits

1. **Centralized Management**: All course types managed from one location
2. **Consistency**: Ensures consistent course type names across all forms
3. **Flexibility**: Easy to add, modify, or remove course types without code changes
4. **Real-time Updates**: Changes immediately reflect in all forms
5. **Data Integrity**: Prevents typos and ensures standardized course type names

## Technical Implementation

### Components
- `src/app/admin/Courses/CourseType/page.tsx` - Main course types management page
- `src/app/admin/components/AddCourseType.tsx` - Add/Edit course type modal component

### Integration Points
- Admin sidebar navigation
- Registration forms (admin, public, mobile)
- Course creation form
- Database operations via MongoDB

### State Management
- Course types are fetched on component mount
- Real-time updates using React state
- Optimistic updates for better UX

## Future Enhancements

Potential improvements for the Course Types feature:
1. **Description Field**: Add description for each course type
2. **Active/Inactive Status**: Enable/disable course types
3. **Sorting**: Add drag-and-drop reordering
4. **Bulk Operations**: Import/export course types
5. **Audit Trail**: Track who created/modified course types
6. **Validation**: Prevent deletion of course types in use 