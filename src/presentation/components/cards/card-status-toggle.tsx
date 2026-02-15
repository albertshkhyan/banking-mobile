import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useThemeColor } from '../../../shared/hooks/use-theme-color';

const TRACK_WIDTH = 36;
const TRACK_HEIGHT = 20;
const THUMB_SIZE = 16;
const TRACK_RADIUS = TRACK_HEIGHT / 2;
const THUMB_OFFSET = (TRACK_HEIGHT - THUMB_SIZE) / 2;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - 2 * THUMB_OFFSET;

const TRACK_OFF_COLOR = '#E0E0E0';
const THUMB_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 2,
};

export interface CardStatusToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel?: string;
}

export function CardStatusToggle({
  value,
  onValueChange,
  accessibilityLabel,
}: CardStatusToggleProps) {
  const primary = useThemeColor({}, 'primary');
  const position = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    position.value = withTiming(value ? 1 : 0, { duration: 200 });
  }, [value, position]);

  const trackStyle = useAnimatedStyle(
    () => ({
      backgroundColor: position.value === 1 ? primary : TRACK_OFF_COLOR,
    }),
    [primary]
  );

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value * THUMB_TRAVEL }],
  }));

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      style={styles.pressable}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View
          style={[
            styles.thumb,
            thumbStyle,
            THUMB_SHADOW,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'center',
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_RADIUS,
    justifyContent: 'center',
    paddingHorizontal: THUMB_OFFSET,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
  },
});
