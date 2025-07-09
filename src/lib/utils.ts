import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to check if a string is a valid MongoDB ObjectId
// without importing MongoDB on the client side
export function isValidObjectId(id: string | null | undefined): boolean {
  if (!id) return false
  // ObjectId is a 24-character hex string
  return /^[a-f\d]{24}$/i.test(id)
}
