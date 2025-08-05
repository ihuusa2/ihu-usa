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
 * @param sequenceNumber - The sequence number starting from 1177 (defaults to 1177)
 * @returns A registration number in format IHU2501177
 */
export const generateRegistrationNumber = (year: number = new Date().getFullYear(), sequenceNumber: number = 1177): string => {
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
  // ENFORCED START from IHU2501177 - ignore old high numbers, start fresh
  const startSequence = 1177;
  const maxValidSequence = 3000; // Lower limit to ignore old high numbers like 7222, 8000 etc.
  
  console.log('=== REGISTRATION NUMBER GENERATION (ENFORCED FRESH START) ===');
  console.log('Year:', year);
  console.log('Existing numbers to check:', existingNumbers);
  console.log('Enforcing fresh start from sequence:', startSequence);
  
  // If no existing numbers, start from IHU2501177
  if (!existingNumbers || existingNumbers.length === 0) {
    console.log('No existing numbers - starting from IHU2501177');
    return generateRegistrationNumber(year, startSequence);
  }
  
  // Filter to only NEW FORMAT numbers (IHUYYXXXXX where length after IHU is exactly 7)
  // ONLY accept numbers within our new sequence range (1177-9999) to ignore old high numbers
  const newFormatNumbers = existingNumbers
    .filter(num => {
      if (!num || !num.startsWith('IHU')) return false;
      const afterIHU = num.slice(3);
      if (afterIHU.length !== 7) return false; // Only new format: YY (2 digits) + XXXXX (5 digits)
      
      const sequenceNumber = parseInt(afterIHU.slice(2)); // Last 5 digits are sequence
      // ONLY accept numbers in our valid new range (1177-9999) to ignore old legacy high numbers
      return !isNaN(sequenceNumber) && sequenceNumber >= startSequence && sequenceNumber <= maxValidSequence;
    })
    .map(num => {
      const sequencePart = num.slice(3); // Remove 'IHU' prefix
      const yearPart = sequencePart.slice(0, 2); // First 2 digits are year
      const sequenceNumber = parseInt(sequencePart.slice(2)); // Last 5 digits are sequence
      return {
        fullNumber: num,
        year: parseInt(yearPart),
        sequence: sequenceNumber
      };
    })
    .filter(item => !isNaN(item.sequence) && !isNaN(item.year));
  
  console.log('Valid new format numbers (1177-9999 range only):', newFormatNumbers);
  
  if (newFormatNumbers.length === 0) {
    console.log('No valid new format numbers in range found - starting fresh from IHU2501177');
    return generateRegistrationNumber(year, startSequence);
  }
  
  // Find the highest sequence number from valid new format numbers (within our range)
  const highestSequence = Math.max(...newFormatNumbers.map(item => item.sequence));
  console.log('Highest valid sequence found in database:', highestSequence);
  
  // Next sequence is highest + 1, ensuring it's within our valid range
  const nextSequence = highestSequence + 1;
  console.log('Next sequence to use:', nextSequence);
  
  // Double-check we're still in valid range
  if (nextSequence > maxValidSequence) {
    throw new Error(`Registration sequence exceeded maximum allowed (${maxValidSequence}). Please contact administrator.`);
  }
  
  const result = generateRegistrationNumber(year, nextSequence);
  console.log('Generated registration number:', result);
  return result;

}

/**
 * Validate and parse a registration number
 * @param registrationNumber - The registration number to validate
 * @returns Parsed registration number details or null if invalid
 */
export const parseRegistrationNumber = (registrationNumber: string): { year: number; sequence: number; fullNumber: string } | null => {
  if (!registrationNumber || !registrationNumber.startsWith('IHU')) {
    return null;
  }
  
  try {
    const sequencePart = registrationNumber.slice(3); // Remove 'IHU' prefix
    if (sequencePart.length !== 7) { // Should be YYXXXXX (2 + 5 digits)
      return null;
    }
    
    const yearPart = sequencePart.slice(0, 2); // First 2 digits are year
    const sequencePart2 = sequencePart.slice(2); // Remaining 5 digits are sequence
    
    const year = parseInt(yearPart);
    const sequence = parseInt(sequencePart2);
    
    if (isNaN(year) || isNaN(sequence)) {
      return null;
    }
    
    return {
      year,
      sequence,
      fullNumber: registrationNumber
    };
  } catch {
    return null;
  }
};
