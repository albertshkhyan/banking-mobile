import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '../../../shared/ui';
import { BorderRadius, Spacing } from '../../../shared/config/theme';
import { useThemeColor } from '../../../shared/hooks/use-theme-color';
import { CardStatusToggle } from './card-status-toggle';

export interface CardStatusCardProps {
  /** Whether the card is active (toggle on) */
  active: boolean;
  onToggle: (value: boolean) => void;
}

export function CardStatusCard({ active, onToggle }: CardStatusCardProps) {
  const surface = useThemeColor({}, 'surface');
  const textSecondary = useThemeColor({}, 'textSecondary');

  return (
    <View style={[styles.root, { backgroundColor: surface }]}>
      <View style={styles.header}>
        <ThemedText type="label" style={styles.title}>
          Card Status
        </ThemedText>
        <CardStatusToggle
          value={active}
          onValueChange={onToggle}
          accessibilityLabel={active ? 'Card active' : 'Card inactive'}
        />
      </View>
      <View style={styles.subtitleRow}>
        <Ionicons name="lock-open-outline" size={14} color={textSecondary} />
        <ThemedText type="caption" style={[styles.subtitle, { color: textSecondary }]}>
          {active ? 'Active' : 'Inactive'}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    minHeight: 88,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: 13,
  },
});
