import { StyleSheet, View } from 'react-native';

import { BankBuildingIcon, ThemedText } from '../../../shared/ui';
import { Spacing } from '../../../shared/config/theme';

const DEFAULT_TITLE = 'SecureBank';
const DEFAULT_SUBTITLE = 'Banking made simple';

/** Figma 2-44: icon container background */
const LOGO_CONTAINER_BG = 'rgba(255, 255, 255, 0.2)';
const HERO_TEXT_COLOR = '#FFFFFF';

type HeroSectionProps = {
  title?: string;
  subtitle?: string;
};

export function HeroSection({ title = DEFAULT_TITLE, subtitle = DEFAULT_SUBTITLE }: HeroSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <BankBuildingIcon size={48} color={HERO_TEXT_COLOR} />
      </View>
      <ThemedText type="displayTitle" style={styles.title}>
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
  /** Figma 2-44: 24px radius, translucent white background */
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: LOGO_CONTAINER_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    color: HERO_TEXT_COLOR,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    color: HERO_TEXT_COLOR,
    textAlign: 'center',
  },
});
