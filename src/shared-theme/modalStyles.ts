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
// Uniform backdrop: lighter gray at 80% opacity for all modals
const UNIFORM_BACKDROP = 'rgba(128, 128, 128, 0.8)';

export const enhancedBackdropStyles = {
  '& .MuiBackdrop-root': {
    backgroundColor: UNIFORM_BACKDROP,
    backdropFilter: 'blur(4px)',
    transition: 'backdrop-filter 0.2s ease-in-out',
  },
};

/**
 * Strong backdrop for critical dialogs (e.g., delete confirmations)
 * Uses same gray 80% overlay but slightly stronger blur for emphasis
 */
export const strongBackdropStyles = {
  '& .MuiBackdrop-root': {
    backgroundColor: UNIFORM_BACKDROP,
    backdropFilter: 'blur(6px)',
    transition: 'backdrop-filter 0.2s ease-in-out',
  },
};

/**
 * Light backdrop for search and info modals
 * Also uses uniform gray 80% overlay to meet the requested spec
 */
export const lightBackdropStyles = {
  '& .MuiBackdrop-root': {
    backgroundColor: UNIFORM_BACKDROP,
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
