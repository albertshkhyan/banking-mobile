import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView } from '../../shared/ui';
import { DebitCreditFlipCard } from '../components/cards';

const SAMPLE_CARD = {
  last4: '4242',
  fullNumber: '4242424242424242',
  holderName: 'John Doe',
  expiryMonth: 12,
  expiryYear: 2028,
  cvv: '123',
} as const;

export function CardsScreen() {
  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
      <ThemedView style={styles.container}>
        <ThemedText type="screenTitle">Cards</ThemedText>
        <View style={styles.cardSection}>
          <DebitCreditFlipCard data={SAMPLE_CARD} />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  cardSection: { width: '100%', marginTop: 24 },
});
