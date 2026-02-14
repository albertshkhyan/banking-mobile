import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '../../../shared/ui';
import { BorderRadius, Spacing } from '../../../shared/config/theme';
import { useThemeColor } from '../../../shared/hooks/use-theme-color';

const DEFAULT_TITLE = 'SecureBank';
const DEFAULT_SUBTITLE = 'Banking made simple';

type HeroSectionProps = {
  title?: string;
  subtitle?: string;
};

export function HeroSection({ title = DEFAULT_TITLE, subtitle = DEFAULT_SUBTITLE }: HeroSectionProps) {
  const iconColor = useThemeColor({}, 'text');
  const iconBg = useThemeColor({}, 'surface');

  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { backgroundColor: iconBg }]}>
        <Ionicons name="business" size={48} color={iconColor} />
      </View>
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText type="tagline" style={styles.subtitle}>
        {subtitle}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
});
