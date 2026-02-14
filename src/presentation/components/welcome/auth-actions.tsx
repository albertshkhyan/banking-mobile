import { StyleSheet, View } from 'react-native';

import { Button } from '../../../shared/ui';
import { Spacing } from '../../../shared/config/theme';

type AuthActionsProps = {
  onLogin?: () => void;
  onCreateAccount?: () => void;
  onViewComponents?: () => void;
};

export function AuthActions({
  onLogin,
  onCreateAccount,
  onViewComponents,
}: AuthActionsProps) {
  return (
    <View style={styles.container}>
      <Button
        variant="primary"
        title="Login"
        onPress={onLogin}
        style={styles.primaryButton}
      />
      <Button
        variant="secondary"
        title="Create Account"
        onPress={onCreateAccount}
        style={styles.secondaryButton}
      />
      <Button
        variant="link"
        title="View Components"
        onPress={onViewComponents}
        style={styles.linkButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
    alignItems: 'stretch',
  },
  primaryButton: {
    marginBottom: Spacing.sm,
  },
  secondaryButton: {
    marginBottom: Spacing.sm,
  },
  linkButton: {
    alignSelf: 'center',
  },
});
