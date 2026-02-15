import { useCallback, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '../../../shared/ui';
import { BorderRadius, Spacing } from '../../../shared/config/theme';
import { CardBack } from './card-back';

/** ISO/IEC 7810 ID-1 approximate ratio; slightly shorter to fit back content without clipping */
const CARD_ASPECT_RATIO = 1.55;

const FLIP_DURATION_MS = 700;
/** Stronger perspective (smaller value) = more 3D depth during flip */
const PERSPECTIVE = 550;
/** Slight scale down at mid-flip (edge-on) for card thickness */
const FLIP_SCALE_EDGE = 0.97;
const CARD_GRADIENT = ['#1A3C8B', '#0E7490'] as const;
const CHIP_GRADIENT = ['#D4AF37', '#9A7B2E', '#6B5B2E'] as const;
const CARD_RADIUS = 14;
const LABEL_MUTED = 'rgba(176,196,222,0.95)';

export interface DebitCreditCardData {
  /** Last 4 digits (always safe to show); used when fullNumber not provided or details hidden */
  last4: string;
  /** Full card number (digits only or with spaces); shown only when details visible. Optional. */
  fullNumber?: string;
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

/** Format full number as groups of 4 (e.g. 4242 4242 4242 4242). Digits only. */
function formatFullNumber(fullNumber: string): string {
  const digits = fullNumber.replace(/\D/g, '');
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4));
  }
  return groups.join(' ');
}

const EYE_ICON_SIZE = 24;
const EYE_BUTTON_SIZE = 44;
const EYE_FROSTED_BG = 'rgba(255,255,255,0.22)';
/** By default details (card number, CVV) are hidden; show closed eye. */
const DEFAULT_DETAILS_VISIBLE = false;

export interface DebitCreditFlipCardProps {
  data: DebitCreditCardData;
}

export function DebitCreditFlipCard({ data }: DebitCreditFlipCardProps) {
  const flipped = useSharedValue(0);
  const [detailsVisible, setDetailsVisible] = useState(DEFAULT_DETAILS_VISIBLE);
  const [isBackVisible, setIsBackVisible] = useState(false);

  const toggleDetails = useCallback(() => {
    setDetailsVisible((v) => !v);
  }, []);

  const flip = useCallback(() => {
    const toBack = flipped.value < 0.5;
    flipped.value = withTiming(toBack ? 1 : 0, {
      duration: FLIP_DURATION_MS,
    });
    setTimeout(() => setIsBackVisible(toBack), FLIP_DURATION_MS);
  }, [flipped]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = `${interpolate(flipped.value, [0, 1], [0, 180])}deg`;
    const scale = interpolate(flipped.value, [0, 0.5, 1], [1, FLIP_SCALE_EDGE, 1]);
    return {
      transform: [{ rotateY }, { scale }],
      backfaceVisibility: 'hidden' as const,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = `${interpolate(flipped.value, [0, 1], [180, 360])}deg`;
    const scale = interpolate(flipped.value, [0, 0.5, 1], [1, FLIP_SCALE_EDGE, 1]);
    return {
      transform: [{ rotateY }, { scale }],
      backfaceVisibility: 'hidden' as const,
    };
  });

  const displayNumber =
    detailsVisible && data.fullNumber
      ? formatFullNumber(data.fullNumber)
      : maskNumber(data.last4);

  return (
    <View style={styles.wrapper}>
      <View style={styles.cardContainer}>
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
              <View style={styles.frontTopRow}>
                <View style={styles.chipWrap}>
                  <LinearGradient
                    colors={[...CHIP_GRADIENT]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.chip}
                  />
                  <View style={styles.chipInner} />
                </View>
                <View style={styles.eyePlaceholder} />
              </View>
            <ThemedText style={styles.cardNumber} lightColor="#FFF" darkColor="#FFF">
              {displayNumber}
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
          <CardBack
            cvv={data.cvv}
            isCvvVisible={detailsVisible}
            onToggleCvv={toggleDetails}
            onFlip={flip}
          />
        </Animated.View>
        </View>
        </Pressable>
        {!isBackVisible && (
          <Pressable
            onPress={toggleDetails}
            style={({ pressed }) => [styles.eyeButton, pressed && styles.eyeButtonPressed]}
            hitSlop={{ top: Spacing.sm, bottom: Spacing.sm, left: Spacing.sm, right: Spacing.sm }}
            accessibilityLabel={detailsVisible ? 'Hide card number' : 'Show card number'}
            accessibilityRole="button"
          >
            <Ionicons
              name={detailsVisible ? 'eye-outline' : 'eye-off-outline'}
              size={EYE_ICON_SIZE}
              color="#FFF"
            />
          </Pressable>
        )}
        {isBackVisible && (
          <Pressable
            onPress={toggleDetails}
            style={({ pressed }) => [styles.eyeButton, pressed && styles.eyeButtonPressed]}
            hitSlop={{ top: Spacing.sm, bottom: Spacing.sm, left: Spacing.sm, right: Spacing.sm }}
            accessibilityLabel={detailsVisible ? 'Hide security code' : 'Show security code'}
            accessibilityRole="button"
          >
            <Ionicons
              name={detailsVisible ? 'eye-outline' : 'eye-off-outline'}
              size={EYE_ICON_SIZE}
              color="#FFF"
            />
          </Pressable>
        )}
      </View>
      <ThemedText type="caption" style={styles.flipLabel}>
        Tap card to flip
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardContainer: {
    width: '100%',
    aspectRatio: CARD_ASPECT_RATIO,
    position: 'relative',
  },
  flipCard: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CARD_RADIUS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
  },
  eyePlaceholder: {
    width: EYE_BUTTON_SIZE,
    height: EYE_BUTTON_SIZE,
  },
  eyeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: EYE_BUTTON_SIZE,
    height: EYE_BUTTON_SIZE,
    borderRadius: EYE_BUTTON_SIZE / 2,
    backgroundColor: EYE_FROSTED_BG,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  eyeButtonPressed: {
    opacity: 0.85,
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
  frontTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
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
  flipLabel: {
    textAlign: 'center',
  },
});
