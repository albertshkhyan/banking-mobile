import { StyleSheet, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColor } from '../hooks/use-theme-color';

/**
 * Full-screen linear gradient background for welcome/landing screens.
 * Uses theme gradientStart and gradientEnd (#1A3C8B → #0891B2).
 */
export function GradientView({ style, ...rest }: ViewProps) {
  const start = useThemeColor({}, 'gradientStart');
  const end = useThemeColor({}, 'gradientEnd');
  return (
    <LinearGradient
      colors={[start, end]}
      style={[StyleSheet.absoluteFill, style]}
      {...rest}
    />
  );
}
