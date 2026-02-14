import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function InitialView() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Banking Mobile</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Initial view
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    marginTop: 8,
  },
});
