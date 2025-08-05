// Simple counter to track registration numbers starting from IHU2501177
let registrationCounter = 1177; // Start from 1177

/**
 * Get the next registration number in sequence
 * This ensures we get IHU2501177, IHU2501178, IHU2501179, etc.
 */
export const getNextSequentialRegistrationNumber = (year: number = new Date().getFullYear()): string => {
  const yearSuffix = String(year).slice(-2); // Get last 2 digits of year
  const sequence = String(registrationCounter).padStart(5, '0'); // Ensure 5-digit format
  
  const registrationNumber = `IHU${yearSuffix}${sequence}`;
  
  // Increment counter for next registration
  registrationCounter++;
  
  console.log(`Generated registration number: ${registrationNumber} (next will be ${registrationCounter})`);
  
  return registrationNumber;
};

/**
 * Reset the counter (for testing purposes)
 */
export const resetRegistrationCounter = (startFrom: number = 1177) => {
  registrationCounter = startFrom;
  console.log(`Registration counter reset to ${startFrom}`);
};

/**
 * Get current counter value
 */
export const getCurrentCounter = () => registrationCounter;