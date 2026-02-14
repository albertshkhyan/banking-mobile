import { View, StyleSheet } from 'react-native';

import { Spacing } from '../../../shared/config/theme';

const MASKED_DOT_COUNT = 6;

export interface MaskedBalanceDotsProps {
  variant?: 'default' | 'small';
}

export function MaskedBalanceDots({ variant = 'default' }: MaskedBalanceDotsProps) {
  const isSmall = variant === 'small';
  return (
    <View style={isSmall ? styles.rowSmall : styles.row}>
      {Array.from({ length: MASKED_DOT_COUNT }).map((_, i) => (
        <View key={i} style={isSmall ? styles.dotSmall : styles.dot} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  rowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.xs,
  },
  dotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
