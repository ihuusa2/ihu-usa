// Helper function to validate and get image URL
export const getValidImageUrl = (image: string | File | undefined | null): string => {
  // If image is a string and not empty
  if (typeof image === 'string' && image.trim() !== '') {
    // Check if it's a full URL or relative path
    if (image.startsWith('http') || image.startsWith('/')) {
      return image;
    }
    // If it's a relative path without leading slash, add it
    return `/${image}`;
  }
  
  // Return fallback image
  return '/Images/Programs/image1.png';
} 