import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '../../../shared/ui';
import { BorderRadius, Colors, Spacing } from '../../../shared/config/theme';
import { useThemeColor } from '../../../shared/hooks/use-theme-color';
import { useColorScheme } from '../../../shared/hooks/use-color-scheme';

export interface CardTransactionItem {
  id: string;
  title: string;
  subtitle: string;
  /** Amount in dollars; positive = income, negative = expense */
  amount: number;
  /** Ionicons name for the left icon (e.g. 'cafe-outline', 'card-outline') */
  icon?: string;
}

const INCOME_COLOR_LIGHT = Colors.light.gradientEnd;
const INCOME_COLOR_DARK = '#22D3EE';

function formatAmount(amount: number): string {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}$${Math.abs(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export interface CardTransactionsProps {
  title?: string;
  transactions: CardTransactionItem[];
}

export function CardTransactions({
  title = 'Card Transactions',
  transactions,
}: CardTransactionsProps) {
  const surface = useThemeColor({}, 'surface');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const border = useThemeColor({}, 'border');
  const iconBg = useThemeColor({}, 'tabBarActivePill');
  const iconDefault = useThemeColor({}, 'icon');
  const scheme = useColorScheme() ?? 'light';
  const incomeColor = scheme === 'dark' ? INCOME_COLOR_DARK : INCOME_COLOR_LIGHT;

  return (
    <View style={styles.section}>
      <ThemedText type="heading" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      <View style={[styles.card, { backgroundColor: surface }]}>
        {transactions.map((item, index) => (
          <View key={item.id}>
            <View style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
                <Ionicons
                  name={(item.icon ?? 'ellipse-outline') as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color={item.amount >= 0 ? incomeColor : iconDefault}
                />
              </View>
              <View style={styles.textBlock}>
                <ThemedText type="defaultSemiBold" style={styles.title}>
                  {item.title}
                </ThemedText>
                <ThemedText type="caption" style={[styles.subtitle, { color: textSecondary }]}>
                  {item.subtitle}
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.amount,
                  item.amount >= 0 ? { color: incomeColor } : undefined,
                ]}
              >
                {formatAmount(item.amount)}
              </ThemedText>
            </View>
            {index < transactions.length - 1 ? (
              <View style={[styles.divider, { backgroundColor: border }]} />
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    fontSize: 18,
  },
  card: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.lg,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    gap: Spacing.xs,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 13,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
});
