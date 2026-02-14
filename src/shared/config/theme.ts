/**
 * Banking Mobile design tokens from Figma (Banking-Mobile).
 * Use for consistent spacing, radius, typography, and colors.
 */

/** Primary brand blue (buttons, links, accents) */
const primary = '#1E3A5F';
const primaryLight = '#2E5A8F';

/** Landing gradient */
const gradientStart = '#1A2F4A';
const gradientEnd = '#2D5A87';

export const Colors = {
  light: {
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    primary,
    primaryContrast: '#FFFFFF',
    border: '#E5E7EB',
    placeholder: '#9CA3AF',
    icon: '#4B5563',
    link: primary,
    tint: primary,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: primary,
    tabBarActivePill: '#F3F4F6',
    /** Landing screen */
    gradientStart,
    gradientEnd,
    landingCardBg: '#E8F0F7',
    landingIconBg: '#D1E3F0',
  },
  dark: {
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    background: '#111827',
    surface: '#1F2937',
    primary: primaryLight,
    primaryContrast: '#FFFFFF',
    border: '#374151',
    placeholder: '#6B7280',
    icon: '#D1D5DB',
    link: '#60A5FA',
    tint: primaryLight,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: primaryLight,
    tabBarActivePill: '#374151',
    gradientStart: '#0F172A',
    gradientEnd: '#1E3A5F',
    landingCardBg: '#1E293B',
    landingIconBg: '#334155',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const Typography = {
  screenTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  link: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
} as const;
