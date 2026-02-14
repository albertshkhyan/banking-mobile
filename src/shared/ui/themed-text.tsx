import { StyleSheet, Text, type TextProps } from 'react-native';

import { Typography } from '../config/theme';
import { useThemeColor } from '../hooks/use-theme-color';

export type ThemedTextType =
  | 'default'
  | 'displayTitle'
  | 'title'
  | 'screenTitle'
  | 'heading'
  | 'defaultSemiBold'
  | 'buttonLabel'
  | 'subtitle'
  | 'label'
  | 'caption'
  | 'tagline'
  | 'link';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemedTextType;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const linkColor = useThemeColor({ light: lightColor, dark: darkColor }, 'link');
  const color = type === 'link' ? linkColor : textColor;

  return (
    <Text
      style={[
        { color },
        type === 'default' && styles.default,
        type === 'displayTitle' && Typography.displayTitle,
        type === 'title' && styles.title,
        type === 'screenTitle' && Typography.screenTitle,
        type === 'heading' && Typography.heading,
        type === 'defaultSemiBold' && styles.defaultSemiBold,
        type === 'buttonLabel' && Typography.buttonLabel,
        type === 'subtitle' && Typography.subtitle,
        type === 'label' && Typography.label,
        type === 'caption' && Typography.caption,
        type === 'tagline' && Typography.tagline,
        type === 'link' && Typography.link,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    ...Typography.body,
  },
  defaultSemiBold: {
    ...Typography.body,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    ...Typography.subtitle,
  },
});
