import { StyleSheet, View } from 'react-native';

import { Spacing } from '../config/theme';
import { useThemeColor } from '../hooks/use-theme-color';

import { ThemedText } from './themed-text';

type DividerWithTextProps = {
  text?: string;
};

export function DividerWithText({ text = 'or' }: DividerWithTextProps) {
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'textMuted');

  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: border }]} />
      <ThemedText style={[styles.text, { color: muted }]}>{text}</ThemedText>
      <View style={[styles.line, { backgroundColor: border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    fontSize: 14,
    marginHorizontal: Spacing.lg,
  },
});
