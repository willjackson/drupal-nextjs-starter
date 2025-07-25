/**
 * Format a date string or Date object consistently between server and client
 * to avoid hydration mismatches
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) {
    return 'Date not available';
  }
  
  let date: Date;
  
  if (dateInput instanceof Date) {
    // If it's already a Date object, use it directly
    date = dateInput;
  } else {
    // Check if the string already contains time information
    if (dateInput.includes('T') || dateInput.includes(' ')) {
      // It's already a full date-time string, parse it directly
      date = new Date(dateInput);
    } else {
      // It's just a date (YYYY-MM-DD), add time to noon UTC to avoid timezone issues
      date = new Date(dateInput + 'T12:00:00Z');
    }
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.error('Invalid date format:', dateInput);
    return 'Invalid date';
  }
  
  // Use UTC methods to ensure consistent formatting
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  };
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get a short date format
 */
export function formatDateShort(dateInput: string | Date | null | undefined): string {
  if (!dateInput) {
    return 'N/A';
  }
  
  let date: Date;
  
  if (dateInput instanceof Date) {
    // If it's already a Date object, use it directly
    date = dateInput;
  } else {
    // Check if the string already contains time information
    if (dateInput.includes('T') || dateInput.includes(' ')) {
      // It's already a full date-time string, parse it directly
      date = new Date(dateInput);
    } else {
      // It's just a date (YYYY-MM-DD), add time to noon UTC to avoid timezone issues
      date = new Date(dateInput + 'T12:00:00Z');
    }
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.error('Invalid date format:', dateInput);
    return 'N/A';
  }
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  };
  
  return date.toLocaleDateString('en-US', options);
}
