import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type PressableProps,
} from 'react-native';

import { BorderRadius, Spacing } from '../config/theme';
import { useThemeColor } from '../hooks/use-theme-color';

import { ThemedText } from './themed-text';

export type ButtonVariant = 'primary' | 'secondary' | 'link';

export type ButtonProps = PressableProps & {
  variant?: ButtonVariant;
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export function Button({
  variant = 'primary',
  title,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const isLink = variant === 'link';
  const primaryBg = useThemeColor({}, 'primary');
  const primaryContrast = useThemeColor({}, 'primaryContrast');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && { backgroundColor: primaryBg },
        variant === 'secondary' && {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: primaryBg,
        },
        isLink && styles.link,
        pressed && !disabled && !isLink && styles.pressed,
        disabled && styles.disabled,
      ]}
      disabled={disabled}
      accessibilityRole="button"
      {...rest}
    >
      <ThemedText
        type={isLink ? 'link' : 'defaultSemiBold'}
        style={[
          styles.label,
          variant === 'primary' && { color: primaryContrast },
          (variant === 'secondary' || isLink) && { color: primaryBg },
          isLink && styles.labelLink,
        ]}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    minHeight: 52,
    borderRadius: BorderRadius.lg,
  },
  link: {
    backgroundColor: 'transparent',
    minHeight: undefined,
    paddingVertical: Spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
  },
  labelLink: {
    fontWeight: '400',
  },
});
