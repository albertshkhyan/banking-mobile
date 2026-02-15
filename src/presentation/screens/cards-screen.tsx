import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '../../shared/ui';
import {
  CardActionPills,
  CardStatusCard,
  CardsScreenHeader,
  CardTransactions,
  CopyNumberCard,
  DebitCreditFlipCard,
  type CardTransactionItem,
} from '../components/cards';
import { Spacing } from '../../shared/config/theme';

const SAMPLE_CARD = {
  last4: '4242',
  fullNumber: '4242424242424242',
  holderName: 'John Doe',
  expiryMonth: 12,
  expiryYear: 2028,
  cvv: '123',
} as const;

const SAMPLE_TRANSACTIONS: CardTransactionItem[] = [
  { id: '1', title: 'Starbucks Coffee', subtitle: 'Today, 10:30 AM', amount: -8.5, icon: 'cafe-outline' },
  { id: '2', title: 'Salary Deposit', subtitle: 'Yesterday', amount: 5250, icon: 'card-outline' },
  { id: '3', title: 'Amazon Purchase', subtitle: 'Feb 12', amount: -156.42, icon: 'bag-outline' },
  { id: '4', title: 'Netflix Subscription', subtitle: 'Feb 11', amount: -15.99, icon: 'tv-outline' },
];

export function CardsScreen() {
  const [cardActive, setCardActive] = useState(true);

  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
      <ThemedView style={styles.container}>
        <CardsScreenHeader />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.cardSection}>
          <DebitCreditFlipCard data={SAMPLE_CARD} />
        </View>
        <View style={styles.actionsRow}>
          <CardStatusCard active={cardActive} onToggle={setCardActive} />
          <View style={styles.actionsGap} />
          <CopyNumberCard cardNumber={SAMPLE_CARD.fullNumber} />
        </View>
        <View style={styles.pillsSection}>
          <CardActionPills />
        </View>
        <View style={styles.transactionsSection}>
          <CardTransactions transactions={SAMPLE_TRANSACTIONS} />
        </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },
  cardSection: { width: '100%', marginTop: 24 },
  actionsRow: {
    flexDirection: 'row',
    marginTop: Spacing.xl,
    width: '100%',
  },
  actionsGap: { width: Spacing.md },
  pillsSection: { marginTop: Spacing.xl, width: '100%' },
  transactionsSection: { marginTop: Spacing.xl, width: '100%' },
});
