# Carousel Management Feature

## Overview
The carousel management feature allows administrators to manage hero carousel images for the home page through the admin panel. This replaces the previously hardcoded carousel images with a dynamic, database-driven system.

## Features

### Admin Panel Access
- **Location**: `/admin/Carousel`
- **Access**: Admin users only
- **Navigation**: Available in the admin sidebar under "Media" section

### Functionality
1. **View All Carousel Images**: See all carousel images with their details
2. **Add New Images**: Upload and configure new carousel images
3. **Edit Existing Images**: Modify image details, titles, descriptions, and settings
4. **Delete Images**: Remove carousel images from the system
5. **Active/Inactive Toggle**: Control which images appear on the home page
6. **Display Order**: Set the order in which images appear in the carousel
7. **Image Preview**: View uploaded images before saving

### Image Requirements
- **File Types**: JPG, PNG, GIF, WebP
- **Maximum Size**: 5MB
- **Recommended Dimensions**: 1920x1080 pixels or similar aspect ratio
- **Upload Method**: Cloudinary integration for optimized storage

### Data Structure
Each carousel image includes:
- `src`: Image URL (uploaded to Cloudinary)
- `alt`: Alt text for accessibility and SEO
- `title`: Optional title for the image
- `description`: Optional description
- `isActive`: Boolean to show/hide the image
- `displayOrder`: Integer to control display order
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

## Technical Implementation

### Database
- **Collection**: `CarouselImages`
- **Database**: MongoDB
- **Indexing**: Sorted by `displayOrder` and `createdAt`

### Server Functions (`src/Server/Carousel.ts`)
- `createCarouselImage()`: Add new carousel image
- `getAllCarouselImages()`: Get all images (admin view)
- `getActiveCarouselImages()`: Get only active images (frontend)
- `updateCarouselImage()`: Update existing image
- `deleteCarouselImage()`: Remove image
- `updateCarouselImageOrder()`: Change display order
- `toggleCarouselImageStatus()`: Activate/deactivate image

### Frontend Components
- **Admin Page**: `src/app/admin/(Media)/Carousel/page.tsx`
- **Add/Edit Component**: `src/app/admin/components/AddCarouselImage.tsx`
- **Type Definition**: `src/Types/Carousel.ts`

### Home Page Integration
- **Dynamic Loading**: Carousel images are fetched from database
- **Fallback**: If no images are found, carousel is hidden
- **Performance**: Only active images are loaded for the frontend

## Usage Instructions

### For Administrators

1. **Access the Admin Panel**
   - Log in with admin credentials
   - Navigate to `/admin`
   - Click on "Carousel" in the sidebar

2. **Add New Carousel Image**
   - Click "Add New Image" button
   - Fill in required fields:
     - Alt Text (required)
     - Title (optional)
     - Description (optional)
   - Upload an image file
   - Set display order and active status
   - Click "Add Carousel Image"

3. **Edit Existing Image**
   - Click "Edit" button next to any image
   - Modify fields as needed
   - Click "Update Carousel Image"

4. **Manage Display Order**
   - Images are displayed in order of `displayOrder` field
   - Lower numbers appear first
   - Edit the display order in the edit form

5. **Activate/Deactivate Images**
   - Use the toggle switch in the edit form
   - Only active images appear on the home page

### For Developers

#### Seeding Initial Data
To populate the database with initial carousel images:

```bash
# Make a POST request to the seed endpoint
curl -X POST http://localhost:3000/api/seed-carousel
```

#### Adding New Features
1. Update the `CarouselImage` type in `src/Types/Carousel.ts`
2. Add corresponding server functions in `src/Server/Carousel.ts`
3. Update the admin components to handle new fields
4. Test the integration on the home page

## Migration from Hardcoded Images

The system has been migrated from hardcoded carousel images in `HomeClientNew.tsx` to a dynamic database-driven system:

### Before
```typescript
const carouselImages = [
  {
    src: '/Images/Banners/banner1.jpeg',
    alt: 'International Hindu University Banner 1',
    title: 'Where Ancient Wisdom Meets Modern Education',
    description: 'Discover the perfect blend...'
  },
  // ... more hardcoded images
];
```

### After
```typescript
// Images are fetched from database
const carouselImages: CarouselImage[] = await getActiveCarouselImages()
```

## Benefits

1. **Dynamic Content**: Admins can update carousel without code changes
2. **Better Performance**: Only active images are loaded
3. **SEO Friendly**: Proper alt text and metadata management
4. **Accessibility**: Screen reader support through alt text
5. **Scalable**: Easy to add more images or modify existing ones
6. **User-Friendly**: Intuitive admin interface for non-technical users

## Security Considerations

- Admin-only access to carousel management
- File upload validation (type and size)
- Cloudinary integration for secure image storage
- Input sanitization for text fields
- Proper error handling and user feedback

## Future Enhancements

1. **Bulk Operations**: Select multiple images for batch actions
2. **Image Optimization**: Automatic resizing and compression
3. **Scheduling**: Set start/end dates for carousel images
4. **Analytics**: Track carousel performance and engagement
5. **A/B Testing**: Test different carousel configurations
6. **Mobile Optimization**: Different images for mobile devices 