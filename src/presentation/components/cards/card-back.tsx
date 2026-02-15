import { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  AccessibilityInfo,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '../../../shared/ui';
import { BorderRadius, Spacing } from '../../../shared/config/theme';

const CARD_GRADIENT = ['#1A3C8B', '#0E7490'] as const;
const LABEL_MUTED = 'rgba(176,196,222,0.95)';
const DISCLAIMER_MUTED = '#8a8a8a';
const CVV_TEXT_COLOR = '#1a1a1a';

/** Magnetic stripe: ~15–20% thinner than before, gradient + soft inner highlight */
const STRIP_HEIGHT = 34;
const STRIP_GRADIENT = ['#141414', '#1e1e1e', '#161616'] as const;
const STRIP_INNER_HIGHLIGHT = 'rgba(255,255,255,0.06)';
const STRIP_EDGE_HIGHLIGHT = 'rgba(255,255,255,0.04)';

/** Warm white, not pure white (real signature strip) */
const SIGNATURE_PANEL_BG = '#F7F7F4';
const SIGNATURE_BORDER = 'rgba(0,0,0,0.08)';
const SIGNATURE_LINE_COLOR = 'rgba(0,0,0,0.05)';
/** Inset shadow: darker bottom/right edge so strip feels recessed */
const SIGNATURE_INSET_SHADOW = 'rgba(0,0,0,0.09)';
const SIGNATURE_INSET_HIGHLIGHT = 'rgba(255,255,255,0.35)';
/** Paper grain: very subtle overlay (2–4% opacity) */
const SIGNATURE_PAPER_GRAIN = 'rgba(60,50,40,0.03)';

const CVV_BOX_BG = '#ffffff';
const CVV_MASK = '•••';

const TAP_HINT_OPACITY = 0.65;
const FADE_DURATION_MS = 280;
const PULSE_DURATION_MS = 2000;

export interface CardBackProps {
  cvv: string;
  isCvvVisible: boolean;
  onToggleCvv: () => void;
  onFlip: () => void;
}

export function CardBack({ cvv, isCvvVisible, onToggleCvv, onFlip }: CardBackProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const cvvOpacity = useSharedValue(isCvvVisible ? 1 : 0);
  const tapHintOpacity = useSharedValue(TAP_HINT_OPACITY);
  const pulseScale = useSharedValue(1);
  const hasPulsed = useSharedValue(0);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const enabled = await AccessibilityInfo.isReduceMotionEnabled?.();
        if (!cancelled) setReduceMotion(!!enabled);
      } catch {
        if (!cancelled) setReduceMotion(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, []);

  const duration = reduceMotion ? 0 : FADE_DURATION_MS;

  useEffect(() => {
    cvvOpacity.value = withTiming(isCvvVisible ? 1 : 0, { duration });
  }, [isCvvVisible, duration, cvvOpacity]);

  const handleFlip = useCallback(() => {
    if (!reduceMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onFlip();
  }, [onFlip, reduceMotion]);

  const cvvAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cvvOpacity.value,
  }));

  const cvvMaskAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - cvvOpacity.value,
  }));

  const tapHintAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tapHintOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  const onTapHintLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { height } = e.nativeEvent.layout;
      if (height > 0 && hasPulsed.value === 0 && !reduceMotion) {
        hasPulsed.value = 1;
        tapHintOpacity.value = withTiming(TAP_HINT_OPACITY, { duration: 300 });
        pulseScale.value = withRepeat(
          withSequence(
            withTiming(1.02, { duration: PULSE_DURATION_MS / 2, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: PULSE_DURATION_MS / 2, easing: Easing.inOut(Easing.ease) })
          ),
          1,
          false
        );
      }
    },
    [reduceMotion, hasPulsed, tapHintOpacity, pulseScale]
  );

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[...CARD_GRADIENT]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.backContent}>
        <View style={styles.magneticStrip}>
          <LinearGradient
            colors={[...STRIP_GRADIENT]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.magneticStripGradient}
          />
          <View style={styles.magneticStripInnerHighlight} />
          <View style={styles.magneticStripEdge} />
        </View>

        <View style={styles.backBottom}>
          <View style={styles.signatureBlock}>
            <ThemedText style={styles.signatureLabel} lightColor={LABEL_MUTED} darkColor={LABEL_MUTED}>
              AUTHORIZED SIGNATURE
            </ThemedText>
            <View style={styles.signaturePanel}>
              <View style={styles.signatureLines}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={styles.signatureLine} />
                ))}
              </View>
              <View style={styles.signaturePaperGrain} pointerEvents="none" />
            </View>
            <ThemedText style={styles.signatureDisclaimer} lightColor={DISCLAIMER_MUTED} darkColor={DISCLAIMER_MUTED}>
              Not valid unless signed
            </ThemedText>
          </View>

          <Animated.View style={[styles.tapHintWrap, tapHintAnimatedStyle]} onLayout={onTapHintLayout}>
            <ThemedText style={styles.tapHint} lightColor="#BAE6FD" darkColor="#BAE6FD">
              Tap to flip
            </ThemedText>
          </Animated.View>

          <View style={styles.cvvRow}>
            <ThemedText style={styles.cvvLabel} lightColor={LABEL_MUTED} darkColor={LABEL_MUTED}>
              Security code
            </ThemedText>
            <View style={styles.cvvBox}>
              <View style={styles.cvvValueWrap}>
                <Animated.View style={[StyleSheet.absoluteFillObject, styles.cvvRevealWrap, cvvMaskAnimatedStyle]} pointerEvents="none">
                  <ThemedText
                    style={styles.cvvValue}
                    lightColor={CVV_TEXT_COLOR}
                    darkColor={CVV_TEXT_COLOR}
                    numberOfLines={1}
                  >
                    {CVV_MASK}
                  </ThemedText>
                </Animated.View>
                <Animated.View style={[StyleSheet.absoluteFillObject, styles.cvvRevealWrap, cvvAnimatedStyle]} pointerEvents="none">
                  <ThemedText
                    style={styles.cvvValue}
                    lightColor={CVV_TEXT_COLOR}
                    darkColor={CVV_TEXT_COLOR}
                    numberOfLines={1}
                  >
                    {cvv}
                  </ThemedText>
                </Animated.View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <Pressable
        onPress={handleFlip}
        style={styles.flipHitArea}
        accessibilityLabel="Flip card"
        accessibilityRole="button"
        accessibilityHint="Shows card front"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: BorderRadius.lg,
  },
  flipHitArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  backContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 0,
    paddingBottom: Spacing.xl,
  },
  magneticStrip: {
    height: STRIP_HEIGHT,
    marginHorizontal: -Spacing.lg,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    borderBottomLeftRadius: BorderRadius.sm,
    borderBottomRightRadius: BorderRadius.sm,
  },
  magneticStripGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  magneticStripInnerHighlight: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 1,
    backgroundColor: STRIP_INNER_HIGHLIGHT,
  },
  magneticStripEdge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: STRIP_EDGE_HIGHLIGHT,
  },
  backBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    minHeight: 0,
    paddingBottom: Spacing.sm,
  },
  signatureBlock: {
    marginBottom: Spacing.xs,
  },
  signatureLabel: {
    fontSize: 7,
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  signaturePanel: {
    height: 26,
    backgroundColor: SIGNATURE_PANEL_BG,
    borderRadius: 4,
    borderWidth: 1,
    borderTopColor: SIGNATURE_INSET_HIGHLIGHT,
    borderLeftColor: SIGNATURE_INSET_HIGHLIGHT,
    borderRightColor: SIGNATURE_INSET_SHADOW,
    borderBottomColor: SIGNATURE_INSET_SHADOW,
    overflow: 'hidden',
  },
  signaturePaperGrain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SIGNATURE_PAPER_GRAIN,
    borderRadius: 3,
  },
  signatureLines: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-evenly',
    paddingVertical: 2,
  },
  signatureLine: {
    height: 1,
    backgroundColor: SIGNATURE_LINE_COLOR,
    marginHorizontal: Spacing.sm,
  },
  signatureDisclaimer: {
    fontSize: 6,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  tapHintWrap: {
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  tapHint: {
    fontSize: 10,
  },
  cvvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cvvLabel: {
    fontSize: 10,
    letterSpacing: 1,
  },
  cvvBox: {
    flex: 1,
    backgroundColor: CVV_BOX_BG,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: 4,
    minHeight: 36,
    borderWidth: 0,
  },
  cvvValueWrap: {
    position: 'relative',
    minHeight: 20,
    justifyContent: 'center',
  },
  cvvRevealWrap: {
    justifyContent: 'center',
  },
  cvvValue: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
