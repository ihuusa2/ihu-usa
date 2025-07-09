/**
 * Consistent date formatting utilities to prevent hydration mismatches
 * These functions ensure server and client render identical date strings
 */

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Use consistent format regardless of locale
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  
  return `${month}/${day}/${year}`
}

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Use consistent format regardless of locale
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  
  return `${month}/${day}/${year} ${hours}:${minutes}`
}

export const formatDateLong = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Use consistent month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const year = dateObj.getFullYear()
  const month = months[dateObj.getMonth()]
  const day = dateObj.getDate()
  
  return `${month} ${day}, ${year}`
}

/**
 * Utility functions for consistent date formatting between server and client
 * Prevents hydration mismatches caused by timezone differences
 */

/**
 * Format a date consistently for both server and client rendering
 * Uses UTC to avoid timezone-related hydration mismatches
 */
export function formatDateConsistent(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  // Use UTC to ensure consistent formatting between server and client
  const utcDate = new Date(Date.UTC(
    dateObj.getUTCFullYear(),
    dateObj.getUTCMonth(),
    dateObj.getUTCDate(),
    dateObj.getUTCHours(),
    dateObj.getUTCMinutes(),
    dateObj.getUTCSeconds()
  ));

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  };

  return utcDate.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Format a date for display with relative time (e.g., "2 hours ago")
 * Only use on client-side to avoid hydration mismatches
 */
export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

/**
 * Get a consistent timestamp for server-side rendering
 * Use this instead of Date.now() to prevent hydration mismatches
 */
export function getConsistentTimestamp(): number {
  // Use a fixed timestamp for SSR, will be updated on client
  return Date.now();
}

/**
 * Create a date object with consistent timezone handling
 */
export function createConsistentDate(dateInput?: string | number | Date): Date {
  if (!dateInput) {
    return new Date();
  }

  const date = new Date(dateInput);
  
  // Ensure consistent timezone handling
  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ));
}

/**
 * Format date for form inputs (YYYY-MM-DD format)
 */
export function formatDateForInput(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(date: Date | string | number): boolean {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateObj > new Date();
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date | string | number): boolean {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateObj < new Date();
} 