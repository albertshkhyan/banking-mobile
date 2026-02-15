import { useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Toast } from 'toastify-react-native';

import { ThemedText } from '../../../shared/ui';
import { BorderRadius, Spacing } from '../../../shared/config/theme';
import { useThemeColor } from '../../../shared/hooks/use-theme-color';

export interface CopyNumberCardProps {
  /** Card number to copy (e.g. formatted "4242 4242 4242 4242" or digits only) */
  cardNumber: string;
}

function formatForClipboard(value: string): string {
  const digits = value.replace(/\D/g, '');
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4));
  }
  return groups.join(' ');
}

export function CopyNumberCard({ cardNumber }: CopyNumberCardProps) {
  const surface = useThemeColor({}, 'surface');
  const primary = useThemeColor({}, 'primary');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const handleCopy = useCallback(async () => {
    const text = formatForClipboard(cardNumber);
    if (!text) return;
    try {
      await Clipboard.setStringAsync(text);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Toast.success('Copied to clipboard');
    } catch {
      // Clipboard not available (e.g. web in some contexts)
    }
  }, [cardNumber]);

  return (
    <View style={[styles.root, { backgroundColor: surface }]}>
      <View style={styles.header}>
        <ThemedText type="label" style={styles.title}>
          Copy Number
        </ThemedText>
        <Pressable
          onPress={handleCopy}
          style={({ pressed }) => [styles.copyButton, pressed && styles.copyButtonPressed]}
          accessibilityLabel="Copy card number"
          accessibilityRole="button"
        >
          <Ionicons name="copy-outline" size={22} color={primary} />
        </Pressable>
      </View>
      <ThemedText type="caption" style={[styles.subtitle, { color: textSecondary }]}>
        Copy to clipboard
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    minHeight: 88,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
  },
  copyButton: {
    padding: Spacing.xs,
  },
  copyButtonPressed: {
    opacity: 0.7,
  },
  subtitle: {
    fontSize: 13,
    marginTop: Spacing.sm,
  },
});
