import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { BorderRadius, Spacing } from '../config/theme';
import { useThemeColor } from '../hooks/use-theme-color';

import { ThemedText } from './themed-text';

export type InputProps = TextInputProps & {
  label?: string;
  leftIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
};

export function Input({
  label,
  leftIcon,
  containerStyle,
  style,
  placeholderTextColor,
  ...rest
}: InputProps) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const placeholder = useThemeColor({}, 'placeholder');
  const text = useThemeColor({}, 'text');

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <ThemedText type="label" style={styles.label}>
          {label}
        </ThemedText>
      ) : null}
      <View style={[styles.inputWrap, { backgroundColor: surface, borderColor: border }]}>
        {leftIcon ? <View style={styles.iconWrap}>{leftIcon}</View> : null}
        <TextInput
          style={[
            styles.input,
            { color: text },
            leftIcon ? styles.inputWithIcon : undefined,
          ]}
          placeholderTextColor={placeholder}
          {...rest}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
  },
  iconWrap: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.md,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
});
