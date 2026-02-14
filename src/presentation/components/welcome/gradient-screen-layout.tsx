import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientView } from '../../../shared/ui';
import { Spacing } from '../../../shared/config/theme';

type GradientScreenLayoutProps = {
  children: ReactNode;
  /** Optional padding override; default uses theme Spacing.xl */
  contentStyle?: ViewStyle;
};

export function GradientScreenLayout({ children, contentStyle }: GradientScreenLayoutProps) {
  return (
    <View style={styles.wrapper}>
      <GradientView style={StyleSheet.absoluteFill} />
      <SafeAreaView style={[styles.content, contentStyle]} edges={['top', 'bottom']}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
});
