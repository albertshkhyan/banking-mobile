import { StyleSheet, type ViewProps } from 'react-native';

import { useThemeColor } from '../hooks/use-theme-color';

import { ThemedView } from './themed-view';

/**
 * Full-screen gradient background for landing/splash screens.
 * Uses theme gradientStart as solid fill. Install expo-linear-gradient for a real gradient.
 */
export function GradientView({ style, ...rest }: ViewProps) {
  const start = useThemeColor({}, 'gradientStart');
  return <ThemedView style={[StyleSheet.absoluteFill, { backgroundColor: start }, style]} {...rest} />;
}
