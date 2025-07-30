export const getNumberSuffix = (index: number) => {
    const j = index % 10,
        k = index % 100;
    if (j === 1 && k !== 11) {
        return `${index}st`;
    }
    if (j === 2 && k !== 12) {
        return `${index}nd`;
    }
    if (j === 3 && k !== 13) {
        return `${index}rd`;
    }
    return `${index}th`;
};

export const createSlug = (text: string) => {


    return text
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export function generateCode() {
    // Generate a random number between 0 and 99999
    const randomNum = Math.floor(Math.random() * 100000);

    // Convert the number to a string and pad it with leading zeros if necessary
    const randomCode = randomNum.toString().padStart(6, '0');

    return randomCode;
}

/**
 * Generate a URL-safe slug from a title
 * @param title - The title to convert to slug
 * @returns A clean, URL-safe slug
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending numbers if slug already exists
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export const generateUniqueSlug = (baseSlug: string, existingSlugs: string[]): string => {
  let uniqueSlug = baseSlug
  let counter = 1
  
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`
    counter++
  }
  
  return uniqueSlug
}

/**
 * Generate a registration number in format IHUYYXXXXX
 * @param year - The year for the registration (defaults to current year)
 * @param sequenceNumber - The sequence number starting from 1176 (defaults to 1176)
 * @returns A registration number in format IHU2501176
 */
export const generateRegistrationNumber = (year: number = new Date().getFullYear(), sequenceNumber: number = 1176): string => {
  const yearSuffix = String(year).slice(-2) // Get last 2 digits of year
  const sequence = String(sequenceNumber).padStart(5, '0') // Ensure 5-digit format
  
  return `IHU${yearSuffix}${sequence}`
}

/**
 * Get the next available registration number for a given year
 * @param year - The year for the registration (defaults to current year)
 * @param existingNumbers - Array of existing registration numbers to check against
 * @returns The next available registration number
 */
export const getNextRegistrationNumber = (year: number = new Date().getFullYear(), existingNumbers: string[] = []): string => {
  // Find the highest sequence number across ALL years (not just current year)
  let maxSequence = 1175 // Start from 1175 so next will be 1176
  
  existingNumbers.forEach(number => {
    if (number.startsWith('IHU')) {
      const sequence = parseInt(number.slice(5), 10) // Extract the 5-digit sequence
      if (sequence > maxSequence) {
        maxSequence = sequence
      }
    }
  })
  
  const nextSequence = maxSequence + 1
  return generateRegistrationNumber(year, nextSequence)
}
