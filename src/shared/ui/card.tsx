import { StyleSheet, View, type ViewProps } from 'react-native';

import { BorderRadius, Spacing } from '../config/theme';
import { useThemeColor } from '../hooks/use-theme-color';

export type CardProps = ViewProps & {
  /** Use 'surface' for form screens, or pass custom (e.g. landingIconBg) */
  variant?: 'surface' | 'elevated';
};

export function Card({ style, variant = 'surface', ...rest }: CardProps) {
  const surface = useThemeColor({}, 'surface');
  const landingCardBg = useThemeColor({}, 'landingCardBg');
  const backgroundColor = variant === 'elevated' ? landingCardBg : surface;

  return (
    <View
      style={[styles.card, { backgroundColor }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
});
