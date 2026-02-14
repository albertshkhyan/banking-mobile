import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';

import { BorderRadius, Spacing } from '../config/theme';
import { useThemeColor } from '../hooks/use-theme-color';

import { ThemedText } from './themed-text';

export type ButtonVariant =
  | 'primary'
  | 'primaryInverted'
  | 'secondary'
  | 'secondaryFilled'
  | 'link';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  variant?: ButtonVariant;
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  /** Optional style applied to the label text (e.g. link color on gradient) */
  labelStyle?: StyleProp<TextStyle>;
};

export function Button({
  variant = 'primary',
  title,
  style,
  disabled,
  labelStyle,
  ...rest
}: ButtonProps) {
  const isLink = variant === 'link';
  const primaryBg = useThemeColor({}, 'primary');
  const primaryContrast = useThemeColor({}, 'primaryContrast');
  const surface = useThemeColor({}, 'surface');
  const gradientEnd = useThemeColor({}, 'gradientEnd');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && { backgroundColor: primaryBg },
        variant === 'primaryInverted' && { backgroundColor: surface },
        variant === 'secondary' && {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: primaryBg,
        },
        variant === 'secondaryFilled' && { backgroundColor: gradientEnd },
        isLink && styles.link,
        pressed && !disabled && !isLink && styles.pressed,
        disabled && styles.disabled,
      ]}
      disabled={disabled}
      accessibilityRole="button"
      {...rest}
    >
      <ThemedText
        type={isLink ? 'link' : 'buttonLabel'}
        style={[
          variant === 'primary' && { color: primaryContrast },
          variant === 'primaryInverted' && { color: primaryBg },
          variant === 'secondary' && { color: primaryBg },
          variant === 'secondaryFilled' && { color: primaryContrast },
          isLink && styles.labelLink,
          labelStyle as StyleProp<TextStyle>,
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
  labelLink: {
    fontWeight: '400',
  },
});
