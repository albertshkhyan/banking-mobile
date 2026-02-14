import { useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { Card, ThemedText } from '../../../shared/ui';
import { Spacing } from '../../../shared/config/theme';
import { TransactionRow } from './transaction-row';
import type { Transaction } from '../../../domain/entities/transaction';

const SLIDE_DISTANCE = 56;
const SPRING_CONFIG = {
  damping: 16,
  stiffness: 68,
  mass: 0.95,
};

export interface RecentTransactionsSectionProps {
  transactions: Transaction[];
  onViewAll: () => void;
}

export function RecentTransactionsSection({
  transactions,
  onViewAll,
}: RecentTransactionsSectionProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(1, SPRING_CONFIG);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateX: -SLIDE_DISTANCE * (1 - progress.value) }],
  }));

  return (
    <Animated.View style={[styles.section, animatedStyle]}>
      <View style={styles.sectionHeader}>
        <ThemedText type="heading">Recent Transactions</ThemedText>
        <Pressable onPress={onViewAll} accessibilityRole="link">
          <ThemedText type="link">View All</ThemedText>
        </Pressable>
      </View>
      {transactions.length === 0 ? (
        <Card variant="surface" style={styles.emptyCard}>
          <ThemedText type="default" lightColor="#6B7280" darkColor="#9CA3AF">
            No recent transactions
          </ThemedText>
        </Card>
      ) : (
        <Card variant="surface" style={styles.transactionsCard}>
          {transactions.map((t) => (
            <TransactionRow key={t.id} transaction={t} />
          ))}
        </Card>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyCard: { alignItems: 'center', paddingVertical: Spacing.xxl },
  transactionsCard: { paddingVertical: Spacing.sm },
});
