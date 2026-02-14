import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Spacing } from '../../shared/config/theme';
import { useThemeColor } from '../../shared/hooks/use-theme-color';
import { useMeQuery } from '../hooks/use-me-query';
import { useAccountsSummaryQuery } from '../hooks/use-accounts-summary-query';
import { useUnreadCountQuery } from '../hooks/use-unread-count-query';
import { useRecentTransactionsQuery } from '../hooks/use-recent-transactions-query';
import {
  BalanceCard,
  HomeErrorState,
  HomeHeader,
  HomeLoadingState,
  RecentTransactionsSection,
} from '../components/home';

const RECENT_TRANSACTIONS_LIMIT = 5;

/**
 * Home dashboard: welcome header, balance card, notification badge, recent transactions.
 * Composes home components; data from GET /me, /accounts/summary, /notifications/unread-count, /transactions.
 */
export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [balanceVisible, setBalanceVisible] = useState(false);
  const gradientStart =
    useThemeColor({}, 'gradientStart') ?? Colors.light.gradientStart;
  const gradientEnd =
    useThemeColor({}, 'gradientEnd') ?? Colors.light.gradientEnd;

  const meQuery = useMeQuery();
  const summaryQuery = useAccountsSummaryQuery();
  const unreadQuery = useUnreadCountQuery();
  const transactionsQuery = useRecentTransactionsQuery(RECENT_TRANSACTIONS_LIMIT);

  const isLoading =
    meQuery.isLoading ||
    summaryQuery.isLoading ||
    unreadQuery.isLoading ||
    transactionsQuery.isLoading;
  const error =
    meQuery.error ?? summaryQuery.error ?? unreadQuery.error ?? transactionsQuery.error;

  const firstName = meQuery.data?.firstName ?? '';
  const summary = summaryQuery.data;
  const unreadCount = unreadQuery.data ?? 0;
  const transactions = transactionsQuery.data ?? [];

  if (isLoading) {
    return (
      <>
        <StatusBar style="light" />
        <HomeLoadingState
          paddingTop={insets.top}
          backgroundColor={gradientStart}
        />
      </>
    );
  }

  if (error) {
    return (
      <>
        <StatusBar style="light" />
        <HomeErrorState
          message={(error as Error).message}
          paddingTop={insets.top}
          backgroundColor={gradientStart}
        />
      </>
    );
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.wrapper} edges={['left', 'right', 'bottom']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[String(gradientStart), String(gradientEnd)]}
            style={[styles.gradientBlock, { paddingTop: insets.top }]}
          >
            <HomeHeader
              firstName={firstName}
              unreadCount={unreadCount}
              onNotificationsPress={() => router.push('/(tabs)/settings')}
            />
            {summary && (
              <BalanceCard
                summary={summary}
                balanceVisible={balanceVisible}
                onToggleVisibility={() => setBalanceVisible((v) => !v)}
              />
            )}
          </LinearGradient>
          <RecentTransactionsSection
            transactions={transactions}
            onViewAll={() => router.push('/(tabs)/accounts')}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },
  gradientBlock: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
});
