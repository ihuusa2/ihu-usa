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
 * Generate a registration number in format IHUYYYYMMDDXXX
 * @param date - The date for the registration (defaults to current date)
 * @param sequenceNumber - The sequence number for the day (defaults to 1)
 * @returns A registration number in format IHU20250101
 */
export const generateRegistrationNumber = (date: Date = new Date(), sequenceNumber: number = 1): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const sequence = String(sequenceNumber).padStart(3, '0')
  
  return `IHU${year}${month}${day}${sequence}`
}

/**
 * Get the next available registration number for a given date
 * @param date - The date for the registration (defaults to current date)
 * @param existingNumbers - Array of existing registration numbers to check against
 * @returns The next available registration number
 */
export const getNextRegistrationNumber = (date: Date = new Date(), existingNumbers: string[] = []): string => {
  const baseNumber = generateRegistrationNumber(date, 1)
  const datePrefix = baseNumber.slice(0, 11) // IHU20250101
  
  // Find the highest sequence number for this date
  let maxSequence = 0
  existingNumbers.forEach(number => {
    if (number.startsWith(datePrefix)) {
      const sequence = parseInt(number.slice(11), 10)
      if (sequence > maxSequence) {
        maxSequence = sequence
      }
    }
  })
  
  return generateRegistrationNumber(date, maxSequence + 1)
}
