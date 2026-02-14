import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView } from '../../shared/ui';

export function AccountsScreen() {
  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
      <ThemedView style={styles.container}>
        <ThemedText type="screenTitle">Accounts</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
});
