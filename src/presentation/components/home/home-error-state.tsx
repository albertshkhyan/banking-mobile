import { View, StyleSheet } from 'react-native';

import { ThemedText } from '../../../shared/ui';
import { Spacing } from '../../../shared/config/theme';

const DEFAULT_BACKGROUND = '#1A3C8B';

export interface HomeErrorStateProps {
  message: string;
  paddingTop: number;
  backgroundColor?: string;
}

export function HomeErrorState({
  message,
  paddingTop,
  backgroundColor = DEFAULT_BACKGROUND,
}: HomeErrorStateProps) {
  return (
    <View style={[styles.wrapper, { backgroundColor }]}>
      <View style={[styles.centered, { paddingTop }]}>
        <ThemedText type="default" style={[styles.errorText, { color: '#FFF' }]}>
          {message}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: { textAlign: 'center', paddingHorizontal: Spacing.xl },
});
