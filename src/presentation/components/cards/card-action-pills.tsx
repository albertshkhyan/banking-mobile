import { View, StyleSheet, Pressable } from 'react-native';

import { ThemedText } from '../../../shared/ui';
import { BorderRadius, Spacing } from '../../../shared/config/theme';
import { useThemeColor } from '../../../shared/hooks/use-theme-color';

export interface CardActionPillItem {
  id: string;
  label: string;
  onPress?: () => void;
}

const DEFAULT_PILLS: CardActionPillItem[] = [
  { id: 'limits', label: 'Limits' },
  { id: 'pin', label: 'PIN' },
  { id: 'report', label: 'Report' },
];

export interface CardActionPillsProps {
  /** Pills to show; defaults to Limits, PIN, Report */
  items?: CardActionPillItem[];
}

export function CardActionPills({ items = DEFAULT_PILLS }: CardActionPillsProps) {
  const pillBg = useThemeColor({}, 'actionPillBg');
  const pillText = useThemeColor({}, 'actionPillText');

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={item.onPress}
          style={({ pressed }) => [
            styles.pill,
            { backgroundColor: pillBg },
            pressed && styles.pillPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={item.label}
        >
          <ThemedText style={[styles.label, { color: pillText }]}>{item.label}</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  pill: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillPressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
