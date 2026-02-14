import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../../shared/ui';
import { useThemeColor } from '../../../shared/hooks/use-theme-color';
import { useBiometricLogin } from '../../hooks/use-biometric-login';
import type { StyleProp, ViewStyle } from 'react-native';

export type BiometricLoginButtonProps = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  style?: StyleProp<ViewStyle>;
};

export function BiometricLoginButton({ onSuccess, onError, style }: BiometricLoginButtonProps) {
  const iconColor = useThemeColor({}, 'icon');
  const { loginWithBiometrics, isLoading, error, biometryLabel, available } = useBiometricLogin();

  async function handlePress() {
    const success = await loginWithBiometrics();
    if (success) {
      onSuccess?.();
    } else if (error) {
      onError?.(error);
    }
  }

  return (
    <Button
      variant="primaryInverted"
      title={isLoading ? 'Signing in...' : `Login with ${biometryLabel}`}
      onPress={handlePress}
      disabled={!available || isLoading}
      leftIcon={<Ionicons name="finger-print-outline" size={24} color={iconColor} />}
      style={style}
    />
  );
}
