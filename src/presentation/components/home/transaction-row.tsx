import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '../../../shared/ui';
import { BorderRadius, Spacing } from '../../../shared/config/theme';
import { useThemeColor } from '../../../shared/hooks/use-theme-color';
import { formatDisplayDate } from './format-display-date';
import { formatAmount } from './format-amount';
import type { Transaction } from '../../../domain/entities/transaction';

export interface TransactionRowProps {
  transaction: Transaction;
}

const FALLBACK_ICON_COLOR = '#4B5563';
const FALLBACK_CREDIT_COLOR = '#059669';

export function TransactionRow({ transaction }: TransactionRowProps) {
  const iconColor = useThemeColor({}, 'icon') ?? FALLBACK_ICON_COLOR;
  const creditColor =
    useThemeColor({ light: '#059669', dark: '#34D399' }, 'text') ??
    FALLBACK_CREDIT_COLOR;
  const isCredit = transaction.type === 'credit';
  const label = transaction.merchant ?? transaction.description;

  return (
    <View style={styles.transactionRow}>
      <View
        style={[
          styles.transactionIconWrap,
          { backgroundColor: `${iconColor}20` },
        ]}
      >
        <Ionicons
          name={isCredit ? 'arrow-down-circle' : 'cart'}
          size={24}
          color={iconColor}
        />
      </View>
      <View style={styles.transactionBody}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {label}
        </ThemedText>
        <ThemedText type="caption" lightColor="#6B7280" darkColor="#9CA3AF">
          {formatDisplayDate(transaction.date)}
        </ThemedText>
      </View>
      <ThemedText
        type="defaultSemiBold"
        style={[styles.amount, isCredit && { color: creditColor }]}
      >
        {formatAmount(transaction)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  transactionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transactionBody: { flex: 1 },
  amount: { marginLeft: Spacing.sm },
});
