import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '../../../shared/ui';
import { Spacing } from '../../../shared/config/theme';

export interface HomeHeaderProps {
  firstName: string;
  unreadCount: number;
  onNotificationsPress: () => void;
}

export function HomeHeader({
  firstName,
  unreadCount,
  onNotificationsPress,
}: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <ThemedText type="caption" style={styles.greeting}>
          Welcome back,
        </ThemedText>
        <ThemedText type="screenTitle" style={styles.name}>
          {firstName || 'User'}
        </ThemedText>
      </View>
      <Pressable
        onPress={onNotificationsPress}
        style={[styles.bellWrap, styles.bellOnGradient]}
        accessibilityLabel="Notifications"
        accessibilityRole="button"
      >
        <Ionicons name="notifications-outline" size={26} color="#FFF" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <ThemedText type="caption" style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </ThemedText>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  greeting: { color: 'rgba(255,255,255,0.85)' },
  name: { color: '#FFF' },
  bellWrap: { position: 'relative', padding: Spacing.xs },
  bellOnGradient: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 22 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
});
