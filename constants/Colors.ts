// constants/Colors.ts

/**
 * A centralized place for the application's color palette.
 * This makes it easier to maintain a consistent look and feel
 * and to implement themes in the future.
 */
export const Colors = {
  primary: '#FF6B6B',      // Main accent color for buttons, icons, etc.
  primaryLight: '#FF8E8E', // Lighter shade of primary for highlights
  
  alert: '#FF3B30',         // Critical alerts, errors, and warnings
  alertBackground: '#FFEBEA', // Background for alert messages

  success: '#34C759',      // Success indicators
  
  background: '#F0F2F5',    // Main background color for screens
  card: '#FFFFFF',          // Background color for card components
  
  text: '#1C1C1E',          // Primary text color
  textSecondary: '#6E6E73', // Secondary text, subtitles, captions
  textLight: '#FFFFFF',     // Text color for dark backgrounds

  border: '#D1D1D6',       // Borders and dividers
  
  // Grayscale
  black: '#000000',
  white: '#FFFFFF',
  gray: '#8E8E93',
  lightGray: '#E5E5EA',
  darkGray: '#3A3A3C'
};

/**
 * Common layout values for padding, margins, and shadows.
 */
export const Layout = {
  padding: 16,
  margin: 16,
  borderRadius: 12,
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
};