import { useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '../../../shared/ui';
import { BorderRadius, Spacing } from '../../../shared/config/theme';

/** ISO/IEC 7810 ID-1 approximate ratio (85.60 / 53.98) */
const CARD_ASPECT_RATIO = 1.586;
const CARD_WIDTH = 320;
const CARD_HEIGHT = Math.round(CARD_WIDTH / CARD_ASPECT_RATIO);

const FLIP_DURATION_MS = 700;
const PERSPECTIVE = 1000;
const CARD_GRADIENT = ['#1A3C8B', '#0E7490'] as const;
const CHIP_GRADIENT = ['#D4AF37', '#9A7B2E', '#6B5B2E'] as const;
const CARD_RADIUS = 14;
const LABEL_MUTED = 'rgba(176,196,222,0.95)';
/** Magnetic stripe: solid dark band across top of back */
const STRIP_COLOR = '#0f172a';
/** Light blue panels for signature strip and CVV (card-back style) */
const BACK_PANEL_BG = 'rgba(255,255,255,0.22)';
const TAP_HINT_COLOR = '#BAE6FD';

export interface DebitCreditCardData {
  /** Last 4 digits (displayed); full number masked as •••• •••• •••• XXXX */
  last4: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
}

function formatExpiry(month: number, year: number): string {
  const mm = String(month).padStart(2, '0');
  const yy = String(year).slice(-2);
  return `${mm}/${yy}`;
}

function maskNumber(last4: string): string {
  return `•••• •••• •••• ${last4}`;
}

export interface DebitCreditFlipCardProps {
  data: DebitCreditCardData;
}

export function DebitCreditFlipCard({ data }: DebitCreditFlipCardProps) {
  const flipped = useSharedValue(0);

  const flip = useCallback(() => {
    flipped.value = withTiming(flipped.value === 1 ? 0 : 1, {
      duration: FLIP_DURATION_MS,
    });
  }, [flipped]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = `${interpolate(flipped.value, [0, 1], [0, 180])}deg`;
    return {
      transform: [{ rotateY }],
      backfaceVisibility: 'hidden' as const,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = `${interpolate(flipped.value, [0, 1], [180, 360])}deg`;
    return {
      transform: [{ rotateY }],
      backfaceVisibility: 'hidden' as const,
    };
  });

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={flip}
        style={styles.flipCard}
        accessibilityLabel="Flip card"
        accessibilityRole="button"
        accessibilityHint="Double tap to show card back with CVV"
      >
        <View style={[styles.perspectiveWrap, { transform: [{ perspective: PERSPECTIVE }] }]}>
        <Animated.View style={[styles.face, styles.frontFace, frontAnimatedStyle]}>
          <LinearGradient
            colors={[...CARD_GRADIENT]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gradient}
          />
          <LinearGradient
            colors={['rgba(255,255,255,0.12)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gloss}
          />
          <View style={styles.frontContent}>
            <View style={styles.chipWrap}>
              <LinearGradient
                colors={[...CHIP_GRADIENT]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.chip}
              />
              <View style={styles.chipInner} />
            </View>
            <ThemedText style={styles.cardNumber} lightColor="#FFF" darkColor="#FFF">
              {maskNumber(data.last4)}
            </ThemedText>
            <View style={styles.bottomRow}>
              <View style={styles.labelBlock}>
                <ThemedText style={styles.label} lightColor={LABEL_MUTED} darkColor={LABEL_MUTED}>
                  CARD HOLDER
                </ThemedText>
                <ThemedText style={styles.holder} lightColor="#FFF" darkColor="#FFF" numberOfLines={1}>
                  {data.holderName.toUpperCase()}
                </ThemedText>
              </View>
              <View style={styles.expiryBlock}>
                <ThemedText style={styles.label} lightColor={LABEL_MUTED} darkColor={LABEL_MUTED}>
                  EXPIRES
                </ThemedText>
                <ThemedText style={styles.holder} lightColor="#FFF" darkColor="#FFF">
                  {formatExpiry(data.expiryMonth, data.expiryYear)}
                </ThemedText>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.face, styles.backFace, backAnimatedStyle]}>
          <LinearGradient
            colors={[...CARD_GRADIENT]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gradient}
          />
          <View style={styles.backContent}>
            <View style={styles.magneticStrip} />
            <View style={styles.signatureStrip}>
              <ThemedText style={styles.signatureLabel} lightColor={LABEL_MUTED} darkColor={LABEL_MUTED}>
                Authorized signature
              </ThemedText>
              <View style={styles.signatureLine} />
            </View>
            <ThemedText style={styles.tapHint} lightColor={TAP_HINT_COLOR} darkColor={TAP_HINT_COLOR}>
              Tap to flip
            </ThemedText>
            <View style={styles.cvvRow}>
              <ThemedText style={styles.cvvLabel} lightColor={LABEL_MUTED} darkColor={LABEL_MUTED}>
                CVV
              </ThemedText>
              <View style={styles.cvvBox}>
                <ThemedText style={styles.cvvValue} lightColor="#FFF" darkColor="#FFF">
                  {data.cvv}
                </ThemedText>
              </View>
            </View>
          </View>
        </Animated.View>
        </View>
      </Pressable>
      <ThemedText type="caption" style={styles.flipLabel}>
        Tap card to flip
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  flipCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
  },
  perspectiveWrap: {
    width: '100%',
    height: '100%',
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
  },
  face: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
  },
  frontFace: {},
  backFace: {},
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  gloss: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1,
  },
  frontContent: {
    flex: 1,
    padding: Spacing.xl,
    paddingTop: Spacing.lg + 4,
    justifyContent: 'space-between',
  },
  chipWrap: {
    alignSelf: 'flex-start',
  },
  chip: {
    width: 44,
    height: 34,
    borderRadius: 8,
    overflow: 'hidden',
  },
  chipInner: {
    position: 'absolute',
    left: 6,
    top: 6,
    right: 6,
    bottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
  },
  cardNumber: {
    fontSize: 20,
    letterSpacing: 3,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: Spacing.lg,
  },
  labelBlock: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 9,
    marginBottom: 3,
    letterSpacing: 1.2,
  },
  holder: {
    fontSize: 15,
    fontWeight: '700',
    maxWidth: 160,
    letterSpacing: 0.5,
  },
  expiryBlock: {
    alignItems: 'flex-end',
  },
  backContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 0,
    paddingBottom: Spacing.xl,
  },
  magneticStrip: {
    height: 56,
    backgroundColor: STRIP_COLOR,
    marginHorizontal: -Spacing.lg,
    marginBottom: Spacing.xl,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  signatureStrip: {
    marginBottom: Spacing.md,
  },
  signatureLabel: {
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 6,
  },
  signatureLine: {
    height: 38,
    backgroundColor: BACK_PANEL_BG,
    borderRadius: 6,
  },
  tapHint: {
    textAlign: 'center',
    fontSize: 13,
    marginBottom: Spacing.lg,
  },
  cvvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cvvLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
  },
  cvvBox: {
    flex: 1,
    backgroundColor: BACK_PANEL_BG,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 6,
  },
  cvvValue: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 2,
  },
  flipLabel: {
    textAlign: 'center',
  },
});
