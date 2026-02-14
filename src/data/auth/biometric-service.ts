/**
 * Wraps expo-local-authentication. Used by biometric-repository-impl only.
 */
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export type BiometricAuthResult = {
  ok: boolean;
  error?: string;
  biometryType?: string;
};

const FACE_ID = 'Face ID';
const TOUCH_ID = 'Touch ID';
const FINGERPRINT = 'Fingerprint';

export async function isBiometricAvailable(): Promise<boolean> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false;
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return isEnrolled;
  } catch {
    return false;
  }
}

export async function getBiometryType(): Promise<string | null> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return null;
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) return null;
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return FACE_ID;
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return Platform.OS === 'ios' ? TOUCH_ID : FINGERPRINT;
    }
    return 'Biometrics';
  } catch {
    return null;
  }
}

export async function authenticate(reason: string): Promise<BiometricAuthResult> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      cancelLabel: 'Cancel',
    });
    if (result.success) {
      const biometryType = await getBiometryType();
      return { ok: true, biometryType: biometryType ?? undefined };
    }
    const error =
      result.error === 'user_cancel'
        ? 'Cancelled'
        : result.error === 'user_fallback'
          ? 'Fallback'
          : result.error === 'lockout'
            ? 'Too many attempts. Try again later.'
            : result.error === 'not_enrolled'
              ? 'Biometrics not set up'
              : 'Authentication failed';
    return { ok: false, error };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: message };
  }
}
