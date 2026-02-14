import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotificationsQuery } from '../hooks/use-notifications-query';

/**
 * Notification screen. Dumb UI; data via useNotificationsQuery (repos from app/di).
 */
export function NotificationScreen() {
  const { data: notifications = [], isLoading, error } = useNotificationsQuery();

  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
      <View style={styles.container}>
        {isLoading && <View style={styles.placeholder} />}
        {error && <View style={styles.placeholder} />}
        {!isLoading && !error && notifications.length > 0 && (
          <View style={styles.placeholder} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  placeholder: { height: 48 },
});
