import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card, ThemedText } from '../../../shared/ui';
import { BorderRadius, Spacing } from '../../../shared/config/theme';
import { useThemeColor } from '../../../shared/hooks/use-theme-color';

const DEFAULT_LABEL = 'Secure • Fast • Reliable';

type SecurityHighlightCardProps = {
  label?: string;
};

export function SecurityHighlightCard({ label = DEFAULT_LABEL }: SecurityHighlightCardProps) {
  const iconColor = useThemeColor({}, 'text');
  const iconBg = useThemeColor({}, 'landingIconBg');

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.inner}>
        <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
          <Ionicons name="shield-checkmark" size={40} color={iconColor} />
        </View>
        <ThemedText type="tagline" style={styles.label}>
          {label}
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.xxl,
    minHeight: 180,
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  label: {
    textAlign: 'center',
  },
});
