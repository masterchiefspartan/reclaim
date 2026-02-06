/**
 * Formatters - Shared formatting utilities
 *
 * Centralized formatting functions to ensure consistency
 * and avoid duplication across the codebase.
 */

/**
 * Format seconds into MM:SS string
 * @param seconds - Total seconds to format
 * @returns Formatted string (e.g., "02:30")
 */
export const formatTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format seconds into M:SS string (no leading zero on minutes)
 * @param seconds - Total seconds to format
 * @returns Formatted string (e.g., "2:30")
 */
export const formatTimeCompact = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format milliseconds into a readable duration string
 * @param ms - Duration in milliseconds
 * @returns Formatted string (e.g., "2m 30s" or "45s")
 */
export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  if (mins === 0) {
    return `${secs}s`;
  }
  if (secs === 0) {
    return `${mins}m`;
  }
  return `${mins}m ${secs}s`;
};

/**
 * Format a Date into a readable date string
 * @param date - Date to format
 * @param format - Format style ('long', 'medium', 'short')
 * @returns Formatted date string
 */
export const formatDate = (date: Date, format: 'long' | 'medium' | 'short' = 'long'): string => {
  const formatOptions: Record<'long' | 'medium' | 'short', Intl.DateTimeFormatOptions> = {
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
  };

  return date.toLocaleDateString('en-US', formatOptions[format]);
};

/**
 * Format a Date into a time string
 * @param date - Date to format
 * @param use24Hour - Use 24-hour format (default: false)
 * @returns Formatted time string (e.g., "2:30 PM" or "14:30")
 */
export const formatTimeOfDay = (date: Date, use24Hour = false): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24Hour,
  });
};

/**
 * Format a Date into a relative time string
 * @param date - Date to format
 * @returns Relative time string (e.g., "2 hours ago", "Yesterday")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'Just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return formatDate(date, 'medium');
};

/**
 * Format a number with commas for thousands
 * @param num - Number to format
 * @returns Formatted number string (e.g., "1,234")
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

/**
 * Format a percentage
 * @param value - Value (0-1 or 0-100 depending on isDecimal)
 * @param isDecimal - Whether value is a decimal (0-1) or percentage (0-100)
 * @returns Formatted percentage string (e.g., "75%")
 */
export const formatPercentage = (value: number, isDecimal = true): string => {
  const percentage = isDecimal ? value * 100 : value;
  return `${Math.round(percentage)}%`;
};
