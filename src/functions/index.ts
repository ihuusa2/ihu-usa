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
