import {
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
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
  /** Optional icon to show to the left of the title (e.g. fingerprint) */
  leftIcon?: React.ReactNode;
};

export function Button({
  variant = 'primary',
  title,
  style,
  disabled,
  labelStyle,
  leftIcon,
  ...rest
}: ButtonProps) {
  const isLink = variant === 'link';
  const primaryBg = useThemeColor({}, 'primary');
  const primaryContrast = useThemeColor({}, 'primaryContrast');
  const surface = useThemeColor({}, 'surface');
  const gradientEnd = useThemeColor({}, 'gradientEnd');
  return (
    <Pressable
      style={({ pressed }) =>
        [
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
          leftIcon && styles.baseWithIcon,
          pressed && !disabled && !isLink && styles.pressed,
          disabled && styles.disabled,
        ].filter(Boolean) as StyleProp<ViewStyle>
      }
      disabled={disabled}
      accessibilityRole="button"
      {...rest}
    >
      {leftIcon ? (
        <View style={styles.labelRow}>
          <View style={styles.iconWrap}>{leftIcon}</View>
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
        </View>
      ) : (
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
      )}
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
  baseWithIcon: {
    flexDirection: 'row',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    marginRight: Spacing.sm,
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
