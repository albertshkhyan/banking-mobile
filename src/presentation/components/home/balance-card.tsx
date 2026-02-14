import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '../../../shared/ui';
import { BorderRadius, Spacing } from '../../../shared/config/theme';
import { MaskedBalanceDots } from './masked-balance-dots';
import type { AccountsSummary } from '../../../domain/entities/accounts-summary';

const BALANCE_CARD_GRADIENT = ['#1A3C8B', '#0E7490'] as const;

const SLIDE_DISTANCE = 60;
const SPRING_CONFIG = {
  damping: 14,
  stiffness: 90,
  mass: 0.85,
};

const NUMBER_SPRING_CONFIG = {
  damping: 18,
  stiffness: 80,
  mass: 0.9,
};

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export interface BalanceCardProps {
  summary: AccountsSummary;
  balanceVisible: boolean;
  onToggleVisibility: () => void;
}

export function BalanceCard({
  summary,
  balanceVisible,
  onToggleVisibility,
}: BalanceCardProps) {
  const progress = useSharedValue(0);
  const numberProgress = useSharedValue(0);
  const totalTarget = useSharedValue(summary.totalBalance);
  const availableTarget = useSharedValue(summary.availableFunds);

  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayAvailable, setDisplayAvailable] = useState(0);

  const updateDisplayNumbers = useCallback((total: number, available: number) => {
    setDisplayTotal(total);
    setDisplayAvailable(available);
  }, []);

  useEffect(() => {
    totalTarget.value = summary.totalBalance;
    availableTarget.value = summary.availableFunds;
  }, [summary.totalBalance, summary.availableFunds, totalTarget, availableTarget]);

  useEffect(() => {
    progress.value = withSpring(1, SPRING_CONFIG);
  }, [progress]);

  useEffect(() => {
    if (balanceVisible) {
      numberProgress.value = 0;
      numberProgress.value = withSpring(1, NUMBER_SPRING_CONFIG);
    } else {
      numberProgress.value = 0;
      setDisplayTotal(0);
      setDisplayAvailable(0);
    }
  }, [balanceVisible, numberProgress]);

  useAnimatedReaction(
    () => numberProgress.value,
    (p) => {
      runOnJS(updateDisplayNumbers)(
        p * totalTarget.value,
        p * availableTarget.value
      );
    }
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: -SLIDE_DISTANCE * (1 - progress.value) },
    ],
  }));

  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <View style={styles.card}>
        <LinearGradient
          colors={[...BALANCE_CARD_GRADIENT]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradientFill}
        />
        <View style={styles.content}>
          <View style={styles.topRow}>
            <ThemedText type="label" style={styles.totalBalanceLabel}>
              Total Balance
            </ThemedText>
            <Pressable
              onPress={onToggleVisibility}
              style={styles.eyeButton}
              accessibilityLabel={balanceVisible ? 'Hide balance' : 'Show balance'}
              accessibilityRole="button"
            >
              <Ionicons
                name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="#FFF"
              />
            </Pressable>
          </View>
          {balanceVisible ? (
            <ThemedText type="displayTitle" style={styles.balanceAmount} numberOfLines={1}>
              ${formatCurrency(displayTotal)}
            </ThemedText>
          ) : (
            <MaskedBalanceDots variant="default" />
          )}
          <ThemedText type="caption" style={styles.availableFundsLabel}>
            Available funds
          </ThemedText>
          {balanceVisible ? (
            <ThemedText type="defaultSemiBold" style={styles.availableAmount} numberOfLines={1}>
              ${formatCurrency(displayAvailable)} {summary.currency}
            </ThemedText>
          ) : (
            <MaskedBalanceDots variant="small" />
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: Spacing.sm },
  card: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  gradientFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: { padding: Spacing.xl },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  totalBalanceLabel: {
    color: '#E0F2FE',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  eyeButton: { padding: Spacing.xs },
  balanceAmount: {
    color: '#FFF',
    marginBottom: Spacing.lg,
    letterSpacing: 0.5,
  },
  availableFundsLabel: {
    color: '#7DD3FC',
    fontSize: 13,
    marginTop: Spacing.xs,
  },
  availableAmount: {
    color: '#FFF',
    marginTop: Spacing.xs,
    fontSize: 15,
    fontWeight: '600',
  },
});
