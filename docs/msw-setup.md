# Mocks Setup for Expo

This project uses a **local Node mock server** for development. MSW is used only for **Node-based tests** (Jest/Vitest); the running app talks to the mock server over HTTP.

## How to run mocks

1. **Start the mock server and Expo together (recommended)**

   ```bash
   npm run dev
   ```

   This runs the mock API on `http://localhost:3099` and Expo in one terminal. In `__DEV__`, the app uses this URL automatically.

2. **Or start the mock server only**

   ```bash
   npm run mock:server
   ```

   Then in another terminal run `npm start`. Use this if you prefer two terminals.

3. **Simulate logged-in (optional)**

   To have `GET /auth/me` return 200 and open the app on (tabs) instead of the welcome screen:

   ```bash
   EXPO_PUBLIC_MOCK_AUTH=logged_in npm run dev
   ```

## Environment

- **`EXPO_PUBLIC_USE_MOCKS`** – In `__DEV__`, mocks default **on** unless set to `false`. No need to set it for normal dev.
- **`EXPO_PUBLIC_API_URL`** – When mocks are on, the app uses `http://localhost:3099` by default. For a physical device, set this to your machine IP (e.g. `http://192.168.1.x:3099`).
- **`EXPO_PUBLIC_MOCK_AUTH`** – Set to `logged_in` to make the auth gate return 200. See above.

See the root [README.md](../README.md) for the full env table.

## Mock server endpoints

The server in `scripts/mock-server.js` implements:

| Method | Path | Response |
|--------|------|----------|
| GET | `/auth/me` | 401, or 200 `{ user }` when `EXPO_PUBLIC_MOCK_AUTH=logged_in` |
| POST | `/auth/login` | Body: `{ email, password }`. 200 `{ user }` or 401 `{ message }` |
| POST | `/auth/register` | Body: `{ name, email, password }`. 201 `{ user }` or 400 `{ message }` |
| GET | `/accounts` | List of accounts |
| GET | `/transactions?limit=N` | Recent transactions |
| GET | `/notifications` | List of notifications |

All app API calls go through `createApiClient(env.apiUrl).get(path)`. When mocks are on, `env.apiUrl` is `http://localhost:3099`, so requests hit the mock server.

## MSW (tests only)

For **Jest or Vitest** (Node), use the MSW server from `msw/node`:

- **Handlers** – `src/mocks/handlers.ts` (same endpoints as the mock server, plus `GET */auth/me`).
- **Server** – `src/mocks/server.ts` uses `setupServer` from `msw/node`. In test setup, call `server.listen()` and in teardown `server.close()`.

The running app does **not** use in-app MSW; `msw/native` was not used because React Native lacks the `MessageEvent` global. The local mock server avoids that and works the same for dev.

## Turning off mocks

Set `EXPO_PUBLIC_USE_MOCKS=false` and provide a real `EXPO_PUBLIC_API_URL`. The app will call the real backend; no code changes needed.
