// Helper function to validate and get image URL
export const getValidImageUrl = (image: string | File | undefined | null): string => {
  // If image is undefined, null, or empty string, return fallback
  if (!image || (typeof image === 'string' && image.trim() === '')) {
    return '/Images/Programs/image1.png';
  }
  
  if (typeof image === 'string') {
    const trimmed = image.trim();
    
    // If it's already a valid URL or relative path, return as is
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
      return trimmed;
    }
    
    // If it's a Cloudinary URL (common case for uploaded images)
    if (trimmed.includes('cloudinary.com')) {
      return trimmed;
    }
    
    // If it's just a filename without path, assume it's in the public folder
    if (!trimmed.includes('/') && !trimmed.includes('\\')) {
      return `/${trimmed}`;
    }
    
    // If it's a relative path without leading slash, add it
    if (!trimmed.startsWith('/')) {
      return `/${trimmed}`;
    }
    
    // If none of the above, return fallback
    return '/Images/Programs/image1.png';
  }
  
  // If it's a File object, this shouldn't happen at this point
  // Return fallback image
  return '/Images/Programs/image1.png';
} 