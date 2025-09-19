/**
 * Reusable Modal and Dialog Backdrop Styles
 * 
 * This file provides consistent backdrop styling for modals and dialogs
 * with enhanced contrast in dark mode and blur effects.
 */

import { Theme } from '@mui/material/styles';

/**
 * Enhanced backdrop styling for better contrast in dark mode
 * 
 * Usage:
 * ```tsx
 * <Dialog sx={enhancedBackdropStyles}>
 * 
 * // or for styled components:
 * const StyledModal = styled(Modal)(({ theme }) => ({
 *   ...enhancedBackdropStyles(theme),
 * }));
 * ```
 */
export const enhancedBackdropStyles = {
  '& .MuiBackdrop-root': {
    backgroundColor: (theme: Theme) => theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.8)' 
      : 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    transition: 'backdrop-filter 0.2s ease-in-out',
  },
};

/**
 * Strong backdrop for critical dialogs (e.g., delete confirmations)
 */
export const strongBackdropStyles = {
  '& .MuiBackdrop-root': {
    backgroundColor: (theme: Theme) => theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.9)' 
      : 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(6px)',
    transition: 'backdrop-filter 0.2s ease-in-out',
  },
};

/**
 * Light backdrop for search and info modals
 */
export const lightBackdropStyles = {
  '& .MuiBackdrop-root': {
    backgroundColor: (theme: Theme) => theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.7)' 
      : 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
    transition: 'backdrop-filter 0.2s ease-in-out',
  },
};

/**
 * Helper function to get backdrop styles based on modal type
 */
export const getBackdropStyles = (type: 'default' | 'strong' | 'light' = 'default') => {
  switch (type) {
    case 'strong':
      return strongBackdropStyles;
    case 'light':
      return lightBackdropStyles;
    default:
      return enhancedBackdropStyles;
  }
};

/**
 * Example usage:
 * 
 * ```tsx
 * // For regular modals
 * <Dialog sx={enhancedBackdropStyles}>
 * 
 * // For delete/critical actions
 * <Dialog sx={strongBackdropStyles}>
 * 
 * // For search/info modals
 * <Modal sx={lightBackdropStyles}>
 * 
 * // Dynamic usage
 * <Dialog sx={getBackdropStyles('strong')}>
 * ```
 */
