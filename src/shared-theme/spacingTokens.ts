/**
 * Standardized Spacing Token System
 * 
 * This file defines consistent spacing values to be used throughout the application.
 * All spacing should use these tokens to ensure consistency and maintainability.
 * 
 * Based on 8px baseline grid system (Material Design standard)
 */

// Base unit (8px in Material UI theme.spacing(1))
export const SPACING_UNIT = 8;

/**
 * Layout Spacing Constants
 * Use these for major layout elements and containers
 */
export const LAYOUT_SPACING = {
  // Global page padding
  PAGE_PADDING_MOBILE: 2,    // 16px
  PAGE_PADDING_DESKTOP: 3,   // 24px
  
  // Navigation
  NAVBAR_HEIGHT: 64,         // 64px (fixed)
  NAVBAR_PADDING_MOBILE: 2,  // 16px
  NAVBAR_PADDING_DESKTOP: 3, // 24px
  SIDEBAR_WIDTH_EXPANDED: 240, // 240px
  SIDEBAR_WIDTH_COLLAPSED: 72, // 72px
  
  // Content areas
  SECTION_SPACING: 2,        // 16px between sections
  COLUMN_GAP: 3,            // 24px between columns
  CARD_PADDING: 3,          // 24px inside cards
} as const;

/**
 * Component Spacing Constants
 * Use these for individual UI components
 */
export const COMPONENT_SPACING = {
  // Interactive elements
  LIST_ITEM_HEIGHT: 48,      // 48px (minimum touch target)
  LIST_ITEM_PADDING: 3,      // 24px horizontal padding
  BUTTON_SPACING: 1,         // 8px between buttons
  
  // Form elements
  FORM_SPACING: 2,           // 16px between form fields
  FORM_SECTION_SPACING: 3,   // 24px between form sections
  
  // Modal and dialog
  MODAL_PADDING: 2,          // 16px outer padding
  MODAL_CONTENT_PADDING: 3,  // 24px inner padding
  MODAL_MAX_WIDTH: 600,      // 600px max width
  
  // DataGrid and tables
  DATAGRID_HEIGHT_MOBILE: 400,   // 400px on mobile
  DATAGRID_HEIGHT_TABLET: 500,   // 500px on tablet
  DATAGRID_HEIGHT_DESKTOP: 600,  // 600px on desktop
} as const;

/**
 * Z-Index Constants
 * Standardized z-index values for layering
 */
export const Z_INDEX = {
  BACKGROUND: -1,
  NORMAL: 0,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  NOTIFICATION: 1080,
} as const;

/**
 * Responsive Breakpoint Helpers
 * Use these for consistent responsive behavior
 */
export const RESPONSIVE_SPACING = {
  // Returns responsive padding object for MUI sx prop
  pagePadding: {
    px: { xs: LAYOUT_SPACING.PAGE_PADDING_MOBILE, sm: LAYOUT_SPACING.PAGE_PADDING_DESKTOP },
    py: { xs: LAYOUT_SPACING.PAGE_PADDING_MOBILE, sm: LAYOUT_SPACING.PAGE_PADDING_DESKTOP },
  },
  
  // Returns responsive navbar padding
  navbarPadding: {
    px: { xs: LAYOUT_SPACING.NAVBAR_PADDING_MOBILE, sm: LAYOUT_SPACING.NAVBAR_PADDING_DESKTOP },
  },
  
  // Returns responsive DataGrid height
  datagridHeight: {
    height: {
      xs: COMPONENT_SPACING.DATAGRID_HEIGHT_MOBILE,
      sm: COMPONENT_SPACING.DATAGRID_HEIGHT_TABLET,
      md: COMPONENT_SPACING.DATAGRID_HEIGHT_DESKTOP,
    },
  },
} as const;

/**
 * Usage Examples:
 * 
 * // Layout spacing
 * <Box sx={{ px: RESPONSIVE_SPACING.pagePadding.px }}>
 * 
 * // Component spacing
 * <Stack spacing={LAYOUT_SPACING.SECTION_SPACING}>
 * 
 * // Custom spacing calculation
 * <Box sx={{ mb: COMPONENT_SPACING.FORM_SPACING }}>
 * 
 * // Z-index
 * <Modal sx={{ zIndex: Z_INDEX.MODAL }}>
 */

export type LayoutSpacing = typeof LAYOUT_SPACING;
export type ComponentSpacing = typeof COMPONENT_SPACING;
export type ZIndex = typeof Z_INDEX;
export type ResponsiveSpacing = typeof RESPONSIVE_SPACING;
