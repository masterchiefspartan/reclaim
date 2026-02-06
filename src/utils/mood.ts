/**
 * Mood Utilities - Helper functions for mood-related operations
 *
 * Centralizes mood logic to ensure consistency across the app.
 */

import { moodEmojis, moodColors } from '@/theme/brandKit';
import type { MoodLevel } from '@/types/journal';

/**
 * Valid mood types that have emojis defined
 */
export type MoodWithEmoji = keyof typeof moodEmojis;

/**
 * Get the emoji for a mood level
 * @param mood - The mood level
 * @param fallback - Fallback emoji if mood is invalid (default: '📝')
 * @returns The corresponding emoji
 */
export const getMoodEmoji = (mood?: MoodLevel | string | null, fallback = '📝'): string => {
  if (!mood) return fallback;

  const emoji = moodEmojis[mood as MoodWithEmoji];
  return emoji || fallback;
};

/**
 * Get the color for a mood level
 * @param mood - The mood level
 * @param variant - 'main' or 'light' color variant
 * @returns The color hex string or undefined if not found
 */
export const getMoodColor = (
  mood?: MoodLevel | string | null,
  variant: 'main' | 'light' = 'main'
): string | undefined => {
  if (!mood) return undefined;

  const moodData = moodColors[mood as keyof typeof moodColors];
  return moodData?.[variant];
};

/**
 * Get both emoji and label for a mood
 * @param mood - The mood level
 * @returns Object with emoji and label, or defaults if mood is invalid
 */
export const getMoodDisplay = (
  mood?: MoodLevel | string | null
): { emoji: string; label: string } => {
  if (!mood) {
    return { emoji: '📝', label: 'No mood' };
  }

  const moodData = moodColors[mood as keyof typeof moodColors];
  if (moodData) {
    return {
      emoji: moodEmojis[mood as MoodWithEmoji] || '📝',
      label: moodData.label,
    };
  }

  // Capitalize first letter as fallback label
  return {
    emoji: '📝',
    label: mood.charAt(0).toUpperCase() + mood.slice(1),
  };
};

/**
 * Get all available moods with their display data
 * @returns Array of mood objects with value, emoji, label, and color
 */
export const getAllMoods = () => {
  return Object.entries(moodColors).map(([value, data]) => ({
    value: value as MoodLevel,
    emoji: moodEmojis[value as MoodWithEmoji] || '📝',
    label: data.label,
    color: data.main,
    lightColor: data.light,
  }));
};

/**
 * Check if a string is a valid mood level
 * @param value - String to check
 * @returns Whether the value is a valid mood
 */
export const isValidMood = (value: string): value is MoodLevel => {
  return value in moodColors;
};
