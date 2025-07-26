# Flyers Management Feature

## Overview
The Flyers Management feature allows administrators to create, manage, and display promotional flyers on the home screen. This feature provides a comprehensive admin interface for managing flyers with advanced scheduling and display options.

## Features

### Admin Panel Features
- **Add New Flyers**: Upload flyer images with titles, descriptions, and links
- **Edit Flyers**: Modify existing flyer content and settings
- **Delete Flyers**: Remove flyers from the system
- **Active/Inactive Status**: Toggle flyer visibility
- **Display Order**: Control the order in which flyers appear
- **Date Scheduling**: Set start and end dates for flyer display
- **Statistics Dashboard**: View flyer analytics and counts

### Home Screen Display
- **Carousel Interface**: Automatic rotation of active flyers
- **Responsive Design**: Optimized for all device sizes
- **Interactive Navigation**: Manual controls and dot indicators
- **Link Integration**: Clickable flyers that redirect to specified URLs
- **Auto-advance**: Automatic slide transitions every 5 seconds

## File Structure

```
src/
├── Types/
│   └── Gallery.ts              # Flyers type definition
├── Server/
│   └── Flyers.ts              # Server-side CRUD operations
├── app/
│   ├── admin/
│   │   ├── (Media)/
│   │   │   └── Flyers/
│   │   │       └── page.tsx   # Admin flyers management page
│   │   └── components/
│   │       └── AddFlyer.tsx   # Add/Edit flyer form component
│   └── api/
│       └── flyers/
│           └── route.ts       # API endpoint for flyers
└── components/
    └── Flyers.tsx             # Home screen flyers display component
```

## Database Schema

The flyers are stored in a MongoDB collection with the following structure:

```typescript
interface Flyers {
  _id?: ObjectId | string
  title: string              // Flyer title
  description: string        // Flyer description
  image: File | string       // Flyer image URL
  link: string              // Optional link URL
  isActive: boolean         // Display status
  displayOrder: number      // Display order (lower numbers first)
  startDate?: Date         // Optional start date
  endDate?: Date           // Optional end date
}
```

## Usage

### For Administrators

1. **Access the Admin Panel**
   - Navigate to `/admin` and sign in with admin credentials
   - Click on "Flyers" in the sidebar navigation

2. **Add a New Flyer**
   - Click "Add New Flyer" button
   - Fill in the required information:
     - Title (required)
     - Description (optional)
     - Link URL (optional)
     - Upload flyer image
     - Set display order
     - Configure active status
     - Set start/end dates (optional)

3. **Manage Existing Flyers**
   - View all flyers in the table
   - Edit flyer details using the "Edit" button
   - Delete flyers using the "Delete" button
   - Toggle active status to control visibility

### For Users

1. **View Flyers on Home Page**
   - Flyers automatically appear on the home page
   - Only active flyers within their date range are displayed
   - Flyers are sorted by display order

2. **Interact with Flyers**
   - Use navigation arrows to manually browse flyers
   - Click on dots to jump to specific flyers
   - Click "Learn More" to visit the linked URL (if provided)

## API Endpoints

### GET /api/flyers
Returns all active flyers for display on the home page.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Sample Flyer",
      "description": "Sample description",
      "image": "https://...",
      "link": "https://...",
      "isActive": true,
      "displayOrder": 1,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T23:59:59.999Z"
    }
  ]
}
```

## Configuration

### Display Settings
- **Auto-advance**: Flyers automatically advance every 5 seconds
- **Transition Duration**: 700ms smooth transitions between flyers
- **Responsive Breakpoints**: Optimized for mobile, tablet, and desktop

### Admin Panel Settings
- **Pagination**: 10 flyers per page in admin table
- **Image Upload**: Supports all common image formats
- **Date Validation**: Ensures end date is after start date

## Security Features

- **Admin Authentication**: Only authenticated admins can manage flyers
- **Image Validation**: Server-side image format and size validation
- **XSS Protection**: Input sanitization for all user-provided content
- **CSRF Protection**: Built-in Next.js CSRF protection

## Performance Optimizations

- **Image Optimization**: Next.js Image component for optimized loading
- **Lazy Loading**: Images load only when needed
- **Caching**: Server-side caching for flyer data
- **Database Indexing**: Optimized queries for active flyers

## Troubleshooting

### Common Issues

1. **Flyers Not Displaying**
   - Check if flyers are marked as active
   - Verify current date is within start/end date range
   - Ensure flyer images are properly uploaded

2. **Admin Access Issues**
   - Verify user has admin role
   - Check authentication status
   - Ensure proper permissions

3. **Image Upload Problems**
   - Check file format (JPG, PNG, GIF supported)
   - Verify file size (max 10MB recommended)
   - Ensure stable internet connection

### Debug Information

- Check browser console for client-side errors
- Review server logs for backend issues
- Verify database connectivity
- Test API endpoints directly

## Future Enhancements

- **Analytics Dashboard**: Track flyer views and clicks
- **A/B Testing**: Test different flyer variations
- **Scheduled Publishing**: Advanced scheduling options
- **Template System**: Pre-designed flyer templates
- **Multi-language Support**: Internationalized flyer content
- **Mobile App Integration**: Native app flyer display 