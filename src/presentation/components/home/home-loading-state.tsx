import { View, StyleSheet, ActivityIndicator } from 'react-native';

const DEFAULT_BACKGROUND = '#1A3C8B';

export interface HomeLoadingStateProps {
  paddingTop: number;
  backgroundColor?: string;
}

export function HomeLoadingState({
  paddingTop,
  backgroundColor = DEFAULT_BACKGROUND,
}: HomeLoadingStateProps) {
  return (
    <View style={[styles.wrapper, { backgroundColor }]}>
      <View style={[styles.centered, { paddingTop }]}>
        <ActivityIndicator size="large" color="#FFF" />
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
});
