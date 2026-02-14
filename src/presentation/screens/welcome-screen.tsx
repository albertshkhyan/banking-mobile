import { useRouter } from 'expo-router';

import {
  AuthActions,
  GradientScreenLayout,
  HeroSection,
  SecurityHighlightCard,
} from '../components/welcome';

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <GradientScreenLayout>
      <HeroSection />
      <SecurityHighlightCard />
      <AuthActions
        onLogin={() => router.push('/(tabs)')}
        onCreateAccount={() => router.push('/(tabs)/accounts')}
        onViewComponents={() => router.push('/(tabs)/settings')}
      />
    </GradientScreenLayout>
  );
}
