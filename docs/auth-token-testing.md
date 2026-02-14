# Auth token system – how to test

- **Call login:** Run app, go to Welcome → Login, enter email/password (e.g. `user@example.com` / any password). Submit; you should land on tabs. Tokens are stored in SecureStore.
- **Hit accounts:** From (tabs), open Accounts (or Home). The app calls `GET /accounts` with `Authorization: Bearer <accessToken>`. Mock returns 200 and account list.
- **Force token expiry:** Mock access tokens expire after 2s (`ACCESS_TOKEN_TTL_MS` in handlers.ts and mock-server.js). Wait 2+ seconds, then pull-to-refresh or navigate to trigger `GET /accounts` or `GET /transactions`. First call returns 401 → client calls `POST /auth/refresh` → stores new tokens → retries the request → success.
- **Verify refresh + retry:** In dev, add a short `ACCESS_TOKEN_TTL_MS` (e.g. 500) or a breakpoint in the api-client after 401 to confirm: one refresh request, then the original request is retried once with the new token.

**Run mocks:** `npm run dev` (mock server + Expo) or `npm run mock:server` in one terminal and `npm run start` in another. Use `EXPO_PUBLIC_USE_MOCKS=true` (default in __DEV__) so the app uses `localhost:3099`.

---

## Login with Biometrics – how to test

1. **Seed refresh token:** Log in once with email/password (Welcome → Login). After success you have access + refresh tokens in SecureStore.
2. **Enable biometrics:** On device/simulator ensure Face ID / Touch ID (or fingerprint on Android) is enrolled.
3. **Restart app:** Force-quit and reopen the app so you hit the auth gate (logged out UI). Go to Welcome → Login.
4. **Tap “Login with Face ID” (or Touch ID / Biometrics):** Biometric prompt appears. Complete it.
5. **Verify:** App calls `POST /auth/refresh` with the stored refresh token; mock returns new tokens; you land on (tabs). If refresh fails (e.g. invalid/expired refresh token), tokens are cleared and you see an error; use password login.
6. **No stored session:** If you never logged in or cleared data, the biometric button is still enabled but refresh will 401 → error message; use password login.

---

## Home Dashboard – how to test

- **Normal:** Log in, then open Home (first tab). You should see: “Welcome back, Mock”, balance card (Total balance + Available), notification badge (count of unread), and “Recent Transactions” with up to 5 items (merchant, date, amount). All requests use `Authorization: Bearer <token>`; MSW/Node mock delay 300–800 ms.
- **Expired token:** Let the access token expire (e.g. wait 2+ s or set `ACCESS_TOKEN_TTL_MS` low). Navigate to Home or pull to refresh. First request returns 401 → app calls `POST /auth/refresh` → retries → Home loads.
- **Empty transactions:** To test empty state, temporarily change the mock so `GET /transactions?limit=5` returns `[]`. Home shows “No recent transactions”.
- **Error scenario:** In `src/mocks/handlers.ts` set `SIMULATE_ERROR = true` at the top. Reload; one of the dashboard endpoints (e.g. `/me` or `/accounts/summary`) will return 500 and the Home screen will show the error message.
