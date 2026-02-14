import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccountsQuery } from '../hooks/use-accounts-query';
import { useRecentTransactionsQuery } from '../hooks/use-recent-transactions-query';

/**
 * Home screen: composes query hooks (repos/use cases injected via app/di).
 * No business logic; dumb UI only.
 */
export function HomeScreen() {
  const accountsQuery = useAccountsQuery();
  const transactionsQuery = useRecentTransactionsQuery(10);

  const accounts = accountsQuery.data ?? [];
  const transactions = transactionsQuery.data ?? [];
  const isLoading = accountsQuery.isLoading || transactionsQuery.isLoading;
  const error = accountsQuery.error ?? transactionsQuery.error;

  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
      <View style={styles.container}>
        {isLoading && <View style={styles.placeholder} />}
        {error && <View style={styles.placeholder} />}
        {!isLoading && !error && (
          <>
            <View style={styles.section}>
              {accounts.length > 0 && <View style={styles.placeholder} />}
            </View>
            <View style={styles.section}>
              {transactions.length > 0 && <View style={styles.placeholder} />}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  section: { marginBottom: 24 },
  placeholder: { height: 48 },
});
