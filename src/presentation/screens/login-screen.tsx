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

import { Button, DividerWithText, Input, ThemedText, ThemedView } from '../../shared/ui';
import { Spacing } from '../../shared/config/theme';
import { useThemeColor } from '../../shared/hooks/use-theme-color';
import { useLogin } from '../hooks/use-login';
import { BiometricLoginButton } from '../components/login';

const EMAIL_PLACEHOLDER = 'your.email@example.com';
const PASSWORD_PLACEHOLDER = 'Enter your password';

export function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [biometricError, setBiometricError] = useState<string | null>(null);
  const iconColor = useThemeColor({}, 'icon');
  const passwordError = loginMutation.isError ? (loginMutation.error as Error).message : null;
  const error = passwordError ?? biometricError;

  async function handleLogin() {
    setBiometricError(null);
    loginMutation.reset();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => router.replace('/(tabs)'),
      }
    );
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
              Welcome back
            </ThemedText>
            <ThemedText type="subtitle" lightColor="#6B7280" darkColor="#9CA3AF" style={styles.subtitle}>
              Sign in to continue to your account
            </ThemedText>

            <View style={styles.form}>
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
              <Pressable
                onPress={() => {}}
                style={styles.forgotWrap}
                accessibilityRole="link"
              >
                <ThemedText type="link">Forgot password?</ThemedText>
              </Pressable>

              {error ? (
                <ThemedText type="caption" style={styles.error} lightColor="#DC2626" darkColor="#F87171">
                  {error}
                </ThemedText>
              ) : null}
              <Button
                variant="primary"
                title={loginMutation.isPending ? 'Signing in...' : 'Login'}
                onPress={handleLogin}
                disabled={loginMutation.isPending}
                style={styles.primaryButton}
              />
              <DividerWithText text="or" />
              <BiometricLoginButton
                onSuccess={() => router.replace('/(tabs)')}
                onError={setBiometricError}
                style={styles.primaryButton}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

/** Figma 2-112: capsule-style primary button with elevation */
const LOGIN_BUTTON_RADIUS = 28;
const LOGIN_BUTTON_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.12,
  shadowRadius: 4,
  elevation: 3,
};

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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
    padding: Spacing.xs,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    marginBottom: Spacing.xl,
  },
  form: {
    marginBottom: 0,
  },
  forgotWrap: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
  },
  error: {
    marginBottom: Spacing.lg,
  },
  primaryButton: {
    borderRadius: LOGIN_BUTTON_RADIUS,
    minHeight: 52,
    ...LOGIN_BUTTON_SHADOW,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
});
