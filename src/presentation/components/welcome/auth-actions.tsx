import { StyleSheet, View } from 'react-native';

import { Button } from '../../../shared/ui';
import { Spacing } from '../../../shared/config/theme';

/** Figma 2-68: Login = white bg / dark text; Create Account = teal filled; link = muted white */
const LINK_COLOR_WELCOME = 'rgba(255, 255, 255, 0.85)';

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
        variant="primaryInverted"
        title="Login"
        onPress={onLogin}
        style={styles.primaryButton}
      />
      <Button
        variant="secondaryFilled"
        title="Create Account"
        onPress={onCreateAccount}
        style={styles.secondaryButton}
      />
      <Button
        variant="link"
        title="View Components"
        onPress={onViewComponents}
        style={styles.linkButton}
        labelStyle={styles.linkLabel}
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
    marginTop: Spacing.lg,
  },
  linkLabel: {
    color: LINK_COLOR_WELCOME,
  },
});
