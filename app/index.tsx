import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { getAuthStatus } from '../src/core';

type GateState = 'loading' | 'logged_in' | 'logged_out';

export default function Index() {
  const router = useRouter();
  const [state, setState] = useState<GateState>('loading');

  useEffect(() => {
    getAuthStatus()
      .then((ok) => setState(ok ? 'logged_in' : 'logged_out'))
      .catch(() => setState('logged_out'));
  }, []);

  useEffect(() => {
    if (state === 'loading') return;
    if (state === 'logged_in') {
      router.replace('/(tabs)');
    } else {
      router.replace('/welcome');
    }
  }, [state, router]);

  if (state === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
