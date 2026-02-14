import { StyleSheet, View } from 'react-native';

import { BankBuildingIcon, ThemedText } from '../../../shared/ui';
import { BorderRadius, Spacing } from '../../../shared/config/theme';

const DEFAULT_LABEL = 'Secure • Fast • Reliable';

/** Figma 2-56: container dimensions (px) */
const CONTAINER_SIZE = 345;
/** Figma 2-56: container background (rounded card on gradient) */
const CONTAINER_BG = 'rgba(255, 255, 255, 0.08)';
/** Translucent light blue for icon circle */
const HIGHLIGHT_ICON_BG = 'rgba(255, 255, 255, 0.2)';
const HIGHLIGHT_TEXT_COLOR = '#FFFFFF';

type SecurityHighlightCardProps = {
  label?: string;
};

export function SecurityHighlightCard({ label = DEFAULT_LABEL }: SecurityHighlightCardProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.iconCircle}>
            <BankBuildingIcon size={40} color={HIGHLIGHT_TEXT_COLOR} />
          </View>
          <ThemedText type="caption" style={styles.label}>
            {label}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  /** Figma 2-56: rounded container wrapping icon + label */
  container: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    borderRadius: BorderRadius.xl,
    backgroundColor: CONTAINER_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: HIGHLIGHT_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  label: {
    color: HIGHLIGHT_TEXT_COLOR,
    textAlign: 'center',
  },
});
