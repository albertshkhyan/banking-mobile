import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getRepos } from '../../core';
import { Button, Input, ThemedText, ThemedView } from '../../shared/ui';
import { Spacing } from '../../shared/config/theme';
import { useThemeColor } from '../../shared/hooks/use-theme-color';
import { isErr } from '../../shared/types/result';

const NAME_PLACEHOLDER = 'Your full name';
const EMAIL_PLACEHOLDER = 'your.email@example.com';
const PASSWORD_PLACEHOLDER = 'Create a password';
const CONFIRM_PASSWORD_PLACEHOLDER = 'Confirm your password';

export function CreateAccountScreen() {
  const router = useRouter();
  const authRepo = getRepos().authRepo;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const iconColor = useThemeColor({}, 'icon');

  async function handleCreateAccount() {
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const res = await authRepo.register({ name, email, password });
    setLoading(false);
    if (isErr(res)) {
      setError(res.error.message || 'Registration failed');
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <ThemedView style={styles.wrapper}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <Ionicons name="chevron-back" size={28} color={iconColor} />
            </Pressable>

            <ThemedText type="screenTitle" style={styles.title}>
              Create account
            </ThemedText>
            <ThemedText type="subtitle" lightColor="#6B7280" darkColor="#9CA3AF" style={styles.subtitle}>
              Sign up to get started with SecureBank
            </ThemedText>

            <View style={styles.form}>
              <Input
                label="Full Name"
                placeholder={NAME_PLACEHOLDER}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                leftIcon={<Ionicons name="person-outline" size={22} color={iconColor} />}
              />
              <Input
                label="Email Address"
                placeholder={EMAIL_PLACEHOLDER}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon={<Ionicons name="mail-outline" size={22} color={iconColor} />}
              />
              <Input
                label="Password"
                placeholder={PASSWORD_PLACEHOLDER}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={<Ionicons name="lock-closed-outline" size={22} color={iconColor} />}
              />
              <Input
                label="Confirm Password"
                placeholder={CONFIRM_PASSWORD_PLACEHOLDER}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                leftIcon={<Ionicons name="lock-closed-outline" size={22} color={iconColor} />}
              />

              {error ? (
                <ThemedText type="caption" style={styles.error} lightColor="#DC2626" darkColor="#F87171">
                  {error}
                </ThemedText>
              ) : null}
              <Button
                variant="primary"
                title={loading ? 'Creating account...' : 'Create Account'}
                onPress={handleCreateAccount}
                disabled={loading}
                style={styles.primaryButton}
              />
              <Pressable
                onPress={() => router.back()}
                style={styles.signInWrap}
                accessibilityRole="link"
              >
                <ThemedText type="default" lightColor="#6B7280" darkColor="#9CA3AF">
                  Already have an account?{' '}
                </ThemedText>
                <ThemedText type="link">Sign in</ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.xl,
    padding: Spacing.xs,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    marginBottom: Spacing.xxl,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  error: {
    marginBottom: Spacing.md,
  },
  primaryButton: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  signInWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
